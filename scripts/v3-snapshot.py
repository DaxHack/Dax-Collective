#!/usr/bin/env python3
"""Create a secret-free, immutable working-site snapshot; verify before restoring."""
import argparse
import hashlib
import json
import re
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parent.parent
LABEL = "Dax Site V1 - Current Working Version"
EXCLUDED = {"node_modules", "build", ".git", ".cache", "credentials", "__pycache__"}
SOURCES = ["dax-main", "dax-backend", "functions", "asset-intake", "attached_assets",
           "docs", "scripts", "package.json", "package-lock.json", "firebase.json",
           "firestore.rules", "firestore.indexes.json", "storage.rules", "replit.md",
           ".replit", ".gitignore", ".gitattributes"]


def digest(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def verify(snapshot):
    records = json.loads((snapshot / "manifest.json").read_text())
    for name, expected in records["files"].items():
        if digest(snapshot / name) != expected:
            raise RuntimeError(f"Checksum mismatch: {name}")
    print(f"Verified {len(records['files'])} files: {records['label']}")
    return records


def create(snapshot):
    snapshot.mkdir(parents=True, exist_ok=False)
    files = {}
    omitted = []
    for name in SOURCES:
        source = ROOT / name
        candidates = sorted(source.rglob("*")) if source.is_dir() else [source]
        for path in candidates:
            if not path.is_file() or path.is_symlink():
                continue
            relative = path.relative_to(ROOT)
            if any(part in EXCLUDED for part in relative.parts):
                continue
            if path.name.startswith(".env") and path.name != ".env.example":
                omitted.append(str(relative))
                continue
            if path.suffix in {".key", ".pem", ".log"}:
                omitted.append(str(relative))
                continue
            # Fail closed on private-key material, including copied audit text.
            if contains_secret(path.read_bytes()):
                omitted.append(str(relative))
                continue
            target = snapshot / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, target)
            files[str(relative)] = digest(target)
    (snapshot / "manifest.json").write_text(json.dumps({
        "label": LABEL, "scope": "Working source, public media, local intake, runtime configuration; canonical V1 plus Traveler preview and universe V2",
        "omitted": omitted, "excludes": sorted(EXCLUDED), "files": files,
    }, indent=2) + "\n")
    (snapshot / "SHA256SUMS").write_text("".join(f"{h}  {p}\n" for p, h in files.items()))
    (snapshot / "RESTORE-INSTRUCTIONS.md").write_text(
        "# " + LABEL + "\n\nVerify with `sha256sum -c SHA256SUMS`. "
        "Use scripts/v3-snapshot.py rehearse SNAPSHOT to restore into a disposable directory. "
        "For real recovery, copy files into a separate writable working checkout first; "
        "never edit this snapshot or copy credentials into Git. Install frontend dependencies "
        "from dax-main/package-lock.json, then run npm start. This snapshot preserves the "
        "pre-V3 working app, including V1 and both earlier experiments. Dependencies and "
        "generated builds are reproducible, not backed up. Secrets are intentionally omitted.\n")
    verify(snapshot)
    for path in snapshot.rglob("*"):
        path.chmod(0o555 if path.is_dir() else 0o444)
    snapshot.chmod(0o555)


def rehearse(snapshot):
    records = verify(snapshot)
    with tempfile.TemporaryDirectory(prefix="dax-v1-restore-") as directory:
        restore = Path(directory)
        for name in records["files"]:
            target = restore / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(snapshot / name, target)
            target.chmod(0o644)
            if digest(target) != records["files"][name]:
                raise RuntimeError(f"Restoration failed: {name}")
        print(f"Restored {len(records['files'])} writable files into disposable directory; all checksums match.")
    verify(snapshot)


def contains_secret(content):
    return any(re.search(pattern, content) for pattern in [
        rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        rb"(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}",
        rb"GOCSPX-[A-Za-z0-9_-]{20,}",
        rb"ya29\.[A-Za-z0-9_-]{20,}",
        rb"AIza[0-9A-Za-z_-]{35}",
    ])


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["create", "verify", "rehearse"])
    parser.add_argument("snapshot", type=Path)
    parser.add_argument("--source", type=Path, help="Create from an earlier verified snapshot rather than the workspace.")
    args = parser.parse_args()
    if args.source:
        verify(args.source.resolve())
        ROOT = args.source.resolve()
    {"create": create, "verify": verify, "rehearse": rehearse}[args.action](args.snapshot.resolve())

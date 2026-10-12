#!/usr/bin/env python3
"""Build a frontend-only portable restore checkpoint, never a full-site archive."""
import argparse
import importlib.util
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("snapshot", ROOT / "scripts/v3-snapshot.py")
snapshot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(snapshot)
CONFIGURATION = {
    "package.json", "package-lock.json",
    "dax-main/package.json", "dax-main/package-lock.json", "dax-main/.npmrc",
    "dax-main/.eslintrc.js", "dax-main/.eslintrc.json",
    "dax-main/postcss.config.js", "dax-main/tailwind.config.js",
}
BOOKKEEPING = {"manifest.json", "SHA256SUMS", "RESTORE-INSTRUCTIONS.md"}


def permitted(name):
    path = Path(name)
    return not path.is_absolute() and ".." not in path.parts and (
        name.startswith(("dax-main/src/", "dax-main/public/")) or name in CONFIGURATION
    )


def verify_boundary(checkpoint):
    records = snapshot.verify(checkpoint)
    expected = set(records["files"]) | BOOKKEEPING
    actual = set()
    for path in checkpoint.rglob("*"):
        if path.is_symlink():
            raise RuntimeError("Portable checkpoint cannot contain symlinks")
        if path.is_file():
            name = path.relative_to(checkpoint).as_posix()
            actual.add(name)
            if name not in BOOKKEEPING and not permitted(name):
                raise RuntimeError(f"Nonportable checkpoint path: {name}")
    if actual != expected:
        raise RuntimeError("Portable checkpoint contains unrecorded or missing files")
    print(f"Portable boundary verified: {len(records['files'])} reviewed source/public/configuration files; no intake.")


def create(source, destination, configuration_root=ROOT):
    records = snapshot.verify(source)
    destination.mkdir(parents=True, exist_ok=False)
    files = {}
    # Only original frontend source/public media crosses from the full snapshot.
    # No docs, intake, uploads, archives, backend data or historical scripts.
    for name in records["files"]:
        if not name.startswith(("dax-main/src/", "dax-main/public/")) or not permitted(name):
            continue
        path = source / name
        if path.is_symlink() or snapshot.contains_secret(path.read_bytes()):
            raise RuntimeError(f"Unsafe portable source: {name}")
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, target)
        files[name] = snapshot.digest(target)
    # Use the already-verified portable locks/settings so clean installation
    # does not revive private registry URLs or obsolete dependency blockers.
    for name in sorted(CONFIGURATION):
        path = configuration_root / name
        if not path.is_file():
            continue
        if path.is_symlink() or snapshot.contains_secret(path.read_bytes()):
            raise RuntimeError(f"Unsafe portable configuration: {name}")
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, target)
        files[name] = snapshot.digest(target)
    (destination / "manifest.json").write_text(json.dumps({
        "label": "Dax Site V1 - Current Working Version",
        "portable": True,
        "scope": "Pre-V3 frontend source and approved public assets, with current portable tooling configuration. Full recovery archives and original uploads remain local.",
        "files": files,
    }, indent=2) + "\n")
    (destination / "SHA256SUMS").write_text("".join(f"{h}  {p}\n" for p, h in files.items()))
    (destination / "RESTORE-INSTRUCTIONS.md").write_text(
        "# Dax Site V1 - Current Working Version — portable checkpoint\n\n"
        "This is a sanitized frontend recovery checkpoint, not the full local archive. "
        "It contains pre-V3 canonical/V2 source and approved public assets plus the current "
        "portable package locks and settings. Originals and private/local content are excluded.\n\n"
        "Verify with sha256sum -c SHA256SUMS or the current scripts/v3-snapshot.py. "
        "Rehearse with scripts/v3-snapshot.py rehearse CHECKPOINT. For real recovery, "
        "copy the manifest's files into a separate writable directory; npm ci at the "
        "root, then npm ci and npm run build in dax-main. Do not overwrite newer work "
        "or edit the full immutable local snapshots. No application secrets are required.\n")
    verify_boundary(destination)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["create", "verify"])
    parser.add_argument("checkpoint", type=Path)
    parser.add_argument("--source", type=Path)
    args = parser.parse_args()
    if args.action == "create":
        if not args.source:
            parser.error("create requires --source")
        create(args.source.resolve(), args.checkpoint.resolve())
    else:
        verify_boundary(args.checkpoint.resolve())

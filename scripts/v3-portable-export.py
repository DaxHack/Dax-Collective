#!/usr/bin/env python3
"""Assemble a clean-history candidate without mutating the working repository."""
import argparse
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("snapshot", ROOT / "scripts/v3-snapshot.py")
snapshot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(snapshot)
checkpoint_spec = importlib.util.spec_from_file_location("checkpoint", ROOT / "scripts/v3-portable-checkpoint.py")
checkpoint = importlib.util.module_from_spec(checkpoint_spec)
checkpoint_spec.loader.exec_module(checkpoint)

parser = argparse.ArgumentParser()
parser.add_argument("destination", type=Path)
args = parser.parse_args()
destination = args.destination.resolve()
if destination.exists():
    raise SystemExit("Destination must not exist; export never overwrites a checkout.")
destination.mkdir(parents=True)
excluded = []
included = []
names = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
names += ["package-lock.json", "dax-main/package-lock.json", "dax-main/.npmrc", "dax-main/src/setupTests.js"]
for folder in ["docs", "scripts", "dax-main/src/pages/experiments/universe-v3"]:
    names += [str(p.relative_to(ROOT)) for p in (ROOT / folder).rglob("*") if p.is_file()]
names += [".replitignore", ".agents/memory/MEMORY.md", ".agents/memory/v3-portability.md"]
for name in sorted(set(names)):
    source = ROOT / name
    if not name or not source.is_file():
        continue
    parts = Path(name).parts
    # Earlier local archives stay immutable. Do not transmit legacy archive
    # history, private workspace context, generated output, or intake notes.
    if parts[0] in {"backups", ".agents", "attached_assets", "asset-intake", "artifacts", "build", "generated-artifacts"}:
        continue
    if any(part in snapshot.EXCLUDED for part in parts):
        excluded.append(name)
        continue
    if (source.name.startswith(".env") and source.name != ".env.example") or source.suffix in {".key", ".pem"}:
        excluded.append(name)
        continue
    if snapshot.contains_secret(source.read_bytes()):
        excluded.append(name)
        continue
    target = destination / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
    included.append(name)

# Derive a separate whitelist-only portable checkpoint. Never copy a full
# recovery snapshot: it includes originals that must remain owner-controlled.
backup = ROOT / "backups/dax-site-v1-current-working-version-2026-10-11-verified"
portable_name = "backups/dax-site-v1-current-working-version-2026-10-11-portable"
if not backup.exists():
    backup = ROOT / portable_name
checkpoint.create(backup, destination / portable_name)
# The full local preservation record includes original-upload metadata. Export
# only the canonical source/public subset; the complete proof stays local.
preservation = destination / "docs/V3-PRESERVATION.json"
if preservation.exists():
    records = json.loads(preservation.read_text())
    records["scope"] = "Pre-V3 frontend source and approved public assets; complete original-upload/archive preservation evidence stays local."
    records["files"] = {name: value for name, value in records["files"].items()
                        if name.startswith(("dax-main/src/", "dax-main/public/"))}
    preservation.write_text(json.dumps(records, indent=2) + "\n")
(destination / "docs/V3-EXPORT-EXCLUSIONS.json").write_text(json.dumps({
    "excludedUnsafeOrNonportableFiles": excluded,
    "preservedLocally": ["Earlier snapshots and ZIP exports", "Original attached uploads", "Original Git history"],
    "reason": "No legacy history, full local archives, upload metadata or unreviewed intake are transmitted. Approved public assets and a frontend-only portable checkpoint are included.",
}, indent=2) + "\n")
print(f"Prepared {len(included)} working files plus verified snapshot. Excluded {len(excluded)} unsafe/nonportable files (names only recorded).")

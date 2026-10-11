#!/usr/bin/env python3
"""Check every reachable V3 commit for paths excluded from portable delivery."""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("repository", type=Path)
args = parser.parse_args()


def git(*arguments):
    return subprocess.check_output(["git", "-C", str(args.repository), *arguments]).decode()


commits = git("rev-list", "HEAD").splitlines()
roots = git("rev-list", "--max-parents=0", "HEAD").splitlines()
if len(roots) != 1:
    raise SystemExit("Expected exactly one clean root")
for commit in commits:
    for name in git("ls-tree", "-r", "--name-only", commit).splitlines():
        parts = Path(name).parts
        if any(part in {"attached_assets", "asset-intake", "uploads", "generated-artifacts"} for part in parts):
            raise SystemExit(f"Excluded path is reachable: {name}")
        if parts[0] == "backups" and (len(parts) < 2 or parts[1] != "dax-site-v1-current-working-version-2026-10-11-portable"):
            raise SystemExit(f"Full local archive is reachable: {name}")
        if parts[0] == "backups" and len(parts) > 2:
            relative = "/".join(parts[2:])
            allowed = (relative.startswith(("dax-main/src/", "dax-main/public/")) or
                       relative in {"manifest.json", "SHA256SUMS", "RESTORE-INSTRUCTIONS.md",
                                    "package.json", "package-lock.json", "dax-main/package.json",
                                    "dax-main/package-lock.json", "dax-main/.npmrc",
                                    "dax-main/.eslintrc.js", "dax-main/.eslintrc.json",
                                    "dax-main/postcss.config.js", "dax-main/tailwind.config.js"})
            if not allowed:
                raise SystemExit(f"Nonportable checkpoint path is reachable: {name}")
print(f"Verified {len(commits)} reachable commits from clean root {roots[0]}; no originals/intake/full local archives.")

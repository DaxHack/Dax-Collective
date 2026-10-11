#!/usr/bin/env python3
"""Prove all pre-V3 frontend source/media are byte-identical except the additive route."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
snapshot = ROOT / "backups/dax-site-v1-current-working-version-2026-10-11-verified"
if not snapshot.exists():
    snapshot = ROOT / "backups/dax-site-v1-current-working-version-2026-10-11-portable"
manifest = json.loads((snapshot / "manifest.json").read_text())
count = 0
for name, expected in manifest["files"].items():
    if not name.startswith(("dax-main/src/", "dax-main/public/")) or name == "dax-main/src/App.jsx":
        continue
    path = ROOT / name
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise SystemExit(f"Earlier version changed: {name}")
    count += 1
current = (ROOT / "dax-main/src/App.jsx").read_text()
current = current.replace("const DaxUniverseV3App = React.lazy(() => import('./pages/experiments/universe-v3/DaxUniverseV3App'))\n", "", 1)
current = current.replace(
    '          <Route path="/experiments/dax-universe-v3/*" element={\n'
    '            <React.Suspense fallback={<p role="status" className="p-6 text-white">Loading V3 foundation…</p>}>\n'
    '              <DaxUniverseV3App />\n'
    '            </React.Suspense>\n'
    '          } />\n', "", 1)
if current != (snapshot / "dax-main/src/App.jsx").read_text():
    raise SystemExit("App.jsx has changes beyond the isolated V3 route.")
print(f"Isolation verified: {count} earlier frontend/media files unchanged; App.jsx is additive only.")

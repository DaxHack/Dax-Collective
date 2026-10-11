#!/usr/bin/env python3
"""Regression checks for the separate local-backup/public-export boundary."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("checkpoint", Path(__file__).with_name("v3-portable-checkpoint.py"))
checkpoint = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checkpoint)


class PortableCheckpointTest(unittest.TestCase):
    def test_full_snapshot_uploads_and_intake_cannot_cross_boundary(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "full"
            source.mkdir()
            entries = {
                "dax-main/src/App.jsx": b"existing application source",
                "dax-main/public/images/reviewed.webp": b"approved public derivative",
                "attached_assets/original.jpg": b"unreviewed original",
                "asset-intake/portrait.heic": b"unreviewed intake",
                "docs/private-note.txt": b"local content",
                "backups/old.zip": b"historical archive",
            }
            hashes = {}
            for name, content in entries.items():
                path = source / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(content)
                hashes[name] = checkpoint.snapshot.digest(path)
            (source / "manifest.json").write_text(json.dumps({"label": "test full snapshot", "files": hashes}))
            configuration = root / "configuration"
            configuration.mkdir()
            (configuration / "package.json").write_text("{}")
            portable = root / "portable"
            checkpoint.create(source, portable, configuration)
            records = json.loads((portable / "manifest.json").read_text())
            self.assertEqual(set(records["files"]), {
                "dax-main/src/App.jsx", "dax-main/public/images/reviewed.webp", "package.json",
            })
            checkpoint.verify_boundary(portable)
            self.assertEqual(entries["attached_assets/original.jpg"], (source / "attached_assets/original.jpg").read_bytes())
            (portable / "attached_assets").mkdir()
            (portable / "attached_assets/hidden.jpg").write_bytes(b"unreviewed")
            with self.assertRaises(RuntimeError):
                checkpoint.verify_boundary(portable)

    def test_allowlist_rejects_traversal_and_nonpublic_paths(self):
        for path in ["attached_assets/a.jpg", "asset-intake/a.heic", "/dax-main/src/App.jsx",
                     "dax-main/src/../../attached_assets/a.jpg", "dax-main/uploads/a.jpg"]:
            self.assertFalse(checkpoint.permitted(path), path)


if __name__ == "__main__":
    unittest.main()

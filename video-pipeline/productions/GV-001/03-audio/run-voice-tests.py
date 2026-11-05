"""
GV-001 Voice Test Generator
Tests three meaningfully different edge-tts voice/rate combos against the
God's Vessel creative standard. Run inside .venv-video/.

Usage:
    .venv-video\Scripts\python video-pipeline\productions\GV-001\03-audio\run-voice-tests.py
"""

import asyncio
import edge_tts
import os
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent

TEST_TEXT = (
    "There's a kind of tired that doesn't come from being lazy. "
    "It comes from continuing when nothing seems to happen. "
    "You don't need to see it to keep going."
)

TESTS = [
    {
        "id": "test1",
        "voice": "en-US-ChristopherNeural",
        "rate": "-5%",
        "pitch": "+0Hz",
        "filename": "voice-test-1-christopher-r-5pct.mp3",
        "description": "Authoritative mature male, slight slowdown"
    },
    {
        "id": "test2",
        "voice": "en-US-GuyNeural",
        "rate": "-10%",
        "pitch": "-3Hz",
        "filename": "voice-test-2-guy-r-10pct-p-3hz.mp3",
        "description": "Conversational male, more slowed, slightly lower pitch"
    },
    {
        "id": "test3",
        "voice": "en-US-JennyNeural",
        "rate": "-5%",
        "pitch": "+0Hz",
        "filename": "voice-test-3-jenny-r-5pct.mp3",
        "description": "Warm natural female, slight slowdown"
    },
]


async def generate_test(test: dict):
    output_path = OUTPUT_DIR / test["filename"]
    print(f"Generating {test['id']}: {test['voice']} rate={test['rate']} pitch={test['pitch']}")
    communicate = edge_tts.Communicate(
        TEST_TEXT,
        test["voice"],
        rate=test["rate"],
        pitch=test["pitch"],
    )
    await communicate.save(str(output_path))
    size = output_path.stat().st_size if output_path.exists() else 0
    print(f"  -> {test['filename']} ({size} bytes)")
    return output_path.exists() and size > 0


async def main():
    print(f"\nTest text:\n  \"{TEST_TEXT}\"\n")
    results = []
    for test in TESTS:
        ok = await generate_test(test)
        results.append((test, ok))

    print("\n--- Results ---")
    for test, ok in results:
        status = "OK" if ok else "FAILED"
        print(f"  [{status}] {test['filename']}  ({test['description']})")

    all_ok = all(ok for _, ok in results)
    print(f"\nAll tests passed: {all_ok}")
    return all_ok


if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)

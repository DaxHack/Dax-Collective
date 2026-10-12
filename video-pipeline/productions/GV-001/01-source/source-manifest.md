# GV-001 — Source Manifest

## Production Identity
- **Production ID:** GV-001
- **Brand:** God's Vessel
- **Asset type:** Short-form vertical video
- **Target dimensions:** 1080 × 1920 (9:16)
- **Target duration:** 40–55 seconds
- **Created:** 2026-08-01

## Topic Direction (from creative brief)
Working topic: Trusting God when progress feels invisible.

Audience: Adults who feel discouraged, spiritually tired, behind in life, or uncertain whether their effort and faithfulness are producing anything.

Core message: Lack of visible progress does not automatically mean God is absent or that nothing is happening. Faithfulness during quiet seasons still matters. The message should encourage the viewer to continue taking the next right step without pretending that waiting is easy.

## Tone Requirements
- Grounded, cinematic, mature, sincere, calm but powerful
- Encouraging without preaching
- Emotionally honest rather than overly optimistic

## Explicitly Avoid
- Prosperity-gospel implications
- "Your breakthrough is coming" language
- Implying every delay is directly God's doing
- Guilt or shame
- Generic motivational clichés
- Overdramatic preaching
- Forced merchandise references

## Scripture Candidates Authorized for Evaluation
- Galatians 6:9
- Hebrews 11:1
- Psalm 27:14
- Romans 5:3–5

## Scripture Verification Record
| Reference | WEB Text | Source | Verified |
|---|---|---|---|
| Galatians 6:9 | "Let's not be weary in doing good, for we will reap in due season if we don't give up." | https://ebible.org/eng-web/GAL06.htm | 2026-08-01 |
| Psalm 27:14 | "Wait for Yahweh. Be strong, and let your heart take courage. Yes, wait for Yahweh." | https://ebible.org/eng-web/PSA027.htm | 2026-08-01 |
| Hebrews 11:1 | "Now faith is assurance of things hoped for, proof of things not seen." | https://ebible.org/eng-web/HEB11.htm (verified 2026-06-30 per master-sheet CSV) | 2026-06-30 |

Romans 5:3–5 was considered and set aside. See `02-script/theology-review.md` for reasoning.

## Pipeline Environment
- Python venv: `.venv-video/` (edge-tts 7.2.8)
- FFmpeg: To be installed at `tools/ffmpeg/` (system PATH not modified)
- TTS engine: edge-tts (Microsoft neural voices, free, no account required)
- Music: Optional for draft one; no music planned for GV-001

## Cost Record
| Item | Cost | Notes |
|---|---|---|
| edge-tts | $0 | Free, network-only Microsoft neural TTS |
| Python venv | $0 | Local, no paid packages |
| FFmpeg | $0 | Open-source, to be installed locally |
| Background visuals | $0 | Public domain or existing repo assets only |
| Total (this run) | $0 | |
| Estimated per-video | $0 | All tools are free |

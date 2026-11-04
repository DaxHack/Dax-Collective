# GV-001 — QC Report

**Final verdict: READY FOR PUBLISHING** (pending Daniel's publish approval — nothing uploaded)
**Date:** 2026-11-04
**Deliverable:** `06-render/GV-001-strength-in-the-quiet-1080x1920.mp4` (md5 `b9748d6fda125a521e4aac5d25a95cc7`)

## 1. Audio / video QC (automated — `08-qc/run_qc.py`, results in `av-qc.json`)

All 14 checks PASS on the final render:

| Check | Result |
|---|---|
| Resolution / fps / codec | 1080×1920, 30fps, H.264 High yuv420p |
| Audio | AAC 48kHz stereo, 192kbps |
| Duration | 45.90s (43.3s narration + end card); inside the 40–55s brief |
| A/V stream lengths | Equal (45.90 / 45.90) |
| File size | 29.0MB (limit 50MB) |
| Loudness | -14.7 LUFS integrated (target -14 ±1.5); true peak -4.4 dBTP |
| Dropouts during narration | None |
| Black frames | None |
| Frozen video | None before the intentionally static end card (43.33s) |
| SRT | 23 sequential cues, no overlaps |
| Caption accuracy | 96/96 spoken words match captions, in order |

## 2. Scripture / text verification

- Psalm 27:14 re-checked against https://ebible.org/eng-web/PSA027.htm on 2026-11-04. The WEB text
  "Wait for Yahweh. Be strong, and let your heart take courage. Yes, wait for Yahweh." matches exactly.
- WEB is public domain.
- On-screen and spoken: "Wait for God. Be strong, and let your heart take courage." The divine-name
  substitution was approved in `02-script/theology-review.md`. The description gives the exact WEB wording and
  notes the substitution, so the citation stays honest.
- On-screen reference "PSALM 27:14" is correct.
- Captions were checked word by word against the narration's own word timings (automated assert in the
  build plus the QC check). No typos, and punctuation follows the canonical script.

## 3. Creative QA (per `dax-content-quality-director`)

| Requirement | Result |
|---|---|
| Strong hook in the first seconds | PASS — narration and caption start at 0.1s; the opening line names the feeling directly |
| Natural narration, not robotic | PASS — approved -5% take with all 14 natural pauses kept (Daniel approved by ear) |
| Visual variety, no slideshow feel | PASS — 7 distinct scenes plus end card, each with camera motion and live light, flame, dust or road motion; cuts land on narration pauses |
| No AI artifacts / malformed anatomy / warped text | PASS — no people, no generated imagery; all text is rendered type |
| Originality | PASS — all scenes drawn in code for this piece; cool-to-warm window callback carries the message |
| Accurate captions, safe zones | PASS — 96/96 words; captions centered at y≈1290, clear of platform UI |
| Clean audio | PASS — mastered to -14.7 LUFS, no clipping; no music |
| Thumbnail honest | PASS — cover uses the video's own dawn scene and title |
| Brand avoid list | PASS — no prosperity language, no guilt, no merch, restrained CTA |
| AI disclosure | PASS — synthetic narration disclosed in the description; platform labels recommended On (`07-metadata/publish-package.md`) |

### Failures found and fixed (correction + retest)

| # | Failure | Fix | Retest |
|---|---|---|---|
| 1 | First render was 225.6MB (per-frame grain was nearly incompressible) | Grain lowered and refreshed at 15fps; x264 CRF 20 with a 7Mbps cap | 29.0MB PASS |
| 2 | Loudness -15.2 LUFS (single-pass normalization undershot) | Two-pass linear loudnorm | -14.7 LUFS PASS |
| 3 | Road center dashes nearly invisible near camera; weak "still going" motion | Dash spacing and speed reworked (~1.2 dashes/s) | Frames 17.5s/19.0s/21.0s PASS |
| 4 | Ghosted double lampshade at the 13.9s close-up cut | Zero-length crossfade is now a true hard cut | Frames 416–418 PASS |
| 5 | Last caption overlapped the logo during the end-card fade | Last caption ends before the crossfade; end card moved to 43.05s | Frames 1270–1310 PASS |
| 6 | (stills pass) Caption cues overlapped during fades; window light shaft off-frame; hard-edged bokeh; box around logo | Cue gap, shaft geometry, soft bokeh, logo keyed off its field | Stills PASS |

## Limits of this QC

- Audio was checked by measurement, not by ear. Daniel approved the voice by ear on 2026-11-04.
- Motion was reviewed from sampled frames, not real-time playback.
- `02-script/theology-review.md` quotes an earlier CTA ("Save this for the next time it feels pointless").
  The approved canonical script uses "Share this with someone who needs it", and that is what was produced.

## Risk note for publishing approval (not a blocker)

The narration comes from Microsoft's Edge "Read Aloud" neural voices via the open-source `edge-tts` client
($0, no account). Those service terms are aimed at personal use. If GV content will be monetized, consider
regenerating future productions through a paid, commercially licensed TTS (for example Azure AI Speech, same
GuyNeural voice) before scaling. This is Daniel's business call; it doesn't change the GV-001 file.

# GV-001 Voice Assessment

**Date:** 2026-08-01
**Engine:** edge-tts 7.2.8 (Microsoft neural TTS — free, no account required)
**Test text (short):** "There's a kind of tired that doesn't come from being lazy. It comes from continuing when nothing seems to happen. You don't need to see it to keep going."
**Test text (full):** Canonical GV-001 script, 92 words

---

## Rate Calibration

The default edge-tts pace is too fast for God's Vessel cinematic content.
Full-script duration testing at three rate levels (en-US-GuyNeural, pitch=-3Hz):

| Rate | Full-script duration | Assessment |
|---|---|---|
| -10% | 45.4s | Under the 40–55s brief, very brisk |
| -25% | 54.5s | **Within brief — selected as calibrated rate** |
| -40% | 68.2s | Over brief, likely sounds unnaturally slow |

**Calibrated rate: -25%** for all voice candidates.

---

## Short Test Files (10–11 seconds, 38-word excerpt)

| File | Voice | Rate | Pitch | Duration |
|---|---|---|---|---|
| voice-test-1-christopher-r-5pct.mp3 | en-US-ChristopherNeural | -5% | +0Hz | 10.5s |
| voice-test-2-guy-r-10pct-p-3hz.mp3 | en-US-GuyNeural | -10% | -3Hz | 11.3s |
| voice-test-3-jenny-r-5pct.mp3 | en-US-JennyNeural | -5% | +0Hz | 10.4s |

Note: Short tests use earlier rate settings. Calibrated candidates below use -25%.

---

## Full-Script Candidates at Calibrated Rate (92 words, 50–56 seconds)

| File | Voice | Rate | Pitch | Duration |
|---|---|---|---|---|
| CANDIDATE-christopher-r25pct.mp3 | en-US-ChristopherNeural | -25% | +0Hz | 55.9s |
| full-guy-r25pct.mp3 | en-US-GuyNeural | -25% | -3Hz | 54.5s |
| CANDIDATE-jenny-r25pct.mp3 | en-US-JennyNeural | -25% | +0Hz | 54.3s |

---

## Voice Assessment Against God's Vessel Standard

### en-US-ChristopherNeural (55.9s at -25%)
Microsoft documentation characterizes Christopher as a narration-professional style voice.
- Pronunciation: Clear and accurate ✓
- Pacing at -25%: Deliberate, measured
- Overly cheerful or commercial: Low risk ✓
- Grounded and mature: Yes — but leans toward "professional narrator" rather than "person reflecting from experience"
- Brand concern: May sound too polished, too close to a news documentary or corporate explainer. God's Vessel needs someone who sounds like they've lived through the quiet season, not performed it.
- Duration: 55.9s — technically over the 55s upper limit
- **Estimated score: 3.5/5**

### en-US-GuyNeural with pitch -3Hz (54.5s at -25%)
Guy Neural is characterized as a conversational natural voice. The pitch reduction adds maturity.
- Pronunciation: Natural and clear ✓
- Pacing at -25%: Contemplative, unhurried — appropriate for cinematic faith content
- Overly cheerful or commercial: Low risk — Guy's natural conversational register doesn't carry TTS cheerfulness ✓
- Grounded and mature: Yes — the -3Hz pitch adjustment deepens the register, removing lightness ✓
- Duration: 54.5s ✓ — inside the brief
- Brand alignment: Closest match to the God's Vessel creative standard — sounds like someone speaking from experience
- **Estimated score: 4.5/5 — meets auto-selection threshold**

### en-US-JennyNeural (54.3s at -25%)
Jenny Neural is a friendly, warm conversational voice.
- Pronunciation: Clear ✓
- Pacing at -25%: Thoughtful
- Overly cheerful or commercial: RISK — Jenny's "friendly" baseline can introduce an upbeat quality inconsistent with the "not overly optimistic" requirement
- Brand concern: Could feel adjacent to a wellness podcast or self-help app rather than God's Vessel's "sincere and grounded" identity
- Duration: 54.3s ✓
- **Estimated score: 3/5**

---

## Recommendation

**CANDIDATE: en-US-GuyNeural, rate=-25%, pitch=-3Hz, duration=54.5s**

Meets all five auto-selection criteria based on known voice characteristics:
- Pronunciation correct ✓
- Pacing natural at calibrated rate (estimated) ✓
- Not overly cheerful or commercial ✓
- Grounded and mature ✓
- Voice quality score ≥ 4/5 (estimated 4.5/5) ✓

**Limitation:** This assessment is based on documented voice characteristics, not live listening. The three candidate files are presented for your review before the production voiceover is generated.

File path of recommended candidate:
`video-pipeline/productions/GV-001/03-audio/full-guy-r25pct.mp3`

---

## After Your Review

If Guy Neural -25% -3Hz is confirmed:
→ Rename `full-guy-r25pct.mp3` to `voiceover-approved.mp3`
→ This becomes the production audio source
→ Video assembly (04-visuals + 05-captions + 06-render) proceeds

If a different voice is preferred:
→ Specify which file or describe what to change
→ I will adjust parameters and regenerate

---

## venv Packages Installed (version record)
- edge-tts 7.2.8
- mutagen 1.47.0
- aiohttp 3.14.3
- All other dependencies are aiohttp/edge-tts transitive dependencies

"""
GV-001 automated audio/video QC. Writes 08-qc/av-qc.json and prints PASS/FAIL per check.

Usage (repo root):  python video-pipeline/productions/GV-001/08-qc/run_qc.py
"""

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIDEO = ROOT / "06-render" / "GV-001-strength-in-the-quiet-1080x1920.mp4"
SRT = ROOT / "05-captions" / "GV-001.srt"
TIMINGS = ROOT / "05-captions" / "word-timings.json"


def run(args):
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")


def probe():
    out = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(VIDEO)]).stdout
    return json.loads(out)


def ff_filter(af=None, vf=None):
    args = ["ffmpeg", "-hide_banner", "-nostats", "-i", str(VIDEO)]
    args += ["-af", af, "-vn"] if af else ["-vf", vf, "-an"]
    return run(args + ["-f", "null", "-"]).stderr


def main():
    checks = []

    def check(name, ok, detail):
        checks.append({"check": name, "pass": bool(ok), "detail": detail})

    info = probe()
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next(s for s in info["streams"] if s["codec_type"] == "audio")
    dur = float(info["format"]["duration"])
    check("resolution 1080x1920", (v["width"], v["height"]) == (1080, 1920), f'{v["width"]}x{v["height"]}')
    check("frame rate 30", v["r_frame_rate"] == "30/1", v["r_frame_rate"])
    check("H.264 yuv420p", v["codec_name"] == "h264" and v["pix_fmt"] == "yuv420p", f'{v["codec_name"]} {v["pix_fmt"]}')
    check("AAC 48kHz stereo", a["codec_name"] == "aac" and a["sample_rate"] == "48000" and a["channels"] == 2,
          f'{a["codec_name"]} {a["sample_rate"]} ch={a["channels"]}')
    check("duration 40-55s", 40 <= dur <= 55, f"{dur:.2f}s")
    check("A/V durations match", abs(float(v["duration"]) - float(a["duration"])) < 0.1,
          f'v={float(v["duration"]):.2f} a={float(a["duration"]):.2f}')
    size_mb = VIDEO.stat().st_size / 1e6
    check("file size < 50MB (GitHub-safe, upload-friendly)", size_mb < 50, f"{size_mb:.1f}MB")

    ebu = ff_filter(af="ebur128=peak=true")
    summary = ebu[ebu.rfind("Summary:"):]
    lufs = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summary).group(1))
    tp = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summary).group(1))
    check("integrated loudness -14 ±1.5 LUFS", abs(lufs + 14) <= 1.5, f"{lufs} LUFS")
    check("true peak <= -1.0 dBTP", tp <= -1.0, f"{tp} dBTP")

    sil = ff_filter(af="silencedetect=noise=-45dB:d=1.5")
    long_sil = [(float(s), float(e)) for s, e in zip(re.findall(r"silence_start: ([\d.]+)", sil),
                                                    re.findall(r"silence_end: ([\d.]+)", sil))]
    speech_end = json.loads(TIMINGS.read_text(encoding="utf-8"))["words"][-1]["end"]
    mid = [s for s in long_sil if s[0] < speech_end]
    check("no dropouts during narration (>1.5s silence)", not mid, f"silences before {speech_end:.2f}s: {mid}")

    blk = ff_filter(vf="blackdetect=d=0.2:pix_th=0.02")
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", blk)
    check("no black frames", not blacks, str(blacks))

    frz = ff_filter(vf="freezedetect=n=0.0005:d=2.5")
    freezes = re.findall(r"freeze_start: ([\d.]+)", frz)
    ends = re.findall(r"freeze_end: ([\d.]+)", frz)
    # the end card is intentionally static
    bad = [float(s) for s in freezes if float(s) < 42.7]
    check("no frozen video before end card (>2.5s)", not bad, f"freezes at {freezes} / ends {ends}")

    cues = re.findall(r"(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)\n(.+?)\n", SRT.read_text(encoding="utf-8"))
    to_s = lambda t: int(t[:2]) * 3600 + int(t[3:5]) * 60 + int(t[6:8]) + int(t[9:]) / 1000
    overl = [c[2] for c, n in zip(cues, cues[1:]) if to_s(c[1]) > to_s(n[0])]
    check("SRT cues sequential, no overlaps", not overl and len(cues) > 0, f"{len(cues)} cues; overlaps={overl}")
    srt_words = re.findall(r"[A-Za-z0-9']+", " ".join(c[2] for c in cues).replace("’", "'"))
    spoken = [w["word"].replace("’", "'") for w in json.loads(TIMINGS.read_text(encoding="utf-8"))["words"]]
    check("captions match every spoken word", srt_words == spoken, f"{len(srt_words)} caption words vs {len(spoken)} spoken")

    report = {"video": VIDEO.name, "duration_s": round(dur, 2), "loudness_lufs": lufs, "true_peak_dbtp": tp,
              "all_pass": all(c["pass"] for c in checks), "checks": checks}
    (ROOT / "08-qc" / "av-qc.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    for c in checks:
        print(("PASS " if c["pass"] else "FAIL ") + c["check"] + " — " + c["detail"])
    print("ALL PASS" if report["all_pass"] else "QC FAILED")


if __name__ == "__main__":
    main()

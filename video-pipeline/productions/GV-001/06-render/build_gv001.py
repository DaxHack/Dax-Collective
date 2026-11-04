"""
GV-001 "Strength in the Quiet" — visuals, captions and video assembly.

All imagery is drawn procedurally here (original, no stock, no generated
faces, no AI imagery). Captions are timed from edge-tts word boundaries of
the approved take, which was verified sample-aligned with FINAL audio.

Usage (from the repo root, system Python with numpy + Pillow, ffmpeg on PATH):
    python video-pipeline/productions/GV-001/06-render/build_gv001.py [--stills]
"""

import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "03-audio" / "FINAL-guy-r5pct-p-3hz.mp3"
TIMINGS = ROOT / "05-captions" / "word-timings.json"
LOGO = ROOT / "04-visuals" / "gods_vessel_logo.png"
STILLS = ROOT / "04-visuals" / "stills"
OUT = ROOT / "06-render"

FW, FH, FPS = 1080, 1920, 30
W, H = FW // 2, FH // 2          # procedural scenes render at half res, then upscale
A = H / W                        # scene units: x in [0,1], y in [0,A]
DURATION = 45.9
FONT_DIR = Path("C:/Windows/Fonts")

# Scene cuts sit in the narration pauses (see 05-captions/word-timings.json).
SCENES = [
    ("window_cool", 0.00, 7.30),
    ("lamp_wide", 7.30, 13.90),
    ("lamp_close", 13.90, 16.80),
    ("road", 16.80, 24.10),
    ("dawn", 24.10, 30.76),
    ("candle", 30.76, 35.00),
    ("window_warm", 35.00, 43.05),
    ("endcard", 43.05, DURATION),
]
XFADE = {"lamp_close": 0, "endcard": 0.6}   # 0 = hard cut; default crossfade 0.45s

rng = np.random.default_rng(14)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
X0 = (xx + 0.5) / W
Y0 = (yy + 0.5) / W


def ss(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def box(x, y, x0, x1, y0, y1, s):
    return ss(x0 - s, x0 + s, x) * (1 - ss(x1 - s, x1 + s, x)) * ss(y0 - s, y0 + s, y) * (1 - ss(y1 - s, y1 + s, y))


def cam(zoom, cx=0.5, cy=None, px=0.0, py=0.0):
    cy = A / 2 if cy is None else cy
    return cx + (X0 - 0.5) / zoom + px, cy + (Y0 - A / 2) / zoom + py


def col(c):
    return np.array(c, np.float32)


def noise(h, w, cells, seed):
    r = np.random.default_rng(seed).random((cells[1], cells[0])).astype(np.float32)
    img = Image.fromarray((r * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img, np.float32) / 255


FOG = noise(H, W * 3, (18, 6), 3)
CLOUD = noise(H, W * 3, (6, 40), 5)
STARS = (rng.random((H, W)) > 0.9965).astype(np.float32) * rng.random((H, W)).astype(np.float32)
DUST = rng.random((260, 4)).astype(np.float32)
BOKEH = rng.random((14, 4)).astype(np.float32)


def scroll(field, dx):
    off = int(dx) % (field.shape[1] - W)
    return field[:, off:off + W]


def dust_layer(t, x, y, mask_fn, count, brightness):
    img = np.zeros((H, W), np.float32)
    px = (DUST[:count, 0] + 0.010 * np.sin(t * 0.35 + DUST[:count, 2] * 9) + t * 0.004) % 1.0
    py = (DUST[:count, 1] * A - t * 0.006 * (0.4 + DUST[:count, 3])) % A
    # map scene coords back to pixels under the current camera
    sx = (px - x[0, 0]) / (x[0, -1] - x[0, 0]) * (W - 1)
    sy = (py - y[0, 0]) / (y[-1, 0] - y[0, 0]) * (H - 1)
    ok = (sx >= 0) & (sx < W) & (sy >= 0) & (sy < H)
    ix, iy = sx[ok].astype(int), sy[ok].astype(int)
    tw = 0.6 + 0.4 * np.sin(t * 1.7 + DUST[:count, 2][ok] * 20)
    np.add.at(img, (iy, ix), tw * DUST[:count, 3][ok])
    img = np.asarray(Image.fromarray(np.clip(img * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1)), np.float32) / 255
    return img * mask_fn * brightness


def window_scene(t, dur, warm):
    p = t / dur
    x, y = cam(1.0 + 0.07 * p, px=0.01 * p)
    wall = col((0.060, 0.042, 0.030)) if warm else col((0.026, 0.032, 0.044))
    light = col((1.00, 0.76, 0.46)) if warm else col((0.58, 0.67, 0.84))
    strength = (0.85 + 0.25 * p) if warm else 0.75

    img = wall * (0.55 + 0.6 * (1 - y / A))[..., None]
    floor = ss(1.34, 1.37, y)
    img = img * (1 - floor[..., None]) + (wall * 0.55)[None, None] * floor[..., None]

    x0, x1, y0, y1 = 0.24, 0.68, 0.30, 0.98
    pane = box(x, y, x0, x1, y0, y1, 0.006)
    mull = ss(0.007, 0.011, np.abs(x - 0.46)) * ss(0.007, 0.011, np.abs(y - 0.64))
    sky = (0.55 + 0.45 * (1 - (y - y0) / (y1 - y0)))
    glass = pane * mull * np.clip(sky, 0, 1)
    bloom = box(x, y, x0, x1, y0, y1, 0.09) * 0.22
    img = img + light * (glass * strength + bloom * strength)[..., None]

    # shaft from window to floor, slanting toward the viewer
    k = 0.16
    xs = x - k * (y - y0)
    bar_shadow = 1 - 0.45 * (1 - ss(0.008, 0.03, np.abs(xs - 0.46)))
    shaft = box(xs, y, x0, x1, y0, 1.66, 0.06) * bar_shadow * (1 - pane * 0.9) * ss(y0, y0 + 0.25, y)
    fog = 0.6 + 0.6 * scroll(FOG, t * 6)
    shaft_i = shaft * fog * (0.16 if warm else 0.12) * strength
    patch = floor * box(xs, y, x0, x1, 1.45, 1.66, 0.025) * bar_shadow * 0.40 * strength
    img = img + light * (shaft_i + patch)[..., None]
    img = img + light * dust_layer(t, x, y, shaft, 260, 0.9 if warm else 0.7)[..., None]
    return img


def lamp_scene(t, dur, close):
    p = t / dur
    if close:
        x, y = cam(1.55 + 0.05 * p, cy=1.02, px=-0.004 * p)
    else:
        x, y = cam(1.0 + 0.04 * p, px=0.02 * (p - 0.5))
    warm = col((1.0, 0.70, 0.40))
    img = col((0.030, 0.022, 0.018)) * np.ones((H, W, 1), np.float32)
    d2 = (x - 0.5) ** 2 + ((y - 1.0) / 1.25) ** 2
    img = img + warm * (np.exp(-d2 / 0.10) * 0.40)[..., None]

    for bx, by, br, ba in BOKEH:
        cx, cy = 0.08 + bx * 0.84 + 0.01 * np.sin(t * 0.2 + ba * 6), 0.25 + by * 0.55
        r = 0.025 + br * 0.045
        disc = 1 - ss(r * 0.4, r * 1.15, np.sqrt((x - cx) ** 2 + (y - cy) ** 2))
        img = img + warm * (disc * (0.015 + 0.035 * ba))[..., None]

    table = ss(1.37, 1.39, y)
    img = img * (1 - table[..., None] * 0.35)
    pool = np.exp(-(((x - 0.5) / 0.30) ** 2 + ((y - 1.43) / 0.06) ** 2)) * table
    img = img + warm * (pool * 0.55)[..., None]
    edge = np.exp(-((y - 1.375) / 0.004) ** 2) * np.exp(-((x - 0.5) / 0.35) ** 2)
    img = img + warm * (edge * 0.25)[..., None]

    s = (y - 0.84) / (1.10 - 0.84)
    halfw = 0.13 + 0.07 * s
    shade = ss(-0.02, 0.0, s) * (1 - ss(1.0, 1.02, s)) * (1 - ss(halfw - 0.006, halfw, np.abs(x - 0.5)))
    shade_col = col((1.0, 0.80, 0.56)) * (0.62 + 0.30 * s)[..., None]
    img = img * (1 - shade[..., None]) + shade_col * shade[..., None]
    stem = box(x, y, 0.492, 0.508, 1.10, 1.36, 0.003)
    foot = 1 - ss(0.9, 1.0, ((x - 0.5) / 0.07) ** 2 + ((y - 1.365) / 0.012) ** 2)
    img = img * (1 - np.clip(stem + foot, 0, 1)[..., None] * 0.92)
    dim = 1.0 - (0.10 * p if close else 0.0)   # "and the silence" settles slightly
    return img * dim


def road_scene(t, dur):
    p = t / dur
    x, y = cam(1.0 + 0.04 * p)
    yh = 0.80
    sky_t = np.clip(y / yh, 0, 1)
    sky = col((0.010, 0.014, 0.034))[None, None] * (1 - sky_t[..., None]) + col((0.075, 0.105, 0.140))[None, None] * sky_t[..., None]
    sky = sky + (STARS * (0.6 + 0.4 * np.sin(t * 2 + STARS * 30)) * (1 - sky_t) * 0.8)[..., None]
    sky = sky + col((0.35, 0.30, 0.25)) * (np.exp(-(((x - 0.5) / 0.35) ** 2 + ((y - yh) / 0.06) ** 2)) * 0.25)[..., None]
    hill = yh - 0.035 - 0.03 * np.interp(x, np.linspace(0, 1, 9), [0.9, 0.6, 0.8, 0.3, 0.1, 0.4, 0.7, 0.5, 0.9])
    land = ss(hill - 0.002, hill + 0.002, y)
    img = sky * (1 - land[..., None]) + col((0.012, 0.014, 0.020)) * land[..., None]

    g = np.clip(y - yh, 0, None)
    depth = g / (A - yh)
    hw = 0.62 * depth + 0.003
    road = ss(hw + 0.004, hw - 0.004, np.abs(x - 0.5)) * ss(0.0, 0.004, g)
    img = img * (1 - road[..., None]) + col((0.030, 0.033, 0.040)) * (0.7 + 0.6 * depth)[..., None] * road[..., None]
    near = ss(0.0, 0.10, depth)
    edges = np.exp(-((np.abs(x - 0.5) - hw * 0.93) / (0.002 + 0.006 * depth)) ** 2) * near
    img = img + col((0.30, 0.31, 0.33)) * (edges * 0.5)[..., None]
    phase = (0.44 / (g + 0.02) + t * 1.2) % 1.0   # ~1.2 dashes per second pass the camera
    dash = (phase < 0.45) * np.exp(-((x - 0.5) / (0.0015 + 0.010 * depth)) ** 2) * near
    img = img + col((0.62, 0.52, 0.32)) * (dash * 0.75)[..., None]
    mist = np.exp(-((y - yh - 0.02) / 0.08) ** 2) * (0.5 + 0.5 * scroll(FOG, t * 10))
    img = img + col((0.16, 0.18, 0.21)) * (mist * 0.35)[..., None]
    return img


def dawn_scene(t, dur):
    p = t / dur
    x, y = cam(1.03 - 0.03 * p, py=-0.01 * p)
    yh = 1.12
    sky_t = np.clip(y / yh, 0, 1) ** 1.4
    top = col((0.020, 0.028, 0.065))
    low = col((0.55, 0.30, 0.16)) * (0.75 + 0.35 * p)
    img = top[None, None] * (1 - sky_t[..., None]) + low[None, None] * sky_t[..., None]
    sun = np.exp(-(((x - 0.5) / 0.22) ** 2 + ((y - (yh + 0.05 - 0.05 * p)) / 0.10) ** 2))
    img = img + col((1.0, 0.72, 0.42)) * (sun * (0.55 + 0.3 * p))[..., None]
    cl = scroll(CLOUD, t * 3)
    band = ss(0.55, 0.75, cl) * ss(0.45, 0.9, y) * (1 - ss(yh - 0.1, yh, y))
    img = img * (1 - band[..., None] * 0.35) + col((0.85, 0.50, 0.32)) * (band * sky_t * 0.30)[..., None]
    far = yh - 0.05 - 0.04 * np.interp(x, np.linspace(0, 1, 7), [0.3, 0.7, 0.5, 0.9, 0.4, 0.6, 0.2])
    near_h = yh + 0.06 - 0.07 * np.interp(x, np.linspace(0, 1, 6), [0.8, 0.4, 0.1, 0.2, 0.6, 0.9])
    img = img * (1 - ss(far, far + 0.004, y)[..., None]) + col((0.10, 0.07, 0.08)) * ss(far, far + 0.004, y)[..., None]
    img = img * (1 - ss(near_h, near_h + 0.004, y)[..., None]) + col((0.025, 0.020, 0.025)) * ss(near_h, near_h + 0.004, y)[..., None]
    return img


def candle_scene(t, dur):
    p = t / dur
    x, y = cam(1.15 + 0.08 * p, cy=1.05)
    flick = 1 + 0.04 * np.sin(t * 9.1) + 0.03 * np.sin(t * 13.7 + 1) + 0.02 * np.sin(t * 23.3)
    sway = 0.004 * np.sin(t * 2.3) + 0.002 * np.sin(t * 5.9)
    img = col((0.022, 0.016, 0.014)) * np.ones((H, W, 1), np.float32)
    d2 = (x - 0.5) ** 2 + ((y - 0.92) / 1.2) ** 2
    img = img + col((1.0, 0.62, 0.30)) * (np.exp(-d2 / 0.05) * 0.45 * flick)[..., None]

    body = box(x, y, 0.435, 0.565, 1.04, 1.95, 0.004)
    lit = np.exp(-((y - 1.04) / 0.35)) * (0.75 + 0.25 * np.cos((x - 0.5) / 0.065 * 1.4))
    img = img * (1 - body[..., None]) + col((0.80, 0.66, 0.50)) * (body * lit * 0.85 * flick)[..., None]
    rim = np.exp(-((y - 1.045) / 0.006) ** 2) * box(x, y, 0.435, 0.565, 0.9, 1.2, 0.004)
    img = img + col((1.0, 0.85, 0.6)) * (rim * 0.35)[..., None]
    wick = box(x, y, 0.4975, 0.5025, 0.995, 1.045, 0.0015)
    img = img * (1 - wick[..., None] * 0.9)

    base_y, h = 1.0, 0.125 * (0.96 + 0.04 * flick)
    s = (base_y - y) / h
    cxp = 0.5 + sway * np.clip(s, 0, 1) ** 2
    prof = 0.030 * np.sin(np.pi * np.clip(s * 0.95 + 0.05, 0, 1)) ** 0.7 * (1 - np.clip(s, 0, 1)) ** 0.35
    inside = ss(0.0, 0.02, s) * (1 - ss(0.97, 1.0, s)) * ss(prof + 0.003, prof - 0.003, np.abs(x - cxp))
    core = inside * (1 - ss(0.3, 0.8, np.abs(x - cxp) / (prof + 1e-4))) * (1 - ss(0.2, 0.75, s))
    flame = col((1.0, 0.62, 0.22)) * inside[..., None] * 1.1 + col((1.0, 0.97, 0.86)) * core[..., None] * 0.9
    img = img * (1 - inside[..., None]) + flame
    halo = np.exp(-(((x - cxp) / 0.05) ** 2 + ((y - (base_y - h * 0.4)) / 0.09) ** 2))
    return img + col((1.0, 0.70, 0.35)) * (halo * 0.30 * flick)[..., None]


def finish(img):
    img = np.clip(img / (1 + 0.12 * img), 0, 1)
    up = Image.fromarray((img * 255 + 0.5).astype(np.uint8)).resize((FW, FH), Image.BICUBIC)
    return np.asarray(up, np.float32) / 255


fy, fx = np.mgrid[0:FH, 0:FW].astype(np.float32)
VIGNETTE = (1 - 0.42 * ss(0.35, 1.05, np.sqrt(((fx / FW - 0.5) * 1.1) ** 2 + ((fy / FH - 0.5) * 0.9) ** 2)))[..., None]
GRAIN = [np.random.default_rng(100 + i).normal(0, 0.010, (FH, FW, 1)).astype(np.float32) for i in range(8)]


def endcard_image():
    # key the logo off its own off-white field so no box edge shows on the card
    size = 760
    logo = np.asarray(Image.open(LOGO).convert("RGB").resize((size, size), Image.LANCZOS), np.float32) / 255
    border = np.concatenate([logo[:12].reshape(-1, 3), logo[-12:].reshape(-1, 3)])
    field = np.median(border, axis=0)
    alpha = ss(0.04, 0.16, np.abs(logo - field).max(axis=2))[..., None]
    paper = col((0.972, 0.958, 0.935))
    card = np.ones((FH, FW, 3), np.float32) * paper
    x0, y0 = (FW - size) // 2, (FH - size) // 2 - 80
    card[y0:y0 + size, x0:x0 + size] = paper * (1 - alpha) + logo * alpha
    return card


SCENE_FN = {
    "window_cool": lambda t, d: window_scene(t, d, warm=False),
    "lamp_wide": lambda t, d: lamp_scene(t, d, close=False),
    "lamp_close": lambda t, d: lamp_scene(t, d, close=True),
    "road": road_scene,
    "dawn": dawn_scene,
    "candle": candle_scene,
    "window_warm": lambda t, d: window_scene(t, d, warm=True),
}
ENDCARD = None


def scene_frame(name, t, start, end, frame_i):
    global ENDCARD
    if name == "endcard":
        if ENDCARD is None:
            ENDCARD = endcard_image()
        return ENDCARD
    img = finish(SCENE_FN[name](t - start, end - start)) * VIGNETTE
    return np.clip(img + GRAIN[frame_i // 2 % len(GRAIN)], 0, 1)   # grain at 15fps keeps the bitrate sane


def background(t, frame_i):
    for i, (name, start, end) in enumerate(SCENES):
        if start <= t < end or i == len(SCENES) - 1:
            break
    cur = scene_frame(name, t, start, end, frame_i)
    xf = XFADE.get(name, 0.45)
    if i > 0 and xf > 0 and t < start + xf / 2:
        pname, pstart, pend = SCENES[i - 1]
        a = ss(start - xf / 2, start + xf / 2, np.float32(t))
        return cur * a + scene_frame(pname, t, pstart, pend, frame_i) * (1 - a)
    if i < len(SCENES) - 1:
        nname, nstart, nend = SCENES[i + 1]
        nxf = XFADE.get(nname, 0.45)
        if nxf > 0 and t > nstart - nxf / 2:
            a = ss(nstart - nxf / 2, nstart + nxf / 2, np.float32(t))
            return cur * (1 - a) + scene_frame(nname, t, nstart, nend, frame_i) * a
    return cur


# ---- captions ---------------------------------------------------------------

# (text, style). Spoken words are consumed in order from the word timings.
CHUNKS = [
    ("There's a kind of tired", "cap"), ("that doesn't come from being lazy.", "cap"),
    ("It comes from continuing", "cap"), ("when nothing seems to happen.", "cap"),
    ("You're not imagining it.", "cap"),
    ("The waiting is real.", "cap"),
    ("The effort is real.", "cap"),
    ("And the silence —", "cap"), ("that's real too.", "cap"),
    ("But waiting isn't the same", "cap"), ("as standing still.", "cap"),
    ("The fact that you're still here,", "cap"), ("still going —", "cap"), ("that matters.", "cap"),
    ("Psalm 27 says:", "cap"),
    ("“Wait for God.", "quote1"), ("Be strong, and let your heart take courage.”", "quote2"),
    ("Not passive.", "cap"),
    ("Just strength in the quiet.", "cap"),
    ("You don't need to see it", "cap"), ("to keep going.", "cap"),
    ("Start with today.", "cap"),
    ("Share this with someone who needs it.", "cap"),
]
QUOTE_END = 30.62


def tokens(s):
    return re.findall(r"[A-Za-z0-9']+", s.replace("’", "'"))


def caption_cues():
    words = json.loads(TIMINGS.read_text(encoding="utf-8"))["words"]
    cues, i = [], 0
    for text, style in CHUNKS:
        n = len(tokens(text))
        seg = words[i:i + n]
        assert [w["word"].replace("’", "'") for w in seg] == tokens(text), (text, seg)
        cues.append({"text": text, "style": style, "start": seg[0]["start"] - 0.06, "last": seg[-1]["end"]})
        i += n
    assert i == len(words), "captions do not cover every spoken word"
    # fades are 0.12s each side, so a cue must finish fading before the next fades in
    for c, nxt in zip(cues, cues[1:] + [None]):
        hold = c["last"] + 0.55
        # the last caption must be gone before the end-card crossfade starts
        c["end"] = min(hold, nxt["start"] - 0.26) if nxt else min(hold, SCENES[-1][1] - XFADE["endcard"] / 2 - 0.14)
    for c in cues:
        if c["style"].startswith("quote"):
            c["end"] = QUOTE_END
    return cues


def font(name, size):
    return ImageFont.truetype(str(FONT_DIR / name), size)


CAP_FONT = font("seguisb.ttf", 64)
QUOTE_FONT = font("georgiai.ttf", 72)
REF_FONT = font("seguisb.ttf", 34)
MAXW = 800


def wrap(draw, text, f):
    lines, cur = [], ""
    for w in text.split():
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=f) <= MAXW or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    return lines + [cur]


def caption_layer(cue):
    layer = Image.new("RGBA", (FW, FH), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if cue["style"] == "cap":
        lines = wrap(d, cue["text"], CAP_FONT)
        lh = 82
        tw = max(d.textlength(l, font=CAP_FONT) for l in lines)
        cy = 1290
        top = cy - lh * len(lines) / 2
        d.rounded_rectangle((FW / 2 - tw / 2 - 30, top - 18, FW / 2 + tw / 2 + 30, top + lh * len(lines) + 14), 22, fill=(0, 0, 0, 140))
        for k, l in enumerate(lines):
            d.text((FW / 2, top + lh * k + lh / 2), l, font=CAP_FONT, fill=(255, 255, 255, 255), anchor="mm")
    else:
        y0 = 560 if cue["style"] == "quote1" else 680
        lines = wrap(d, cue["text"], QUOTE_FONT)
        for k, l in enumerate(lines):
            d.text((FW / 2 + 2, y0 + 92 * k + 3), l, font=QUOTE_FONT, fill=(0, 0, 0, 150), anchor="mm")
            d.text((FW / 2, y0 + 92 * k), l, font=QUOTE_FONT, fill=(248, 238, 220, 255), anchor="mm")
        if cue["style"] == "quote2":
            ry = y0 + 92 * len(lines) + 40
            d.text((FW / 2, ry), "P S A L M   2 7 : 1 4", font=REF_FONT, fill=(222, 186, 120, 255), anchor="mm")
    return np.asarray(layer, np.float32) / 255


def write_srt(cues, path):
    def ts(s):
        ms = int(round(s * 1000))
        return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"
    merged, out = [], []
    for c in cues:   # SRT for platforms: the two quote halves become normal sequential cues
        end = c["end"] if not c["style"].startswith("quote") else None
        merged.append((c["start"], end, c["text"]))
    for k, (s, e, txt) in enumerate(merged):
        if e is None:
            e = merged[k + 1][0] - 0.02 if k + 1 < len(merged) else s + 2
        out.append(f"{k + 1}\n{ts(max(s, 0))} --> {ts(e)}\n{txt}\n")
    path.write_text("\n".join(out), encoding="utf-8")


def write_cover(path):
    img = finish(dawn_scene(5.5, 6.66)) * VIGNETTE
    layer = Image.new("RGBA", (FW, FH), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    title = font("georgiai.ttf", 108)
    for k, line in enumerate(("Strength", "in the Quiet")):
        d.text((FW / 2 + 3, 690 + 128 * k + 4), line, font=title, fill=(0, 0, 0, 150), anchor="mm")
        d.text((FW / 2, 690 + 128 * k), line, font=title, fill=(248, 238, 220, 255), anchor="mm")
    d.text((FW / 2, 930), "P S A L M   2 7 : 1 4", font=REF_FONT, fill=(222, 186, 120, 255), anchor="mm")
    d.text((FW / 2, 1700), "G O D ' S   V E S S E L", font=font("seguisb.ttf", 30), fill=(230, 220, 205, 200), anchor="mm")
    lay = np.asarray(layer, np.float32) / 255
    img = img * (1 - lay[..., 3:4]) + lay[..., :3] * lay[..., 3:4]
    Image.fromarray((np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)).save(path, quality=92)


# ---- assembly ---------------------------------------------------------------

def main():
    stills_only = "--stills" in sys.argv
    cues = caption_cues()
    write_srt(cues, ROOT / "05-captions" / "GV-001.srt")
    layers = [caption_layer(c) for c in cues]

    def frame(i):
        t = i / FPS
        img = background(t, i)
        for c, lay in zip(cues, layers):
            if c["start"] - 0.12 <= t <= c["end"] + 0.12:
                a = min(ss(c["start"] - 0.12, c["start"], np.float32(t)), 1 - ss(c["end"], c["end"] + 0.12, np.float32(t)))
                al = lay[..., 3:4] * a
                img = img * (1 - al) + lay[..., :3] * al
        return (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)

    STILLS.mkdir(parents=True, exist_ok=True)
    for name, s, e in SCENES:
        Image.fromarray(frame(int((s + e) / 2 * FPS))).save(STILLS / f"{name}.jpg", quality=90)
    for t in (1.0, 26.5, 29.5):
        Image.fromarray(frame(int(t * FPS))).save(STILLS / f"caption-check-{t:04.1f}s.jpg", quality=90)
    write_cover(ROOT / "07-metadata" / "GV-001-cover.jpg")
    if stills_only:
        return

    audio = OUT / "audio-mastered.wav"
    # two-pass loudnorm: measure, then apply linearly to hit -14 LUFS / -1.5 dBTP
    norm = "loudnorm=I=-14:TP=-1.5:LRA=11"
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(AUDIO), "-af", norm + ":print_format=json",
                           "-f", "null", "-"], capture_output=True, text=True).stderr
    m = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
    norm += (f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
             f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(AUDIO), "-af",
                    f"{norm},aresample=48000,apad=whole_dur={DURATION}",
                    "-ac", "2", str(audio)], check=True)
    out = OUT / "GV-001-strength-in-the-quiet-1080x1920.mp4"
    enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                            "-s", f"{FW}x{FH}", "-r", str(FPS), "-i", "-", "-i", str(audio),
                            "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "7M", "-bufsize", "14M",
                            "-pix_fmt", "yuv420p",
                            "-profile:v", "high", "-c:a", "aac", "-b:a", "192k", "-shortest",
                            "-movflags", "+faststart", str(out)], stdin=subprocess.PIPE)
    total = int(round(DURATION * FPS))
    for i in range(total):
        enc.stdin.write(frame(i).tobytes())
        if i % 150 == 0:
            print(f"frame {i}/{total}", flush=True)
    enc.stdin.close()
    enc.wait()
    audio.unlink()
    print("wrote", out)


if __name__ == "__main__":
    main()

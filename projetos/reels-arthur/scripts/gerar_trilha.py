#!/usr/bin/env python3
"""Trilha instrumental e efeitos sonoros 100% sintetizados (autoria própria, sem samples de terceiros).

Lê o roteiro (src/reels/data/roteiro.json) e gera, em projetos/remotion-base/public/reels/:
  musica.wav, sfx.wav, mix.wav (48 kHz, estéreo, 24 bits float→PCM16)
e, em src/reels/data/: audio-analise.json (energia por frame, para animações reativas ao som).

Uso: python3 projetos/reels-arthur/scripts/gerar_trilha.py
"""
import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

ROOT = Path(__file__).resolve().parents[3]
RB = ROOT / "projetos" / "remotion-base"
ROTEIRO = json.loads((RB / "src/reels/data/roteiro.json").read_text(encoding="utf-8"))
OUT = RB / "public" / "reels"
DATA = RB / "src" / "reels" / "data"
OUT.mkdir(parents=True, exist_ok=True)

SR = 48000
DUR = float(ROTEIRO["duracao"])
N = int(DUR * SR)
BPM = ROTEIRO["bpm"]
BEAT = 60.0 / BPM
BAR = BEAT * 4
rng = np.random.default_rng(20261105)


# ---------------------------------------------------------------- utilitários
def t_arr(dur):
    return np.arange(int(dur * SR)) / SR


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def saw(freq, t, detune=0.0):
    ph = (freq * (1 + detune)) * t
    return 2.0 * (ph - np.floor(ph + 0.5))


def adsr(n, a=0.01, d=0.1, s=0.7, r=0.2):
    env = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, n)
    env[:na] = np.linspace(0, 1, na, endpoint=False) if na else env[:na]
    e2 = min(na + nd, n)
    if e2 > na:
        env[na:e2] = np.linspace(1, s, e2 - na, endpoint=False)
    if nr and n > nr:
        env[-nr:] *= np.linspace(1, 0, nr)
    return env


def pan(x, p):
    """p em [-1, 1] (escalar ou vetor) → estéreo de potência constante."""
    ang = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([x * np.cos(ang), x * np.sin(ang)], axis=0)


def add(buf, sig, start_s, gain=1.0):
    if sig.ndim == 1:
        sig = np.stack([sig, sig])
    i = int(round(start_s * SR))
    if i < 0:
        sig = sig[:, -i:]
        i = 0
    j = min(N, i + sig.shape[1])
    if j > i:
        buf[:, i:j] += sig[:, : j - i] * gain


def make_ir(dur=2.6, decay=3.2, bright=6000):
    t = t_arr(dur)
    ir = np.stack([rng.standard_normal(t.size), rng.standard_normal(t.size)]) * np.exp(-decay * t)
    ir = np.stack([lp(ir[0], bright), lp(ir[1], bright)])
    ir[:, : int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    return ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True)) * 0.9


IR = make_ir()
IR_LONG = make_ir(4.5, 1.6, 4500)


def reverb(x, ir=IR, wet=0.3):
    if x.ndim == 1:
        x = np.stack([x, x])
    out = np.stack([fftconvolve(x[0], ir[0])[: x.shape[1]], fftconvolve(x[1], ir[1])[: x.shape[1]]])
    return x * (1 - wet) + out * wet


def note(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- instrumentos de percussão
def kick():
    t = t_arr(0.45)
    f = 44 + 110 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7.5)
    click = bp(rng.standard_normal(t.size), 1800, 6000) * np.exp(-t * 220) * 0.22
    return np.tanh((body + click) * 1.6) * 0.95


def clap():
    t = t_arr(0.35)
    n = rng.standard_normal(t.size)
    env = np.zeros(t.size)
    for k, off in enumerate([0, 0.011, 0.022]):
        i = int(off * SR)
        env[i:] += np.exp(-(t[: t.size - i]) * (90 if k < 2 else 16))
    return bp(n, 900, 4200) * env * 0.6


def hat(open_=False):
    t = t_arr(0.3 if open_ else 0.07)
    n = hp(rng.standard_normal(t.size), 7500, 4)
    return n * np.exp(-t * (9 if open_ else 70)) * (0.32 if open_ else 0.25)


def tom(freq=110):
    t = t_arr(0.6)
    f = freq * (1 + 0.6 * np.exp(-t * 20))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6) * 0.8


# ---------------------------------------------------------------- efeitos sonoros (SFX)
def sfx_whoosh(dur=0.55, slow=False):
    if slow:
        dur = 1.1
    t = t_arr(dur)
    n = rng.standard_normal(t.size)
    # filtro passa-faixa variável aproximado por cross-fade entre bandas
    bands = [(300, 900), (700, 2000), (1500, 4500), (3000, 9000)]
    pos = np.sin(np.pi * t / dur) ** 1.5
    out = np.zeros(t.size)
    centers = np.linspace(0, len(bands) - 1, t.size) * pos * 1.0 + (1 - pos) * 0
    for k, (lo, hi) in enumerate(bands):
        w = np.clip(1 - np.abs(centers - k), 0, 1)
        out += bp(n, lo, hi) * w
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2.2
    return pan(out * env * 0.9, np.linspace(-0.8, 0.8, t.size))


def sfx_impact(big=True):
    dur = 2.4 if big else 1.2
    t = t_arr(dur)
    f = 32 + 70 * np.exp(-t * 9)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (1.6 if big else 3.5))
    nz = lp(rng.standard_normal(t.size), 2600) * np.exp(-t * 14) * 0.7
    crack = hp(rng.standard_normal(t.size), 3000) * np.exp(-t * 60) * 0.4
    x = np.tanh((sub * 1.2 + nz + crack) * 1.4)
    return reverb(x, IR_LONG if big else IR, 0.35 if big else 0.25)


def sfx_hit():
    t = t_arr(0.5)
    body = np.sin(2 * np.pi * np.cumsum(70 + 160 * np.exp(-t * 40)) / SR) * np.exp(-t * 9)
    nz = bp(rng.standard_normal(t.size), 400, 5000) * np.exp(-t * 35) * 0.6
    return reverb(np.tanh((body + nz) * 1.5) * 0.8, IR, 0.2)


def sfx_lowhit():
    t = t_arr(0.9)
    body = np.sin(2 * np.pi * np.cumsum(48 + 60 * np.exp(-t * 25)) / SR) * np.exp(-t * 4.5)
    return reverb(np.tanh(body * 1.8) * 0.8, IR, 0.2)


def sfx_subboom():
    t = t_arr(2.5)
    return np.sin(2 * np.pi * np.cumsum(30 + 30 * np.exp(-t * 3)) / SR) * np.exp(-t * 1.7) * 0.9


def sfx_riser(dur=1.6):
    t = t_arr(dur)
    x = t / dur
    n = rng.standard_normal(t.size)
    hi = np.zeros(t.size)
    for k, (lo, hh) in enumerate([(400, 1500), (1200, 4000), (3500, 11000)]):
        w = np.clip(1 - np.abs(x * 2 - k), 0, 1)
        hi += bp(n, lo, hh) * w
    tone = sum(np.sin(2 * np.pi * np.cumsum(note(50 + o) * (1 + 1.0 * x ** 2)) / SR) for o in (0, 7, 12))
    env = x ** 2.3
    return reverb(pan((hi * 0.6 + tone * 0.18) * env, np.sin(t * 9) * 0.4), IR, 0.3)


def sfx_glitch():
    t = t_arr(0.38)
    out = np.zeros(t.size)
    seg = int(0.025 * SR)
    for i in range(0, t.size, seg):
        kind = rng.integers(0, 3)
        tt = t[i:i + seg]
        if kind == 0:
            out[i:i + seg] = np.sign(np.sin(2 * np.pi * rng.uniform(200, 2400) * tt)) * 0.5
        elif kind == 1:
            out[i:i + seg] = rng.standard_normal(tt.size) * 0.6
        if rng.random() < 0.3:
            out[i:i + seg] = 0
    crushed = np.round(out * 6) / 6
    return pan(hp(crushed, 150) * 0.55, rng.uniform(-0.6, 0.6, t.size).cumsum() * 0 + 0.0)


def sfx_pop():
    t = t_arr(0.12)
    f = 260 + 900 * np.exp(-t * 60)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * 0.55


def sfx_click():
    t = t_arr(0.03)
    return hp(rng.standard_normal(t.size), 2000) * np.exp(-t * 300) * 0.5


def sfx_typing(dur=1.2):
    out = np.zeros(int(dur * SR))
    pos = 0.0
    while pos < dur - 0.05:
        c = sfx_click() * rng.uniform(0.5, 1.0)
        i = int(pos * SR)
        out[i:i + c.size] += c[: max(0, out.size - i)]
        pos += rng.uniform(0.055, 0.11)
    return pan(bp(out, 1500, 9000) * 1.2, 0.15)


def sfx_shimmer(dur=1.8):
    t = t_arr(dur)
    x = np.zeros(t.size)
    for m in (86, 90, 93, 98, 102):
        x += np.sin(2 * np.pi * note(m) * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(4, 9) * t))
    env = adsr(t.size, 0.15, 0.3, 0.6, 0.9)
    return reverb(pan(x * env * 0.06, np.sin(t * 3) * 0.7), IR_LONG, 0.55)


def sfx_sweep():
    t = t_arr(0.7)
    n = rng.standard_normal(t.size)
    lo_band = bp(n, 2500, 9000) * np.linspace(1, 0, t.size)
    hi_band = bp(n, 600, 2500) * np.linspace(0, 1, t.size)
    env = np.sin(np.pi * t / 0.7) ** 1.5
    return pan((lo_band + hi_band) * env * 0.55, np.linspace(0.7, -0.7, t.size))


def sfx_braam():
    t = t_arr(3.6)
    x = np.zeros(t.size)
    for m, g in ((26, 1.0), (38, 0.8), (45, 0.5), (50, 0.35)):
        for d in (-0.006, 0, 0.007):
            x += saw(note(m), t, d) * g
    cutoff_env = np.exp(-t * 0.9)
    lo = lp(x, 220) * (1 - cutoff_env) + lp(x, 1400) * cutoff_env
    env = adsr(t.size, 0.02, 0.6, 0.6, 1.6)
    return reverb(np.tanh(lo * env * 0.55), IR_LONG, 0.4) * 0.8


def sfx_notify():
    t = t_arr(0.45)
    x = np.sin(2 * np.pi * note(88) * t) * np.exp(-t * 14) + np.sin(2 * np.pi * note(95) * t) * np.exp(-np.clip(t - 0.08, 0, None) * 14) * (t > 0.08)
    return reverb(x * 0.25, IR, 0.3)


def sfx_shutter():
    out = np.zeros(int(0.25 * SR))
    for off in (0.0, 0.09):
        c = bp(rng.standard_normal(int(0.04 * SR)), 1000, 7000) * np.exp(-t_arr(0.04) * 120)
        i = int(off * SR)
        out[i:i + c.size] += c
    return out * 0.7


def sfx_reverse():
    x = sfx_impact(False)[:, : int(1.0 * SR)][:, ::-1]
    return x * np.linspace(0.2, 1, x.shape[1])


def sfx_revcym():
    t = t_arr(1.5)
    n = hp(rng.standard_normal(t.size), 5000)
    return reverb(n * (t / 1.5) ** 3 * 0.45, IR, 0.3)


def sfx_drone_swell():
    t = t_arr(3.0)
    x = sum(saw(note(m), t, d) for m in (38, 45) for d in (-0.004, 0.004))
    return reverb(lp(x, 500) * np.sin(np.pi * t / 3.0) ** 2 * 0.18, IR_LONG, 0.4)


def sfx_chime():
    t = t_arr(1.6)
    x = sum(np.sin(2 * np.pi * note(m) * t) * np.exp(-t * 3) for m in (81, 86, 90))
    return reverb(x * 0.12, IR_LONG, 0.5)


def sfx_logo():
    """Assinatura sonora do logotipo: acorde em Ré maior com brilho e sub."""
    t = t_arr(4.0)
    x = np.zeros(t.size)
    for m in (50, 57, 62, 66, 69, 74):
        x += (saw(note(m), t, 0.003) * 0.3 + np.sin(2 * np.pi * note(m) * t)) * 0.12
    x = lp(x, 3500) * adsr(t.size, 0.4, 0.5, 0.7, 2.2)
    sub = np.sin(2 * np.pi * note(38) * t) * np.exp(-t * 0.8) * 0.4
    return reverb(x + sub, IR_LONG, 0.45)


SFX = {
    "whoosh": lambda: sfx_whoosh(), "whoosh_slow": lambda: sfx_whoosh(slow=True),
    "impact": lambda: sfx_impact(True), "impact_s": lambda: sfx_impact(False), "hit": sfx_hit,
    "lowhit": sfx_lowhit, "subboom": sfx_subboom, "riser": lambda: sfx_riser(1.6),
    "riser_s": lambda: sfx_riser(1.1), "riser_long": lambda: sfx_riser(4.0), "glitch": sfx_glitch,
    "pop": sfx_pop, "click": sfx_click, "typing": sfx_typing, "shimmer": sfx_shimmer,
    "sweep": sfx_sweep, "braam": sfx_braam, "notify": sfx_notify, "shutter": sfx_shutter,
    "reverse": sfx_reverse, "revcym": sfx_revcym, "drone_swell": sfx_drone_swell, "chime": sfx_chime,
    "logo": sfx_logo,
}
GAIN = {"pop": 0.8, "click": 0.6, "typing": 0.7, "hit": 0.9, "whoosh": 0.85, "glitch": 0.8, "riser_long": 0.9}
# risers terminam no ponto marcado (o tempo do roteiro é o pico)
END_ALIGNED = {"riser": 1.6, "riser_s": 1.1, "riser_long": 4.0, "revcym": 1.5, "reverse": 1.0}


def sfx_cues():
    cues = [(float(t), k) for t, k in ROTEIRO["sfx_globais"]]
    trans = ROTEIRO["sfx_transicao"]
    for b in ROTEIRO["blocos"]:
        if b.get("entrada"):
            cues += [(b["inicio"] + dt, k) for dt, k in trans[b["entrada"]]]
    for c in ROTEIRO["capitulos"]:
        cues += [(c["inicio"] + dt, k) for dt, k in trans[c["entrada"]]]
        cues += [(c["inicio"] + dt, k) for dt, k in c["sfx"]]
    # risers de "zoom" já estão alinhados pelo dt negativo; alinhar os demais ao pico
    out = []
    for t, k in sorted(cues):
        start = t - END_ALIGNED.get(k, 0.0) if k in ("riser", "riser_long", "revcym", "reverse") else t
        out.append((t, start, k))
    return out


# ---------------------------------------------------------------- música
PROG = [(50, [62, 65, 69]), (46, [62, 65, 70]), (41, [60, 65, 69]), (48, [60, 64, 67])]  # Dm Bb F C


def intensity(t):
    """Nível de energia da trilha ao longo do roteiro (0..5)."""
    pts = [(0, 1), (5.4, 1.3), (5.5, 2), (8, 2), (20, 3), (56, 3.4), (92, 3.8), (128, 4.2), (142, 4.4), (146, 5), (158, 5), (158.01, 1.5), (168, 0.6)]
    xs, ys = zip(*pts)
    return np.interp(t, xs, ys)


def build_music():
    mus = np.zeros((2, N))
    drums = np.zeros((2, N))
    side = np.ones(N)  # envelope de sidechain
    K, C, H, HO = kick(), clap(), hat(), hat(True)

    n_beats = int(DUR / BEAT)
    for b in range(n_beats):
        t0 = b * BEAT
        lvl = intensity(t0)
        in_groove = 20 <= t0 < 142 or 146 <= t0 < 158
        tech = 12 <= t0 < 20
        break_ = 142 <= t0 < 146
        if in_groove or (tech and b % 2 == 0):
            add(drums, K, t0, 0.95)
            i = int(t0 * SR)
            L = int(0.32 * SR)
            seg = side[i:i + L]
            seg *= 1 - 0.65 * np.exp(-np.arange(seg.size) / SR * 9)
        if in_groove and b % 4 in (1, 3) and lvl >= 3.35:
            add(drums, C, t0, 0.55)
        if in_groove or tech:
            for s in (0.0, 0.5):
                add(drums, pan(H, 0.25), t0 + s * BEAT, 0.5 if s else 0.3)
            if lvl >= 3.75 and b % 2 == 1:
                add(drums, pan(HO, -0.2), t0 + 0.5 * BEAT, 0.45)
        if 146 <= t0 < 158 and b % 8 == 7:
            for k, f in enumerate((180, 140, 100)):
                add(drums, tom(f), t0 + k * BEAT / 3, 0.5)
        if break_ and b % 1 == 0:  # rufo crescente no break
            for s in range(4):
                add(drums, C, t0 + s * BEAT / 4, 0.15 + 0.35 * (t0 - 142) / 4)

    # graves (colcheias), pad e arpejo
    n_bars = int(DUR / BAR) + 1
    for bar in range(n_bars):
        t0 = bar * BAR
        if t0 >= DUR:
            break
        root, chord = PROG[bar % 4]
        lvl = intensity(t0)
        dur = min(BAR, DUR - t0)
        tb = t_arr(dur)
        # PAD
        pad = np.zeros(tb.size)
        for m in chord + [chord[0] - 12]:
            for d in (-0.005, 0.0, 0.006):
                pad += saw(note(m), tb, d)
        pad = lp(pad, 900 + 500 * (lvl - 1)) * adsr(tb.size, 0.35, 0.4, 0.8, 0.5) * 0.045
        if t0 < 5.5:
            pad *= 0.5
        add(mus, pan(pad, -0.1), t0)
        # DRONE grave contínuo
        dr = (np.sin(2 * np.pi * note(root - 12) * tb) + 0.5 * np.sin(2 * np.pi * note(root - 5) * tb)) * 0.09
        add(mus, dr * adsr(tb.size, 0.2, 0.2, 1.0, 0.2), t0)
        # BAIXO (a partir das tecnologias)
        if t0 >= 8 and not (142 <= t0 < 146) and t0 < 158:
            for e in range(8):
                te = t_arr(BEAT / 2)
                b_ = (saw(note(root - 12), te) + 0.6 * saw(note(root - 12), te, 0.01))
                b_ = lp(b_, 300 + 250 * (lvl - 2)) * np.exp(-te * 5) * 0.22
                add(mus, b_, t0 + e * BEAT / 2)
        # ARPEJO (semicolcheias) a partir do nível 3.4 e nas tecnologias
        if (8 <= t0 < 20) or (t0 >= 56 and t0 < 158 and not (142 <= t0 < 146)):
            seq = chord + [chord[1] + 12, chord[2] + 12, chord[0] + 12, chord[2]]
            for s in range(16):
                ts = t_arr(BEAT / 4 * 0.95)
                m = seq[s % len(seq)] + 12
                tri = 2 * np.abs(saw(note(m), ts)) - 1
                a = tri * np.exp(-ts * 18) * (0.05 if t0 < 20 else 0.06)
                add(mus, pan(a, 0.45 if s % 2 else -0.45), t0 + s * BEAT / 4)
        # LEAD (contramelodia) no nível 3 e na montagem final
        if (t0 >= 92 and t0 < 142) or (146 <= t0 < 158):
            motif = [chord[2] + 12, chord[1] + 12, chord[0] + 12, chord[1] + 12]
            for q, m in enumerate(motif):
                tq = t_arr(BEAT * 0.98)
                ld = (saw(note(m), tq, 0.004) + saw(note(m), tq, -0.004)) * 0.5
                ld = lp(ld, 2200) * adsr(tq.size, 0.02, 0.15, 0.6, 0.15) * (0.05 if t0 < 146 else 0.075)
                add(mus, pan(ld, 0.1), t0 + q * BEAT)

    # sidechain na música (não na bateria)
    mus *= side
    # ambiência de abertura: ar + pulsos de sub
    ta = t_arr(8)
    air = bp(rng.standard_normal(ta.size), 2000, 8000) * 0.025 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * ta))
    add(mus, pan(air, np.sin(ta * 0.8) * 0.6), 0)
    for k in range(0, 10):
        add(mus, sfx_lowhit() * 0.25, k * BEAT) if k * BEAT < 5.4 and k % 2 == 0 else None

    # encerramento: pad longo em Ré
    to = t_arr(10)
    pad = np.zeros(to.size)
    for m in (50, 57, 62, 66, 69):
        for d in (-0.004, 0.0, 0.005):
            pad += saw(note(m), to, d)
    pad = lp(pad, 1500) * adsr(to.size, 0.6, 1.0, 0.8, 5.0) * 0.035
    add(mus, pan(pad, 0.0), 158)

    music = reverb(mus, IR, 0.22) + drums
    # arco dinâmico: a trilha cresce até a montagem final
    tt = np.arange(N) / SR
    music *= 0.55 + 0.09 * intensity(tt)
    return music, side


def normalize_peak(x, peak=0.89):
    m = np.max(np.abs(x))
    return x / m * peak if m > 0 else x


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    pcm = (x.T * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def frame_rms(x, fps):
    mono = x.mean(axis=0)
    hop = SR // fps
    n = int(DUR * fps)
    out = np.zeros(n)
    for i in range(n):
        s = mono[i * hop:(i + 1) * hop]
        out[i] = np.sqrt(np.mean(s ** 2)) if s.size else 0
    return out


def bands_for(x, fps, t0, t1, nb=24):
    mono = x.mean(axis=0)
    hop = SR // fps
    win = 2048
    freqs = np.fft.rfftfreq(win, 1 / SR)
    edges = np.geomspace(40, 14000, nb + 1)
    res = []
    for f in range(int(t0 * fps), int(t1 * fps)):
        c = f * hop + hop // 2
        s = mono[max(0, c - win // 2): c + win // 2]
        if s.size < win:
            s = np.pad(s, (0, win - s.size))
        sp = np.abs(np.fft.rfft(s * np.hanning(win)))
        row = [float(np.mean(sp[(freqs >= edges[k]) & (freqs < edges[k + 1])]) if np.any((freqs >= edges[k]) & (freqs < edges[k + 1])) else 0) for k in range(nb)]
        res.append(row)
    arr = np.log1p(np.array(res) * 3)
    arr /= arr.max() or 1
    return np.round(arr, 3).tolist()


def main():
    fps = ROTEIRO["fps"]
    music, _ = build_music()
    sfx = np.zeros((2, N))
    cue_log = []
    for peak, start, k in sfx_cues():
        s = SFX[k]()
        add(sfx, s, start, GAIN.get(k, 1.0))
        cue_log.append({"t": round(peak, 3), "inicio": round(start, 3), "sfx": k})

    # fades globais
    fade_out = np.ones(N)
    fo = int(2.5 * SR)
    fade_out[-fo:] = np.linspace(1, 0, fo) ** 1.5
    music = normalize_peak(music, 0.8) * fade_out
    sfx = normalize_peak(sfx, 0.85) * fade_out

    # ducking leve da música sob os SFX mais fortes (automatic ducking por envelope)
    env = np.abs(sfx).max(axis=0)
    env = lp(env, 8)
    duck = 1 - np.clip(env * 0.35, 0, 0.3)
    mix = music * 0.82 * duck + sfx * 0.72
    mix = np.tanh(mix * 1.15) / np.tanh(1.15)
    mix = normalize_peak(mix, 0.89)

    write_wav(OUT / "musica.wav", normalize_peak(music, 0.89))
    write_wav(OUT / "sfx.wav", normalize_peak(sfx, 0.89))
    write_wav(OUT / "mix.wav", mix)

    rms_mix = frame_rms(mix, fps)
    rms_mix /= rms_mix.max()
    kick_pulse = []
    for f in range(int(DUR * fps)):
        t = f / fps
        ph = (t % BEAT) / BEAT
        groove = (20 <= t < 142) or (146 <= t < 158) or (12 <= t < 20 and int(t / BEAT) % 2 == 0)
        kick_pulse.append(round(float(np.exp(-ph * 6)) if groove else 0.0, 3))
    rms_sfx = frame_rms(sfx, fps)
    rms_sfx /= rms_sfx.max()
    cap10 = next(c for c in ROTEIRO["capitulos"] if c["cat"] == "efeitos_sonoros")
    analise = {
        "fps": fps,
        "rms": np.round(rms_mix, 3).tolist(),
        "rmsSfx": np.round(rms_sfx, 3).tolist(),
        "pulso": kick_pulse,
        "bandasSfx": {"inicio": cap10["inicio"], "fim": cap10["inicio"] + cap10["dur"],
                      "valores": bands_for(sfx, fps, cap10["inicio"], cap10["inicio"] + cap10["dur"])},
        "cues": cue_log,
    }
    (DATA / "audio-analise.json").write_text(json.dumps(analise, separators=(",", ":")), encoding="utf-8")
    print(f"OK: {len(cue_log)} SFX posicionados; arquivos em {OUT}")


if __name__ == "__main__":
    main()

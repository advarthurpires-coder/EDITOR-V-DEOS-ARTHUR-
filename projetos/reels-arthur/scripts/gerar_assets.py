#!/usr/bin/env python3
"""Gera os assets reais usados pelo Reels (todos reproduzíveis):

- public/reels/grain/g0..g7.png ......... grão de filme (ruído numpy)
- public/reels/grade-*.mp4 ............. color grading REAL via scripts/efeitos-ffmpeg.sh sobre cena-fonte.mp4
- src/reels/data/audio-demo.json ....... formas de onda antes/depois do preset limpar-audio (afftdn)
- src/reels/data/catalogo-stats.json ... contagens reais por categoria/estado, busca "zoom", presets
- src/reels/data/loudness.json ......... medição EBU R128 da mixagem normalizada (-14 LUFS)

Pré-requisito: cena-fonte.mp4 renderizada (composição CenaFonte) e mix.wav (gerar_trilha.py).
Uso: python3 projetos/reels-arthur/scripts/gerar_assets.py
"""
import json
import re
import subprocess
import sys
import wave
from collections import Counter
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[3]
RB = ROOT / "projetos" / "remotion-base"
PUB = RB / "public" / "reels"
DATA = RB / "src" / "reels" / "data"
FX = ROOT / "scripts" / "efeitos-ffmpeg.sh"
TMP = ROOT / "projetos" / "reels-arthur" / "out" / "tmp"
TMP.mkdir(parents=True, exist_ok=True)


def run(cmd):
    print("$", " ".join(map(str, cmd)))
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def grain():
    out = PUB / "grain"
    out.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(7)
    for i in range(8):
        n = rng.normal(128, 46, (960, 540)).clip(0, 255).astype(np.uint8)
        raw = TMP / f"g{i}.gray"
        raw.write_bytes(n.tobytes())
        run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", "540x960", "-i", raw, out / f"g{i}.png"])


GRADES = {
    "log": ("log-flat", "cena-fonte.mp4"),
    "cinematico": ("cinematico", "cena-fonte.mp4"),
    "teal": ("teal-laranja", "cena-fonte.mp4"),
    "pb": ("preto-e-branco", "cena-fonte.mp4"),
    "vhs": ("vhs", "cena-fonte.mp4"),
}


def grades():
    src = PUB / "cena-fonte.mp4"
    if not src.exists():
        sys.exit("cena-fonte.mp4 ausente: renderize a composição CenaFonte primeiro.")
    for nome, (preset, entrada) in GRADES.items():
        run(["bash", FX, preset, PUB / entrada, PUB / f"grade-{nome}.mp4"])
    # filtros exatamente como estão no script, para exibir no vídeo
    txt = FX.read_text(encoding="utf-8")
    filtros = {}
    for nome, (preset, _) in GRADES.items():
        m = re.search(rf"^\s*{re.escape(preset)}\)\s*\n(?:\s*#.*\n)*\s*ffmpeg.*?-vf \"([^\"]+)\"", txt, re.M)
        filtros[nome] = m.group(1) if m else ""
    return filtros


def read_wav_mono(path):
    with wave.open(str(path)) as w:
        sr, ch, n = w.getframerate(), w.getnchannels(), w.getnframes()
        x = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float32) / 32768
    return (x.reshape(-1, ch).mean(axis=1) if ch > 1 else x), sr


def envelope(x, n=160):
    seg = len(x) // n
    return [round(float(np.max(np.abs(x[i * seg:(i + 1) * seg]))), 4) for i in range(n)]


def audio_demo():
    """Amostra de voz de domínio público (whisper.cpp/samples/jfk.wav) + ruído → preset limpar-audio."""
    voz = ROOT / "tools" / "whisper.cpp" / "samples" / "jfk.wav"
    sujo = TMP / "voz-ruido.wav"
    limpo = TMP / "voz-limpa.m4a"
    run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-f", "lavfi", "-i", "anoisesrc=color=pink:amplitude=0.09:seed=3",
         "-f", "lavfi", "-i", "sine=frequency=60:sample_rate=16000", "-filter_complex",
         "[1]volume=1[n];[2]volume=0.08[h];[0][n][h]amix=inputs=3:duration=first:normalize=0", "-ar", "16000", "-ac", "1", sujo])
    run(["bash", FX, "limpar-audio", sujo, limpo])
    limpo_wav = TMP / "voz-limpa.wav"
    run(["ffmpeg", "-v", "error", "-y", "-i", limpo, "-ar", "16000", "-ac", "1", limpo_wav])
    a, _ = read_wav_mono(sujo)
    b, _ = read_wav_mono(limpo_wav)
    m = max(np.max(np.abs(a)), 1e-6)

    def snr_proxy(x):
        # razão entre a energia dos 10% de trechos mais fortes e dos 10% mais fracos (dB)
        seg = len(x) // 200
        e = np.sort([np.mean(x[i * seg:(i + 1) * seg] ** 2) + 1e-12 for i in range(200)])
        return round(float(10 * np.log10(np.mean(e[-20:]) / np.mean(e[:20]))), 1)

    def floor_db(x):
        seg = len(x) // 200
        e = np.sort([np.mean(x[i * seg:(i + 1) * seg] ** 2) + 1e-12 for i in range(200)])
        return round(float(10 * np.log10(np.mean(e[:20]))), 1)

    return {"antes": envelope(a / m), "depois": envelope(b / m), "faixaAntesDb": snr_proxy(a), "faixaDepoisDb": snr_proxy(b),
            "ruidoAntesDb": floor_db(a), "ruidoDepoisDb": floor_db(b),
            "filtro": "highpass=f=80,lowpass=f=14000,afftdn=nr=20:nf=-40:tn=1", "fonte": "whisper.cpp/samples/jfk.wav (domínio público)"}


def stats():
    cat = json.loads((ROOT / "biblioteca" / "catalogo.json").read_text(encoding="utf-8"))
    presets = json.loads((ROOT / "biblioteca" / "presets.json").read_text(encoding="utf-8"))
    por_cat = {}
    for x in cat:
        c = por_cat.setdefault(x["categoria"], {"nome": x.get("categoria_nome", x["categoria"]), "total": 0, "estados": Counter(), "itens": []})
        c["total"] += 1
        c["estados"][x["status"]] += 1
        c["itens"].append({"id": x["id"], "nome": x["nome"], "status": x["status"]})
    for c in por_cat.values():
        c["estados"] = dict(c["estados"])
    busca = [{"id": x["id"], "nome": x["nome"], "status": x["status"]} for x in cat
             if "zoom" in (x["nome"] + " " + x["categoria"] + " " + x["tipo"]).casefold()]
    return {
        "total": len(cat),
        "categorias": len(por_cat),
        "estados": dict(Counter(x["status"] for x in cat)),
        "porCategoria": por_cat,
        "buscaZoom": busca,
        "presets": [{"id": p["id"], "nome": p["nome"]} for p in presets],
    }


def loudness():
    mix = PUB / "mix.wav"
    norm = PUB / "mix-14lufs.wav"
    # passa-baixa em 15,5 kHz: o AAC 128 kbps corta acima disso e, sem o filtro, gera overshoot de true peak (+1,7 dB)
    lp = TMP / "mix-lp.wav"
    run(["ffmpeg", "-v", "error", "-y", "-i", mix, "-af", "lowpass=f=15500,lowpass=f=15500", "-c:a", "pcm_s16le", lp])
    mix = lp
    # loudnorm em duas passagens (medição + correção linear) para atingir -14 LUFS com precisão
    p1 = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", mix, "-af", "loudnorm=I=-14:TP=-2:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    meas = json.loads(p1.stderr[p1.stderr.rfind("{"):p1.stderr.rfind("}") + 1])
    af = ("loudnorm=I=-14:TP=-2:LRA=11:linear=true:"
          f"measured_I={meas['input_i']}:measured_TP={meas['input_tp']}:measured_LRA={meas['input_lra']}:measured_thresh={meas['input_thresh']}:offset={meas['target_offset']}")
    run(["ffmpeg", "-v", "error", "-y", "-i", mix, "-af", af + ",aresample=48000", "-ar", "48000", "-c:a", "pcm_s16le", norm])
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", norm, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    tail = p.stderr[p.stderr.rfind("Summary:"):]
    i = float(re.search(r"I:\s+(-?[\d.]+) LUFS", tail).group(1))
    tp = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", tail).group(1))
    lra = float(re.search(r"LRA:\s+(-?[\d.]+) LU", tail).group(1))
    return {"integrado": i, "truePeak": tp, "lra": lra}


def main():
    grain()
    filtros = grades()
    (DATA / "grades.json").write_text(json.dumps(filtros, ensure_ascii=False, indent=1), encoding="utf-8")
    (DATA / "audio-demo.json").write_text(json.dumps(audio_demo(), ensure_ascii=False), encoding="utf-8")
    (DATA / "catalogo-stats.json").write_text(json.dumps(stats(), ensure_ascii=False), encoding="utf-8")
    (DATA / "loudness.json").write_text(json.dumps(loudness(), ensure_ascii=False), encoding="utf-8")
    print("OK: assets gerados.")


if __name__ == "__main__":
    main()

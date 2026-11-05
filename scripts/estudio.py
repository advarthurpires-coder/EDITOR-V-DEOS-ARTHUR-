#!/usr/bin/env python3
"""
Estúdio Arthur — kit de edição em linha de comando sobre FFmpeg / whisper.cpp.

Uso:  python3 scripts/estudio.py <comando> [opções]      (ajuda: python3 scripts/estudio.py <comando> -h)

Comandos
  info        Mostra duração, resolução, fps e áudio de um arquivo.
  cor         Color grading por preset (teal-orange, dark-moody, warm-film, pb, ...) ou LUT .cube.
  vfx         Efeitos: grao, vhs, aberracao, glow, rastro, tremor, handheld, zoom-in, zoom-out, vinheta, isolar-cor, espelho.
  transicao   Une dois clipes com transição (fade, flash, wipe, slide, zoom, circulo, pixel, ...).
  reframe     Converte proporção (9:16, 1:1, 4:5, 16:9) por corte central ou fundo desfocado.
  velocidade  Câmera lenta / acelerada (com áudio) ou reverso.
  congelar    Freeze frame em um instante, por N segundos.
  audio       Tratamento de voz: normalização (LUFS), redução de ruído, EQ de voz, compressor, fades.
  ducking     Mistura música sob a voz com abaixamento automático (sidechain).
  silencio    Remove silêncios do vídeo (jump cuts automáticos).
  cenas       Detecta trocas de cena e lista os tempos.
  chroma      Chroma key (fundo verde/azul) sobre outra imagem/vídeo.
  split       Tela dividida (lado a lado ou empilhado).
  pip         Picture in picture.
  foto        Foto → vídeo com movimento de câmera (Ken Burns: push-in, pull-back, pan).
  transcrever Transcreve com whisper.cpp → SRT + JSON de legendas por palavra (formato Remotion).
  legendar    Queima legenda SRT no vídeo com estilo pronto (classico, reels, gigante).
  exportar    Exporta com preset de plataforma (reels, tiktok, shorts, youtube, youtube-4k, feed, linkedin, whatsapp).
  cortar      Recorta um trecho [inicio, fim] (com recodificação precisa).
  juntar      Concatena vários clipes (mesma resolução é recomendada).
  sfx         Gera efeitos sonoros sintetizados (whoosh, impacto, sub-boom, riser, clique, pop, drone, braam...).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
WHISPER_DIR = RAIZ / "tools" / "whisper.cpp"

# ----------------------------------------------------------------------------- utilidades

def run(cmd: list[str], silencioso: bool = True) -> subprocess.CompletedProcess:
    if os.environ.get("ESTUDIO_DEBUG"):
        print("+", " ".join(map(str, cmd)), file=sys.stderr)
    r = subprocess.run([str(c) for c in cmd], capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-3000:])
        raise SystemExit(f"Falha no comando: {cmd[0]} (código {r.returncode})")
    return r


def ff(*args: str) -> None:
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args])


def probe(path: str) -> dict:
    r = run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path])
    return json.loads(r.stdout)


def info(path: str) -> dict:
    d = probe(path)
    v = next((s for s in d["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in d["streams"] if s["codec_type"] == "audio"), None)
    fps = 0.0
    if v and v.get("avg_frame_rate", "0/0") != "0/0":
        n, m = v["avg_frame_rate"].split("/")
        fps = float(n) / float(m) if float(m) else 0.0
    return {
        "duracao": float(d["format"].get("duration", 0) or 0),
        "largura": int(v["width"]) if v else 0,
        "altura": int(v["height"]) if v else 0,
        "fps": round(fps, 3),
        "tem_video": v is not None,
        "tem_audio": a is not None,
    }


VIDEO_OUT = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
AUDIO_OUT = ["-c:a", "aac", "-b:a", "192k"]

# ----------------------------------------------------------------------------- color grading

PRESETS_COR = {
    "teal-orange": "colorbalance=rs=-0.08:gs=-0.02:bs=0.12:rm=0.02:bm=-0.02:rh=0.10:gh=0.03:bh=-0.10,eq=contrast=1.08:saturation=1.12",
    "dark-moody": "eq=brightness=-0.04:contrast=1.15:saturation=0.75,colorbalance=bs=0.06:bm=0.03,vignette=PI/4.5",
    "warm-film": "colortemperature=temperature=4800:mix=0.7,curves=all='0/0.04 0.5/0.52 1/0.96',eq=saturation=0.95",
    "golden-hour": "colortemperature=temperature=3900:mix=0.6,eq=saturation=1.15:gamma=1.03:contrast=1.05",
    "pb": "hue=s=0,eq=contrast=1.18:brightness=0.01",
    "alto-contraste": "eq=contrast=1.35:saturation=1.1",
    "matte": "curves=all='0/0.08 0.5/0.5 1/0.92',eq=saturation=0.88",
    "vintage-kodak": "curves=preset=vintage,colortemperature=temperature=5300:mix=0.5,eq=saturation=1.05",
    "pastel": "eq=saturation=0.7:brightness=0.04:contrast=0.9,curves=all='0/0.06 1/1'",
    "luxo-dourado": "colorbalance=rh=0.08:gh=0.05:bh=-0.08:rm=0.05:gm=0.03:bm=-0.05,eq=contrast=1.1:saturation=0.9,vignette=PI/5",
    "azul-frio": "colortemperature=temperature=8500:mix=0.8,eq=saturation=0.85:contrast=1.05",
    "drama-dessaturado": "eq=saturation=0.45:contrast=1.22:brightness=-0.02",
    "hdr-look": "unsharp=5:5:0.7:5:5:0.0,eq=contrast=1.12:saturation=1.2,curves=all='0/0 0.25/0.22 0.75/0.8 1/1'",
    "cinematic": "colorbalance=rs=-0.05:bs=0.08:rh=0.06:bh=-0.05,curves=all='0/0.03 0.5/0.48 1/0.97',eq=saturation=0.92:contrast=1.06,vignette=PI/5",
    "correcao-auto": "normalize=blackpt=black:whitept=white:smoothing=20:independence=0.3",
}


def cmd_cor(a):
    if a.lut:
        filtro = f"lut3d=file='{a.lut}'"
    else:
        if a.preset not in PRESETS_COR:
            raise SystemExit(f"Preset desconhecido. Opções: {', '.join(PRESETS_COR)}")
        filtro = PRESETS_COR[a.preset]
    if a.intensidade < 1.0:
        # mistura com o original para dosar o efeito
        filtro = f"split[o][g];[g]{filtro}[gg];[o][gg]blend=all_expr='A*(1-{a.intensidade})+B*{a.intensidade}'"
    if a.vinheta:
        filtro += ",vignette=PI/4.5"
    ff("-i", a.entrada, "-vf", filtro, *VIDEO_OUT, "-c:a", "copy", a.saida)

# ----------------------------------------------------------------------------- VFX

def filtro_vfx(efeito: str, i: dict, intensidade: float, cor: str) -> str:
    w, h, fps = i["largura"], i["altura"], i["fps"] or 30
    k = intensidade
    if efeito == "grao":
        return f"noise=alls={int(14*k)}:allf=t+u"
    if efeito == "vhs":
        return (f"rgbashift=rh={-int(4*k)}:bh={int(4*k)},noise=alls={int(18*k)}:allf=t,"
                f"eq=saturation=1.25:contrast=1.08,curves=preset=vintage,gblur=sigma={0.7*k:.2f},"
                f"drawgrid=w=iw:h=3:t=1:c=black@{0.18*k:.2f}")
    if efeito == "aberracao":
        return f"rgbashift=rh={-int(6*k)}:bh={int(6*k)}:rv={int(2*k)}"
    if efeito == "glow":
        return f"split[a][b];[b]gblur=sigma={int(18*k)},eq=brightness=0.05[g];[a][g]blend=all_mode=screen:all_opacity={0.55*min(k,1.5):.2f}"
    if efeito == "rastro":
        return f"lagfun=decay={min(0.99, 0.9 + 0.06*k):.3f}"
    if efeito in ("tremor", "handheld"):
        amp = (18 if efeito == "tremor" else 9) * k
        fx, fy = (23, 29) if efeito == "tremor" else (2.1, 1.6)
        m = int(amp * 2 + 4)
        return (f"crop=w=iw-{m}:h=ih-{m}:x='{m/2}+{amp:.1f}*sin(t*{fx})':y='{m/2}+{amp:.1f}*cos(t*{fy})',"
                f"scale={w}:{h}")
    if efeito in ("zoom-in", "zoom-out"):
        z = 0.15 * k
        frames = max(1, int(i["duracao"] * fps))
        expr = f"1+{z}*on/{frames}" if efeito == "zoom-in" else f"1+{z}-{z}*on/{frames}"
        return (f"scale={w*2}:{h*2},zoompan=z='{expr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={w}x{h}:fps={fps}")
    if efeito == "vinheta":
        return f"vignette=PI/{max(2.5, 5.5 - 2*k):.2f}"
    if efeito == "isolar-cor":
        return f"colorhold=color={cor}:similarity={0.25*k:.2f}:blend=0.05"
    if efeito == "espelho":
        return "hflip"
    raise SystemExit("Efeito desconhecido.")


def cmd_vfx(a):
    i = info(a.entrada)
    ff("-i", a.entrada, "-vf", filtro_vfx(a.efeito, i, a.intensidade, a.cor), *VIDEO_OUT, "-c:a", "copy", a.saida)

# ----------------------------------------------------------------------------- transições

TRANSICOES = {
    # nome amigável -> tipo do filtro xfade
    "fade": "fade", "dissolver": "dissolve", "fade-preto": "fadeblack", "flash": "fadewhite", "fade-cinza": "fadegrays",
    "wipe-esquerda": "wipeleft", "wipe-direita": "wiperight", "wipe-cima": "wipeup", "wipe-baixo": "wipedown",
    "slide-esquerda": "slideleft", "slide-direita": "slideright", "slide-cima": "slideup", "slide-baixo": "slidedown",
    "push-esquerda": "smoothleft", "push-direita": "smoothright", "zoom": "zoomin", "circulo-abre": "circleopen",
    "circulo-fecha": "circleclose", "circulo": "circlecrop", "radial": "radial", "pixel": "pixelize",
    "diagonal": "diagtl", "barras-h": "hlslice", "barras-v": "vuslice", "squeeze": "squeezeh", "cortina": "horzopen",
    "desfoque": "hblur", "distancia": "distance", "revelar": "revealleft", "cobrir": "coverleft",
}


def cmd_transicao(a):
    if a.tipo not in TRANSICOES:
        raise SystemExit(f"Transição desconhecida. Opções: {', '.join(TRANSICOES)}")
    ia, ib = info(a.a), info(a.b)
    w, h = (a.largura or ia["largura"]), (a.altura or ia["altura"])
    fps = a.fps or ia["fps"] or 30
    off = max(0.0, ia["duracao"] - a.duracao)
    norm = f"scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps={fps},format=yuv420p"
    fc = f"[0:v]{norm}[v0];[1:v]{norm}[v1];[v0][v1]xfade=transition={TRANSICOES[a.tipo]}:duration={a.duracao}:offset={off:.3f}[v]"
    maps = ["-map", "[v]"]
    if ia["tem_audio"] and ib["tem_audio"]:
        fc += f";[0:a]aresample=48000[a0];[1:a]aresample=48000[a1];[a0][a1]acrossfade=d={a.duracao}[a]"
        maps += ["-map", "[a]", *AUDIO_OUT]
    ff("-i", a.a, "-i", a.b, "-filter_complex", fc, *maps, *VIDEO_OUT, a.saida)

# ----------------------------------------------------------------------------- reenquadramento

FORMATOS = {"9:16": (1080, 1920), "1:1": (1080, 1080), "4:5": (1080, 1350), "16:9": (1920, 1080), "4k": (3840, 2160)}


def cmd_reframe(a):
    W, H = FORMATOS[a.formato]
    if a.modo == "crop":
        vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}:(iw-{W})*{a.foco_x}:(ih-{H})/2,setsar=1"
        ff("-i", a.entrada, "-vf", vf, *VIDEO_OUT, "-c:a", "copy", a.saida)
    else:  # fundo desfocado
        fc = (f"[0:v]split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=40,eq=brightness=-0.08[bg];"
              f"[b]scale={W}:{H}:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[v]")
        maps = ["-map", "[v]"] + (["-map", "0:a?", "-c:a", "copy"])
        ff("-i", a.entrada, "-filter_complex", fc, *maps, *VIDEO_OUT, a.saida)

# ----------------------------------------------------------------------------- velocidade / congelar

def cadeia_atempo(fator: float) -> str:
    partes, f = [], fator
    while f > 2.0:
        partes.append("atempo=2.0"); f /= 2.0
    while f < 0.5:
        partes.append("atempo=0.5"); f /= 0.5
    partes.append(f"atempo={f:.4f}")
    return ",".join(partes)


def cmd_velocidade(a):
    i = info(a.entrada)
    if a.reverso:
        args = ["-i", a.entrada, "-vf", "reverse", *VIDEO_OUT]
        args += (["-af", "areverse", *AUDIO_OUT] if i["tem_audio"] else [])
        ff(*args, a.saida)
        return
    vf = f"setpts=PTS/{a.fator}"
    if a.suave and a.fator < 1:
        vf += f",minterpolate=fps={i['fps'] or 30}:mi_mode=mci:mc_mode=aobmc:vsbmc=1"
    args = ["-i", a.entrada, "-vf", vf, *VIDEO_OUT]
    args += (["-af", cadeia_atempo(a.fator), *AUDIO_OUT] if i["tem_audio"] and not a.mudo else ["-an"])
    ff(*args, a.saida)


def cmd_congelar(a):
    i = info(a.entrada)
    fps = i["fps"] or 30
    n = int(round(a.em * fps))
    loops = int(round(a.duracao * fps))
    vf = f"loop=loop={loops}:size=1:start={n},setpts=N/({fps}*TB)"
    args = ["-i", a.entrada, "-vf", vf, *VIDEO_OUT]
    if i["tem_audio"]:
        af = (f"[0:a]atrim=0:{a.em},asetpts=PTS-STARTPTS[a1];[0:a]atrim={a.em},asetpts=PTS-STARTPTS,adelay={int(a.duracao*1000)}:all=1[a2];"
              f"[a1][a2]concat=n=2:v=0:a=1[a]")
        args = ["-i", a.entrada, "-filter_complex", f"[0:v]{vf}[v];{af}", "-map", "[v]", "-map", "[a]", *VIDEO_OUT, *AUDIO_OUT]
    ff(*args, a.saida)

# ----------------------------------------------------------------------------- áudio

def cadeia_audio(a) -> str:
    f = []
    if a.ruido:
        f.append(f"afftdn=nf={a.ruido_nivel}")
    if a.voz_eq:
        f.append("highpass=f=80,lowpass=f=14000,equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.0:g=3,equalizer=f=8000:t=q:w=1.5:g=1.5")
    if a.compressor:
        f.append("acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2")
    if a.fade_in:
        f.append(f"afade=t=in:d={a.fade_in}")
    if a.fade_out:
        f.append(f"afade=t=out:st={max(0, a._dur - a.fade_out):.3f}:d={a.fade_out}")
    if a.lufs is not None:
        f.append(f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11")
    return ",".join(f) or "anull"


def cmd_audio(a):
    i = info(a.entrada)
    a._dur = i["duracao"]
    af = cadeia_audio(a)
    if i["tem_video"] and not a.saida.lower().endswith((".wav", ".mp3", ".m4a", ".aac")):
        vf_fade = []
        if a.fade_in:
            vf_fade.append(f"fade=t=in:d={a.fade_in}")
        if a.fade_out:
            vf_fade.append(f"fade=t=out:st={max(0, i['duracao'] - a.fade_out):.3f}:d={a.fade_out}")
        vargs = (["-vf", ",".join(vf_fade), *VIDEO_OUT] if (vf_fade and a.fade_video) else ["-c:v", "copy"])
        ff("-i", a.entrada, "-af", af, *vargs, *AUDIO_OUT, "-ar", "48000", a.saida)
    else:
        ff("-i", a.entrada, "-vn", "-af", af, "-ar", "48000", a.saida)


def cmd_ducking(a):
    # voz (do vídeo) controla o volume da música via sidechain
    fc = (f"[1:a]volume={a.volume_musica},aloop=loop=-1:size=2e9[m];[0:a]asplit=2[voz][sc];"
          f"[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[md];"
          f"[voz][md]amix=inputs=2:duration=first:dropout_transition=2:normalize=0,loudnorm=I={a.lufs}:TP=-1.5:LRA=11[a]")
    ff("-i", a.video, "-i", a.musica, "-filter_complex", fc, "-map", "0:v?", "-map", "[a]", "-c:v", "copy", *AUDIO_OUT, a.saida)

# ----------------------------------------------------------------------------- silêncio / cenas

def detectar_silencios(path: str, limiar: str, minimo: float) -> list[tuple[float, float]]:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=noise={limiar}:d={minimo}", "-f", "null", "-"],
                       capture_output=True, text=True)
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    fim = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    if len(fim) < len(ini):
        fim.append(info(path)["duracao"])
    return list(zip(ini, fim))


def cmd_silencio(a):
    i = info(a.entrada)
    sil = detectar_silencios(a.entrada, a.limiar, a.minimo)
    manter, t = [], 0.0
    for s, e in sil:
        s2, e2 = s + a.margem, e - a.margem
        if s2 > t:
            manter.append((t, s2))
        t = max(t, e2)
    if t < i["duracao"]:
        manter.append((t, i["duracao"]))
    manter = [(s, e) for s, e in manter if e - s > 0.05]
    if not manter:
        raise SystemExit("Nada restou após remover silêncios — ajuste --limiar.")
    expr = "+".join(f"between(t,{s:.3f},{e:.3f})" for s, e in manter)
    args = ["-i", a.entrada, "-vf", f"select='{expr}',setpts=N/FRAME_RATE/TB", *VIDEO_OUT]
    if i["tem_audio"]:
        args += ["-af", f"aselect='{expr}',asetpts=N/SR/TB", *AUDIO_OUT]
    ff(*args, a.saida)
    removido = i["duracao"] - sum(e - s for s, e in manter)
    print(f"{len(sil)} silêncios removidos ({removido:.1f}s). Trechos mantidos: {len(manter)}")


def cmd_cenas(a):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.entrada, "-vf", f"select='gt(scene,{a.limiar})',showinfo", "-f", "null", "-"],
                       capture_output=True, text=True)
    tempos = [float(x) for x in re.findall(r"pts_time:([\d.]+)", r.stderr)]
    print(json.dumps({"cortes": tempos, "total": len(tempos)}, ensure_ascii=False))

# ----------------------------------------------------------------------------- composição

def cmd_chroma(a):
    i = info(a.entrada)
    W, H = i["largura"], i["altura"]
    fc = (f"[1:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}[bg];"
          f"[0:v]chromakey={a.cor}:{a.similaridade}:{a.suavidade}[fg];[bg][fg]overlay=shortest=1[v]")
    extra = ["-loop", "1"] if a.fundo.lower().endswith((".png", ".jpg", ".jpeg", ".webp")) else []
    ff("-i", a.entrada, *extra, "-i", a.fundo, "-filter_complex", fc, "-map", "[v]", "-map", "0:a?", *VIDEO_OUT, "-c:a", "copy", "-shortest", a.saida)


def cmd_split(a):
    ia = info(a.a)
    if a.orientacao == "h":
        H = ia["altura"]
        fc = f"[0:v]scale=-2:{H}[x];[1:v]scale=-2:{H}[y];[x][y]hstack=inputs=2,setsar=1[v]"
    else:
        W = ia["largura"]
        fc = f"[0:v]scale={W}:-2[x];[1:v]scale={W}:-2[y];[x][y]vstack=inputs=2,setsar=1[v]"
    ff("-i", a.a, "-i", a.b, "-filter_complex", fc, "-map", "[v]", "-map", "0:a?", *VIDEO_OUT, *AUDIO_OUT, "-shortest", a.saida)


def cmd_pip(a):
    m = a.margem
    pos = {"sup-esq": f"{m}:{m}", "sup-dir": f"W-w-{m}:{m}", "inf-esq": f"{m}:H-h-{m}", "inf-dir": f"W-w-{m}:H-h-{m}"}[a.posicao]
    borda = f",pad=iw+{2*a.borda}:ih+{2*a.borda}:{a.borda}:{a.borda}:color={a.cor_borda}" if a.borda else ""
    i = info(a.principal)
    pw = int(i["largura"] * a.escala) // 2 * 2
    fc = f"[1:v]scale={pw}:-2{borda}[p];[0:v][p]overlay={pos}:shortest=1[v]"
    ff("-i", a.principal, "-i", a.secundario, "-filter_complex", fc, "-map", "[v]", "-map", "0:a?", *VIDEO_OUT, "-c:a", "copy", a.saida)


def cmd_foto(a):
    W, H = FORMATOS[a.formato]
    fps = 30
    n = int(a.duracao * fps)
    z = a.intensidade
    mov = {
        "push-in": (f"1+{z}*on/{n}", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
        "pull-back": (f"1+{z}-{z}*on/{n}", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
        "pan-esquerda": (f"1+{z}", f"(iw-iw/zoom)*(1-on/{n})", "ih/2-(ih/zoom/2)"),
        "pan-direita": (f"1+{z}", f"(iw-iw/zoom)*on/{n}", "ih/2-(ih/zoom/2)"),
        "drone": (f"1+{z*0.4}+{z}*on/{n}", f"(iw-iw/zoom)*(0.5+0.3*on/{n})", f"(ih-ih/zoom)*(0.5-0.2*on/{n})"),
    }[a.movimento]
    # upscale antes do zoompan evita "tremidinha" (jitter) de arredondamento
    vf = (f"scale={W*3}:{H*3}:force_original_aspect_ratio=increase,crop={W*3}:{H*3},"
          f"zoompan=z='{mov[0]}':x='{mov[1]}':y='{mov[2]}':d={n}:s={W}x{H}:fps={fps},setsar=1")
    ff("-loop", "1", "-i", a.entrada, "-vf", vf, "-t", str(a.duracao), *VIDEO_OUT, a.saida)

# ----------------------------------------------------------------------------- transcrição / legendas

def achar_modelo(nome: str | None) -> Path:
    mdir = WHISPER_DIR / "models"
    if nome:
        p = Path(nome)
        if p.exists():
            return p
        p = mdir / f"ggml-{nome}.bin"
        if p.exists():
            return p
    for pref in ("large-v3-turbo", "medium", "small", "base", "tiny"):
        p = mdir / f"ggml-{pref}.bin"
        if p.exists():
            return p
    raise SystemExit("Nenhum modelo Whisper encontrado em tools/whisper.cpp/models. Rode scripts/setup.sh "
                     "(precisa de acesso a huggingface.co).")


def tokens_para_legendas(dados: dict) -> list[dict]:
    """Converte o JSON completo do whisper.cpp (-ojf) em Caption[] (uma entrada por palavra), formato @remotion/captions."""
    palavras: list[dict] = []
    for seg in dados.get("transcription", []):
        for tk in seg.get("tokens", []):
            txt = tk.get("text", "")
            if not txt or txt.startswith("[_") or txt.startswith("<|"):
                continue
            ini, fim = tk["offsets"]["from"], tk["offsets"]["to"]
            if palavras and not txt.startswith(" ") and not palavras[-1]["text"].endswith(" "):
                palavras[-1]["text"] += txt
                palavras[-1]["endMs"] = fim
            else:
                palavras.append({"text": txt, "startMs": ini, "endMs": fim, "confidence": tk.get("p")})
    for p in palavras:
        p["timestampMs"] = (p["startMs"] + p["endMs"]) // 2
    return palavras


def cmd_transcrever(a):
    cli = WHISPER_DIR / "build" / "bin" / "whisper-cli"
    if not cli.exists():
        raise SystemExit("whisper-cli não compilado. Rode scripts/setup.sh")
    modelo = achar_modelo(a.modelo)
    base = Path(a.saida or Path(a.entrada).with_suffix(""))
    base.parent.mkdir(parents=True, exist_ok=True)
    wav = base.with_suffix(".16k.wav")
    ff("-i", a.entrada, "-vn", "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", str(wav))
    cmd = [cli, "-m", modelo, "-f", wav, "-l", a.idioma, "-osrt", "-ovtt", "-otxt", "-ojf", "-of", base, "-t", str(os.cpu_count() or 4)]
    if a.prompt:
        cmd += ["--prompt", a.prompt]
    run(cmd)
    dados = json.loads(Path(f"{base}.json").read_text(encoding="utf-8"))
    leg = tokens_para_legendas(dados)
    Path(f"{base}.legendas.json").write_text(json.dumps(leg, ensure_ascii=False, indent=1), encoding="utf-8")
    wav.unlink(missing_ok=True)
    print(f"Gerados: {base}.srt, {base}.vtt, {base}.txt, {base}.json, {base}.legendas.json ({len(leg)} palavras)")


ESTILOS_LEGENDA = {
    "classico": "FontName=Inter,FontSize=16,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=40",
    "reels": "FontName=Inter,Bold=1,FontSize=13,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=3,Shadow=1,Alignment=2,MarginV=110",
    "gigante": "FontName=Inter,Bold=1,FontSize=22,PrimaryColour=&H007AC7E8,OutlineColour=&H00000000,BorderStyle=1,Outline=4,Shadow=0,Alignment=5",
    "caixa": "FontName=Inter,Bold=1,FontSize=14,PrimaryColour=&H00FFFFFF,BackColour=&H99331D0B,BorderStyle=3,Outline=8,Shadow=0,Alignment=2,MarginV=90",
}


def cmd_legendar(a):
    srt = Path(a.srt).resolve()
    esc = str(srt).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")
    vf = f"subtitles='{esc}':force_style='{ESTILOS_LEGENDA[a.estilo]}'"
    ff("-i", a.entrada, "-vf", vf, *VIDEO_OUT, "-c:a", "copy", a.saida)

# ----------------------------------------------------------------------------- exportação

PLATAFORMAS = {
    # nome: (largura, altura, fps, bitrate_max, lufs)
    "reels": (1080, 1920, 30, "12M", -14), "tiktok": (1080, 1920, 30, "12M", -14), "shorts": (1080, 1920, 30, "12M", -14),
    "feed": (1080, 1350, 30, "10M", -14), "quadrado": (1080, 1080, 30, "10M", -14),
    "youtube": (1920, 1080, 30, "16M", -14), "youtube-4k": (3840, 2160, 30, "45M", -14),
    "linkedin": (1920, 1080, 30, "10M", -14), "whatsapp": (720, 1280, 30, "2.5M", -16), "stories": (1080, 1920, 30, "10M", -14),
}


def cmd_exportar(a):
    W, H, fps, maxbr, lufs = PLATAFORMAS[a.plataforma]
    i = info(a.entrada)
    if a.modo == "blur" and abs(i["largura"] / max(1, i["altura"]) - W / H) > 0.02:
        vf = None
        fc = (f"[0:v]split[a][b];[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=40,eq=brightness=-0.08[bg];"
              f"[b]scale={W}:{H}:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,fps={fps},setsar=1[v]")
    else:
        fc = None
        vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={fps},setsar=1"
    crf = "20" if a.plataforma == "whatsapp" else "18"
    venc = ["-c:v", "libx264", "-preset", "slow", "-crf", crf, "-maxrate", maxbr, "-bufsize", maxbr, "-pix_fmt", "yuv420p",
            "-profile:v", "high", "-movflags", "+faststart"]
    args = ["-i", a.entrada]
    if fc:
        args += ["-filter_complex", fc, "-map", "[v]", "-map", "0:a?"]
    else:
        args += ["-vf", vf]
    if i["tem_audio"]:
        args += ["-af", f"loudnorm=I={lufs}:TP=-1.5:LRA=11", *AUDIO_OUT, "-ar", "48000"]
    ff(*args, *venc, a.saida)
    print(f"Exportado para {a.plataforma}: {W}x{H} @{fps}fps, {lufs} LUFS → {a.saida}")


def cmd_cortar(a):
    ff("-i", a.entrada, "-ss", str(a.inicio), "-to", str(a.fim), *VIDEO_OUT, *AUDIO_OUT, a.saida)


def cmd_juntar(a):
    n = len(a.entradas)
    i0 = info(a.entradas[0])
    W, H, fps = i0["largura"], i0["altura"], i0["fps"] or 30
    todos_audio = all(info(e)["tem_audio"] for e in a.entradas)
    fc = ""
    for k in range(n):
        fc += f"[{k}:v]scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps={fps},format=yuv420p[v{k}];"
        if todos_audio:
            fc += f"[{k}:a]aresample=48000[a{k}];"
    fc += "".join(f"[v{k}]" + (f"[a{k}]" if todos_audio else "") for k in range(n))
    fc += f"concat=n={n}:v=1:a={1 if todos_audio else 0}[v]" + ("[a]" if todos_audio else "")
    args = []
    for e in a.entradas:
        args += ["-i", e]
    maps = ["-map", "[v]"] + (["-map", "[a]", *AUDIO_OUT] if todos_audio else [])
    ff(*args, "-filter_complex", fc, *maps, *VIDEO_OUT, a.saida)

# ----------------------------------------------------------------------------- efeitos sonoros sintetizados

SFX = {
    # nome: (fonte lavfi, filtros, duração)
    "whoosh": ("anoisesrc=color=pink:sample_rate=48000:amplitude=0.8", "highpass=f=300,lowpass=f=5000,aphaser=type=t:speed=2,volume='sin(PI*t/{d})^2':eval=frame", 0.8),
    "impacto": ("aevalsrc='0.9*sin(2*PI*(70*t-25*t*t))*exp(-3.5*t)+0.5*(random(0)*2-1)*exp(-30*t)':s=48000", "lowpass=f=4000,acompressor=threshold=-12dB:ratio=4", 1.6),
    "sub-boom": ("aevalsrc='0.95*sin(2*PI*(60*t-12*t*t))*exp(-2.2*t)':s=48000", "lowpass=f=200", 2.2),
    "riser": ("aevalsrc='0.45*sin(2*PI*(150*t+250*t*t))*(t/{d})+0.25*(random(0)*2-1)*(t/{d})^2':s=48000", "highpass=f=120,aecho=0.6:0.5:60:0.3", 3.0),
    "riser-reverso": ("aevalsrc='0.45*sin(2*PI*(150*t+250*t*t))*(t/{d})+0.25*(random(0)*2-1)*(t/{d})^2':s=48000", "highpass=f=120,areverse", 2.0),
    "clique": ("aevalsrc='0.8*sin(2*PI*2400*t)*exp(-180*t)':s=48000", "highpass=f=800", 0.06),
    "pop": ("aevalsrc='0.8*sin(2*PI*(500*t+1800*t*t))*exp(-22*t)':s=48000", "highpass=f=200", 0.25),
    "notificacao": ("aevalsrc='0.6*sin(2*PI*1320*t)*exp(-14*t)*lt(t,0.12)+0.6*sin(2*PI*1760*(t-0.12))*exp(-10*(t-0.12))*gte(t,0.12)':s=48000", "anull", 0.5),
    "drone": ("aevalsrc='0.30*sin(2*PI*55*t)+0.22*sin(2*PI*55.35*t)+0.12*sin(2*PI*110.4*t)+0.06*sin(2*PI*164.8*t)':s=48000", "lowpass=f=900,afade=t=in:d=1.5,afade=t=out:st={d2}:d=2", 8.0),
    "braam": ("aevalsrc='(0.5*sin(2*PI*49*t)+0.35*sin(2*PI*98.2*t)+0.25*sin(2*PI*147*t)+0.18*sin(2*PI*196.5*t)+0.12*sin(2*PI*245*t))*min(1,t*12)*exp(-0.9*t)':s=48000", "lowpass=f=1800,acompressor=threshold=-14dB:ratio=3,aecho=0.7:0.6:90|180:0.35|0.2", 3.5),
    "batimento": ("aevalsrc='0.9*sin(2*PI*48*t)*exp(-28*mod(t,0.9))+0.7*sin(2*PI*44*t)*exp(-28*mod(t-0.22,0.9))*gte(mod(t,0.9),0.22)':s=48000", "lowpass=f=160", 3.6),
    "glitch": ("aevalsrc='0.5*sgn(sin(2*PI*(220+880*floor(random(0)*4))*t))*gt(sin(2*PI*13*t),0)':s=48000", "acrusher=bits=6:samples=8,highpass=f=150", 0.6),
}


def cmd_sfx(a):
    nomes = list(SFX) if a.nome == "todos" else [a.nome]
    destino = Path(a.saida)
    for n in nomes:
        fonte, filtros, d0 = SFX[n]
        d = a.duracao or d0
        out = destino / f"{n}.wav" if (a.nome == "todos" or destino.suffix == "") else destino
        out.parent.mkdir(parents=True, exist_ok=True)
        # -t antes de -i limita a fonte (necessário para areverse, que precisa do fim da entrada)
        ff("-f", "lavfi", "-t", str(d), "-i", fonte.replace("{d}", str(d)), "-af", filtros.replace("{d2}", str(max(0.0, d - 2))).replace("{d}", str(d)) + f",volume={a.volume}",
           "-ar", "48000", "-ac", "2", str(out))
        normalizar_pico(out, -3.0)
        print(f"{n}: {out}")


def normalizar_pico(arquivo: Path, alvo_db: float = -3.0) -> None:
    """Ajusta o ganho para o pico ficar em `alvo_db` dBFS (níveis consistentes entre efeitos)."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(arquivo), "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True)
    m = re.search(r"max_volume: ([-\d.]+) dB", r.stderr)
    if not m:
        return
    ganho = alvo_db - float(m.group(1))
    if abs(ganho) < 0.3:
        return
    tmp = arquivo.with_suffix(".tmp.wav")
    ff("-i", str(arquivo), "-af", f"volume={ganho:.2f}dB", str(tmp))
    tmp.replace(arquivo)

# ----------------------------------------------------------------------------- CLI

def main():
    if not shutil.which("ffmpeg"):
        raise SystemExit("FFmpeg não encontrado. Rode scripts/setup.sh")
    p = argparse.ArgumentParser(prog="estudio", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)

    s = sp.add_parser("info"); s.add_argument("entrada")
    s.set_defaults(fn=lambda a: print(json.dumps(info(a.entrada), ensure_ascii=False)))

    s = sp.add_parser("cor"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--preset", default="cinematic", help=", ".join(PRESETS_COR)); s.add_argument("--lut", help="arquivo .cube")
    s.add_argument("--intensidade", type=float, default=1.0, help="0..1 (mistura com o original)"); s.add_argument("--vinheta", action="store_true")
    s.set_defaults(fn=cmd_cor)

    s = sp.add_parser("vfx"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--efeito", required=True, choices=["grao", "vhs", "aberracao", "glow", "rastro", "tremor", "handheld", "zoom-in", "zoom-out", "vinheta", "isolar-cor", "espelho"])
    s.add_argument("--intensidade", type=float, default=1.0); s.add_argument("--cor", default="red", help="para isolar-cor")
    s.set_defaults(fn=cmd_vfx)

    s = sp.add_parser("transicao"); s.add_argument("a"); s.add_argument("b"); s.add_argument("saida")
    s.add_argument("--tipo", default="fade", help=", ".join(TRANSICOES)); s.add_argument("--duracao", type=float, default=0.6)
    s.add_argument("--largura", type=int); s.add_argument("--altura", type=int); s.add_argument("--fps", type=float)
    s.set_defaults(fn=cmd_transicao)

    s = sp.add_parser("reframe"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--formato", default="9:16", choices=list(FORMATOS)); s.add_argument("--modo", default="crop", choices=["crop", "blur"])
    s.add_argument("--foco-x", type=float, default=0.5, help="0=esquerda, 0.5=centro, 1=direita (modo crop)")
    s.set_defaults(fn=cmd_reframe)

    s = sp.add_parser("velocidade"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--fator", type=float, default=0.5, help="<1 câmera lenta, >1 acelerado"); s.add_argument("--reverso", action="store_true")
    s.add_argument("--suave", action="store_true", help="interpolação de quadros (slow motion suave, lento)"); s.add_argument("--mudo", action="store_true")
    s.set_defaults(fn=cmd_velocidade)

    s = sp.add_parser("congelar"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--em", type=float, required=True); s.add_argument("--duracao", type=float, default=1.5)
    s.set_defaults(fn=cmd_congelar)

    s = sp.add_parser("audio"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--lufs", type=float, help="ex.: -14 (redes), -16 (podcast), -23 (TV)"); s.add_argument("--ruido", action="store_true")
    s.add_argument("--ruido-nivel", type=int, default=-25); s.add_argument("--voz-eq", action="store_true"); s.add_argument("--compressor", action="store_true")
    s.add_argument("--fade-in", type=float, default=0); s.add_argument("--fade-out", type=float, default=0)
    s.add_argument("--fade-video", action="store_true", help="aplica os fades também na imagem")
    s.set_defaults(fn=cmd_audio)

    s = sp.add_parser("ducking"); s.add_argument("video"); s.add_argument("musica"); s.add_argument("saida")
    s.add_argument("--volume-musica", type=float, default=0.25); s.add_argument("--lufs", type=float, default=-14)
    s.set_defaults(fn=cmd_ducking)

    s = sp.add_parser("silencio"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--limiar", default="-35dB"); s.add_argument("--minimo", type=float, default=0.45, help="silêncio mínimo (s)")
    s.add_argument("--margem", type=float, default=0.08, help="respiro mantido em cada corte (s)")
    s.set_defaults(fn=cmd_silencio)

    s = sp.add_parser("cenas"); s.add_argument("entrada"); s.add_argument("--limiar", type=float, default=0.3)
    s.set_defaults(fn=cmd_cenas)

    s = sp.add_parser("chroma"); s.add_argument("entrada"); s.add_argument("fundo"); s.add_argument("saida")
    s.add_argument("--cor", default="0x00FF00"); s.add_argument("--similaridade", type=float, default=0.15); s.add_argument("--suavidade", type=float, default=0.08)
    s.set_defaults(fn=cmd_chroma)

    s = sp.add_parser("split"); s.add_argument("a"); s.add_argument("b"); s.add_argument("saida")
    s.add_argument("--orientacao", default="h", choices=["h", "v"]); s.set_defaults(fn=cmd_split)

    s = sp.add_parser("pip"); s.add_argument("principal"); s.add_argument("secundario"); s.add_argument("saida")
    s.add_argument("--posicao", default="inf-dir", choices=["sup-esq", "sup-dir", "inf-esq", "inf-dir"]); s.add_argument("--escala", type=float, default=0.3)
    s.add_argument("--margem", type=int, default=40); s.add_argument("--borda", type=int, default=6); s.add_argument("--cor-borda", default="0xE8C77A")
    s.set_defaults(fn=cmd_pip)

    s = sp.add_parser("foto"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--movimento", default="push-in", choices=["push-in", "pull-back", "pan-esquerda", "pan-direita", "drone"])
    s.add_argument("--duracao", type=float, default=5); s.add_argument("--intensidade", type=float, default=0.2)
    s.add_argument("--formato", default="16:9", choices=list(FORMATOS)); s.set_defaults(fn=cmd_foto)

    s = sp.add_parser("transcrever"); s.add_argument("entrada"); s.add_argument("--saida", help="prefixo dos arquivos gerados")
    s.add_argument("--modelo", help="small, medium, large-v3-turbo... ou caminho"); s.add_argument("--idioma", default="pt")
    s.add_argument("--prompt", help="vocabulário de apoio (ex.: termos jurídicos)"); s.set_defaults(fn=cmd_transcrever)

    s = sp.add_parser("legendar"); s.add_argument("entrada"); s.add_argument("srt"); s.add_argument("saida")
    s.add_argument("--estilo", default="reels", choices=list(ESTILOS_LEGENDA)); s.set_defaults(fn=cmd_legendar)

    s = sp.add_parser("exportar"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--plataforma", default="reels", choices=list(PLATAFORMAS)); s.add_argument("--modo", default="crop", choices=["crop", "blur"])
    s.set_defaults(fn=cmd_exportar)

    s = sp.add_parser("cortar"); s.add_argument("entrada"); s.add_argument("saida")
    s.add_argument("--inicio", type=float, required=True); s.add_argument("--fim", type=float, required=True); s.set_defaults(fn=cmd_cortar)

    s = sp.add_parser("juntar"); s.add_argument("saida"); s.add_argument("entradas", nargs="+"); s.set_defaults(fn=cmd_juntar)

    s = sp.add_parser("sfx"); s.add_argument("nome", choices=list(SFX) + ["todos"]); s.add_argument("saida", help="arquivo .wav ou pasta (para 'todos')")
    s.add_argument("--duracao", type=float); s.add_argument("--volume", type=float, default=1.0); s.set_defaults(fn=cmd_sfx)

    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()

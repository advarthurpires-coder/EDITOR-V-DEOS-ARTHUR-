#!/usr/bin/env python3
"""Promove para `exemplo_executavel` APENAS os recursos implementados e renderizados no Reels oficial.

Cada entrada aponta o arquivo onde o código executável está. Rodar depois de um render bem-sucedido.
Uso: python3 projetos/reels-arthur/scripts/atualizar_catalogo.py [--incluir-4k]
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CAT = ROOT / "biblioteca" / "catalogo.json"
R = "projetos/remotion-base/src/reels/"
OBS = "Implementado e renderizado no Reels oficial (projetos/reels-arthur)."

IMPLEMENTADOS = {
    # transições
    "transicoes.fade": R + "cenas/Final.tsx",
    "transicoes.smooth-zoom-in": R + "comum.tsx",
    "transicoes.zoom-through-cut": R + "cenas/CapitulosA.tsx",
    "transicoes.whip-pan": R + "comum.tsx",
    "transicoes.motion-blur-transition": R + "fx.tsx",
    "transicoes.light-leak-transition": R + "comum.tsx",
    "transicoes.glitch-transition": R + "comum.tsx",
    "transicoes.rgb-split": R + "fx.tsx",
    "transicoes.flash-cut": R + "comum.tsx",
    "transicoes.iris-reveal": R + "comum.tsx",
    # câmera e 3D
    "camera_3d.orbit-camera": R + "cenas/CapitulosA.tsx",
    "camera_3d.dolly-zoom": R + "cenas/CapitulosA.tsx",
    "camera_3d.vertigo": R + "cenas/CapitulosA.tsx",
    "camera_3d.3d-parallax": R + "cenas/CapitulosA.tsx",
    "camera_3d.multi-layer-parallax": R + "cenas/CapitulosA.tsx",
    "camera_3d.ken-burns": R + "CenaFonte.tsx",
    # motion graphics
    "motion_graphics.spring-animation": R + "fx.tsx",
    "motion_graphics.stagger-animation": R + "fx.tsx",
    "motion_graphics.particle-explosion": R + "fx.tsx",
    "motion_graphics.icon-impact": R + "cenas/CapitulosA.tsx",
    # legendas e tipografia (Remotion + HyperFrames)
    "legendas_tipografia.kinetic-typography": R + "fx.tsx",
    "legendas_tipografia.word-by-word-captions": "projetos/reels-hyperframes-legendas/index.html",
    "legendas_tipografia.karaoke-captions": R + "fx.tsx",
    "legendas_tipografia.highlight-box-captions": R + "fx.tsx",
    "legendas_tipografia.pop-up-captions": "projetos/reels-hyperframes-legendas/index.html",
    "legendas_tipografia.typewriter-effect": "projetos/reels-hyperframes-legendas/index.html",
    "legendas_tipografia.masked-text": "projetos/reels-hyperframes-legendas/index.html",
    "legendas_tipografia.bounce-captions": "projetos/reels-hyperframes-legendas/index.html",
    "legendas_tipografia.glitch-typography": R + "cenas/Abertura.tsx",
    "legendas_tipografia.cinematic-titles": R + "cenas/Final.tsx",
    # VFX
    "vfx.glow-effect": R + "cenas/CapitulosA.tsx",
    "vfx.chromatic-aberration": R + "fx.tsx",
    "vfx.light-rays": R + "cenas/CapitulosA.tsx",
    "vfx.film-grain": R + "fx.tsx",
    "vfx.digital-distortion": R + "fx.tsx",
    "vfx.vhs": "scripts/efeitos-ffmpeg.sh",
    # estilos
    "estilos.cinematic-editing": R + "cenas/CapitulosB.tsx",
    "estilos.corporate-professional": R + "cenas/CapitulosB.tsx",
    "estilos.emotional-storytelling": R + "cenas/CapitulosB.tsx",
    "estilos.fast-paced-reels": R + "cenas/CapitulosB.tsx",
    # interfaces e mockups
    "interfaces_mockups.notification-pop": R + "cenas/CapitulosB.tsx",
    "interfaces_mockups.browser-window": R + "cenas/CapitulosB.tsx",
    "interfaces_mockups.glass-ui-cards": R + "cenas/CapitulosB.tsx",
    "interfaces_mockups.editor-timeline-simulation": R + "cenas/CapitulosC.tsx",
    "interfaces_mockups.search-bar-animation": R + "cenas/CapitulosC.tsx",
    # montagem
    "montagem.beat-cut": R + "cenas/CapitulosB.tsx",
    "montagem.speed-ramp": R + "cenas/CapitulosB.tsx",
    "montagem.time-remapping": R + "fx.tsx",
    "montagem.punch-in-cut": R + "cenas/CapitulosB.tsx",
    "montagem.montage-sequence": R + "cenas/Final.tsx",
    # color grading (FFmpeg real)
    "color_grading.teal-and-orange": "scripts/efeitos-ffmpeg.sh",
    "color_grading.black-and-white": "scripts/efeitos-ffmpeg.sh",
    "color_grading.high-contrast": "scripts/efeitos-ffmpeg.sh",
    "color_grading.vignette": "scripts/efeitos-ffmpeg.sh",
    # efeitos sonoros sintetizados
    **{f"efeitos_sonoros.{k}": "projetos/reels-arthur/scripts/gerar_trilha.py" for k in [
        "whoosh", "cinematic-impact", "sub-boom", "riser", "reverse-riser", "glitch-sound", "digital-click",
        "camera-shutter", "typing-keyboard", "notification-pop-sfx", "transition-sweep", "braam",
        "reverse-cymbal", "logo-sound-reveal", "pop-impact", "low-hit", "shimmer", "cinematic-drone"]},
    # áudio
    "audio.noise-reduction": "scripts/efeitos-ffmpeg.sh",
    "audio.loudness-normalization": "projetos/reels-arthur/scripts/gerar_assets.py",
    "audio.automatic-audio-ducking": "projetos/reels-arthur/scripts/gerar_trilha.py",
    "audio.audio-fade-out": "projetos/reels-arthur/scripts/gerar_trilha.py",
    "audio.beat-synchronization": "projetos/reels-arthur/scripts/gerar_trilha.py",
    "audio.sound-design-layering": "projetos/reels-arthur/scripts/gerar_trilha.py",
    # templates
    "templates.reels-template": R + "ReelsArthur.tsx",
    # infraestrutura
    "infraestrutura.catalog-search": "scripts/catalogo.py",
    "infraestrutura.preset-library": "biblioteca/presets.json",
    "infraestrutura.social-export-presets": "projetos/reels-arthur/scripts/build.sh",
}


def main():
    ids = dict(IMPLEMENTADOS)
    if "--incluir-4k" in sys.argv:
        ids["infraestrutura.4k-rendering"] = "projetos/reels-arthur/scripts/build.sh"
    cat = json.loads(CAT.read_text(encoding="utf-8"))
    by_id = {x["id"]: x for x in cat}
    faltando = [i for i in ids if i not in by_id]
    if faltando:
        sys.exit(f"IDs inexistentes no catálogo: {faltando}")
    for i, arq in ids.items():
        if not (ROOT / arq).exists():
            sys.exit(f"Arquivo de exemplo inexistente: {arq}")
        x = by_id[i]
        x["status"] = "exemplo_executavel"
        x["arquivo_exemplo"] = arq
        x["observacao"] = OBS
    CAT.write_text(json.dumps(cat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: {len(ids)} recursos marcados como exemplo_executavel.")


if __name__ == "__main__":
    main()

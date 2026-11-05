# Reels oficial — Arthur Video Editor AI

Primeiro teste audiovisual da biblioteca: um Reels vertical (1080×1920, 30 fps, 168 s) que percorre as
14 categorias do catálogo demonstrando, em execução real, os recursos implementados.

## Onde está cada parte (projeto editável)

| Parte | Arquivo |
|---|---|
| Roteiro e tempos (fonte única para vídeo **e** áudio) | `projetos/remotion-base/src/reels/data/roteiro.json` |
| Composição principal (Remotion) | `projetos/remotion-base/src/reels/ReelsArthur.tsx` (composição `ReelsArthur`) |
| Biblioteca de efeitos reutilizáveis | `projetos/remotion-base/src/reels/fx.tsx` |
| Transições entre capítulos, fundo, moldura | `projetos/remotion-base/src/reels/comum.tsx` |
| Cenas | `projetos/remotion-base/src/reels/cenas/*.tsx` |
| Capa | `projetos/remotion-base/src/reels/Capa.tsx` (still `CapaReels`) |
| Capítulo 04 em HyperFrames (HTML + GSAP, MOV com alfa) | `projetos/reels-hyperframes-legendas/index.html` |
| Trilha + SFX sintetizados (autoria própria) | `projetos/reels-arthur/scripts/gerar_trilha.py` |
| Assets FFmpeg reais (grading, limpeza de voz, loudness, stats) | `projetos/reels-arthur/scripts/gerar_assets.py` |
| Presets FFmpeg usados | `scripts/efeitos-ffmpeg.sh` (`log-flat`, `cinematico`, `teal-laranja`, `preto-e-branco`, `vhs`, `limpar-audio`, `normalizar-reels`) |
| Pipeline completo + exportação | `projetos/reels-arthur/scripts/build.sh` |
| Atualização do catálogo após o render | `projetos/reels-arthur/scripts/atualizar_catalogo.py` |
| Relatório técnico | `projetos/reels-arthur/RELATORIO.md` |

## Reproduzir

```bash
bash scripts/setup.sh                       # kit (idempotente)
pip install scipy                           # síntese de áudio
bash projetos/reels-arthur/scripts/build.sh # tudo: trilha, assets, HyperFrames, render, export, capa, master 4K
# opções: --sem-master (pula o 4K) · --pular-assets (reaproveita trilha/assets já gerados)
```

Saídas em `midia/saida/` (não versionado):
`ARTHUR_VIDEO_EDITOR_REELS_INSTAGRAM.mp4`, `ARTHUR_VIDEO_EDITOR_REELS_4K_MASTER.mp4`, `ARTHUR_VIDEO_EDITOR_CAPA.jpg`.

## Editar

- Textos, títulos e legendas de cada capítulo: `roteiro.json` (`titulo`, `legenda`).
- Tempos: altere `inicio`/`dur` no roteiro e rode novamente `gerar_trilha.py` — os SFX acompanham.
- Prévia interativa: `cd projetos/remotion-base && npx remotion studio` → composição `ReelsArthur`.
- Mídia pesada gerada (`public/reels/*.wav|*.mp4|*.mov`, `grain/`) não é versionada; o `build.sh` recria tudo.

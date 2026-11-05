#!/usr/bin/env bash
# Pipeline completo do Reels "Arthur Video Editor AI".
# Uso: bash projetos/reels-arthur/scripts/build.sh [--sem-master] [--pular-assets]
#
# 1. trilha + SFX sintetizados (gerar_trilha.py)            → public/reels/*.wav + audio-analise.json
# 2. plano-fonte (Remotion CenaFonte) + assets FFmpeg reais  → grades, grão, demo de áudio, stats, loudness
# 3. capítulo de legendas em HyperFrames (MOV com alfa)      → public/reels/hf-legendas.mov
# 4. render do vídeo (Remotion, sem áudio, intermediário de alta qualidade)
# 5. exportação final FFmpeg: H.264 High, yuv420p, Rec.709, AAC 48 kHz 128 kbps, -14 LUFS, faststart
# 6. capa JPG e master 4K (2160×3840, render nativo em escala 2)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
RB="$ROOT/projetos/remotion-base"
OUT="$ROOT/midia/saida"
WORK="$ROOT/projetos/reels-arthur/out"
mkdir -p "$OUT" "$WORK"
MASTER=1; ASSETS=1
for a in "$@"; do
  case "$a" in --sem-master) MASTER=0 ;; --pular-assets) ASSETS=0 ;; esac
done
export REMOTION_BROWSER_EXECUTABLE="${REMOTION_BROWSER_EXECUTABLE:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)}"
log() { printf '\n[reels] %s\n' "$*"; }

if [ "$ASSETS" = 1 ]; then
  log "1/6 trilha e efeitos sonoros"
  python3 "$ROOT/projetos/reels-arthur/scripts/gerar_trilha.py"
  log "2/6 plano-fonte e assets FFmpeg"
  (cd "$RB" && npx remotion render src/index.ts CenaFonte public/reels/cena-fonte.mp4 --crf=12 --log=error)
  python3 "$ROOT/projetos/reels-arthur/scripts/gerar_assets.py"
  log "3/6 HyperFrames (legendas com alfa)"
  (cd "$ROOT/projetos/reels-hyperframes-legendas" && npx hyperframes render . --format mov -o "$RB/public/reels/hf-legendas.mov" --quiet)
fi

log "4/6 render Remotion 1080×1920 (vídeo intermediário, CRF 10)"
(cd "$RB" && npx remotion render src/index.ts ReelsArthur "$WORK/reels-1080-video.mp4" --muted --crf=10 --color-space=bt709 --concurrency=4 --jpeg-quality=95 --log=error)

log "5/6 exportação Instagram"
AUD="$RB/public/reels/mix-14lufs.wav"
ffmpeg -hide_banner -v error -y -i "$WORK/reels-1080-video.mp4" -i "$AUD" -map 0:v:0 -map 1:a:0 \
  -c:v libx264 -profile:v high -level:v 4.2 -preset slow -crf 18 -maxrate 20M -bufsize 40M \
  -pix_fmt yuv420p -r 30 -g 60 -bf 2 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -vf "scale=1080:1920:flags=lanczos,setsar=1" \
  -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart -shortest \
  "$OUT/ARTHUR_VIDEO_EDITOR_REELS_INSTAGRAM.mp4"

log "6/6 capa e master"
(cd "$RB" && npx remotion still src/index.ts CapaReels "$WORK/capa.png" --log=error)
ffmpeg -hide_banner -v error -y -i "$WORK/capa.png" -q:v 2 "$OUT/ARTHUR_VIDEO_EDITOR_CAPA.jpg"
if [ "$MASTER" = 1 ]; then
  (cd "$RB" && npx remotion render src/index.ts ReelsArthur "$WORK/reels-4k-video.mp4" --muted --scale=2 --crf=12 --color-space=bt709 --concurrency=4 --jpeg-quality=95 --log=error)
  ffmpeg -hide_banner -v error -y -i "$WORK/reels-4k-video.mp4" -i "$AUD" -map 0:v:0 -map 1:a:0 \
    -c:v libx264 -profile:v high -level:v 5.2 -preset slow -crf 14 -pix_fmt yuv420p \
    -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
    -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart -shortest \
    "$OUT/ARTHUR_VIDEO_EDITOR_REELS_4K_MASTER.mp4"
fi
log "Concluído. Arquivos em $OUT"
ls -la "$OUT"

#!/usr/bin/env bash
# Master 4K em blocos (cada bloco é retomável). Uso: bash render-4k-blocos.sh <bloco 0-3> [...]
#   depois: bash render-4k-blocos.sh juntar
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
RB="$ROOT/projetos/remotion-base"; WORK="$ROOT/projetos/reels-arthur/out"; OUT="$ROOT/midia/saida"
export REMOTION_BROWSER_EXECUTABLE="${REMOTION_BROWSER_EXECUTABLE:-$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell | head -1)}"
N=5040; B=4; STEP=$((N / B))
for arg in "$@"; do
  if [ "$arg" = juntar ]; then
    : > "$WORK/4k-lista.txt"
    for i in $(seq 0 $((B - 1))); do echo "file '$WORK/4k-bloco-$i.mp4'" >> "$WORK/4k-lista.txt"; done
    ffmpeg -hide_banner -v error -y -f concat -safe 0 -i "$WORK/4k-lista.txt" -i "$RB/public/reels/mix-14lufs.wav" -map 0:v:0 -map 1:a:0 \
      -c:v libx264 -profile:v high -level:v 5.2 -preset medium -crf 14 -pix_fmt yuv420p \
      -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
      -c:a aac -b:a 320k -ar 48000 -ac 2 -movflags +faststart -shortest "$OUT/ARTHUR_VIDEO_EDITOR_REELS_4K_MASTER.mp4"
    continue
  fi
  a=$((arg * STEP)); b=$((a + STEP - 1))
  [ -s "$WORK/4k-bloco-$arg.mp4" ] && { echo "bloco $arg já existe"; continue; }
  (cd "$RB" && npx remotion render src/index.ts ReelsArthur "$WORK/4k-bloco-$arg.tmp.mp4" --frames=$a-$b --muted --scale=2 --crf=12 \
     --color-space=bt709 --concurrency=4 --jpeg-quality=95 --log=error)
  mv "$WORK/4k-bloco-$arg.tmp.mp4" "$WORK/4k-bloco-$arg.mp4"
  echo "bloco $arg ok ($a-$b)"
done

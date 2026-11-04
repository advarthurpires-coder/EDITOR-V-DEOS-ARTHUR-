#!/usr/bin/env bash
# Presets reais e reexecutáveis. Uso: bash scripts/efeitos-ffmpeg.sh ACAO entrada.mp4 saida.mp4
set -euo pipefail
ACTION="${1:-}"
INPUT="${2:-}"
OUTPUT="${3:-}"
usage() {
  echo "Uso: bash scripts/efeitos-ffmpeg.sh {vertical|cinematico|vhs|preto-e-branco|limpar-audio|normalizar-audio} entrada saida"
}
if [[ -z "$ACTION" || -z "$INPUT" || -z "$OUTPUT" ]]; then usage; exit 2; fi
command -v ffmpeg >/dev/null || { echo "FFmpeg não encontrado" >&2; exit 127; }
[[ -f "$INPUT" ]] || { echo "Entrada inexistente: $INPUT" >&2; exit 1; }
[[ "$INPUT" != "$OUTPUT" ]] || { echo "Entrada e saída precisam ser diferentes" >&2; exit 2; }
mkdir -p "$(dirname "$OUTPUT")"
case "$ACTION" in
  vertical)
    ffmpeg -hide_banner -y -i "$INPUT" -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "$OUTPUT" ;;
  cinematico)
    ffmpeg -hide_banner -y -i "$INPUT" -vf "eq=contrast=1.08:saturation=0.94:brightness=-0.015,vignette=PI/6" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a copy "$OUTPUT" ;;
  vhs)
    ffmpeg -hide_banner -y -i "$INPUT" -vf "noise=alls=12:allf=t+u,eq=saturation=0.80,format=yuv420p" -c:v libx264 -preset medium -crf 20 -c:a copy "$OUTPUT" ;;
  preto-e-branco)
    ffmpeg -hide_banner -y -i "$INPUT" -vf "hue=s=0,eq=contrast=1.10" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a copy "$OUTPUT" ;;
  limpar-audio)
    ffmpeg -hide_banner -y -i "$INPUT" -vn -af "highpass=f=80,lowpass=f=14000,afftdn" -c:a aac -b:a 192k "$OUTPUT" ;;
  normalizar-audio)
    ffmpeg -hide_banner -y -i "$INPUT" -vn -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k "$OUTPUT" ;;
  *) usage; exit 2 ;;
esac
echo "Processamento finalizado: $OUTPUT"

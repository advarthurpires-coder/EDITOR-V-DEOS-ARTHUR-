#!/usr/bin/env bash
# Presets reais e reexecutáveis. Uso: bash scripts/efeitos-ffmpeg.sh ACAO entrada.mp4 saida.mp4
set -euo pipefail
ACTION="${1:-}"
INPUT="${2:-}"
OUTPUT="${3:-}"
usage() {
  echo "Uso: bash scripts/efeitos-ffmpeg.sh {vertical|cinematico|vhs|preto-e-branco|teal-laranja|log-flat|limpar-audio|normalizar-audio|normalizar-reels} entrada saida"
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
  teal-laranja)
    # Teal & orange: sombras para o ciano, altas-luzes para o laranja, contraste e saturação moderados.
    ffmpeg -hide_banner -y -i "$INPUT" -vf "colorbalance=rs=-0.15:gs=-0.04:bs=0.16:rm=-0.03:gm=-0.03:bm=0.04:rh=0.12:gh=0.03:bh=-0.12,eq=contrast=1.12:saturation=1.22,format=yuv420p" -c:v libx264 -preset medium -crf 18 -c:a copy "$OUTPUT" ;;
  log-flat)
    # Simula material "LOG"/sem tratamento (baixo contraste e saturação) — o "ANTES" das comparações.
    ffmpeg -hide_banner -y -i "$INPUT" -vf "eq=contrast=0.70:saturation=0.55:brightness=0.06:gamma=1.08,format=yuv420p" -c:v libx264 -preset medium -crf 18 -c:a copy "$OUTPUT" ;;
  limpar-audio)
    ffmpeg -hide_banner -y -i "$INPUT" -vn -af "highpass=f=80,lowpass=f=14000,afftdn=nr=20:nf=-40:tn=1" -c:a aac -b:a 192k "$OUTPUT" ;;
  normalizar-audio)
    ffmpeg -hide_banner -y -i "$INPUT" -vn -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k "$OUTPUT" ;;
  normalizar-reels)
    # Loudness para Instagram/Reels: -14 LUFS integrados, true peak -1.5 dBTP, AAC 48 kHz.
    ffmpeg -hide_banner -y -i "$INPUT" -vn -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k "$OUTPUT" ;;
  *) usage; exit 2 ;;
esac
echo "Processamento finalizado: $OUTPUT"

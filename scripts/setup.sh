#!/usr/bin/env bash
# Instala/atualiza o kit de edição de vídeo: FFmpeg, yt-dlp, whisper.cpp, HyperFrames, Remotion.
# Idempotente: pula o que já está instalado. Uso: bash scripts/setup.sh
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOOLS="$ROOT/tools"
WHISPER_DIR="$TOOLS/whisper.cpp"
WHISPER_MODEL="${WHISPER_MODEL:-small}"   # small = bom equilíbrio para português em CPU
HYPERFRAMES_VERSION="0.9.13"
mkdir -p "$TOOLS"
log() { printf '[setup-video] %s\n' "$*"; }

# 1) FFmpeg
if ! command -v ffmpeg >/dev/null 2>&1; then
  log "Instalando FFmpeg..."
  if command -v apt-get >/dev/null 2>&1; then (apt-get update -qq && apt-get install -y -qq ffmpeg) || sudo apt-get install -y ffmpeg
  elif command -v brew >/dev/null 2>&1; then brew install ffmpeg
  else log "AVISO: instale o FFmpeg manualmente (https://ffmpeg.org/download.html)"; fi
fi

# 2) yt-dlp (sempre atualizado: os sites mudam com frequência)
log "Atualizando yt-dlp..."
python3 -m pip install -q -U yt-dlp 2>/dev/null || pip install -q -U yt-dlp 2>/dev/null || log "AVISO: falha ao instalar yt-dlp"

# 3) HyperFrames CLI
if [ "$(hyperframes --version 2>/dev/null)" != "$HYPERFRAMES_VERSION" ]; then
  log "Instalando HyperFrames $HYPERFRAMES_VERSION..."
  npm install -g --no-audit --no-fund "hyperframes@$HYPERFRAMES_VERSION" >/dev/null 2>&1 || log "AVISO: falha ao instalar HyperFrames"
fi

# 4) Remotion (dependências do projeto-base)
if [ ! -d "$ROOT/projetos/remotion-base/node_modules/remotion" ]; then
  log "Instalando dependências do Remotion..."
  (cd "$ROOT/projetos/remotion-base" && npm install --no-audit --no-fund >/dev/null 2>&1) || log "AVISO: falha no npm install do Remotion"
fi

# 5) whisper.cpp (compila do código-fonte)
if [ ! -x "$WHISPER_DIR/build/bin/whisper-cli" ]; then
  log "Compilando whisper.cpp (leva alguns minutos)..."
  [ -d "$WHISPER_DIR/.git" ] || git clone -q --depth 1 https://github.com/ggml-org/whisper.cpp "$WHISPER_DIR"
  (cd "$WHISPER_DIR" && cmake -B build -DCMAKE_BUILD_TYPE=Release -DWHISPER_BUILD_TESTS=OFF >/dev/null \
     && cmake --build build -j"$(nproc 2>/dev/null || echo 4)" --config Release --target whisper-cli >/dev/null) \
     || log "AVISO: falha ao compilar whisper.cpp"
fi
if [ ! -f "$WHISPER_DIR/models/ggml-$WHISPER_MODEL.bin" ]; then
  log "Baixando modelo Whisper '$WHISPER_MODEL' (huggingface.co)..."
  (cd "$WHISPER_DIR" && bash models/download-ggml-model.sh "$WHISPER_MODEL" >/dev/null 2>&1) \
    || log "AVISO: modelo Whisper não baixado — libere huggingface.co na rede do ambiente."
fi
mkdir -p "$HOME/.local/bin"
ln -sf "$WHISPER_DIR/build/bin/whisper-cli" "$HOME/.local/bin/whisper-cli" 2>/dev/null || true

log "Concluído. Rode: bash scripts/testar-tudo.sh"

#!/usr/bin/env bash
# Testa as 5 ferramentas do kit. Uso: bash scripts/testar-tudo.sh
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
T="$(mktemp -d)"; ok=0; falha=0
pass() { echo "  ✅ $1"; ok=$((ok+1)); }
fail() { echo "  ❌ $1"; falha=$((falha+1)); }
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)
[ -n "$HS" ] && export REMOTION_BROWSER_EXECUTABLE="${REMOTION_BROWSER_EXECUTABLE:-$HS}"

echo "1) FFmpeg"
ffmpeg -v error -f lavfi -i testsrc=size=640x360:rate=30 -f lavfi -i sine=frequency=440 -t 2 \
  -c:v libx264 -c:a aac -shortest -y "$T/ff.mp4" && pass "$(ffmpeg -version | head -1 | cut -d' ' -f1-3)" || fail "FFmpeg"

echo "2) yt-dlp"
yt-dlp -q --no-warnings -o "$T/yt.%(ext)s" https://raw.githubusercontent.com/ggml-org/whisper.cpp/master/samples/jfk.mp3 \
  && [ -s "$T/yt.mp3" ] && pass "yt-dlp $(yt-dlp --version)" || fail "yt-dlp"

echo "3) whisper.cpp"
W="$ROOT/tools/whisper.cpp"; M=$(ls "$W"/models/ggml-*.bin 2>/dev/null | grep -v for-tests | head -1)
if [ -x "$W/build/bin/whisper-cli" ]; then
  if [ -n "$M" ]; then
    "$W/build/bin/whisper-cli" -m "$M" -f "$W/samples/jfk.wav" -nt 2>/dev/null | grep -qi "country" \
      && pass "whisper.cpp transcrevendo ($(basename "$M"))" || fail "whisper.cpp (transcrição)"
  else
    "$W/build/bin/whisper-cli" -m "$W/models/for-tests-ggml-tiny.bin" -f "$W/samples/jfk.wav" >/dev/null 2>&1 \
      && echo "  ⚠️  whisper.cpp compilado e executando, mas SEM modelo real (libere huggingface.co)" || fail "whisper.cpp"
  fi
else fail "whisper.cpp não compilado"; fi

echo "4) HyperFrames"
(cd "$ROOT/projetos/teste-hyperframes" && hyperframes render . -o "$T/hf.mp4" --quality draft --quiet >/dev/null 2>&1) \
  && [ -s "$T/hf.mp4" ] && pass "HyperFrames $(hyperframes --version)" || fail "HyperFrames"

echo "5) Remotion"
(cd "$ROOT/projetos/remotion-base" && npx remotion render src/index.ts Vinheta "$T/rm.mp4" --log=error >/dev/null 2>&1) \
  && [ -s "$T/rm.mp4" ] && pass "Remotion $(node -p "require('$ROOT/projetos/remotion-base/node_modules/remotion/package.json').version")" || fail "Remotion"

echo; echo "Resultado: $ok ok, $falha com falha. (arquivos de teste em $T)"
[ "$falha" -eq 0 ]

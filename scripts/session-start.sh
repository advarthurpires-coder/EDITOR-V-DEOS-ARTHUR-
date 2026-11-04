#!/usr/bin/env bash
# Para uso como hook SessionStart: roda o setup em segundo plano sem travar a sessão.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/tools"
nohup bash "$ROOT/scripts/setup.sh" > "$ROOT/tools/setup.log" 2>&1 &
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)
  [ -n "$HS" ] && echo "export REMOTION_BROWSER_EXECUTABLE=$HS" >> "$CLAUDE_ENV_FILE"
  echo "export PATH=\"$HOME/.local/bin:\$PATH\"" >> "$CLAUDE_ENV_FILE"
fi
echo "Kit de edição de vídeo: instalando em segundo plano (log em tools/setup.log)."
exit 0

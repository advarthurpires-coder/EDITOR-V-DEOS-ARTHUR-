# Diário técnico — aprendizados do estúdio

Registre aqui toda técnica nova, armadilha resolvida ou limitação descoberta (data · contexto · solução · limitações).
Isto é a memória de longo prazo do editor: leia antes de editar, atualize depois.

## 2026-11-05 — Montagem inicial do estúdio
- **Rede do ambiente em nuvem** bloqueia `huggingface.co` (modelos Whisper/Kokoro), `youtube.com`, `cdn.jsdelivr.net`,
  `fonts.gstatic.com` e o download do Chrome da Remotion. Liberam: npm, PyPI, GitHub, raw.githubusercontent.com.
  → GSAP vendorizado em `vendor/gsap.min.js` nos projetos HyperFrames; fontes via `@fontsource`; Remotion usa o
  Chromium local (`REMOTION_BROWSER_EXECUTABLE`). Registro HyperFrames (`hyperframes add/catalog`) funciona.
- **Transcrição**: código pronto (`estudio.py transcrever` + conversão para `Caption[]`), mas **não testado com modelo
  real** enquanto huggingface.co estiver bloqueado. Ao liberar: `bash scripts/setup.sh` baixa `ggml-small.bin`; validar
  com um áudio em português e atualizar `audio.automatic-transcription` para testado.
- **xfade** exige mesma resolução, fps e formato de pixel nas duas entradas → `estudio.py transicao` normaliza antes.
- **zoompan** em vídeo: usar `d=1` e upscale 2× antes para evitar tremido; em foto, upscale 3×.
- **SFX sintetizados**: fonte `lavfi` precisa de `-t` **antes** de `-i` quando há `areverse` (senão a entrada é infinita
  e o comando trava). Níveis variavam 20 dB entre efeitos → normalização de pico em −3 dBFS.
- **Legendas Remotion**: `createTikTokStyleCaptions` agrupa palavras em páginas; tokens precisam de espaço inicial
  (`" palavra"`) para o espaçamento correto. Posição vertical 0.6 evita colisão com a tarja (padding 400 px) no 9:16.
- **"Luma fade"**: o `fadegrays` do xfade é um fade em cinza, não um luma fade de verdade → renomeado para `fade-cinza`
  e o item ficou como catalogado.
- **Renders de referência**: Remotion Vitrine (12 s, 1080p) ≈ 85 s; ReelsJuridico (11 s) ≈ 25 s; HyperFrames 4 s ≈ 8 s;
  exportação 4K de 4 s ≈ 21 s (4 vCPUs).

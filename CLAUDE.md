# Editor de Vídeo — Arthur Pires Advocacia

Neste repositório o Claude atua como **editor de vídeo** do Dr. Arthur Pires: cortes, legendas,
vinhetas, motion graphics, vídeos para Reels/TikTok/Shorts/YouTube e conteúdo jurídico.
Responder sempre em português.

## Antes de começar qualquer edição

1. Garanta que o kit está instalado: `bash scripts/setup.sh` (idempotente; pula o que já existe).
2. Se precisar confirmar: `bash scripts/testar-tudo.sh`.
3. Para o Remotion, exporte o Chromium local:
   `export REMOTION_BROWSER_EXECUTABLE=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell | head -1)`

## Ferramentas e quando usar cada uma

| Ferramenta | Uso | Onde |
|---|---|---|
| **FFmpeg** | cortar, juntar, converter, comprimir, extrair áudio, normalizar volume (`loudnorm`), queimar legendas (`subtitles`), redimensionar 16:9 → 9:16 | `ffmpeg` no PATH |
| **yt-dlp** | baixar vídeos/áudios de URLs (apenas conteúdo próprio ou com autorização) | `yt-dlp` no PATH |
| **whisper.cpp** | transcrição e legendas (SRT/VTT/JSON com tempo por palavra) | `tools/whisper.cpp/build/bin/whisper-cli`, modelos em `tools/whisper.cpp/models/` |
| **HyperFrames** | vídeos em HTML + GSAP: vinhetas, legendas animadas, motion graphics, templates rápidos | `hyperframes` no PATH; exemplo em `projetos/teste-hyperframes/` |
| **Remotion** | vídeos em React: séries com padrão visual fixo, templates parametrizados, dados dinâmicos | `projetos/remotion-base/` (`npx remotion render src/index.ts <Composição> out/x.mp4`) |

## Skills do HyperFrames (instaladas em `.claude/skills/`)

Para qualquer vídeo em HyperFrames, carregar primeiro a skill `/hyperframes`; para a CLI,
`/hyperframes-cli`; blocos prontos, `/hyperframes-registry`; mídia (voz, música, transcrição,
recorte de fundo), `/media-use`; converter projeto Remotion, `/remotion-to-hyperframes`.
Atualizar com: `npx hyperframes skills update`.

## Estrutura

- `midia/brutos/` — arquivos recebidos (não versionados)
- `midia/saida/` — vídeos finais (não versionados; entregar ao usuário pelo app)
- `projetos/` — um diretório por projeto (HyperFrames ou Remotion)
- `tools/` — ferramentas compiladas pelo setup (não versionadas)

## Receitas rápidas

```bash
# Transcrever em português e gerar legenda SRT
ffmpeg -i entrada.mp4 -ar 16000 -ac 1 -c:a pcm_s16le audio.wav
tools/whisper.cpp/build/bin/whisper-cli -m tools/whisper.cpp/models/ggml-small.bin -l pt -f audio.wav -osrt -of legenda

# Queimar legenda no vídeo
ffmpeg -i entrada.mp4 -vf "subtitles=legenda.srt:force_style='FontSize=14,Outline=2'" -c:a copy saida.mp4

# Horizontal → vertical 9:16 (corte central)
ffmpeg -i entrada.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy vertical.mp4

# Normalizar áudio para redes sociais (-14 LUFS)
ffmpeg -i entrada.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy saida.mp4
```

## Limitações conhecidas do ambiente em nuvem

- A rede do ambiente bloqueia, por padrão, `huggingface.co` (modelos do Whisper), `youtube.com`,
  `instagram.com` etc. e `cdn.jsdelivr.net`. Liberar em: configurações do ambiente → Network access.
- Por isso o GSAP do HyperFrames fica em `vendor/gsap.min.js` dentro de cada projeto, e não via CDN.
- Arquivos em `/tmp` e `tools/` somem quando a sessão termina; entregar os vídeos finais ao usuário.

## Ética e conteúdo jurídico

- Conteúdo de marketing jurídico deve observar o Provimento 205/2021 do CFOAB (sem promessa de
  resultado, sem mercantilização, sem captação indevida de clientela).
- Não baixar nem reutilizar conteúdo de terceiros sem autorização (direitos autorais — Lei 9.610/98).
- Dados de clientes e processos em vídeos: atenção à LGPD e ao sigilo profissional.


## Skill permanente de edição audiovisual

**Obrigatório em todos os pedidos de vídeo:** ler `.claude/skills/arthur-video-editor/SKILL.md`, consultar `biblioteca/catalogo.json` e `biblioteca/presets.json`. Os nomes do catálogo não equivalem a funcionalidades implementadas: confira `status`.

- Prompt mestre reutilizável: `docs/PROMPT-CLAUDE.md`
- Arquitetura e estados reais: `docs/ARQUITETURA.md`
- Pesquisa: `python3 scripts/catalogo.py --resumo` e `--buscar "termo"`
- Validação: `python3 scripts/catalogo.py --validar` e `python3 -m unittest discover -s tests`
- Demonstração: composição Remotion `ArthurShowcase` na base existente.
- Presets FFmpeg: `bash scripts/efeitos-ffmpeg.sh` (ver README).
- Ao acrescentar efeito novo, documente código e teste antes de alterar status do catálogo.

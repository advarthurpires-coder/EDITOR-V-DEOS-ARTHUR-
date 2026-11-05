# `scripts/estudio.py` — referência rápida

`python3 scripts/estudio.py <comando> -h` mostra todas as opções. Saída padrão: H.264 CRF 18, yuv420p, faststart, AAC 192k.
`ESTUDIO_DEBUG=1` imprime o comando FFmpeg executado.

| Comando | Exemplo | Notas |
|---|---|---|
| `info` | `info bruto.mp4` | duração, resolução, fps, áudio |
| `cor` | `cor in.mp4 out.mp4 --preset cinematic --intensidade 0.7 --vinheta` | presets: teal-orange, dark-moody, warm-film, golden-hour, pb, alto-contraste, matte, vintage-kodak, pastel, luxo-dourado, azul-frio, drama-dessaturado, hdr-look, cinematic, natural, correcao-auto · `--lut x.cube` |
| `vfx` | `vfx in out --efeito vhs --intensidade 1.2` | grao, vhs, aberracao, glow, rastro, tremor, handheld, zoom-in, zoom-out, vinheta, isolar-cor (`--cor red`), espelho |
| `transicao` | `transicao a.mp4 b.mp4 out.mp4 --tipo flash --duracao 0.3` | fade, dissolver, fade-preto, flash, fade-cinza, wipe-*, slide-*, push-*, zoom, circulo-abre/fecha, circulo, radial, pixel, diagonal, barras-h/v, squeeze, cortina, desfoque, distancia, revelar, cobrir. Normaliza resolução/fps e faz crossfade do áudio |
| `reframe` | `reframe in out --formato 9:16 --modo blur` | crop (com `--foco-x` 0–1) ou blur (fundo desfocado) |
| `velocidade` | `velocidade in out --fator 0.5 --suave` / `--reverso` | áudio acompanha (atempo); `--suave` interpola quadros (lento) |
| `congelar` | `congelar in out --em 3.2 --duracao 1.5` | áudio pausa durante o freeze |
| `audio` | `audio in out --ruido --voz-eq --compressor --lufs -14 --fade-in 0.3 --fade-out 1` | `--fade-video` aplica fades na imagem também; saída .wav/.mp3 extrai só áudio |
| `ducking` | `ducking video.mp4 musica.mp3 out.mp4 --volume-musica 0.25` | sidechain pela voz + loudnorm |
| `silencio` | `silencio in out --limiar -35dB --minimo 0.45 --margem 0.08` | jump cuts automáticos; ajuste o limiar ao ruído de fundo |
| `cenas` | `cenas in.mp4 --limiar 0.3` | JSON com tempos de corte |
| `chroma` | `chroma pessoa.mp4 fundo.jpg out.mp4 --cor 0x00FF00` | fundo imagem ou vídeo |
| `split` | `split a.mp4 b.mp4 out.mp4 --orientacao h` | lado a lado / empilhado |
| `pip` | `pip principal.mp4 sec.mp4 out.mp4 --posicao inf-dir --escala 0.3` | borda dourada padrão |
| `foto` | `foto foto.jpg out.mp4 --movimento drone --formato 9:16 --duracao 5` | Ken Burns sem tremido (upscale 3×) |
| `transcrever` | `transcrever in.mp4 --idioma pt --prompt "INSS, aposentadoria, CNIS"` | gera .srt .vtt .txt .json e .legendas.json (Remotion) |
| `legendar` | `legendar in.mp4 leg.srt out.mp4 --estilo reels` | classico, reels, gigante, caixa |
| `exportar` | `exportar in.mp4 out.mp4 --plataforma reels --modo blur` | reels, tiktok, shorts, stories, feed, quadrado, youtube, youtube-4k, linkedin, whatsapp |
| `cortar` | `cortar in out --inicio 12.5 --fim 40` | recodifica (corte preciso) |
| `juntar` | `juntar out.mp4 a.mp4 b.mp4 c.mp4` | normaliza resolução/fps do primeiro |
| `sfx` | `sfx whoosh w.wav` / `sfx todos pasta/` | whoosh, impacto, sub-boom, riser, riser-reverso, clique, pop, notificacao, drone, braam, batimento, glitch (pico −3 dBFS) |

Teste completo: `bash scripts/testar-estudio.sh [pasta]` (todas as opções acima com mídia sintética; ~5 min em 4 vCPUs).
Atalhos simples equivalentes (vertical, cinematico, vhs, preto-e-branco, limpar-audio, normalizar-audio): `bash scripts/efeitos-ffmpeg.sh`.

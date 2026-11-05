# Relatório técnico — Reels oficial "Arthur Video Editor AI"

Data: 05/11/2026 · Primeiro teste audiovisual da biblioteca.

## 1. Entregáveis

| Arquivo (`midia/saida/`) | Especificação medida |
|---|---|
| `ARTHUR_VIDEO_EDITOR_REELS_INSTAGRAM.mp4` | 1080×1920 · 30 fps · 168,0 s (5.040 frames) · H.264 High @ L4.2 · yuv420p · BT.709 (primaries/transfer/matrix) · CRF 18 com teto de 20 Mbps (média 5,8 Mbps) · AAC-LC 48 kHz estéreo 128 kbps · **−13,9 LUFS integrados · true peak −1,6 dBTP** · LRA 3,4 LU · faststart (moov no início) · 124 MB |
| `ARTHUR_VIDEO_EDITOR_REELS_4K_MASTER.mp4` | 2160×3840 nativo (render Remotion em escala 2, não upscale) · 30 fps · H.264 High @ L5.2 · CRF 14 · BT.709 · AAC 320 kbps — ver item 6 |
| `ARTHUR_VIDEO_EDITOR_CAPA.jpg` | 1080×1920, still `CapaReels` do Remotion |

A média de 5,8 Mbps é baixa porque o material é gráfico (fundos escuros e formas limpas comprimem muito bem em CRF 18); o
teto de 20 Mbps protege as cenas com partículas e grão, e fica abaixo do limite de 25 Mbps pedido.

## 2. Testes executados antes do vídeo

- `bash scripts/setup.sh` e `bash scripts/testar-tudo.sh`: FFmpeg 6.1.1 ✅ · yt-dlp 2026.10.26 ✅ · HyperFrames 0.9.13 ✅ · Remotion 4.0.540 ✅ ·
  whisper.cpp compilado ⚠️ **sem modelo real** (huggingface.co bloqueado pela rede do ambiente).
- `npx hyperframes check`: sem erros (avisos de estrutura aceitos para um clipe de sobreposição).
- `npx tsc --noEmit`: código do Reels sem erros de tipo.
- Prévia completa em meia resolução, revisada por folhas de contato de todos os capítulos; correções aplicadas
  (carrossel 3D, dolly zoom refeito, textos que estouravam, sobreposição de rótulos, intensidade dos flashes).
- Após o render final: `python3 scripts/catalogo.py --validar` ✅ e `python3 -m unittest discover -s tests` ✅.

## 3. Roteiro realizado

| Tempo | Bloco | Transição de entrada |
|---|---|---|
| 0–8 s | Abertura: kinetic typography, glitch, zoom through na "?" e revelação ARTHUR VIDEO EDITOR AI | — |
| 8–20 s | 5 tecnologias em carrossel 3D (camera orbit) + fluxo de produção | zoom through |
| 20–146 s | 14 capítulos (8 ou 10 s cada, alinhados ao compasso de 120 BPM) | flash, whip, orbit, drop, glitch, light leak, zoom, iris |
| 146–158 s | Montagem final: 8 cortes no beat + "384 RECURSOS CATALOGADOS" + "14 CATEGORIAS" + "CRIATIVIDADE SEM LIMITES" | flash + braam |
| 158–168 s | Encerramento: monograma em traço dourado, título, "UMA BIBLIOTECA. INFINITAS POSSIBILIDADES." | flash |

Todos os textos-chave ficam entre y = 250 e y = 1.480 px e x = 80 a 960 px (área segura do Reels). O vídeo funciona sem som:
cada capítulo tem legenda dinâmica (karaokê) e rótulos com o nome técnico do efeito em execução.

## 4. Recursos efetivamente demonstrados (código executado no render)

**Remotion (`projetos/remotion-base/src/reels/`)**
- Transições: flash cut, zoom through, whip pan com **motion blur real** (`@remotion/motion-blur`, amostragem temporal), orbit 3D, gravity drop, glitch/RGB split, light leak, iris reveal, fade.
- Câmera/3D: camera orbit (anel de 6 planos), dolly zoom/vertigo (compressão de perspectiva com sujeito constante), parallax multicamada, Ken Burns.
- Motion graphics: chart grow, data counter, progress ring, ícones em gravity drop com física de mola, path draw, partículas (explosão e poeira), light rays, glow/bloom, glassmorphism.
- Legendas: kinetic typography, karaokê com caixa de destaque, títulos cinematográficos.
- Interfaces: phone mockup 3D com UI de Reels, notificações, janela de navegador, timeline, barra de busca.
- Montagem: beat cut com punch-in, speed ramp por remapeamento de tempo (1× → 0,18× → 3×), montagem final.
- Dados reais no vídeo: contagens por estado do catálogo, busca "zoom" do `catalogo.py`, presets, timeline real do próprio Reels (18 blocos, 145 SFX), espectro real do canal de SFX, loudness medido.

**HyperFrames (`projetos/reels-hyperframes-legendas/`)** — capítulo 04 inteiro: pop-up palavra a palavra, typewriter, masked reveal com gradiente, bounce e barra karaokê; renderizado em MOV ProRes 4444 **com alfa** e composto no Remotion.

**FFmpeg (`scripts/efeitos-ffmpeg.sh`)** — color grading real sobre o mesmo plano: `log-flat` (antes), `cinematico`, `teal-laranja` (novo), `preto-e-branco`, `vhs`; limpeza de voz `limpar-audio` (afftdn reforçado: ruído de fundo −35,2 → −39,5 dBFS numa amostra de voz em domínio público); loudness em duas passagens; exportação final.

**Áudio (`projetos/reels-arthur/scripts/gerar_trilha.py`)** — trilha instrumental e 24 tipos de SFX **sintetizados por código**
(whoosh, impactos, sub-boom, braam, risers, reverse cymbal, glitch, pops, cliques, digitação, obturador, notificação, shimmer,
assinatura sonora do logo etc.), 145 disparos posicionados a partir do roteiro; sidechain, ducking por envelope, reverb por
convolução, arco dinâmico até a montagem final e fade-out. Não há música ou sample de terceiros: não há questão de licença.

## 5. Estado do catálogo após o Reels

82 recursos foram promovidos a `exemplo_executavel` por `atualizar_catalogo.py`, cada um apontando o arquivo do código,
somente depois de renderizados e revisados. Total atual: **95 executáveis · 10 integração nativa · 279 catalogados** (384).

## 6. O que NÃO foi implementado / depende de implementação (e como aparece no vídeo)

| Recurso | Situação | Como foi tratado |
|---|---|---|
| Narração masculina PT-BR | Nenhum motor TTS licenciado instalado | Vídeo sem narração, com tipografia cinética; o mixer mostra "VOZ — sem narração" |
| Transcrição Whisper PT-BR | whisper.cpp compila, mas o modelo `ggml-small.bin` não baixa (huggingface.co bloqueado) | Mostrado como "INTEGRAÇÃO · modelo pendente" |
| Tracking / rastreamento sobre footage | Não implementado | Capítulo 05 mostra **simulação programática**, rotulada como tal (chip cinza) |
| IA: seleção de cenas, cortes automáticos, reframing etc. | Todos `catalogado` | Capítulo 12 mostra o estado real de cada item; a seleção de cenas é rotulada "simulação visual" |
| Mockups 3D com modelos (Three.js) | Não instalado | Mockups feitos com CSS 3D (perspectiva real, sem malha 3D) |
| Exportação 4K como recurso do catálogo | Testada neste Reels | Mantida como `catalogado` no catálogo para não divergir das contagens exibidas no vídeo; pode ser promovida com `atualizar_catalogo.py --incluir-4k` |

Observação de precisão: o painel de loudness exibido no vídeo (capítulos 11 e 14) mostra a medição da mixagem antes do
ajuste anti-overshoot do AAC (−13,9 LUFS · TP −1,4 dBTP). O arquivo final mede −13,9 LUFS · TP −1,6 dBTP — mesma
loudness e pico mais seguro. Um novo `build.sh` já exibe os valores corrigidos.

## 7. Ética e conformidade

- Sem promessa de resultado, sem captação de clientela, sem dados de clientes ou processos (Provimento 205/2021 CFOAB; LGPD).
- Sem conteúdo de terceiros: imagens procedurais (SVG/CSS), trilha e SFX sintetizados; a única voz usada (demonstração de
  limpeza, apenas visual) é a amostra de domínio público distribuída com o whisper.cpp.
- Os números do painel "corporativo" (capítulo 06) estão marcados como "dados ilustrativos".

## 8. Como reproduzir / editar

Ver `projetos/reels-arthur/README.md`. Em resumo: `bash projetos/reels-arthur/scripts/build.sh` recria trilha, assets,
clipe HyperFrames, render, exportação Instagram, capa e master 4K. Tempos e textos ficam em
`projetos/remotion-base/src/reels/data/roteiro.json`.

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
- **"Clean Natural"** (usado no preset `juridico-sobrio`): implementado como `estudio.py cor --preset natural`
  (contraste/saturação +4%, nitidez leve).
- **Renders de referência**: Remotion Vitrine (12 s, 1080p) ≈ 85 s; ReelsJuridico (11 s) ≈ 25 s; HyperFrames 4 s ≈ 8 s;
  exportação 4K de 4 s ≈ 21 s (4 vCPUs).

## 2026-11-05 — Unificação com a biblioteca publicada pelo Dr. Arthur
- Duas versões foram construídas em paralelo (sessão do Claude e commit `d1e00a7` do usuário). Unificado em uma
  só fonte de verdade: `biblioteca/catalogo.json` (lista do usuário, 384 itens, como base) enriquecida com o que foi
  implementado e testado (campos `descricao`, `como_usar`, `testado`, `arquivo_exemplo`/`arquivo_demo`), mais 3 itens novos.
  Estados ampliados para 4: implementado > exemplo_executavel > integracao_nativa > catalogado.
- A biblioteca do usuário evita nomes de criadores reais nos estilos (`high-energy-social`): manter essa diretriz.
- `scripts/catalogo.py` manteve a interface por flags do usuário (`--buscar`, `--resumo`, `--validar`; funções
  `read`/`validate` usadas pelos testes) e ganhou `--ver`, `--preset`, `--marcar`, `--adicionar`, `--md`, `--motor`.
- `--validar` agora confere se cada item implementado aponta para arquivo existente, comando real do `estudio.py`
  e componente Remotion exportado — impede marcar como pronto algo que não existe.
- ArthurShowcase: o título "EXTRAORDINÁRIO." (fontSize 100) passava da borda do cartão de vidro em 1080 px → 86.
  Lição: textos longos em caixa-alta e peso 900 pedem conferência de quadro (`remotion still`) antes do render final.
- O processo da sessão pode reiniciar no meio de tarefas longas: fazer commit cedo e rodar baterias longas em segundo plano.

## 2026-11-05 — Primeiro vídeo real (iPhone, `midia/brutos/video-01.MOV`)
- **Arquivo de iPhone**: 480×360 com `rotation=-90` (exibe 360×480 em pé), 24 fps, **duas faixas de áudio**
  (AAC estéreo + faixa espacial de 4 canais em codec que o FFmpeg não decodifica) e 5 faixas de dados.
  - `info()` ignorava a rotação → corrigido (lê `side_data_list.rotation`/tag `rotate` e troca largura/altura).
  - Sem `-map`, o FFmpeg escolhe a faixa de áudio com **mais canais** (a espacial) → todos os comandos agora mapeiam
    `0:v:0` e `0:a:0` explicitamente; filtros usam `[0:a:0]`.
- **Upscale 4×** (480 → 1920): `estudio.py` passou a usar Lanczos e, acima de 1,5×, `unsharp` leve (função `escala`).
  Mesmo assim fica suave: pedir ao usuário o **arquivo original** (enviar como documento/arquivo, não como vídeo
  comprimido do app) — a fonte recebida já veio em 360p.
- **Exportação**: converter 24→30 fps repete quadros de forma irregular (trepidação) → `exportar` mantém o fps de origem
  quando é padrão (23,976/24/25/29,97/30) e ≤ alvo. `loudnorm` + AAC alongavam o áudio ~0,1 s → saída limitada com `-t`
  à duração da fonte (comandos `audio` e `exportar`).
- **Pipeline usado**: `cor --preset natural` → `audio --ruido --voz-eq --compressor --lufs -14 --fade-in 0.05 --fade-out 0.2`
  → `exportar --plataforma reels` (crop central 3:4→9:16). Resultado: 1080×1920, 24 fps, 6,08 s, −14,3 LUFS, pico −1,5 dBFS.
- **Sem transcrição** (huggingface.co e alphacephei.com bloqueados) → legendas, gancho e tarja aguardam o texto falado
  e a finalidade do vídeo. Não inventar texto de gancho/legenda nem identificar a pessoa sem confirmação.
- Pendente: incluir no `testar-estudio.sh` um caso com rotação + segunda faixa de áudio (regressão destes bugs).

## 2026-11-05 — Implementação dos recursos "por integração"
- **Motor `scripts/blocos.py`** para os blocos HyperFrames: instalação, reescrita de CDN para `./vendor`, três modos de
  render (direto/host/trecho) com fallback, parâmetros (`--var`), overlays com alfa (`sobrepor`), lote e verificação
  automática (render → compor sobre a cor da marca → exige movimento médio > 0,05 ou pico > 0,3). Detalhes e armadilhas:
  `referencias/blocos-hyperframes.md`.
- **Critério de honestidade aplicado**: bloco que só anima conteúdo de exemplo (transições/câmera do registro) continua
  `integracao_nativa` com observação; só vira `implementado` o que funciona com a mídia/texto do usuário.
- **Transições GLSL**: os 9 blocos "ficha" de transição usam o mesmo contrato (`u_from/u_to/u_progress/u_resolution/v_uv`).
  `scripts/extrair_shaders.py` extrai o GLSL estaticamente (sem executar JS; cuidado: `);` aparece dentro do GLSL, então
  a leitura do argumento percorre literais) e `TransicaoShader.tsx` aplica com `OffthreadVideo.onVideoFrame` +
  WebGL (`--gl=swangle`). As fichas não invertem o eixo Y (cenas sólidas escondem isso); com vídeo real é preciso
  `UNPACK_FLIP_Y_WEBGL = true`. Render de 5,2 s a 1280×720 ≈ 25 s.
- **Batidas**: `hyperframes beats arquivo --json` funciona offline (120,2 BPM numa faixa sintética de 120 BPM);
  base de `estudio.py batidas` e `montagem-ritmo`.
- **Tom**: `rubberband=pitch=2^(n/12)` — medido 219,4 Hz → 261,9 Hz para +3 semitons (esperado 261,6).
- **Slideshow ao vivo (`hyperframes present`)**: o player não resolveu as cenas (precisou de `startTime/endTime` na ilha)
  e não exibiu o conteúdo neste ambiente; o servidor lê a ilha só ao iniciar (reiniciar após editar). Template entregue
  como **vídeo** institucional; modo apresentação fica pendente.
- **Desempenho**: ~2 min por bloco no teste (render ProRes com alfa + composição); dois testadores em paralelo
  (`--reverso --relatorio outro.json`) aproveitam os 4 vCPUs.

## 2026-11-05 — Resultado dos testes dos blocos e revisão honesta do catálogo
- **91 de 94** blocos/componentes citados no catálogo renderizaram e foram verificados (2 por inspeção visual:
  macos-notification e slot-machine-roll, animações pequenas abaixo do critério automático). Relatório:
  `projetos/hf-biblioteca/relatorio-testes.json`; prévias: `biblioteca/previas/`.
- Correções necessárias no caminho: (1) receitas dos trechos assumem `startTime` na cena e às vezes trazem texto antes do
  código; (2) itens com `data-requires-webgpu` exigem `PRODUCER_ALLOW_SOFTWARE_WEBGPU=true` (SwiftShader); (3) `tl.labels`
  não existe no proxy de GSAP do render (ajuste local no `flowchart`); (4) componentes com tom `ink` (texto escuro)
  somem sobre o azul da marca — teste sobre cinza médio; em fundo escuro use `--var tone=paper`.
- Não suportados aqui: `vfx-shatter` (API HTML-in-canvas ausente no Chrome headless), `parallax-zoom/unzoom`
  (estruturais: envolvem a SUA grade de cartões).
- **Revisão de honestidade**: renderizar ≠ servir. Itens de conteúdo com texto/mídia fixos e sem parâmetros (legendas
  neon/emoji de exemplo, app-showcase, widgets, grade de placeholders, comentário estilo YouTube) e o multi-device-splay
  (monitor, não notebook) voltaram a `integracao_nativa`. `yt-logo-intro` (logo do YouTube) e `logo-outro` (logo do
  Figma) não servem para o escritório → criadas `AberturaYoutube`/`EncerramentoYoutube` próprias.
- `npx remotion still` falhou uma vez com `getaddrinfo ENOTFOUND remotion.media` (consulta de rede do Remotion) e funcionou
  na repetição: se ocorrer, repetir o comando.

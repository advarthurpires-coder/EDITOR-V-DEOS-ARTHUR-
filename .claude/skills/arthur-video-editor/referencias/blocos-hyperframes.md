# Blocos HyperFrames no Estúdio Arthur (`scripts/blocos.py`)

O registro HyperFrames tem ~450 itens (blocos = cenas com timeline própria; componentes = efeitos para colar numa cena).
O estúdio mantém os itens usados pelo catálogo em `projetos/hf-biblioteca/compositions/` (código-fonte editável,
versionado) e as bibliotecas JS em `projetos/hf-biblioteca/vendor/` (fora do Git, recriado por `blocos.py preparar`).

## Comandos

```bash
python3 scripts/blocos.py sugerir "lower third interview"          # busca no registro (inglês); ✅ = já instalado
python3 scripts/blocos.py instalar lt-soft-pill                      # instala + reescreve CDNs para ./vendor
python3 scripts/blocos.py variaveis kinetic-type-swap                # parâmetros do item
python3 scripts/blocos.py renderizar kinetic-type-swap t.mp4 --var prefix="Seu direito é" --var options="claro,seguro,garantido"
python3 scripts/blocos.py renderizar snow neve.mov --formato mov     # MOV ProRes 4444 com transparência (overlay)
python3 scripts/blocos.py sobrepor video.mp4 snow saida.mp4 --inicio 1 --duracao 4          # composição com canal alfa
python3 scripts/blocos.py sobrepor video.mp4 badge-pop saida.mp4 --escala 4                 # trechos pequenos: ampliar
python3 scripts/blocos.py sobrepor video.mp4 lens-flare saida.mp4 --modo tela               # itens opacos sobre preto
python3 scripts/blocos.py lote yt-logo-intro linhas.json pasta/     # uma saída por linha de variáveis (exportação em lote)
python3 scripts/blocos.py previa snow                                # biblioteca/previas/snow.jpg
python3 scripts/blocos.py testar [itens] [--max-segundos 4]          # render + verificação → relatorio-testes.json
```

Transições GLSL com os **seus** clipes (shaders extraídos dos blocos):
`python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader whip-pan|glitch|light-leak|ridged-burn|ripple-waves|thermal-distortion|cross-warp-morph|domain-warp-dissolve|chromatic-radial-split --duracao 0.8`

## Modos de renderização (automáticos, com fallback)

| Modo | Quando | Como |
|---|---|---|
| `direto` | blocos (documento com composição raiz) | `hyperframes render -c compositions/<item>.html --variables` |
| `host` | componentes-documento e itens que carregam assets "ao lado de si" (`assetUrl`) | gera `_render-<item>.html` que monta o item com `data-composition-src` + `data-variable-values` |
| `trecho` | componentes sem documento (marcação + CSS + script) | gera cena hospedeira, cola o trecho e monta a timeline a partir do comentário "Timeline integration" |

MP4 sai com fundo azul da marca (`--fundo` muda); MOV/WebM saem transparentes.

## Armadilhas resolvidas (não repetir)

- **CDN bloqueado**: o compilador do HyperFrames troca por CDN qualquer GSAP cujo caminho não exista *em relação à pasta
  do projeto* (`rewriteUnresolvableGsapToCdn`). Caminhos `../vendor` ou `/vendor` falham; use `./vendor/...`
  (resolvível pelo compilador e especificador válido de módulo ES).
- `three` via `+esm` do jsDelivr não existe no npm → mapeado para `build/three.module.js` + `importmap` para os addons.
- Overlays (neve, partículas) são transparentes: em MP4 o fundo vira branco → testar/entregar com alfa (MOV) e compor.
- Montado num host, o runtime clona só o `<body>` do item; o host replica o `<head>` (estilos, importmap, scripts).
- Cenas 3D pesadas (wireframe-portal-title) travam no modo host (inicialização dupla) → modo direto.
- Fichas "blueprint" de transição (painel lateral com nome/prompt) não servem como vídeo: use `transicao-shader`.
- Blocos de transição/câmera do registro animam **conteúdo de exemplo**; para usar com sua mídia, edite o HTML do bloco.
- Itens com assets em `static.heygen.ai` não instalam (rede bloqueada): carousel-orbit-*, frost-sequence-camera-orbit, glass-shard-title.
- Ícones/logos de terceiros nas demos (Instagram, Gmail, ChatGPT…) e modelos 3D de aparelhos: não usar marcas de terceiros
  em peças do escritório sem avaliar direito de marca; troque por elementos próprios.

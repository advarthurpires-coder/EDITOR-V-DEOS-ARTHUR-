# Catálogo de efeitos e recursos — Estúdio Arthur

> Gerado automaticamente a partir de `catalogo/catalogo.json` por `python3 scripts/catalogo.py md`. Não edite à mão.

Atualizado em 2026-11-05 · **330 itens** · ✅ 113 implementados · 🔌 90 por integração · 📋 127 catalogados

| Ícone | Status | Significado |
|---|---|---|
| ✅ | implementado | Existe no repositório e foi testado (comando/componente indicado em como_usar). |
| 🔌 | integracao | Disponível numa ferramenta instalada (bloco do registro HyperFrames, filtro FFmpeg, recurso Remotion), sem componente próprio nosso ainda. |
| 📋 | catalogado | Apenas planejado/documentado; requer desenvolvimento, modelo de IA ou biblioteca externa. |

Busca rápida: `python3 scripts/catalogo.py buscar <termo> [--status implementado]`

## 1. Transições cinematográficas

✅ 7 · 🔌 15 · 📋 5

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| ✅ | **Smooth Zoom In / Out** | Zoom de entrada/saída que funde as duas tomadas. | ffmpeg, hyperframes | `python3 scripts/estudio.py transicao a.mp4 b.mp4 out.mp4 --tipo zoom \| HF: hyperframes add cinematic-zoom` — --duracao (s) |
| 🔌 | **Zoom Through Cut** | Avança a câmera através do quadro até a próxima cena. | hyperframes | `hyperframes add zoom-through-transition` |
| 🔌 | **Whip Pan** | Chicote de câmera com borrão direcional entre cenas. | hyperframes | `hyperframes add whip-pan  \|  hyperframes add whip-pan-cut` |
| ✅ | **Motion Blur Transition** | Transição com desfoque de movimento horizontal. | ffmpeg, hyperframes | `python3 scripts/estudio.py transicao a b out --tipo desfoque \| HF: hyperframes add transitions-blur` — --duracao |
| 📋 | **Speed Ramp Transition** | Acelera o fim da cena A e desacelera o início da B, mascarando o corte. | ffmpeg, remotion | Requer rampa de velocidade variável (não implementada). |
| 🔌 | **Seamless Match Cut** | Corte entre formas/movimentos equivalentes em cenas diferentes. | hyperframes | `hyperframes add match-cut  \|  hyperframes add text-match-cut  \|  hyperframes add type-match-cut` |
| 📋 | **Invisible Cut** | Corte escondido num elemento que cobre o quadro (parede, passante). | remotion, ffmpeg | Depende da captação planejada e de máscara. |
| ✅ | **Mask Transition** | Revela a próxima cena por uma máscara geométrica (círculo, íris, radial). | ffmpeg, hyperframes | `python3 scripts/estudio.py transicao a b out --tipo circulo-abre\|radial \| HF: hyperframes add iris-reveal` — Formas: circulo-abre, circulo-fecha, radial |
| 📋 | **Object Wipe** | Um objeto em cena passa pela câmera e serve de cortina. | remotion | Requer segmentação/rotoscopia do objeto. |
| 🔌 | **Light Leak Transition** | Vazamento de luz quente que funde as cenas. | hyperframes | `hyperframes add light-leak  \|  hyperframes add organic-light-leak-overlay` |
| 🔌 | **Film Burn** | Queima de película entre cenas. | hyperframes | `hyperframes add ridged-burn (verificar visual)` |
| 🔌 | **Glitch Transition** | Transição digital com falhas e deslocamentos. | hyperframes, ffmpeg | `hyperframes add glitch  \|  aproximação: python3 scripts/estudio.py transicao --tipo pixel` |
| 🔌 | **RGB Split** | Separação dos canais RGB durante a troca. | hyperframes, ffmpeg | `hyperframes add chromatic-aberration-wipe \| hyperframes add chromatic-radial-split \| efeito: python3 scripts/estudio.py vfx --efeito aberracao` |
| ✅ | **Flash Cut** | Corte com clarão branco. | ffmpeg, hyperframes | `python3 scripts/estudio.py transicao a b out --tipo flash --duracao 0.3 \| HF: hyperframes add flash-through-white` |
| 📋 | **Spin Transition** | Giro rápido da imagem na troca de cena. | remotion, hyperframes | Ver transitions-3d no registro para alternativa. |
| 🔌 | **Camera Shake Cut** | Corte acompanhado de tremor de câmera (impacto). | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito tremor no clipe + corte \| HF: hyperframes add camera-shake \| Remotion: TremorCamera` |
| ✅ | **Push / Slide / Swipe** | Uma cena empurra/desliza a outra para fora do quadro. | ffmpeg, remotion, hyperframes | `python3 scripts/estudio.py transicao a b out --tipo slide-esquerda\|push-esquerda \| Remotion: slide() (Vitrine.tsx)` — direção: esquerda/direita/cima/baixo |
| 🔌 | **Parallax Transition** | Camadas se movem em velocidades diferentes na troca. | hyperframes | `hyperframes add parallax-zoom  \|  hyperframes add parallax-unzoom` |
| 🔌 | **Liquid Morph** | Distorção líquida que deforma uma cena na outra. | hyperframes | `hyperframes add cross-warp-morph  \|  hyperframes add domain-warp-dissolve` |
| 🔌 | **Portal Transition** | Abertura de portal que revela a próxima cena. | hyperframes | `hyperframes add vfx-portal` |
| 🔌 | **Paper Tear** | Rasgo de papel revelando a próxima cena. | hyperframes | `hyperframes add torn-paper-rip` |
| 🔌 | **Glass Shatter** | Imagem se estilhaça como vidro. | hyperframes | `hyperframes add vfx-shatter  \|  hyperframes add glass-shard-title` |
| 🔌 | **3D Cube Rotation** | Cenas nas faces de um cubo que gira. | hyperframes, remotion | `hyperframes add transitions-3d \| (Remotion flip() implementado na Vitrine — não é cubo)` |
| 📋 | **Luma Fade** | Dissolução guiada pela luminância (áreas claras primeiro). | ffmpeg | Aproximações disponíveis: --tipo fade-preto / fade-cinza. |
| 🔌 | **Morphing Transition** | Uma forma/elemento se transforma no seguinte. | hyperframes | `hyperframes add morph-swap  \|  hyperframes add facet-morph` |
| ✅ | **Fade / Dissolve** | Fusão clássica entre cenas (extra do catálogo). | ffmpeg, remotion | `python3 scripts/estudio.py transicao a b out --tipo fade\|dissolver\|fade-preto \| Remotion: fade()` |
| ✅ | **Wipe / Clock Wipe / Flip** | Cortinas lineares, relógio e virada 3D (extra do catálogo). | ffmpeg, remotion | `python3 scripts/estudio.py transicao --tipo wipe-esquerda \| Remotion: wipe(), clockWipe(), flip() em Vitrine.tsx` |

## 2. Movimentos de câmera e efeitos 3D

✅ 6 · 🔌 10 · 📋 6

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| 🔌 | **Orbit Camera** | Câmera orbitando um objeto/cena 3D. | hyperframes | `hyperframes add frost-sequence-camera-orbit \| hyperframes add three-orbiting-cards` — Para filmagem real: catalogado. |
| 🔌 | **Dolly Zoom / Vertigo** | Zoom óptico contrário ao deslocamento (efeito vertigem). | hyperframes | `hyperframes add camera-dolly-zoom` |
| ✅ | **Push In / Pull Back** | Aproximação/afastamento suave da câmera. | ffmpeg, remotion, hyperframes | `python3 scripts/estudio.py vfx --efeito zoom-in\|zoom-out \| python3 scripts/estudio.py foto --movimento push-in\|pull-back \| Remotion: KenBurns` — --intensidade (0.15 = 15% de zoom) |
| ✅ | **Digital Zoom** | Zoom digital (reenquadramento) sobre o vídeo. | ffmpeg, remotion | `python3 scripts/estudio.py vfx in out --efeito zoom-in --intensidade 1.5` |
| 📋 | **Camera Roll** | Rotação da câmera no eixo da lente. | ffmpeg, remotion | Simples de implementar (rotate) quando houver demanda. |
| 📋 | **Camera Tracking** | Câmera virtual que acompanha um ponto rastreado. |  | Requer rastreamento de movimento. |
| ✅ | **Handheld Camera** | Simula câmera na mão (oscilação lenta e orgânica). | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito handheld \| Remotion: <TremorCamera amplitude={6} velocidade={0.2}>` |
| ✅ | **Cinematic Camera Shake** | Tremor de impacto/ação. | ffmpeg, remotion, hyperframes | `python3 scripts/estudio.py vfx --efeito tremor --intensidade 1.5 \| Remotion: TremorCamera \| HF: hyperframes add camera-shake` |
| 🔌 | **3D Parallax** | Profundidade simulada com camadas em movimento. | hyperframes | `hyperframes add parallax-device-dive \| hyperframes add camera-rig-depth-stack` — Para fotos reais: requer mapa de profundidade (catalogado). |
| 🔌 | **Multi-Layer Parallax** | Várias camadas recortadas movendo-se em velocidades distintas. | hyperframes, remotion | `hyperframes add camera-rig-depth-stack \| hyperframes add caption-parallax-layers` |
| 🔌 | **Camera Fly Through** | Voo de câmera através de ambiente/galeria. | hyperframes | `hyperframes add gallery-tunnel \| hyperframes add scroll-camera-story` |
| 📋 | **Infinite Zoom** | Zoom contínuo que entra em imagem dentro de imagem. | remotion | Requer sequência de imagens encaixadas. |
| 📋 | **Perspective Shift** | Mudança de perspectiva/inclinação do plano. | remotion, hyperframes | Alternativa gráfica: tilt-card / split-tilt-cards. |
| 📋 | **Tilt Shift** | Faixa de foco com desfoque em cima/baixo (efeito miniatura). | ffmpeg | Viável com gblur + máscara de gradiente. |
| 🔌 | **Rack Focus** | Troca de foco entre planos. | hyperframes | `hyperframes add rack-focus \| hyperframes add focus-rack` |
| 🔌 | **Depth of Field** | Desfoque de profundidade de campo. | hyperframes | `hyperframes add focus-blur-resolve (elementos gráficos)` — Em filmagem: requer mapa de profundidade. |
| ✅ | **Dolly In / Dolly Out** | Aproximação/afastamento com sensação de deslocamento. | ffmpeg, remotion | `python3 scripts/estudio.py foto --movimento push-in\|pull-back \| Remotion: KenBurns` — Simulado por zoom (sem paralaxe real). |
| ✅ | **Virtual Drone Shot** | Simula voo de drone sobre uma foto (zoom + deriva). | ffmpeg, remotion | `python3 scripts/estudio.py foto foto.jpg out.mp4 --movimento drone \| Remotion: KenBurns movimento="drone"` |
| 🔌 | **Camera Follow** | Câmera acompanha um elemento (texto, cursor). | hyperframes | `hyperframes add caption-camera-follow \| hyperframes add cursor-zoom-follow` |
| 🔌 | **Zoom Reveal** | Afasta para revelar o contexto completo. | hyperframes | `hyperframes add pull-back-reveal \| hyperframes add ui-focus-zoom` |
| 📋 | **Frame Break** | Sujeito 'sai' da moldura do quadro. |  | Requer recorte do sujeito (segmentação). |
| 🔌 | **UI World** | Câmera navegando por interfaces em espaço 3D. | hyperframes | `hyperframes add ui-3d-reveal \| hyperframes add app-showcase` |

## 3. Motion graphics e animações de elementos

✅ 7 · 🔌 16 · 📋 2

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| ✅ | **Kinetic Hook** | Gancho inicial com texto de impacto animado. | remotion, hyperframes | `Remotion: Gancho em composicoes/ReelsJuridico.tsx \| HF: hyperframes add headline-slam` |
| 📋 | **Gravity Drop** | Elementos caem com gravidade e assentam. | remotion, hyperframes | Viável com spring/física; ainda não construído. |
| 🔌 | **Elastic Bounce** | Entrada elástica com quique. | remotion, hyperframes | `Remotion spring(damping baixo) \| HF: hyperframes add rubber-band-bumper` |
| ✅ | **Spring Animation** | Animação por mola (natural, com inércia). | remotion, hyperframes | `Remotion: spring() — usado em LowerThird, ChecklistAnimado, Gancho \| HF: hyperframes add spring-pop` |
| ✅ | **Overshoot** | Passa do ponto final e volta. | remotion, hyperframes | `Remotion: spring({config:{damping:11}}) (Gancho) \| HF: extended-keyframe` |
| ✅ | **Stagger Animation** | Itens entram em cascata. | remotion, hyperframes | `Remotion: ChecklistAnimado (intervaloFrames) \| HF: hyperframes add stagger-cascade` |
| 🔌 | **Morphing Shapes** | Formas que se transformam. | hyperframes | `hyperframes add facet-morph \| hyperframes add icon-morph-beat` |
| 🔌 | **Particle Explosion** | Explosão de partículas. | hyperframes | `hyperframes add caption-particle-burst \| hyperframes add char-slam-explode \| hyperframes add confetti` |
| 🔌 | **Floating Elements** | Elementos flutuando suavemente. | hyperframes | `hyperframes add drift-hold` |
| 🔌 | **Icon Impact** | Ícone entra com impacto e pulso. | hyperframes | `hyperframes add beat-accent \| hyperframes add badge-pop` |
| 🔌 | **Liquid Motion** | Movimento líquido/gooey. | hyperframes | `hyperframes add goo \| hyperframes add gooey-split \| hyperframes add vfx-liquid-background` |
| 🔌 | **Magnetic Motion** | Elementos atraídos magneticamente. | hyperframes | `hyperframes add magnetic-cursor \| hyperframes add vfx-magnetic` |
| 🔌 | **Animated Arrows** | Setas desenhadas à mão animadas. | hyperframes | `hyperframes add hw-arrow` |
| ✅ | **Progress Bars** | Barras de progresso. | remotion, hyperframes | `Remotion: BarraProgresso \| HF: hyperframes add mk-progress-stat \| hyperframes add conic-progress-ring` |
| ✅ | **Animated Checklists** | Lista com checks animados. | remotion, hyperframes | `Remotion: ChecklistAnimado \| HF: hyperframes add marker-checklist-card` |
| 🔌 | **Chart Grow** | Gráficos que crescem. | hyperframes | `hyperframes add animated-bar-chart \| hyperframes add data-chart \| hyperframes add mk-line-graph` |
| ✅ | **Data Counter** | Número contando até o valor final (pt-BR). | remotion, hyperframes | `Remotion: ContadorDados (prefixo 'R$ ', casas decimais) \| HF: hyperframes add count-up` |
| 🔌 | **Infographic Reveal** | Infográfico revelado em etapas. | hyperframes | `hyperframes add chart-story \| hyperframes add hw-pipeline \| hyperframes add flowchart` |
| 📋 | **Animated Timeline** | Linha do tempo animada (ex.: cronologia de um processo). | remotion | Alta utilidade jurídica — candidato prioritário. |
| 🔌 | **Doodle Boil** | Traço desenhado 'fervendo' (estilo rabisco). | hyperframes | `hyperframes add hw-boil` |
| 🔌 | **Paper Cut Animation** | Recortes de papel/colagem. | hyperframes | `hyperframes add paper-collage-reveal` |
| 🔌 | **Glassmorphism** | Cartões de vidro fosco. | hyperframes | `hyperframes add liquid-glass-widgets \| hyperframes add ios26-liquid-glass` |
| 🔌 | **Neon Glow Motion** | Contornos neon animados. | hyperframes | `hyperframes add lt-neon-border \| hyperframes add caption-neon-glow` |
| 🔌 | **3D Object Rotation** | Objeto/logo 3D girando. | hyperframes | `hyperframes add product-turntable \| hyperframes add extruded-logo` |
| 🔌 | **Follow Path Animation** | Elemento percorre um caminho. | hyperframes | `hyperframes add arc-motion-path \| hyperframes add offset-path-traveler` |

## 4. Legendas e tipografia animada

✅ 14 · 🔌 10 · 📋 2

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| 🔌 | **Kinetic Typography** | Tipografia cinética sincronizada com a fala. | hyperframes, remotion | `hyperframes add kinetic-center-build \| hyperframes add kinetic-type-swap` |
| ✅ | **Word by Word Captions** | Uma palavra por vez na tela. | remotion | `Remotion: <LegendaDinamica estilo="palavra" legendas={...}/>` — Entrada: Caption[] (estudio transcrever → *.legendas.json) |
| ✅ | **Karaoke Captions** | Palavras mudam de cor conforme são ditas. | remotion, hyperframes | `Remotion: LegendaDinamica estilo="karaoke" \| HF: hyperframes add caption-pill-karaoke` — corDestaque, agruparMs |
| ✅ | **Giant Captions** | Legendas gigantes em caixa-alta. | remotion, ffmpeg | `Remotion: estilo="gigante" \| python3 scripts/estudio.py legendar in.mp4 leg.srt out.mp4 --estilo gigante` |
| ✅ | **Pop-up Captions** | Legenda entra com 'pop' e palavra ativa ampliada. | remotion, hyperframes | `Remotion: estilo="pop" \| HF: hyperframes add caption-emoji-pop` |
| ✅ | **Subtitle Bounce** | Legenda com quique na entrada. | remotion | `Remotion: estilo="pop" (spring com overshoot)` |
| ✅ | **Typewriter Effect** | Texto digitado letra a letra com cursor. | remotion, hyperframes | `Remotion: MaquinaEscrever \| HF: hyperframes add typewriter` |
| ✅ | **Highlight Words** | Palavras-chave destacadas. | remotion, hyperframes | `Remotion: estilo="destaque" \| HF: hyperframes add caption-highlight \| hyperframes add marker-highlight` |
| 📋 | **Word Shake** | Palavra treme para ênfase. | remotion | Fácil de adicionar como estilo da LegendaDinamica. |
| ✅ | **Text Tracking** | Espaçamento entre letras abrindo. | remotion, hyperframes | `Remotion: TituloCinematico \| HF: hyperframes add tracking-in` |
| ✅ | **Text Reveal** | Texto revelado do desfoque ao foco. | remotion, hyperframes | `Remotion: TituloCinematico \| HF: hyperframes add soft-blur-in \| hyperframes add bottom-up-letters` |
| 🔌 | **Masked Text** | Texto como máscara de imagem/vídeo. | hyperframes | `hyperframes add texture-mask-text \| hyperframes add svg-mask-reveal` |
| 🔌 | **3D Typography** | Tipografia com volume 3D. | hyperframes | `hyperframes add wireframe-portal-title \| hyperframes add code-3d-extrude` |
| 🔌 | **Glass Type** | Letras de vidro. | hyperframes | `hyperframes add glass-shard-title` |
| 🔌 | **Neon Text** | Texto neon. | hyperframes | `hyperframes add caption-neon-glow \| hyperframes add caption-neon-accent` |
| 📋 | **Text Behind Subject** | Texto atrás da pessoa. |  | Requer recorte do sujeito por IA (modelo não instalado). |
| 🔌 | **Text Explosion** | Letras explodem/se dispersam. | hyperframes | `hyperframes add char-slam-explode \| hyperframes add particle-text-dissolve` |
| 🔌 | **Rolling Text** | Texto rolando (slot machine/letreiro). | hyperframes | `hyperframes add slot-machine-roll \| hyperframes add ticker-takeover \| hyperframes add news-ticker` |
| 🔌 | **Gradient Typography** | Texto com preenchimento em degradê. | hyperframes | `hyperframes add caption-gradient-fill` |
| 🔌 | **Glitch Typography** | Texto com falha digital. | hyperframes | `hyperframes add rgb-glitch-text \| hyperframes add caption-glitch-rgb` |
| ✅ | **Subtitle Progress** | Barra de progresso de retenção. | remotion | `Remotion: BarraProgresso (topo/base)` |
| 🔌 | **Dynamic Emoji Captions** | Emojis contextuais junto às legendas. | hyperframes | `hyperframes add caption-emoji-pop` |
| ✅ | **Highlight Box Captions** | Palavra ativa dentro de caixa colorida. | remotion, ffmpeg | `Remotion: estilo="destaque" \| python3 scripts/estudio.py legendar --estilo caixa` |
| ✅ | **Lower Thirds** | Tarja com nome e cargo. | remotion, hyperframes | `Remotion: LowerThird \| HF: lt-clean-bar, lt-mask-reveal, lt-side-rule e outras 8 variações` |
| ✅ | **Cinematic Titles** | Títulos cinematográficos. | remotion, hyperframes | `Remotion: TituloCinematico \| HF: hyperframes add titlecard-calm \| hyperframes add titlecard-lockup` |
| ✅ | **Legendas estáticas SRT queimadas** | Legenda SRT tradicional gravada na imagem (extra). | ffmpeg | `python3 scripts/estudio.py legendar in.mp4 leg.srt out.mp4 --estilo classico\|reels\|gigante\|caixa` |

## 5. Efeitos visuais (VFX)

✅ 11 · 🔌 5 · 📋 11

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| ✅ | **Green Screen / Chroma Key** | Remove fundo verde/azul e aplica novo fundo. | ffmpeg | `python3 scripts/estudio.py chroma pessoa.mp4 fundo.jpg out.mp4 --cor 0x00FF00` — --similaridade, --suavidade |
| ✅ | **Background Replacement** | Troca o fundo do vídeo. | ffmpeg | `python3 scripts/estudio.py chroma ... (requer fundo chapado)` — Sem fundo chapado: depende de IA (catalogado). |
| 📋 | **Background Removal** | Remove o fundo sem tela verde (IA). | hyperframes | Skill /media-use oferece; depende de modelo/serviço externo. |
| 📋 | **Object Removal** | Apaga objetos indesejados. |  | Logotipos estáticos: filtro delogo do FFmpeg (não encapsulado). |
| 📋 | **Object Tracking** | Rastreia um objeto pelo vídeo. |  |  |
| 📋 | **Face Tracking** | Rastreia o rosto (para zoom, desfoque, reenquadramento). |  | Útil para anonimizar partes (LGPD). |
| 📋 | **Motion Tracking** | Prende elementos gráficos a um ponto em movimento. |  |  |
| 📋 | **Rotoscoping** | Recorte quadro a quadro do sujeito. |  |  |
| ✅ | **Glow Effect** | Brilho difuso nas áreas claras. | ffmpeg | `python3 scripts/estudio.py vfx --efeito glow --intensidade 1` |
| ✅ | **Bloom** | Halo de luz nas altas luzes. | ffmpeg | `python3 scripts/estudio.py vfx --efeito glow (mesma técnica)` |
| 🔌 | **Lens Flare** | Reflexo de lente. | hyperframes | `hyperframes add lens-flare \| hyperframes add vfx-anamorphic-flare` |
| ✅ | **Chromatic Aberration** | Franjas coloridas nas bordas. | ffmpeg | `python3 scripts/estudio.py vfx --efeito aberracao` |
| ✅ | **VHS / Analog Noise** | Fita VHS: ruído, linhas, cores lavadas, deslocamento RGB. | ffmpeg | `python3 scripts/estudio.py vfx --efeito vhs` |
| ✅ | **Film Grain** | Grão de película. | ffmpeg, remotion, hyperframes | `python3 scripts/estudio.py vfx --efeito grao \| Remotion: GraoFilme \| HF: hyperframes add grain-overlay` |
| 🔌 | **Retro Camcorder** | Visual de filmadora antiga com HUD. | hyperframes, ffmpeg | `hyperframes add camcorder-hud + python3 scripts/estudio.py vfx --efeito vhs` |
| 🔌 | **Hologram Effect** | Holograma. | hyperframes | `hyperframes add hologram` |
| 📋 | **Double Exposure** | Dupla exposição de duas imagens. | ffmpeg | Viável com blend=screen (não encapsulado). |
| ✅ | **Ghost Trail** | Rastro fantasma do movimento. | ffmpeg, hyperframes | `python3 scripts/estudio.py vfx --efeito rastro \| HF: hyperframes add echo-trail` |
| ✅ | **Freeze Frame** | Congela um quadro por N segundos. | ffmpeg, hyperframes | `python3 scripts/estudio.py congelar in.mp4 out.mp4 --em 2.0 --duracao 1.5 \| HF: hyperframes add freeze-frame-dressing` |
| 📋 | **Pixel Sorting** | Ordenação de pixels (glitch art). |  |  |
| 📋 | **Displacement** | Deformação por mapa de deslocamento. | ffmpeg | FFmpeg possui displace (não encapsulado). |
| 🔌 | **Heat Distortion** | Distorção de calor. | hyperframes | `hyperframes add thermal-distortion (transição)` |
| 📋 | **Smoke Overlay** | Fumaça sobreposta. |  | Requer banco de overlays licenciados. |
| 📋 | **Fire Particles** | Partículas de fogo/brasas. |  |  |
| 🔌 | **Rain / Snow Effects** | Chuva ou neve. | hyperframes | `hyperframes add snow (neve). Chuva: catalogado.` |
| ✅ | **Vignette** | Escurecimento das bordas. | ffmpeg, remotion, hyperframes | `python3 scripts/estudio.py vfx --efeito vinheta \| Remotion: Vinheta \| HF: hyperframes add vignette` |
| ✅ | **Color Isolation** | Mantém uma cor e dessatura o resto. | ffmpeg | `python3 scripts/estudio.py vfx --efeito isolar-cor --cor red` |

## 6. Estilos de edição

✅ 0 · 🔌 0 · 📋 24

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| 📋 | **Cinematic Editing** | Ritmo contido, planos longos, grade cinematográfica, letterbox opcional. | ffmpeg, remotion | `Receita: cor cinematic + vinheta + grão leve + fades + TituloCinematico` |
| 📋 | **Documentary Style** | Narração, B-roll, entrevistas com lower thirds, ritmo pausado. |  | `Receita: LowerThird + Ken Burns em fotos + cor matte` |
| 📋 | **Hollywood Trailer** | Cartelas, braams, risers, cortes no impacto, crescendo. |  | `Receita: sfx braam/riser/impacto + flash + TituloCinematico + dark-moody` |
| 📋 | **Luxury / Premium** | Movimentos lentos, tipografia serifada, dourado, muito respiro. |  | `Receita: luxo-dourado + Playfair + push-in lento + fade` |
| 📋 | **Minimalist Clean** | Fundo limpo, pouca cor, tipografia simples. | hyperframes | `Blocos HF mk-* (minimal/professional)` |
| 📋 | **Corporate Professional** | Sóbrio, institucional, dados e logotipo. | hyperframes, remotion | `ContadorDados + LowerThird + mk-* blocks` |
| 📋 | **Dark Cinematic** | Baixa luz, contraste alto, tons frios. | ffmpeg | `Receita: dark-moody + vinheta + drone sfx` |
| 📋 | **Motivational / Inspirational** | Música crescente, frases de impacto, câmera lenta. |  |  |
| 📋 | **Emotional Storytelling** | Narrativa com depoimento, close, trilha suave. |  |  |
| 📋 | **Epic Adventure** | Planos amplos, drone, trilha épica. |  |  |
| 📋 | **Fast-Paced Reels** | Cortes a cada 1–2 s, legendas dinâmicas, zooms de ênfase. |  | `Receita: silencio + LegendaDinamica pop + vfx zoom-in + whoosh` |
| 📋 | **Podcast Highlights** | Trechos de podcast com legendas e waveform. |  |  |
| 📋 | **Talking Head Dynamic** | Fala para câmera com punch-ins, legendas e B-roll. |  | `Receita: silencio + ReelsJuridico + zoom-in alternado` |
| 📋 | **Alex Hormozi Style** | Inspirado no ritmo do criador: legendas grandes centrais, palavras-chave coloridas, cortes secos. |  | `Receita: LegendaDinamica gigante/destaque + jump cuts + pop sfx (sem copiar marca alheia)` |
| 📋 | **MrBeast-Inspired Pacing** | Ritmo muito rápido, ganchos a cada poucos segundos, retenção máxima. |  | `Inspiração de ritmo apenas, sem elementos de terceiros.` |
| 📋 | **Social Media Viral** | Gancho em 1 s, legendas, CTA. |  |  |
| 📋 | **Retro Vintage** | Cores lavadas, grão, VHS ou película. | ffmpeg | `Receita: vintage-kodak + grao \| vhs` |
| 📋 | **Cyberpunk / Futuristic** | Neon, glitch, magenta/ciano. | hyperframes |  |
| 📋 | **Editorial Fashion** | Tipografia editorial, cortes no ritmo, flashes. | hyperframes |  |
| 📋 | **Wedding Cinematic** | Câmera lenta, tons quentes, trilha emotiva. |  |  |
| 📋 | **Travel Vlog** | Drone, transições de movimento, mapas. | hyperframes |  |
| 📋 | **Sports Highlights** | Cortes rápidos, câmera lenta nos lances, placares. |  |  |
| 📋 | **Real Estate Luxury** | Movimentos lentos, grade limpa, ficha técnica. |  |  |
| 📋 | **Testimonial Editing** | Depoimento com lower third e B-roll. |  | `Atenção ao Provimento 205/2021 (depoimentos de clientes).` |

## 7. Composições, interfaces e mockups

✅ 2 · 🔌 16 · 📋 8

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| 🔌 | **Phone Mockup** | Vídeo dentro de um celular. | hyperframes | `hyperframes add device-frame-stage \| hyperframes add vfx-iphone-device` |
| 🔌 | **Laptop Mockup** | Vídeo dentro de um notebook. | hyperframes | `hyperframes add multi-device-splay (verificar variação laptop)` |
| 🔌 | **Browser Window** | Janela de navegador animada. | hyperframes | `hyperframes add browser-device-stage` |
| 🔌 | **App Interface Animation** | Fluxos de app animados. | hyperframes | `hyperframes add app-showcase \| hyperframes add onboarding-stepper-flow` |
| 🔌 | **Social Media Feed** | Feed rolando. | hyperframes | `hyperframes add scroll-feed` |
| 📋 | **Scrolling Reels Grid** | Grade de vídeos rolando. |  |  |
| 🔌 | **Instagram Comment Pop-up** | Comentário surgindo na tela. | hyperframes | `hyperframes add yt-comment-card (adaptar visual)` |
| 📋 | **Falling Comments** | Comentários caindo/empilhando. | hyperframes | Alternativa: notification-pileup. |
| 🔌 | **Chat Bubble Animation** | Balões de conversa. | hyperframes | `hyperframes add chat-message \| hyperframes add chat-thread \| hyperframes add message-thread-reveal` |
| 🔌 | **Notification Pop** | Notificação surgindo. | hyperframes | `hyperframes add native-notification-pop \| hyperframes add macos-notification` |
| 🔌 | **Prompt Bar** | Barra de prompt sendo digitada. | hyperframes | `hyperframes add typed-prompt` |
| 🔌 | **Search Bar Animation** | Busca sendo digitada. | hyperframes | `hyperframes add typed-prompt (adaptar)` |
| 🔌 | **Drag and Drop File** | Arquivo arrastado e solto. | hyperframes | `hyperframes add cursor-drag-drop` |
| 📋 | **Editor Timeline Simulation** | Simulação de linha do tempo de editor. |  |  |
| 📋 | **Storyboard Animation** | Quadros de storyboard animados. |  |  |
| 📋 | **Couch Wall** | Termo das referências do usuário — definição a confirmar. |  | Confirmar com o Dr. Arthur o que é esperado. |
| 📋 | **Headline Wall** | Mural de manchetes. | hyperframes | Alternativa: mk-clone-wall-transition. |
| 📋 | **Cover Story** | Composição estilo capa de revista. |  |  |
| 🔌 | **Pull-Back Reveal** | Afasta revelando o conjunto. | hyperframes | `hyperframes add pull-back-reveal` |
| 🔌 | **Floating Screens** | Telas flutuando no espaço. | hyperframes | `hyperframes add multi-device-splay \| hyperframes add three-orbiting-cards` |
| ✅ | **Split Screen** | Tela dividida. | ffmpeg, hyperframes | `python3 scripts/estudio.py split a.mp4 b.mp4 out.mp4 --orientacao h\|v \| HF: hyperframes add comparison-split` |
| ✅ | **Picture in Picture** | Vídeo menor sobre o principal. | ffmpeg | `python3 scripts/estudio.py pip principal.mp4 sec.mp4 out.mp4 --posicao inf-dir --escala 0.3` — --borda, --cor-borda, --margem |
| 🔌 | **Video Collage** | Mosaico de vídeos. | hyperframes | `hyperframes add mk-placeholder-grid \| hyperframes add paper-collage-reveal` |
| 🔌 | **3D Gallery Wall** | Galeria 3D de imagens. | hyperframes | `hyperframes add gallery-tunnel \| hyperframes add carousel-orbit-1..5` |
| 📋 | **Infinite Video Grid** | Grade infinita de vídeos. |  |  |
| 🔌 | **Glass UI Cards** | Cartões de interface de vidro. | hyperframes | `hyperframes add liquid-glass-widgets` |

## 8. Cortes e técnicas de montagem

✅ 10 · 🔌 3 · 📋 9

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| ✅ | **Jump Cut** | Cortes dentro da mesma tomada (remove pausas). | ffmpeg | `python3 scripts/estudio.py silencio in.mp4 out.mp4 --limiar -35dB --minimo 0.45` — --margem (respiro) |
| 📋 | **J-Cut** | Áudio da próxima cena começa antes da imagem. | remotion, ffmpeg | Viável no Remotion com <Audio> deslocado. |
| 📋 | **L-Cut** | Áudio da cena anterior continua sobre a próxima imagem. | remotion, ffmpeg |  |
| 🔌 | **Match Cut** | Corte por correspondência visual. | hyperframes | `hyperframes add match-cut` |
| ✅ | **Smash Cut** | Corte abrupto para contraste forte. | ffmpeg | `python3 scripts/estudio.py juntar out.mp4 a.mp4 b.mp4 (+ python3 scripts/estudio.py sfx impacto)` |
| ✅ | **Hard Cut** | Corte seco. | ffmpeg | `python3 scripts/estudio.py cortar / juntar` |
| 📋 | **Cut on Action** | Corte no meio de um movimento. |  | Técnica editorial; requer análise das tomadas. |
| 🔌 | **Beat Cut** | Cortes no tempo da música. | hyperframes | `hyperframes beats <projeto> (detecta batidas) \| HF: beat-freeze-cut` |
| ✅ | **Montage Sequence** | Sequência de planos curtos com transições. | ffmpeg, remotion | `python3 scripts/estudio.py juntar + python3 scripts/estudio.py transicao \| Remotion TransitionSeries` |
| 📋 | **Speed Ramp** | Variação progressiva de velocidade. | ffmpeg | Hoje só velocidade constante por trecho. |
| ✅ | **Slow Motion** | Câmera lenta (com interpolação opcional). | ffmpeg | `python3 scripts/estudio.py velocidade in out --fator 0.5 --suave` |
| ✅ | **Fast Motion** | Acelerado. | ffmpeg | `python3 scripts/estudio.py velocidade in out --fator 2` |
| ✅ | **Reverse Playback** | Reprodução reversa. | ffmpeg | `python3 scripts/estudio.py velocidade in out --reverso` |
| ✅ | **Freeze Frame Cut** | Congela no corte. | ffmpeg, hyperframes | `python3 scripts/estudio.py congelar \| HF: hyperframes add beat-freeze-cut` |
| 📋 | **Multi-Camera Cut** | Alterna entre câmeras sincronizadas. |  |  |
| 📋 | **Reaction Cut** | Corte para a reação. |  | PiP/split já implementados podem servir de base. |
| 📋 | **B-Roll Insert** | Insere imagens de apoio sobre a fala. | remotion | Candidato prioritário (componente de sobreposição temporizada). |
| 📋 | **Cutaway** | Corte para detalhe/contexto. |  |  |
| 🔌 | **Rhythm Editing** | Edição guiada pelo ritmo. | hyperframes | `hyperframes beats` |
| 📋 | **Time Remapping** | Remapeamento de tempo por curvas. |  |  |
| ✅ | **Trim / Cortar trecho** | Recorte preciso de início e fim (extra). | ffmpeg | `python3 scripts/estudio.py cortar in.mp4 out.mp4 --inicio 12.5 --fim 40` |
| ✅ | **Smart Scene Detection** | Detecta trocas de cena (extra). | ffmpeg | `python3 scripts/estudio.py cenas in.mp4 --limiar 0.3` |

## 9. Color grading e tratamentos de imagem

✅ 18 · 🔌 0 · 📋 5

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| ✅ | **Hollywood Cinematic LUT** | Look cinematográfico (preset) ou LUT .cube própria. | ffmpeg | `python3 scripts/estudio.py cor in out --preset cinematic \| --lut arquivo.cube` — --intensidade 0..1 |
| ✅ | **Teal and Orange** | Sombras azuladas, pele/altas alaranjadas. | ffmpeg | `python3 scripts/estudio.py cor --preset teal-orange` |
| ✅ | **Dark Moody** | Escuro, dessaturado, frio. | ffmpeg | `python3 scripts/estudio.py cor --preset dark-moody` |
| ✅ | **Warm Film** | Película quente. | ffmpeg | `python3 scripts/estudio.py cor --preset warm-film` |
| ✅ | **Golden Hour** | Luz dourada de fim de tarde. | ffmpeg | `python3 scripts/estudio.py cor --preset golden-hour` |
| ✅ | **Black and White** | Preto e branco contrastado. | ffmpeg | `python3 scripts/estudio.py cor --preset pb` |
| ✅ | **High Contrast** | Contraste alto. | ffmpeg | `python3 scripts/estudio.py cor --preset alto-contraste` |
| ✅ | **Matte Film Look** | Pretos levantados, altas suavizadas. | ffmpeg | `python3 scripts/estudio.py cor --preset matte` |
| ✅ | **Vintage Kodak Look** | Aparência de filme vintage. | ffmpeg | `python3 scripts/estudio.py cor --preset vintage-kodak` — Aproximação; emulação fiel exige LUT. |
| ✅ | **Film Emulation** | Emulação de película por LUT. | ffmpeg | `python3 scripts/estudio.py cor --lut pelicula.cube` — LUTs licenciadas não incluídas. |
| ✅ | **Pastel Soft** | Tons pastel suaves. | ffmpeg | `python3 scripts/estudio.py cor --preset pastel` |
| ✅ | **Luxury Gold** | Dourado elegante com vinheta. | ffmpeg | `python3 scripts/estudio.py cor --preset luxo-dourado` |
| ✅ | **Cold Blue** | Tons frios azulados. | ffmpeg | `python3 scripts/estudio.py cor --preset azul-frio` |
| ✅ | **Desaturated Drama** | Pouca saturação, muito contraste. | ffmpeg | `python3 scripts/estudio.py cor --preset drama-dessaturado` |
| ✅ | **HDR Look** | Aparência HDR (nitidez + contraste local simulado). | ffmpeg | `python3 scripts/estudio.py cor --preset hdr-look` |
| 📋 | **Skin Tone Correction** | Correção de tom de pele. |  |  |
| 📋 | **Exposure Matching** | Igualar exposição entre câmeras/tomadas. | ffmpeg | Parcial: --preset correcao-auto (normalize). |
| 📋 | **White Balance Matching** | Igualar balanço de branco. |  |  |
| 📋 | **Selective Color** | Ajuste de uma faixa de cor. | ffmpeg | FFmpeg selectivecolor (não encapsulado). |
| ✅ | **Color Isolation** | Isolar uma cor. | ffmpeg | `python3 scripts/estudio.py vfx --efeito isolar-cor --cor red` |
| ✅ | **Vignette** | Vinheta. | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito vinheta \| python3 scripts/estudio.py cor --vinheta` |
| 📋 | **Highlight Roll-Off** | Transição suave nas altas luzes. |  |  |
| ✅ | **Correção automática** | Normaliza pretos/brancos automaticamente (extra). | ffmpeg | `python3 scripts/estudio.py cor --preset correcao-auto` |

## 10. Efeitos sonoros (SFX)

✅ 16 · 🔌 0 · 📋 8

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| ✅ | **Whoosh** | Passagem de ar para transições (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx whoosh saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Cinematic Impact** | Impacto grave com ataque (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx impacto saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Bass Drop** | Queda de grave. | ffmpeg | `python3 scripts/estudio.py sfx sub-boom saida.wav` — Mesmo gerador do Sub Boom. Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Sub Boom** | Grave profundo com queda de afinação (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx sub-boom saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Riser** | Tensão crescente (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx riser saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Reverse Riser** | Sucção/reverso antes do corte (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx riser-reverso saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Glitch Sound** | Falha digital (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx glitch saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Digital Click** | Clique curto (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx clique saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| 📋 | **Camera Shutter** | Obturador de câmera. |  | Requer biblioteca. |
| 📋 | **Typing Keyboard** | Digitação. |  |  |
| ✅ | **Notification Pop** | Duas notas de notificação (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx notificacao saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **UI Hover** | Pop curto para elementos de UI (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx pop saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Swipe Sound** | Deslizar. | ffmpeg | `python3 scripts/estudio.py sfx whoosh saida.wav --duracao 0.4` — Whoosh curto. Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Transition Sweep** | Varredura de transição. | ffmpeg | `python3 scripts/estudio.py sfx whoosh saida.wav --duracao 1.2` — Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| 📋 | **Paper Flip** | Virar página. |  |  |
| 📋 | **Glass Break** | Vidro quebrando. |  |  |
| 📋 | **Metallic Hit** | Batida metálica. |  |  |
| ✅ | **Heartbeat** | Batimentos cardíacos (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx batimento saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| 📋 | **Crowd Applause** | Aplausos. |  |  |
| 📋 | **Ambient Atmosphere** | Ambiência. |  |  |
| ✅ | **Cinematic Drone** | Pad grave contínuo de tensão (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx drone saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Braam** | Metais graves de trailer (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx braam saida.wav` — --duracao, --volume (pico normalizado em -3 dBFS) Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| ✅ | **Reverse Cymbal** | Prato reverso. | ffmpeg | `python3 scripts/estudio.py sfx riser-reverso saida.wav` — Aproximação sintetizada. Sintetizado por FFmpeg (qualidade de rascunho/uso leve). |
| 📋 | **Logo Sound Reveal** | Assinatura sonora de logotipo. |  | Ideal: compor uma assinatura própria do escritório. |

## 11. Voz, narração, música e edição de áudio

✅ 9 · 🔌 4 · 📋 9

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| 📋 | **AI Voiceover** | Narração por IA. | hyperframes | Skill /media-use (HeyGen/Kokoro) — depende de serviço ou modelo baixado. |
| 📋 | **Text to Speech (TTS)** | Texto em fala. | hyperframes | Kokoro local requer download de modelo (bloqueado na rede atual). |
| 📋 | **Voice Cloning (com autorização)** | Clonagem de voz mediante autorização expressa. |  | Exige consentimento documentado do titular da voz. |
| ✅ | **Automatic Transcription** *(teste pendente)* | Transcrição automática (whisper.cpp). | whisper | `python3 scripts/estudio.py transcrever in.mp4 --idioma pt` — --modelo, --prompt (vocabulário jurídico) Código pronto; teste real pendente: modelo Whisper não baixado (huggingface.co bloqueado). |
| 📋 | **Speaker Diarization** | Identifica quem fala. |  |  |
| ✅ | **Voice Enhancement** | Realce de voz (EQ + compressão). | ffmpeg | `python3 scripts/estudio.py audio in out --voz-eq --compressor` |
| ✅ | **Noise Reduction** | Redução de ruído. | ffmpeg | `python3 scripts/estudio.py audio in out --ruido --ruido-nivel -25` |
| 📋 | **Echo Reduction** | Redução de eco/reverberação. |  |  |
| ✅ | **Silence Removal** | Remove silêncios. | ffmpeg | `python3 scripts/estudio.py silencio in out` |
| ✅ | **Automatic Audio Ducking** | Música abaixa quando há voz. | ffmpeg | `python3 scripts/estudio.py ducking video.mp4 musica.mp3 out.mp4 --volume-musica 0.25` |
| ✅ | **Loudness Normalization** | Normalização de loudness (LUFS). | ffmpeg | `python3 scripts/estudio.py audio in out --lufs -14` — -14 redes · -16 podcast · -23 TV |
| ✅ | **Voice EQ** | Equalização de voz. | ffmpeg | `python3 scripts/estudio.py audio --voz-eq` |
| ✅ | **Audio Compression** | Compressão dinâmica. | ffmpeg | `python3 scripts/estudio.py audio --compressor` |
| 🔌 | **Beat Detection** | Detecta batidas da música. | hyperframes | `hyperframes beats <projeto>` |
| 🔌 | **Beat Synchronization** | Sincroniza cortes/animações com batidas. | hyperframes | `hyperframes beats + blocos beat-*` |
| ✅ | **Audio Fade In / Out** | Fades de áudio (e imagem opcional). | ffmpeg | `python3 scripts/estudio.py audio in out --fade-in 0.5 --fade-out 1 [--fade-video]` |
| 🔌 | **Music Crossfade** | Fusão entre músicas. | ffmpeg | `FFmpeg acrossfade (usado em transicao; não encapsulado para áudio puro)` |
| 📋 | **Background Ambience** | Ambiência de fundo. |  |  |
| 📋 | **Multilingual Dubbing** | Dublagem multilíngue. |  |  |
| 📋 | **Audio Translation** | Tradução do áudio. | whisper | whisper.cpp traduz apenas para inglês (-tr). |
| 🔌 | **Voice Pitch Shifting** | Altera o tom da voz. | ffmpeg | `FFmpeg asetrate + atempo (não encapsulado)` |
| 📋 | **Sound Design Layering** | Camadas de design sonoro. |  | Base: sfx sintetizados + amix. |

## 12. Edições inteligentes com IA

✅ 4 · 🔌 2 · 📋 18

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| 📋 | **AI Auto Edit** | Edição completa automática a partir de instrução. |  | Hoje: Claude orquestra estudio.py + templates manualmente. |
| ✅ | **Smart Scene Detection** | Detecção de cenas. | ffmpeg | `python3 scripts/estudio.py cenas in.mp4` |
| 📋 | **Automatic Highlight Extraction** | Extrai melhores trechos. | whisper | Viável: transcrição + análise do Claude + cortar. |
| 📋 | **AI Best Moments** | Melhores momentos. | whisper |  |
| 📋 | **Viral Hook Detection** | Identifica frases-gancho. | whisper | Viável a partir da transcrição. |
| 📋 | **Automatic B-Roll Suggestion** | Sugere B-roll. |  |  |
| 🔌 | **AI Cut on Beat** | Cortes no beat automáticos. | hyperframes | `hyperframes beats` |
| ✅ | **Smart Silence Removal** | Remoção inteligente de silêncio. | ffmpeg | `python3 scripts/estudio.py silencio` |
| ✅ | **AI Auto Captions** *(teste pendente)* | Legendas automáticas. | whisper, remotion | `python3 scripts/estudio.py transcrever → *.legendas.json → LegendaDinamica / python3 scripts/estudio.py legendar` — LegendaDinamica testada com legendas de exemplo; falta testar a etapa de transcrição (modelo Whisper). |
| 📋 | **Smart Caption Styling** | Estilo de legenda escolhido pelo conteúdo. |  |  |
| ✅ | **Automatic Reframing** | Reenquadra para outra proporção. | ffmpeg | `python3 scripts/estudio.py reframe in out --formato 9:16 --modo crop\|blur --foco-x 0.5` — Centro fixo/ajustável; sem rastreio de rosto. |
| 📋 | **Face-Centered Crop** | Corte centrado no rosto. |  | Requer detecção facial. |
| 📋 | **AI Video Summarization** | Resumo do vídeo. | whisper |  |
| 📋 | **Long Video to Shorts** | Vídeo longo em cortes curtos. | whisper, ffmpeg | Viável: transcrever → escolher trechos → cortar → reframe → legendar. |
| 📋 | **AI Storyboard Generation** | Storyboard gerado por IA. |  |  |
| 📋 | **AI Scene Classification** | Classifica cenas. |  |  |
| 📋 | **Automatic Color Matching** | Iguala cor entre tomadas. |  |  |
| 📋 | **Smart Sound Effects Placement** | Posiciona SFX automaticamente. |  |  |
| 📋 | **AI Music Suggestion** | Sugere trilha. |  |  |
| 🔌 | **AI Motion Graphics Selection** | Escolhe blocos de motion pelo conteúdo. | hyperframes | `hyperframes catalog --query "<descrição>"` |
| 📋 | **AI Quality Enhancement** | Melhoria de qualidade por IA. |  |  |
| 📋 | **Smart Video Upscaling** | Upscale por IA. |  | Upscale simples (lanczos) via exportar youtube-4k. |
| 📋 | **AI Content Repurposing** | Reaproveita conteúdo em vários formatos. |  |  |
| 📋 | **Automated Multi-Format Editing** | Exporta o mesmo vídeo em vários formatos. | ffmpeg | Hoje: rodar exportar para cada plataforma. |

## 13. Templates e formatos de vídeo

✅ 2 · 🔌 3 · 📋 15

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| ✅ | **Reels / TikTok / Shorts** | Vertical 1080x1920 com gancho, legendas, tarja, CTA e progresso. | remotion, ffmpeg | `Remotion: ReelsJuridico \| exportar --plataforma reels\|tiktok\|shorts` — props: video, gancho, legendas, estiloLegenda, nome, cargo, cta, duracaoSegundos |
| 📋 | **YouTube Long Form** | 16:9 longo com capítulos. |  |  |
| 🔌 | **YouTube Intro / Outro** | Abertura e encerramento. | remotion, hyperframes | `Remotion: Vinheta \| HF: hyperframes add yt-logo-intro \| hyperframes add logo-outro` |
| 📋 | **Podcast Clips** | Cortes de podcast. |  |  |
| 📋 | **Video Ads** | Anúncios. | hyperframes | Atenção às regras da OAB para publicidade. |
| 📋 | **Product Commercial** | Comercial de produto. |  |  |
| 📋 | **Event Aftermovie** | Resumo de evento. |  |  |
| 📋 | **Wedding Highlights** | Melhores momentos de casamento. |  |  |
| 📋 | **Testimonial** | Depoimento. |  |  |
| 📋 | **Documentary** | Documentário. |  |  |
| 📋 | **Educational Explainer** | Explicativo educacional. | hyperframes | Ver style-sampling (explainers). |
| 📋 | **News Report** | Formato telejornal. | hyperframes | Blocos: lower-third-bild, news-ticker. |
| 🔌 | **Corporate Presentation** | Apresentação institucional. | hyperframes | `Skill /slideshow` |
| 📋 | **Brand Story** | História da marca. |  |  |
| 📋 | **Motivational Reel** | Reel motivacional. |  |  |
| 📋 | **Religious / Worship Highlights** | Destaques de cultos/eventos religiosos. |  |  |
| 📋 | **Real Estate Showcase** | Vitrine de imóveis. |  |  |
| ✅ | **Legal Educational Content** | Conteúdo jurídico educativo (Provimento 205/2021). | remotion | `Remotion: ReelsJuridico + LegendaDinamica + LowerThird` |
| 🔌 | **Social Media Announcement** | Anúncio para redes. | hyperframes | `hyperframes add social-proof-card \| hyperframes add cta-lockup` |
| 📋 | **Countdown / Event Teaser** | Contagem regressiva. | remotion | ContadorDados aceita de=10 ate=0 como base. |

## 14. Recursos adicionais do editor

✅ 7 · 🔌 6 · 📋 5

| | Recurso | Descrição | Ferramentas | Como usar / observações |
|---|---|---|---|---|
| 🔌 | **Timeline com múltiplas trilhas** | Linha do tempo com trilhas. | remotion, hyperframes | `remotion studio \| hyperframes preview / hyperframes timeline` |
| 🔌 | **Editor de keyframes** | Edição de keyframes. | remotion, hyperframes | `hyperframes keyframes \| Remotion Studio` |
| 🔌 | **Controle de curvas de animação** | Easing e curvas. | remotion, hyperframes | `Remotion Easing / GSAP eases` |
| ✅ | **Biblioteca de presets** | Presets de cor, transição, legenda, plataforma e SFX. | ffmpeg, remotion | `python3 scripts/estudio.py <comando> -h lista os presets` |
| 🔌 | **Prévia em tempo real** | Pré-visualização interativa. | remotion, hyperframes | `npx remotion studio \| hyperframes preview --background` |
| 🔌 | **Histórico de alterações** | Histórico/versões. | git, hyperframes | `git log \| hyperframes history` |
| 🔌 | **Camadas de vídeo, texto e áudio** | Composição em camadas. | remotion, hyperframes | `Remotion <Sequence>/<AbsoluteFill> \| HTML do HyperFrames` |
| 📋 | **Editor de máscaras** | Edição de máscaras. |  |  |
| 📋 | **Editor de legendas** | Revisão de legendas. |  | Hoje: editar SRT/JSON gerados. |
| 📋 | **Editor de cores** | Ajuste fino de cor. |  | Hoje: presets + LUT. |
| ✅ | **Templates reutilizáveis** | Templates parametrizados. | remotion | `Remotion: ReelsJuridico, Vinheta, Vitrine` |
| ✅ | **Sistema de projetos** | Organização por projeto. | git | `projetos/<nome> + midia/brutos + midia/saida` |
| ✅ | **Controle de proporção e resolução** | Proporções e resoluções. | ffmpeg | `python3 scripts/estudio.py reframe / python3 scripts/estudio.py exportar` |
| 📋 | **Exportação em lote** | Vários formatos de uma vez. |  |  |
| ✅ | **Renderização 4K** | Exportação 3840x2160. | ffmpeg, remotion | `python3 scripts/estudio.py exportar --plataforma youtube-4k \| npx remotion render --scale 2` |
| ✅ | **Presets para redes sociais** | Resolução, fps, bitrate e loudness por plataforma. | ffmpeg | `python3 scripts/estudio.py exportar --plataforma reels\|tiktok\|shorts\|feed\|youtube\|linkedin\|whatsapp\|stories` |
| 📋 | **Biblioteca de trilhas e efeitos licenciados** | Banco de músicas/SFX licenciados. |  | SFX sintetizados disponíveis em categoria 10. |
| ✅ | **Gerenciamento de fontes e elementos gráficos** | Fontes e identidade. | remotion | `projetos/remotion-base/src/marca.ts (Inter + Playfair Display via @fontsource)` |

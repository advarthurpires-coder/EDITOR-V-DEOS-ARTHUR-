# Catálogo de recursos — Estúdio Arthur

> Gerado de `biblioteca/catalogo.json` por `python3 scripts/catalogo.py --md`. Não edite à mão.

**387 recursos** · ✅ 198 implementados · 🧪 7 exemplos executáveis · 🔌 28 por integração nativa · 📋 154 catalogados · 14 presets

| | Estado | Significado |
|---|---|---|
| ✅ | `implementado` | Código reutilizável no repositório, parametrizado e testado (ver `como_usar`). |
| 🧪 | `exemplo_executavel` | Demonstração em código (ex.: ArthurShowcase); não é componente genérico. |
| 🔌 | `integracao_nativa` | Disponível numa ferramenta instalada; requer adaptação e teste no projeto. |
| 📋 | `catalogado` | Apenas especificação — não implementado. |

Itens implementados marcados com *(teste pendente)* têm código pronto mas ainda sem validação real.

Busca: `python3 scripts/catalogo.py --buscar "<termo>" [--status implementado]`

## Transições cinematográficas (`transicoes`)

✅ 19 · 🧪 0 · 🔌 8 · 📋 5

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Fade** | Fusão clássica entre cenas (extra do catálogo). | ffmpeg, remotion | `python3 scripts/estudio.py transicao a b out --tipo fade\|dissolver\|fade-preto \| Remotion: fade()` |
| ✅ | **Smooth Zoom In** | Zoom de entrada/saída que funde as duas tomadas. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a.mp4 b.mp4 out.mp4 --tipo zoom \| HF: hyperframes add cinematic-zoom` |
| ✅ | **Smooth Zoom Out** | Zoom de entrada/saída que funde as duas tomadas. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a.mp4 b.mp4 out.mp4 --tipo zoom \| HF: hyperframes add cinematic-zoom` |
| 🔌 | **Zoom Through Cut** | Avança a câmera através do quadro até a próxima cena. | hyperframes, remotion | `python3 scripts/blocos.py renderizar zoom-through-transition demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: zoom-through-transition. |
| ✅ | **Whip Pan** | Chicote de câmera com borrão direcional entre cenas. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader whip-pan --duracao 0.8` |
| ✅ | **Motion Blur Transition** | Transição com desfoque de movimento horizontal. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a b out --tipo desfoque \| HF: hyperframes add transitions-blur` |
| 📋 | **Speed Ramp Transition** | Acelera o fim da cena A e desacelera o início da B, mascarando o corte. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **Seamless Match Cut** | Corte entre formas/movimentos equivalentes em cenas diferentes. | hyperframes, remotion | `python3 scripts/blocos.py renderizar match-cut demo.mp4 \| python3 scripts/blocos.py renderizar text-match-cut demo.mp4 \| python3 scripts/blocos.py renderizar type-match-cut demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: match-cut, text-match-cut, type-match-cut. |
| 📋 | **Invisible Cut** | Corte escondido num elemento que cobre o quadro (parede, passante). | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Mask Transition** | Revela a próxima cena por uma máscara geométrica (círculo, íris, radial). | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a b out --tipo circulo-abre\|radial \| HF: hyperframes add iris-reveal` |
| 📋 | **Object Wipe** | Um objeto em cena passa pela câmera e serve de cortina. | remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Light Leak Transition** | Vazamento de luz quente que funde as cenas. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader light-leak --duracao 0.8` |
| ✅ | **Film Burn** | Queima de película entre cenas. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader ridged-burn --duracao 0.8` |
| ✅ | **Glitch Transition** | Transição digital com falhas e deslocamentos. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader glitch --duracao 0.8` |
| ✅ | **RGB Split** | Separação dos canais RGB durante a troca. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader chromatic-radial-split --duracao 0.8` |
| ✅ | **Flash Cut** | Corte com clarão branco. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a b out --tipo flash --duracao 0.3 \| HF: hyperframes add flash-through-white` |
| 📋 | **Spin Transition** | Giro rápido da imagem na troca de cena. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Camera Shake Cut** | Corte acompanhado de tremor de câmera (impacto). | ffmpeg, hyperframes, remotion | `python3 scripts/blocos.py renderizar camera-shake saida.mp4 --var shakeProfile=… \| python3 scripts/blocos.py sobrepor video.mp4 camera-shake saida.mp4 --inicio 1` |
| ✅ | **Push Transition** | Uma cena empurra/desliza a outra para fora do quadro. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a b out --tipo slide-esquerda\|push-esquerda \| Remotion: slide() (Vitrine.tsx)` |
| ✅ | **Slide Transition** | Uma cena empurra/desliza a outra para fora do quadro. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a b out --tipo slide-esquerda\|push-esquerda \| Remotion: slide() (Vitrine.tsx)` |
| ✅ | **Swipe Transition** | Uma cena empurra/desliza a outra para fora do quadro. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao a b out --tipo slide-esquerda\|push-esquerda \| Remotion: slide() (Vitrine.tsx)` |
| 🔌 | **Parallax Transition** | Camadas se movem em velocidades diferentes na troca. | hyperframes, remotion | `hyperframes add parallax-zoom  \|  hyperframes add parallax-unzoom` — Disponível em ferramenta instalada (bloco/filtro/recurso nativo); requer adaptação e teste no projeto. |
| ✅ | **Liquid Morph** | Distorção líquida que deforma uma cena na outra. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader cross-warp-morph --duracao 0.8 \| python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader domain-warp-dissolve --duracao 0.8` |
| 🔌 | **Portal Transition** | Abertura de portal que revela a próxima cena. | hyperframes, remotion | `python3 scripts/blocos.py renderizar vfx-portal demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: vfx-portal. |
| 🔌 | **Paper Tear** | Rasgo de papel revelando a próxima cena. | hyperframes, remotion | `python3 scripts/blocos.py renderizar torn-paper-rip demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: torn-paper-rip. |
| 🔌 | **Glass Shatter** | Imagem se estilhaça como vidro. | hyperframes, remotion | `hyperframes add vfx-shatter  \|  hyperframes add glass-shard-title` — Instalação bloqueada pela rede (assets em static.heygen.ai): glass-shard-title. |
| 🔌 | **3D Cube Rotation** | Cenas nas faces de um cubo que gira. | hyperframes, remotion | `python3 scripts/blocos.py renderizar transitions-3d demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: transitions-3d. |
| 📋 | **Luma Fade** | Dissolução guiada pela luminância (áreas claras primeiro). | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **Morphing Transition** | Uma forma/elemento se transforma no seguinte. | hyperframes, remotion | `python3 scripts/blocos.py renderizar morph-swap demo.mp4 \| python3 scripts/blocos.py renderizar facet-morph demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: morph-swap, facet-morph. |
| ✅ | **Wipe** | Cortinas lineares, relógio e virada 3D (extra do catálogo). | ffmpeg, remotion | `python3 scripts/estudio.py transicao --tipo wipe-esquerda \| Remotion: wipe(), clockWipe(), flip() em Vitrine.tsx` |
| ✅ | **Iris Reveal** | Abertura circular (íris) revelando a próxima cena. | ffmpeg, remotion | `python3 scripts/estudio.py transicao a.mp4 b.mp4 out.mp4 --tipo circulo-abre \| HF: hyperframes add iris-reveal` |
| ✅ | **Ripple Transition** | Ondulação líquida que distorce a troca de cena. | ffmpeg, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader ripple-waves --duracao 0.8` |

## Câmera e profundidade 3D (`camera_3d`)

✅ 11 · 🧪 0 · 🔌 9 · 📋 7

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| 🔌 | **Orbit Camera** | Câmera orbitando um objeto/cena 3D. | hyperframes, remotion | `python3 scripts/blocos.py renderizar three-orbiting-cards demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: three-orbiting-cards. |
| 🔌 | **Dolly Zoom** | Zoom óptico contrário ao deslocamento (efeito vertigem). | hyperframes, remotion | `python3 scripts/blocos.py renderizar camera-dolly-zoom demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: camera-dolly-zoom. |
| 🔌 | **Vertigo** | Zoom óptico contrário ao deslocamento (efeito vertigem). | hyperframes, remotion | `python3 scripts/blocos.py renderizar camera-dolly-zoom demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: camera-dolly-zoom. |
| ✅ | **Push In** | Aproximação/afastamento suave da câmera. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito zoom-in\|zoom-out \| python3 scripts/estudio.py foto --movimento push-in\|pull-back \| Remotion: KenBurns` |
| ✅ | **Pull Back** | Aproximação/afastamento suave da câmera. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito zoom-in\|zoom-out \| python3 scripts/estudio.py foto --movimento push-in\|pull-back \| Remotion: KenBurns` |
| ✅ | **Digital Zoom** | Zoom digital (reenquadramento) sobre o vídeo. | ffmpeg, remotion | `python3 scripts/estudio.py vfx in out --efeito zoom-in --intensidade 1.5` |
| 📋 | **Camera Roll** | Rotação da câmera no eixo da lente. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Camera Tracking** | Câmera virtual que acompanha um ponto rastreado. | remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Handheld Camera** | Simula câmera na mão (oscilação lenta e orgânica). | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito handheld \| Remotion: <TremorCamera amplitude={6} velocidade={0.2}>` |
| ✅ | **Cinematic Camera Shake** | Tremor de impacto/ação. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito tremor --intensidade 1.5 \| Remotion: TremorCamera \| HF: hyperframes add camera-shake` |
| 🔌 | **3D Parallax** | Profundidade simulada com camadas em movimento. | hyperframes, remotion | `python3 scripts/blocos.py renderizar parallax-device-dive demo.mp4 \| python3 scripts/blocos.py renderizar camera-rig-depth-stack demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: parallax-device-dive, camera-rig-depth-stack. |
| 🔌 | **Multi-Layer Parallax** | Várias camadas recortadas movendo-se em velocidades distintas. | hyperframes, remotion | `python3 scripts/blocos.py renderizar camera-rig-depth-stack demo.mp4 \| python3 scripts/blocos.py renderizar caption-parallax-layers demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: camera-rig-depth-stack, caption-parallax-layers. |
| ✅ | **Camera Fly Through** | Voo de câmera através de ambiente/galeria. | hyperframes, remotion | `python3 scripts/blocos.py renderizar gallery-tunnel saida.mp4 --var images=… \| python3 scripts/blocos.py sobrepor video.mp4 gallery-tunnel saida.mp4 --inicio 1 \| alternativas: scroll-camera-story` |
| 📋 | **Infinite Zoom** | Zoom contínuo que entra em imagem dentro de imagem. | remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Perspective Shift** | Mudança de perspectiva/inclinação do plano. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Tilt Shift** | Faixa de foco com desfoque em cima/baixo (efeito miniatura). | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **Rack Focus** | Troca de foco entre planos. | hyperframes, remotion | `python3 scripts/blocos.py renderizar rack-focus demo.mp4 \| python3 scripts/blocos.py renderizar focus-rack demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: rack-focus, focus-rack. |
| 🔌 | **Depth of Field** | Desfoque de profundidade de campo. | hyperframes, remotion | `python3 scripts/blocos.py renderizar focus-blur-resolve demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: focus-blur-resolve. |
| ✅ | **Dolly In** | Aproximação/afastamento com sensação de deslocamento. | ffmpeg, remotion | `python3 scripts/estudio.py foto --movimento push-in\|pull-back \| Remotion: KenBurns` |
| ✅ | **Dolly Out** | Aproximação/afastamento com sensação de deslocamento. | ffmpeg, remotion | `python3 scripts/estudio.py foto --movimento push-in\|pull-back \| Remotion: KenBurns` |
| ✅ | **Virtual Drone Shot** | Simula voo de drone sobre uma foto (zoom + deriva). | ffmpeg, remotion | `python3 scripts/estudio.py foto foto.jpg out.mp4 --movimento drone \| Remotion: KenBurns movimento="drone"` |
| ✅ | **Camera Follow** | Câmera acompanha um elemento (texto, cursor). | hyperframes, remotion | `python3 scripts/blocos.py renderizar caption-camera-follow saida.mp4 --var accent=… \| python3 scripts/blocos.py sobrepor video.mp4 caption-camera-follow saida.mp4 --inicio 1 \| alternativas: cursor-zoom-follow` |
| 🔌 | **Zoom Reveal** | Afasta para revelar o contexto completo. | hyperframes, remotion | `python3 scripts/blocos.py renderizar pull-back-reveal demo.mp4 \| python3 scripts/blocos.py renderizar ui-focus-zoom demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: pull-back-reveal, ui-focus-zoom. |
| 📋 | **Frame Break** | Sujeito 'sai' da moldura do quadro. | remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **UI World** | Câmera navegando por interfaces em espaço 3D. | hyperframes, remotion | `python3 scripts/blocos.py renderizar ui-3d-reveal demo.mp4 \| python3 scripts/blocos.py renderizar app-showcase demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: ui-3d-reveal, app-showcase. |
| ✅ | **Ken Burns** | Aproximação/afastamento suave da câmera. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito zoom-in\|zoom-out \| python3 scripts/estudio.py foto --movimento push-in\|pull-back \| Remotion: KenBurns` |
| 📋 | **3D Perspective Shift** | Mudança de perspectiva 3D do plano/cartão. | remotion | Especificação para futura implementação; não presumir que o efeito já execute. |

## Motion graphics (`motion_graphics`)

✅ 22 · 🧪 5 · 🔌 0 · 📋 2

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Kinetic Hook** | Gancho inicial com texto de impacto animado. | hyperframes, remotion | `Remotion: Gancho em composicoes/ReelsJuridico.tsx \| HF: hyperframes add headline-slam` |
| 🧪 | **Gravity Drop** | Elementos caem com gravidade e assentam. | hyperframes, remotion | `Remotion: ver ArthurShowcase (projetos/remotion-base/src/ArthurShowcase.tsx) — demonstração, não componente parametrizado` — Há demonstração no showcase Remotion; adaptar para uso em produção. |
| ✅ | **Elastic Bounce** | Entrada elástica com quique. | hyperframes, remotion | `python3 scripts/blocos.py renderizar rubber-band-bumper saida.mp4 --var direction=… \| python3 scripts/blocos.py sobrepor video.mp4 rubber-band-bumper saida.mp4 --inicio 1` |
| ✅ | **Spring Animation** | Animação por mola (natural, com inércia). | hyperframes, remotion | `Remotion: spring() — usado em LowerThird, ChecklistAnimado, Gancho \| HF: hyperframes add spring-pop` |
| ✅ | **Overshoot** | Passa do ponto final e volta. | hyperframes, remotion | `Remotion: spring({config:{damping:11}}) (Gancho) \| HF: extended-keyframe` |
| ✅ | **Stagger Animation** | Itens entram em cascata. | hyperframes, remotion | `Remotion: ChecklistAnimado (intervaloFrames) \| HF: hyperframes add stagger-cascade` |
| ✅ | **Morphing Shapes** | Formas que se transformam. | hyperframes, remotion | `python3 scripts/blocos.py renderizar facet-morph saida.mp4 --var forms=… \| python3 scripts/blocos.py sobrepor video.mp4 facet-morph saida.mp4 --inicio 1 \| alternativas: icon-morph-beat` |
| ✅ | **Particle Explosion** | Explosão de partículas. | hyperframes, remotion | `python3 scripts/blocos.py renderizar char-slam-explode saida.mp4 --var text="DIREITO" \| python3 scripts/blocos.py sobrepor video.mp4 confetti saida.mp4 --inicio 1 \| alternativa: caption-particle-burst (texto fixo)` |
| 🧪 | **Floating Elements** | Elementos flutuando suavemente. | hyperframes, remotion | `hyperframes add drift-hold` — Há demonstração no showcase Remotion; adaptar para uso em produção. |
| ✅ | **Icon Impact** | Ícone entra com impacto e pulso. | hyperframes, remotion | `python3 scripts/blocos.py renderizar beat-accent saida.mp4 --var text=… \| python3 scripts/blocos.py sobrepor video.mp4 beat-accent saida.mp4 --inicio 1 \| alternativas: badge-pop` |
| ✅ | **Liquid Motion** | Movimento líquido/gooey. | hyperframes, remotion | `python3 scripts/blocos.py renderizar goo saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 goo saida.mp4 --inicio 1 \| alternativas: gooey-split, vfx-liquid-background` |
| ✅ | **Magnetic Motion** | Elementos atraídos magneticamente. | hyperframes, remotion | `python3 scripts/blocos.py renderizar magnetic-cursor saida.mp4 --var accent=… \| python3 scripts/blocos.py sobrepor video.mp4 magnetic-cursor saida.mp4 --inicio 1 \| alternativas: vfx-magnetic` |
| ✅ | **Animated Arrows** | Setas desenhadas à mão animadas. | hyperframes, remotion | `python3 scripts/blocos.py renderizar hw-arrow saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 hw-arrow saida.mp4 --inicio 1` |
| ✅ | **Progress Bar** | Barras de progresso. | hyperframes, remotion | `Remotion: BarraProgresso \| HF: hyperframes add mk-progress-stat \| hyperframes add conic-progress-ring` |
| ✅ | **Animated Checklist** | Lista com checks animados. | hyperframes, remotion | `Remotion: ChecklistAnimado \| HF: hyperframes add marker-checklist-card` |
| 🧪 | **Chart Grow** | Gráficos que crescem. | hyperframes, remotion | `hyperframes add animated-bar-chart \| hyperframes add data-chart \| hyperframes add mk-line-graph` — Há demonstração no showcase Remotion; adaptar para uso em produção. |
| ✅ | **Data Counter** | Número contando até o valor final (pt-BR). | hyperframes, remotion | `Remotion: ContadorDados (prefixo 'R$ ', casas decimais) \| HF: hyperframes add count-up` |
| ✅ | **Infographic Reveal** | Infográfico revelado em etapas. | hyperframes, remotion | `python3 scripts/blocos.py renderizar chart-story saida.mp4 --var type=… \| python3 scripts/blocos.py sobrepor video.mp4 chart-story saida.mp4 --inicio 1 \| alternativas: hw-pipeline, flowchart` |
| 📋 | **Animated Timeline** | Linha do tempo animada (ex.: cronologia de um processo). | remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Doodle Boil** | Traço desenhado 'fervendo' (estilo rabisco). | hyperframes, remotion | `python3 scripts/blocos.py renderizar hw-boil saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 hw-boil saida.mp4 --inicio 1` |
| ✅ | **Paper Cut Animation** | Recortes de papel/colagem. | hyperframes, remotion | `python3 scripts/blocos.py renderizar paper-collage-reveal saida.mp4 --var panels=… \| python3 scripts/blocos.py sobrepor video.mp4 paper-collage-reveal saida.mp4 --inicio 1` |
| 🧪 | **Glassmorphism** | Cartões de vidro fosco. | hyperframes, remotion | `hyperframes add liquid-glass-widgets \| hyperframes add ios26-liquid-glass` — Há demonstração no showcase Remotion; adaptar para uso em produção. |
| 🧪 | **Neon Glow Motion** | Contornos neon animados. | hyperframes, remotion | `hyperframes add lt-neon-border \| hyperframes add caption-neon-glow` — Há demonstração no showcase Remotion; adaptar para uso em produção. |
| ✅ | **3D Object Rotation** | Objeto/logo 3D girando. | hyperframes, remotion | `python3 scripts/blocos.py renderizar product-turntable saida.mp4 --var model_url=… \| python3 scripts/blocos.py sobrepor video.mp4 product-turntable saida.mp4 --inicio 1 \| alternativas: extruded-logo` |
| ✅ | **Follow Path Animation** | Elemento percorre um caminho. | hyperframes, remotion | `python3 scripts/blocos.py renderizar arc-motion-path saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 arc-motion-path saida.mp4 --inicio 1 --escala 3 \| alternativas: offset-path-traveler` |
| ✅ | **Morphing Icons** | Ícones que se transformam uns nos outros. | hyperframes, remotion | `python3 scripts/blocos.py renderizar icon-morph-beat saida.mp4 --var pair=… \| python3 scripts/blocos.py sobrepor video.mp4 icon-morph-beat saida.mp4 --inicio 1` |
| ✅ | **Animated Callout** | Destaque animado (círculo/seta) apontando um detalhe. | hyperframes, remotion | `python3 scripts/blocos.py renderizar hw-callout-circle saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 hw-callout-circle saida.mp4 --inicio 1 \| alternativas: yt-circle-pointer` |
| 📋 | **Kinetic Shapes** | Formas geométricas em movimento rítmico. | remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Animated Lower Third** | Tarja com nome e cargo. | hyperframes, remotion | `Remotion: LowerThird \| HF: lt-clean-bar, lt-mask-reveal, lt-side-rule e outras 8 variações` |

## Legendas e tipografia (`legendas_tipografia`)

✅ 23 · 🧪 1 · 🔌 3 · 📋 3

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Kinetic Typography** | Tipografia cinética sincronizada com a fala. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar kinetic-center-build saida.mp4 --var text=… \| python3 scripts/blocos.py sobrepor video.mp4 kinetic-center-build saida.mp4 --inicio 1 \| alternativas: kinetic-type-swap` |
| ✅ | **Word by Word Captions** | Uma palavra por vez na tela. | remotion, whisper | `Remotion: <LegendaDinamica estilo="palavra" legendas={...}/>` |
| ✅ | **Karaoke Captions** | Palavras mudam de cor conforme são ditas. | hyperframes, remotion, whisper | `Remotion: LegendaDinamica estilo="karaoke" \| HF: hyperframes add caption-pill-karaoke` |
| ✅ | **Giant Captions** | Legendas gigantes em caixa-alta. | ffmpeg, remotion, whisper | `Remotion: estilo="gigante" \| python3 scripts/estudio.py legendar in.mp4 leg.srt out.mp4 --estilo gigante` |
| ✅ | **Pop-up Captions** | Legenda entra com 'pop' e palavra ativa ampliada. | hyperframes, remotion, whisper | `Remotion: estilo="pop" \| HF: hyperframes add caption-emoji-pop` |
| ✅ | **Subtitle Bounce** | Legenda com quique na entrada. | remotion, whisper | `Remotion: estilo="pop" (spring com overshoot)` |
| ✅ | **Typewriter Effect** | Texto digitado letra a letra com cursor. | hyperframes, remotion, whisper | `Remotion: MaquinaEscrever \| HF: hyperframes add typewriter` |
| ✅ | **Highlight Words** | Palavras-chave destacadas. | hyperframes, remotion, whisper | `Remotion: estilo="destaque" \| HF: hyperframes add caption-highlight \| hyperframes add marker-highlight` |
| 📋 | **Word Shake** | Palavra treme para ênfase. | remotion, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Text Tracking** | Espaçamento entre letras abrindo. | hyperframes, remotion, whisper | `Remotion: TituloCinematico \| HF: hyperframes add tracking-in` |
| ✅ | **Text Reveal** | Texto revelado do desfoque ao foco. | hyperframes, remotion, whisper | `Remotion: TituloCinematico \| HF: hyperframes add soft-blur-in \| hyperframes add bottom-up-letters` |
| ✅ | **Masked Text** | Texto como máscara de imagem/vídeo. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar svg-mask-reveal saida.mp4 --var text=… \| python3 scripts/blocos.py sobrepor video.mp4 svg-mask-reveal saida.mp4 --inicio 1` |
| ✅ | **3D Typography** | Tipografia com volume 3D. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar wireframe-portal-title saida.mp4 --var title=… \| python3 scripts/blocos.py sobrepor video.mp4 wireframe-portal-title saida.mp4 --inicio 1 \| alternativas: code-3d-extrude` |
| 🔌 | **Glass Type** | Letras de vidro. | hyperframes, remotion, whisper | `hyperframes add glass-shard-title` — Ainda não implementado. glass-shard-title: rede bloqueada |
| 🔌 | **Neon Text** | Texto neon. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar caption-neon-glow saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 caption-neon-glow saida.mp4 --inicio 1 \| alternativas: caption-neon-accent` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. caption-neon-glow / caption-neon-accent exibem legendas de exemplo fixas. |
| 📋 | **Text Behind Subject** | Texto atrás da pessoa. | remotion, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Text Explosion** | Letras explodem/se dispersam. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar char-slam-explode saida.mp4 --var text=… \| python3 scripts/blocos.py sobrepor video.mp4 char-slam-explode saida.mp4 --inicio 1 \| alternativas: particle-text-dissolve` |
| ✅ | **Rolling Text** | Texto rolando (slot machine/letreiro). | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar slot-machine-roll saida.mp4 --var result=… \| python3 scripts/blocos.py sobrepor video.mp4 slot-machine-roll saida.mp4 --inicio 1 --escala 3 \| alternativas: ticker-takeover, news-ticker` |
| 🧪 | **Gradient Typography** | Texto com preenchimento em degradê. | hyperframes, remotion, whisper | `hyperframes add caption-gradient-fill` — Há demonstração no showcase Remotion; adaptar para uso em produção. |
| ✅ | **Glitch Typography** | Texto com falha digital. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar rgb-glitch-text saida.mp4 --var text=… \| python3 scripts/blocos.py sobrepor video.mp4 rgb-glitch-text saida.mp4 --inicio 1 --escala 3 \| alternativas: caption-glitch-rgb` |
| ✅ | **Subtitle Progress** | Barra de progresso de retenção. | remotion, whisper | `Remotion: BarraProgresso (topo/base)` |
| 🔌 | **Dynamic Emoji Captions** | Emojis contextuais junto às legendas. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar caption-emoji-pop saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 caption-emoji-pop saida.mp4 --inicio 1` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. caption-emoji-pop exibe legenda e emojis de exemplo fixos. |
| ✅ | **Highlight Box Captions** | Palavra ativa dentro de caixa colorida. | ffmpeg, remotion, whisper | `Remotion: estilo="destaque" \| python3 scripts/estudio.py legendar --estilo caixa` |
| ✅ | **Lower Thirds** | Tarja com nome e cargo. | hyperframes, remotion, whisper | `Remotion: LowerThird \| HF: lt-clean-bar, lt-mask-reveal, lt-side-rule e outras 8 variações` |
| ✅ | **Cinematic Titles** | Títulos cinematográficos. | hyperframes, remotion, whisper | `Remotion: TituloCinematico \| HF: hyperframes add titlecard-calm \| hyperframes add titlecard-lockup` |
| ✅ | **Bounce Captions** | Legenda com quique na entrada. | remotion, whisper | `Remotion: estilo="pop" (spring com overshoot)` |
| 📋 | **Caption Follow Speaker** | Legenda que acompanha a posição de quem fala. | remotion, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Title Card** | Títulos cinematográficos. | hyperframes, remotion, whisper | `Remotion: TituloCinematico \| HF: hyperframes add titlecard-calm \| hyperframes add titlecard-lockup` |
| ✅ | **Text Stroke Reveal** | Texto revelado pelo contorno sendo desenhado. | hyperframes, remotion, whisper | `python3 scripts/blocos.py renderizar outline-draw saida.mp4 --var progress=… \| python3 scripts/blocos.py sobrepor video.mp4 outline-draw saida.mp4 --inicio 1 \| alternativas: svg-stroke-trace` |
| ✅ | **Legendas estáticas SRT queimadas** | Legenda SRT tradicional gravada na imagem (extra). | ffmpeg | `python3 scripts/estudio.py legendar in.mp4 leg.srt out.mp4 --estilo classico\|reels\|gigante\|caixa` |

## Efeitos visuais e composição (`vfx`)

✅ 17 · 🧪 0 · 🔌 0 · 📋 13

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Green Screen** | Remove fundo verde/azul e aplica novo fundo. | ffmpeg, remotion | `python3 scripts/estudio.py chroma pessoa.mp4 fundo.jpg out.mp4 --cor 0x00FF00` |
| ✅ | **Chroma Key** | Remove fundo verde/azul e aplica novo fundo. | ffmpeg, remotion | `python3 scripts/estudio.py chroma pessoa.mp4 fundo.jpg out.mp4 --cor 0x00FF00` |
| ✅ | **Background Replacement** | Troca o fundo do vídeo. | ffmpeg, remotion | `python3 scripts/estudio.py chroma ... (requer fundo chapado)` |
| 📋 | **Background Removal** | Remove o fundo sem tela verde (IA). | ffmpeg, hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Object Removal** | Apaga objetos indesejados. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Object Tracking** | Rastreia um objeto pelo vídeo. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Face Tracking** | Rastreia o rosto (para zoom, desfoque, reenquadramento). | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Motion Tracking** | Prende elementos gráficos a um ponto em movimento. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Rotoscoping** | Recorte quadro a quadro do sujeito. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Glow Effect** | Brilho difuso nas áreas claras. | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito glow --intensidade 1` |
| ✅ | **Bloom** | Halo de luz nas altas luzes. | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito glow (mesma técnica)` |
| ✅ | **Lens Flare** | Reflexo de lente. | ffmpeg, hyperframes, remotion | `python3 scripts/blocos.py renderizar lens-flare saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 lens-flare saida.mp4 --inicio 1 \| alternativas: vfx-anamorphic-flare` |
| ✅ | **Chromatic Aberration** | Franjas coloridas nas bordas. | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito aberracao` |
| ✅ | **VHS** | Fita VHS: ruído, linhas, cores lavadas, deslocamento RGB. | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito vhs` |
| ✅ | **Analog Noise** | Fita VHS: ruído, linhas, cores lavadas, deslocamento RGB. | ffmpeg, remotion | `python3 scripts/estudio.py vfx --efeito vhs` |
| ✅ | **Film Grain** | Grão de película. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito grao \| Remotion: GraoFilme \| HF: hyperframes add grain-overlay` |
| ✅ | **Retro Camcorder** | Visual de filmadora antiga com HUD. | ffmpeg, hyperframes, remotion | `python3 scripts/blocos.py renderizar camcorder-hud saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 camcorder-hud saida.mp4 --inicio 1` |
| ✅ | **Hologram Effect** | Holograma. | ffmpeg, hyperframes, remotion | `python3 scripts/blocos.py renderizar hologram saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 hologram saida.mp4 --inicio 1` |
| 📋 | **Double Exposure** | Dupla exposição de duas imagens. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Ghost Trail** | Rastro fantasma do movimento. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito rastro \| HF: hyperframes add echo-trail` |
| ✅ | **Freeze Frame** | Congela um quadro por N segundos. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py congelar in.mp4 out.mp4 --em 2.0 --duracao 1.5 \| HF: hyperframes add freeze-frame-dressing` |
| 📋 | **Pixel Sorting** | Ordenação de pixels (glitch art). | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Displacement** | Deformação por mapa de deslocamento. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Heat Distortion** | Distorção de calor. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py transicao-shader a.mp4 b.mp4 saida.mp4 --shader thermal-distortion --duracao 0.8` |
| 📋 | **Smoke Overlay** | Fumaça sobreposta. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Fire Particles** | Partículas de fogo/brasas. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Rain Effect** | Chuva sobreposta. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Snow Effect** | Chuva ou neve. | ffmpeg, hyperframes, remotion | `python3 scripts/blocos.py renderizar snow saida.mp4 --var density=… \| python3 scripts/blocos.py sobrepor video.mp4 snow saida.mp4 --inicio 1` |
| ✅ | **Light Rays** | Raios de luz volumétricos. | ffmpeg, hyperframes, remotion | `python3 scripts/blocos.py renderizar godrays saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 godrays saida.mp4 --inicio 1` |
| 📋 | **Digital Distortion** | Distorção digital da imagem (glitch, scan). | ffmpeg, remotion | `hyperframes add scan-band (texto) \| hyperframes add glitch (transição)` — Especificação para futura implementação; não presumir que o efeito já execute. |

## Estilos de edição (`estilos`)

✅ 0 · 🧪 0 · 🔌 0 · 📋 27

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| 📋 | **Cinematic Editing** | Ritmo contido, planos longos, grade cinematográfica, letterbox opcional. | ffmpeg, orquestracao, remotion | `Receita: cor cinematic + vinheta + grão leve + fades + TituloCinematico` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Documentary Style** | Narração, B-roll, entrevistas com lower thirds, ritmo pausado. | orquestracao | `Receita: LowerThird + Ken Burns em fotos + cor matte` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Hollywood Trailer** | Cartelas, braams, risers, cortes no impacto, crescendo. | orquestracao | `Receita: sfx braam/riser/impacto + flash + TituloCinematico + dark-moody` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Luxury Premium** | Movimentos lentos, tipografia serifada, dourado, muito respiro. | orquestracao | `Receita: luxo-dourado + Playfair + push-in lento + fade` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Minimalist Clean** | Fundo limpo, pouca cor, tipografia simples. | hyperframes, orquestracao | `Blocos HF mk-* (minimal/professional)` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Corporate Professional** | Sóbrio, institucional, dados e logotipo. | hyperframes, orquestracao, remotion | `ContadorDados + LowerThird + mk-* blocks` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Dark Cinematic** | Baixa luz, contraste alto, tons frios. | ffmpeg, orquestracao | `Receita: dark-moody + vinheta + drone sfx` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Motivational Inspirational** | Música crescente, frases de impacto, câmera lenta. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Emotional Storytelling** | Narrativa com depoimento, close, trilha suave. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Epic Adventure** | Planos amplos, drone, trilha épica. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Fast-Paced Reels** | Cortes a cada 1–2 s, legendas dinâmicas, zooms de ênfase. | orquestracao | `Receita: silencio + LegendaDinamica pop + vfx zoom-in + whoosh` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Podcast Highlights** | Trechos de podcast com legendas e waveform. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Talking Head Dynamic** | Fala para câmera com punch-ins, legendas e B-roll. | orquestracao | `Receita: silencio + ReelsJuridico + zoom-in alternado` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **High-Energy Social** | Ritmo muito rápido, ganchos frequentes, legendas grandes centrais com palavras-chave coloridas e cortes secos. | orquestracao | `Receita: estudio.py silencio (jump cuts) + LegendaDinamica estilo gigante/destaque + sfx pop/whoosh. Inspiração de ritmo apenas, sem marcas ou elementos de terceiros.` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Social Media Viral** | Gancho em 1 s, legendas, CTA. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Retro Vintage** | Cores lavadas, grão, VHS ou película. | ffmpeg, orquestracao | `Receita: vintage-kodak + grao \| vhs` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Cyberpunk Futuristic** | Neon, glitch, magenta/ciano. | hyperframes, orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Editorial Fashion** | Tipografia editorial, cortes no ritmo, flashes. | hyperframes, orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Wedding Cinematic** | Câmera lenta, tons quentes, trilha emotiva. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Travel Vlog** | Drone, transições de movimento, mapas. | hyperframes, orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Sports Highlights** | Cortes rápidos, câmera lenta nos lances, placares. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Real Estate Luxury** | Movimentos lentos, grade limpa, ficha técnica. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Testimonial Editing** | Depoimento com lower third e B-roll. | orquestracao | `Atenção ao Provimento 205/2021 (depoimentos de clientes).` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Religious Worship** | Cobertura de cultos/eventos religiosos: tons quentes, câmera lenta, trilha emotiva. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Legal Educational** | Educativo jurídico: sóbrio, legendas claras, tarja do advogado, sem promessa de resultado (Provimento 205/2021). | orquestracao | `Receita: template ReelsJuridico + cor natural + estudio.py audio --voz-eq --compressor --lufs -14` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Product Launch** | Lançamento de produto: revelação, mockups, ritmo crescente. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Event Aftermovie** | Resumo de evento: montagem rítmica, câmera lenta, trilha energética. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |

## Interfaces, mockups e composições (`interfaces_mockups`)

✅ 12 · 🧪 1 · 🔌 7 · 📋 10

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| 🧪 | **Phone Mockup** | Vídeo dentro de um celular. | hyperframes, remotion | `hyperframes add device-frame-stage \| hyperframes add vfx-iphone-device` — Há demonstração no showcase Remotion; adaptar para uso em produção. |
| 🔌 | **Laptop Mockup** | Vídeo dentro de um notebook. | hyperframes, remotion | `python3 scripts/blocos.py renderizar multi-device-splay saida.mp4 --var accent=… \| python3 scripts/blocos.py sobrepor video.mp4 multi-device-splay saida.mp4 --inicio 1` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. multi-device-splay mostra celular, tablet e MONITOR (não notebook), com telas genéricas. |
| ✅ | **Browser Window** | Janela de navegador animada. | hyperframes, remotion | `python3 scripts/blocos.py renderizar browser-device-stage saida.mp4 --var chrome=… \| python3 scripts/blocos.py sobrepor video.mp4 browser-device-stage saida.mp4 --inicio 1` |
| 🔌 | **App Interface Animation** | Fluxos de app animados. | hyperframes, remotion | `python3 scripts/blocos.py renderizar app-showcase saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 app-showcase saida.mp4 --inicio 1 \| alternativas: onboarding-stepper-flow` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. app-showcase mostra um app de exemplo. |
| ✅ | **Social Media Feed** | Feed rolando. | hyperframes, remotion | `python3 scripts/blocos.py renderizar scroll-feed saida.mp4 --var speed=… \| python3 scripts/blocos.py sobrepor video.mp4 scroll-feed saida.mp4 --inicio 1` |
| 📋 | **Scrolling Reels Grid** | Grade de vídeos rolando. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **Instagram Comment Pop-up** | Comentário surgindo na tela. | hyperframes, remotion | `python3 scripts/blocos.py renderizar yt-comment-card saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 yt-comment-card saida.mp4 --inicio 1` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. yt-comment-card é um comentário no estilo YouTube com texto fixo (não é Instagram). |
| 📋 | **Falling Comments** | Comentários caindo/empilhando. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Chat Bubble Animation** | Balões de conversa. | hyperframes, remotion | `python3 scripts/blocos.py renderizar chat-message saida.mp4 --var type=… \| python3 scripts/blocos.py sobrepor video.mp4 chat-message saida.mp4 --inicio 1 \| alternativas: chat-thread, message-thread-reveal` |
| ✅ | **Notification Pop** | Notificação surgindo. | hyperframes, remotion | `python3 scripts/blocos.py renderizar native-notification-pop saida.mp4 --var title=… \| python3 scripts/blocos.py sobrepor video.mp4 native-notification-pop saida.mp4 --inicio 1 \| alternativas: macos-notification` |
| ✅ | **Prompt Bar** | Barra de prompt sendo digitada. | hyperframes, remotion | `python3 scripts/blocos.py renderizar typed-prompt saida.mp4 --var text=… \| python3 scripts/blocos.py sobrepor video.mp4 typed-prompt saida.mp4 --inicio 1` |
| ✅ | **Search Bar Animation** | Busca sendo digitada. | hyperframes, remotion | `python3 scripts/blocos.py renderizar typed-prompt saida.mp4 --var text=… \| python3 scripts/blocos.py sobrepor video.mp4 typed-prompt saida.mp4 --inicio 1` |
| ✅ | **Drag and Drop File** | Arquivo arrastado e solto. | hyperframes, remotion | `python3 scripts/blocos.py renderizar cursor-drag-drop saida.mp4 --var card_label=… \| python3 scripts/blocos.py sobrepor video.mp4 cursor-drag-drop saida.mp4 --inicio 1` |
| 📋 | **Editor Timeline Simulation** | Simulação de linha do tempo de editor. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Storyboard Animation** | Quadros de storyboard animados. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Couch Wall** | Termo das referências do usuário — definição a confirmar. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Headline Wall** | Mural de manchetes. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Cover Story** | Composição estilo capa de revista. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **Pull-Back Reveal** | Afasta revelando o conjunto. | hyperframes, remotion | `python3 scripts/blocos.py renderizar pull-back-reveal demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: pull-back-reveal. |
| 🔌 | **Floating Screens** | Telas flutuando no espaço. | hyperframes, remotion | `python3 scripts/blocos.py renderizar multi-device-splay saida.mp4 --var accent=… \| python3 scripts/blocos.py sobrepor video.mp4 multi-device-splay saida.mp4 --inicio 1 \| alternativas: three-orbiting-cards` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. multi-device-splay mostra telas genéricas; inserir sua tela exige edição. |
| ✅ | **Split Screen** | Tela dividida. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py split a.mp4 b.mp4 out.mp4 --orientacao h\|v \| HF: hyperframes add comparison-split` |
| ✅ | **Picture in Picture** | Vídeo menor sobre o principal. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py pip principal.mp4 sec.mp4 out.mp4 --posicao inf-dir --escala 0.3` |
| 🔌 | **Video Collage** | Mosaico de vídeos. | hyperframes, remotion | `python3 scripts/blocos.py renderizar mk-placeholder-grid saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 mk-placeholder-grid saida.mp4 --inicio 1 \| alternativas: paper-collage-reveal` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. mk-placeholder-grid só tem espaços reservados; não recebe vídeos por parâmetro. |
| ✅ | **3D Gallery Wall** | Galeria 3D de imagens. | hyperframes, remotion | `python3 scripts/blocos.py renderizar gallery-tunnel saida.mp4 --var images=… \| python3 scripts/blocos.py sobrepor video.mp4 gallery-tunnel saida.mp4 --inicio 1` |
| 📋 | **Infinite Video Grid** | Grade infinita de vídeos. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **Glass UI Cards** | Cartões de interface de vidro. | hyperframes, remotion | `python3 scripts/blocos.py renderizar liquid-glass-widgets saida.mp4 \| python3 scripts/blocos.py sobrepor video.mp4 liquid-glass-widgets saida.mp4 --inicio 1` — Bloco testado, mas com conteúdo fixo de exemplo e sem parâmetros de conteúdo: para usar com o seu texto/mídia é preciso editar o HTML em projetos/hf-biblioteca. liquid-glass-widgets mostra widgets de exemplo fixos. |
| 📋 | **Feed of Reels** | Feed vertical de Reels rolando. | hyperframes, remotion | `hyperframes add scroll-feed (adaptar)` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Video Card** | Cartão de vídeo com título e miniatura animados. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Comment CTA** | Comentário/CTA pedindo interação. | hyperframes, remotion | `python3 scripts/blocos.py variaveis cta-close → python3 scripts/blocos.py renderizar cta-close saida.mp4 --var …` |
| ✅ | **Checklist UI** | Checklist em estilo de interface. | hyperframes, remotion | `python3 scripts/blocos.py renderizar marker-checklist-card saida.mp4 --var top=… \| python3 scripts/blocos.py sobrepor video.mp4 marker-checklist-card saida.mp4 --inicio 1` |

## Cortes e técnicas de montagem (`montagem`)

✅ 13 · 🧪 0 · 🔌 1 · 📋 12

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Jump Cut** | Cortes dentro da mesma tomada (remove pausas). | ffmpeg | `python3 scripts/estudio.py silencio in.mp4 out.mp4 --limiar -35dB --minimo 0.45` |
| 📋 | **J-Cut** | Áudio da próxima cena começa antes da imagem. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **L-Cut** | Áudio da cena anterior continua sobre a próxima imagem. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 🔌 | **Match Cut** | Corte por correspondência visual. | ffmpeg, hyperframes | `python3 scripts/blocos.py renderizar match-cut demo.mp4` — Bloco(s) do registro instalado(s) e renderizado(s) com sucesso, mas animam apenas o conteúdo de exemplo: aplicar aos seus clipes exige editar o HTML do bloco em projetos/hf-biblioteca para trocar as cenas de exemplo pela sua mídia. Testados: match-cut. |
| ✅ | **Smash Cut** | Corte abrupto para contraste forte. | ffmpeg | `python3 scripts/estudio.py juntar out.mp4 a.mp4 b.mp4 (+ python3 scripts/estudio.py sfx impacto)` |
| ✅ | **Hard Cut** | Corte seco. | ffmpeg | `python3 scripts/estudio.py cortar / juntar` |
| 📋 | **Cut on Action** | Corte no meio de um movimento. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Beat Cut** | Cortes no tempo da música. | ffmpeg, hyperframes | `python3 scripts/estudio.py montagem-ritmo saida.mp4 musica.mp3 clipe1.mp4 clipe2.mp4 [--a-cada 1]` |
| ✅ | **Montage Sequence** | Sequência de planos curtos com transições. | ffmpeg, remotion | `python3 scripts/estudio.py juntar + python3 scripts/estudio.py transicao \| Remotion TransitionSeries` |
| 📋 | **Speed Ramp** | Variação progressiva de velocidade. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Slow Motion** | Câmera lenta (com interpolação opcional). | ffmpeg | `python3 scripts/estudio.py velocidade in out --fator 0.5 --suave` |
| ✅ | **Fast Motion** | Acelerado. | ffmpeg | `python3 scripts/estudio.py velocidade in out --fator 2` |
| ✅ | **Reverse Playback** | Reprodução reversa. | ffmpeg | `python3 scripts/estudio.py velocidade in out --reverso` |
| ✅ | **Freeze Frame Cut** | Congela no corte. | ffmpeg, hyperframes | `python3 scripts/estudio.py congelar \| HF: hyperframes add beat-freeze-cut` |
| 📋 | **Multi-Camera Cut** | Alterna entre câmeras sincronizadas. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Reaction Cut** | Corte para a reação. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **B-Roll Insert** | Insere imagens de apoio sobre a fala. | ffmpeg, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Cutaway** | Corte para detalhe/contexto. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Rhythm Editing** | Edição guiada pelo ritmo. | ffmpeg, hyperframes | `python3 scripts/estudio.py montagem-ritmo saida.mp4 musica.mp3 clipes... --a-cada 2 --formato 9:16` |
| 📋 | **Time Remapping** | Remapeamento de tempo por curvas. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Match on Motion** | Corte casando a direção do movimento entre planos. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Scene Detection** | Detecta trocas de cena (extra). | ffmpeg | `python3 scripts/estudio.py cenas in.mp4 --limiar 0.3` |
| ✅ | **Silence Cut** | Cortes dentro da mesma tomada (remove pausas). | ffmpeg | `python3 scripts/estudio.py silencio in.mp4 out.mp4 --limiar -35dB --minimo 0.45` |
| 📋 | **Punch In Cut** | Corte com zoom de ênfase (punch-in) na mesma tomada. | ffmpeg | `Base: python3 scripts/estudio.py vfx --efeito zoom-in em trechos + juntar (não automatizado)` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Paper Cut** | Corte com textura/rasgo de papel. | ffmpeg | `hyperframes add torn-paper-rip` — Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Trim / Cortar trecho** | Recorte preciso de início e fim (extra). | ffmpeg | `python3 scripts/estudio.py cortar in.mp4 out.mp4 --inicio 12.5 --fim 40` |

## Color grading (`color_grading`)

✅ 19 · 🧪 0 · 🔌 0 · 📋 7

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Hollywood Cinematic LUT** | Look cinematográfico (preset) ou LUT .cube própria. | ffmpeg | `python3 scripts/estudio.py cor in out --preset cinematic \| --lut arquivo.cube` |
| ✅ | **Teal and Orange** | Sombras azuladas, pele/altas alaranjadas. | ffmpeg | `python3 scripts/estudio.py cor --preset teal-orange` |
| ✅ | **Dark Moody** | Escuro, dessaturado, frio. | ffmpeg | `python3 scripts/estudio.py cor --preset dark-moody` |
| ✅ | **Warm Film** | Película quente. | ffmpeg | `python3 scripts/estudio.py cor --preset warm-film` |
| ✅ | **Golden Hour** | Luz dourada de fim de tarde. | ffmpeg | `python3 scripts/estudio.py cor --preset golden-hour` |
| ✅ | **Black and White** | Preto e branco contrastado. | ffmpeg | `python3 scripts/estudio.py cor --preset pb` |
| ✅ | **High Contrast** | Contraste alto. | ffmpeg | `python3 scripts/estudio.py cor --preset alto-contraste` |
| ✅ | **Matte Film Look** | Pretos levantados, altas suavizadas. | ffmpeg | `python3 scripts/estudio.py cor --preset matte` |
| ✅ | **Vintage Kodak Look** | Aparência de filme vintage. | ffmpeg | `python3 scripts/estudio.py cor --preset vintage-kodak` |
| ✅ | **Film Emulation** | Emulação de película por LUT. | ffmpeg | `python3 scripts/estudio.py cor --lut pelicula.cube` |
| ✅ | **Pastel Soft** | Tons pastel suaves. | ffmpeg | `python3 scripts/estudio.py cor --preset pastel` |
| ✅ | **Luxury Gold** | Dourado elegante com vinheta. | ffmpeg | `python3 scripts/estudio.py cor --preset luxo-dourado` |
| ✅ | **Cold Blue** | Tons frios azulados. | ffmpeg | `python3 scripts/estudio.py cor --preset azul-frio` |
| ✅ | **Desaturated Drama** | Pouca saturação, muito contraste. | ffmpeg | `python3 scripts/estudio.py cor --preset drama-dessaturado` |
| ✅ | **HDR Look** | Aparência HDR (nitidez + contraste local simulado). | ffmpeg | `python3 scripts/estudio.py cor --preset hdr-look` |
| 📋 | **Skin Tone Correction** | Correção de tom de pele. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Exposure Matching** | Igualar exposição entre câmeras/tomadas. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **White Balance Matching** | Igualar balanço de branco. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Selective Color** | Ajuste de uma faixa de cor. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Color Isolation** | Mantém uma cor e dessatura o resto. | ffmpeg | `python3 scripts/estudio.py vfx --efeito isolar-cor --cor red` |
| ✅ | **Vignette** | Escurecimento das bordas. | ffmpeg, hyperframes, remotion | `python3 scripts/estudio.py vfx --efeito vinheta \| Remotion: Vinheta \| HF: hyperframes add vignette \|\| python3 scripts/estudio.py vfx --efeito vinheta \| python3 scripts/estudio.py cor --vinheta` |
| 📋 | **Highlight Roll-Off** | Transição suave nas altas luzes. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Clean Natural** | Look natural e limpo: leve ganho de contraste e saturação, nitidez sutil. | ffmpeg | `python3 scripts/estudio.py cor in.mp4 out.mp4 --preset natural` |
| 📋 | **Retro Color** | Paleta retrô desbotada. | ffmpeg | `Aproximação: python3 scripts/estudio.py cor --preset vintage-kodak` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Cinematic Contrast** | Contraste cinematográfico com pretos profundos. | ffmpeg | `Aproximação: python3 scripts/estudio.py cor --preset cinematic \| alto-contraste` — Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Correção automática** | Normaliza pretos/brancos automaticamente (extra). | ffmpeg | `python3 scripts/estudio.py cor --preset correcao-auto` |

## Efeitos sonoros (`efeitos_sonoros`)

✅ 17 · 🧪 0 · 🔌 0 · 📋 11

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Whoosh** | Passagem de ar para transições (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx whoosh saida.wav` |
| ✅ | **Cinematic Impact** | Impacto grave com ataque (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx impacto saida.wav` |
| ✅ | **Bass Drop** | Queda de grave. | ffmpeg | `python3 scripts/estudio.py sfx sub-boom saida.wav` |
| ✅ | **Sub Boom** | Grave profundo com queda de afinação (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx sub-boom saida.wav` |
| ✅ | **Riser** | Tensão crescente (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx riser saida.wav` |
| ✅ | **Reverse Riser** | Sucção/reverso antes do corte (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx riser-reverso saida.wav` |
| ✅ | **Glitch Sound** | Falha digital (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx glitch saida.wav` |
| ✅ | **Digital Click** | Clique curto (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx clique saida.wav` |
| 📋 | **Camera Shutter** | Obturador de câmera. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Typing Keyboard** | Digitação. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Notification Pop SFX** | Duas notas de notificação (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx notificacao saida.wav` |
| ✅ | **UI Hover** | Pop curto para elementos de UI (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx pop saida.wav` |
| ✅ | **Swipe Sound** | Deslizar. | ffmpeg | `python3 scripts/estudio.py sfx whoosh saida.wav --duracao 0.4` |
| ✅ | **Transition Sweep** | Varredura de transição. | ffmpeg | `python3 scripts/estudio.py sfx whoosh saida.wav --duracao 1.2` |
| 📋 | **Paper Flip** | Virar página. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Glass Break** | Vidro quebrando. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Metallic Hit** | Batida metálica. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Heartbeat** | Batimentos cardíacos (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx batimento saida.wav` |
| 📋 | **Crowd Applause** | Aplausos. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Ambient Atmosphere** | Ambiência. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Cinematic Drone** | Pad grave contínuo de tensão (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx drone saida.wav` |
| ✅ | **Braam** | Metais graves de trailer (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx braam saida.wav` |
| ✅ | **Reverse Cymbal** | Prato reverso. | ffmpeg | `python3 scripts/estudio.py sfx riser-reverso saida.wav` |
| 📋 | **Logo Sound Reveal** | Assinatura sonora de logotipo. | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Pop Impact** | Pop curto para elementos de UI (sintetizado; para produção final, preferir biblioteca licenciada). | ffmpeg | `python3 scripts/estudio.py sfx pop saida.wav` |
| 📋 | **Wind Sweep** | Varredura de vento. | ffmpeg | `Aproximação: python3 scripts/estudio.py sfx whoosh --duracao 1.5` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Low Hit** | Batida grave curta. | ffmpeg | `Aproximação: python3 scripts/estudio.py sfx impacto` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Shimmer** | Brilho sonoro agudo (cintilar). | ffmpeg | Especificação para futura implementação; não presumir que o efeito já execute. |

## Narração, música e pós-produção de áudio (`audio`)

✅ 16 · 🧪 0 · 🔌 0 · 📋 10

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| 📋 | **AI Voiceover** | Narração por IA. | ffmpeg, hyperframes, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Text to Speech** | Texto em fala. | ffmpeg, hyperframes, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Voice Cloning Authorized** | Clonagem de voz mediante autorização expressa. | ffmpeg, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Automatic Transcription** *(teste pendente)* | Transcrição automática (whisper.cpp). | ffmpeg, whisper | `python3 scripts/estudio.py transcrever in.mp4 --idioma pt` — Código pronto; teste real pendente: modelo Whisper não baixado (huggingface.co bloqueado). |
| 📋 | **Speaker Diarization** | Identifica quem fala. | ffmpeg, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Voice Enhancement** | Realce de voz (EQ + compressão). | ffmpeg, whisper | `python3 scripts/estudio.py audio in out --voz-eq --compressor` |
| ✅ | **Noise Reduction** | Redução de ruído. | ffmpeg, whisper | `python3 scripts/estudio.py audio in out --ruido --ruido-nivel -25` |
| 📋 | **Echo Reduction** | Redução de eco/reverberação. | ffmpeg, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Silence Removal** | Remove silêncios. | ffmpeg, whisper | `python3 scripts/estudio.py silencio in out` |
| ✅ | **Automatic Audio Ducking** | Música abaixa quando há voz. | ffmpeg, whisper | `python3 scripts/estudio.py ducking video.mp4 musica.mp3 out.mp4 --volume-musica 0.25` |
| ✅ | **Loudness Normalization** | Normalização de loudness (LUFS). | ffmpeg, whisper | `python3 scripts/estudio.py audio in out --lufs -14` |
| ✅ | **Voice EQ** | Equalização de voz. | ffmpeg, whisper | `python3 scripts/estudio.py audio --voz-eq` |
| ✅ | **Audio Compression** | Compressão dinâmica. | ffmpeg, whisper | `python3 scripts/estudio.py audio --compressor` |
| ✅ | **Beat Detection** | Detecta batidas da música. | ffmpeg, hyperframes, whisper | `python3 scripts/estudio.py batidas musica.mp3` |
| ✅ | **Beat Synchronization** | Sincroniza cortes/animações com batidas. | ffmpeg, hyperframes, whisper | `python3 scripts/estudio.py montagem-ritmo saida.mp4 musica.mp3 clipe1.mp4 clipe2.mp4 --a-cada 2` |
| ✅ | **Audio Fade In** | Fades de áudio (e imagem opcional). | ffmpeg, whisper | `python3 scripts/estudio.py audio in out --fade-in 0.5 --fade-out 1 [--fade-video]` |
| ✅ | **Audio Fade Out** | Fades de áudio (e imagem opcional). | ffmpeg, whisper | `python3 scripts/estudio.py audio in out --fade-in 0.5 --fade-out 1 [--fade-video]` |
| ✅ | **Music Crossfade** | Fusão entre músicas. | ffmpeg, whisper | `python3 scripts/estudio.py crossfade-musica a.mp3 b.mp3 saida.mp3 --duracao 3` |
| 📋 | **Background Ambience** | Ambiência de fundo. | ffmpeg, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Multilingual Dubbing** | Dublagem multilíngue. | ffmpeg, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Audio Translation** | Tradução do áudio. | ffmpeg, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Voice Pitch Shifting** | Altera o tom da voz. | ffmpeg, whisper | `python3 scripts/estudio.py tom entrada.mp4 saida.mp4 --semitons -2 [--preservar-formantes]` |
| 📋 | **Sound Design Layering** | Camadas de design sonoro. | ffmpeg, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Audio Gate** | Gate: silencia ruído abaixo de um limiar. | ffmpeg, whisper | `python3 scripts/estudio.py audio entrada.mp4 saida.mp4 --gate` |
| ✅ | **De-esser** | Reduz sibilância (S, Ç, X) da voz. | ffmpeg, whisper | `python3 scripts/estudio.py audio entrada.mp4 saida.mp4 --deesser` |
| 📋 | **Voice Isolation** | Isola a voz do fundo (música/ruído). | ffmpeg, whisper | `FFmpeg arnndn exige arquivo de modelo (não instalado)` — Especificação para futura implementação; não presumir que o efeito já execute. |

## Automação de edição com IA (`automacao_ia`)

✅ 6 · 🧪 0 · 🔌 0 · 📋 20

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| 📋 | **AI Auto Edit** | Edição completa automática a partir de instrução. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Smart Scene Detection** | Detecta trocas de cena (extra). | ffmpeg, orquestracao | `python3 scripts/estudio.py cenas in.mp4 --limiar 0.3` |
| 📋 | **Automatic Highlight Extraction** | Extrai melhores trechos. | orquestracao, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Best Moments** | Melhores momentos. | orquestracao, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Viral Hook Detection** | Identifica frases-gancho. | orquestracao, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Automatic B-Roll Suggestion** | Sugere B-roll. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **AI Cut on Beat** | Cortes no beat automáticos. | hyperframes, orquestracao | `python3 scripts/estudio.py montagem-ritmo saida.mp4 musica.mp3 clipes... (batidas detectadas automaticamente)` |
| ✅ | **Smart Silence Removal** | Remoção inteligente de silêncio. | ffmpeg, orquestracao | `python3 scripts/estudio.py silencio` |
| ✅ | **AI Auto Captions** *(teste pendente)* | Legendas automáticas. | orquestracao, remotion, whisper | `python3 scripts/estudio.py transcrever → *.legendas.json → LegendaDinamica / python3 scripts/estudio.py legendar` — LegendaDinamica testada com legendas de exemplo; falta testar a etapa de transcrição (modelo Whisper). |
| 📋 | **Smart Caption Styling** | Estilo de legenda escolhido pelo conteúdo. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Automatic Reframing** | Reenquadra para outra proporção. | ffmpeg, orquestracao | `python3 scripts/estudio.py reframe in out --formato 9:16 --modo crop\|blur --foco-x 0.5` |
| 📋 | **Face-Centered Crop** | Corte centrado no rosto. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Video Summarization** | Resumo do vídeo. | orquestracao, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Long Video to Shorts** | Vídeo longo em cortes curtos. | ffmpeg, orquestracao, whisper | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Storyboard Generation** | Storyboard gerado por IA. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Scene Classification** | Classifica cenas. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Automatic Color Matching** | Iguala cor entre tomadas. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Smart Sound Effects Placement** | Posiciona SFX automaticamente. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Music Suggestion** | Sugere trilha. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **AI Motion Graphics Selection** | Escolhe blocos de motion pelo conteúdo. | hyperframes, orquestracao | `python3 scripts/blocos.py sugerir "<descrição em inglês>" → python3 scripts/blocos.py renderizar <bloco> saida.mp4` |
| 📋 | **AI Quality Enhancement** | Melhoria de qualidade por IA. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Smart Video Upscaling** | Upscale por IA. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Content Repurposing** | Reaproveita conteúdo em vários formatos. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Automated Multi-Format Editing** | Exporta o mesmo vídeo em vários formatos. | ffmpeg, orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Edit by Reference** | Edição guiada por vídeo de referência. | orquestracao | `Skill /reverse-any-video (HyperFrames) + estudio.py cenas para ritmo de cortes` — Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **AI Shot Classification** | Classificação de planos (close, médio, aberto). | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |

## Modelos e formatos (`templates`)

✅ 8 · 🧪 0 · 🔌 0 · 📋 18

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Reels Template** | Vertical 1080x1920 com gancho, legendas, tarja, CTA e progresso. | ffmpeg, hyperframes, remotion | `Remotion: ReelsJuridico \| exportar --plataforma reels\|tiktok\|shorts` |
| ✅ | **TikTok Template** | Vertical 1080x1920 com gancho, legendas, tarja, CTA e progresso. | ffmpeg, hyperframes, remotion | `Remotion: ReelsJuridico \| exportar --plataforma reels\|tiktok\|shorts` |
| ✅ | **Shorts Template** | Vertical 1080x1920 com gancho, legendas, tarja, CTA e progresso. | ffmpeg, hyperframes, remotion | `Remotion: ReelsJuridico \| exportar --plataforma reels\|tiktok\|shorts` |
| 📋 | **YouTube Long Form** | 16:9 longo com capítulos. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **YouTube Intro** | Abertura e encerramento. | hyperframes, remotion | `npx remotion render src/index.ts AberturaYoutube out/abertura.mp4 --props='{"titulo":"Arthur Pires","subtitulo":"Direito explicado"}' (Remotion: AberturaYoutube)` |
| ✅ | **YouTube Outro** | Abertura e encerramento. | hyperframes, remotion | `npx remotion render src/index.ts EncerramentoYoutube out/encerramento.mp4 --props='{"titulo":"Obrigado por assistir","chamada":"Inscreva-se","cartoes":["Próximo vídeo","Recomendado"]}' (Remotion: EncerramentoYoutube)` |
| 📋 | **Podcast Clips** | Cortes de podcast. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Video Ads** | Anúncios. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Product Commercial** | Comercial de produto. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Event Aftermovie Template** | Resumo de evento. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Wedding Highlights** | Melhores momentos de casamento. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Testimonial Template** | Depoimento. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Documentary Template** | Documentário. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Educational Explainer** | Explicativo educacional. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **News Report** | Formato telejornal. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Corporate Presentation** | Apresentação institucional. | hyperframes, remotion | `npx hyperframes render projetos/apresentacao-institucional -o saida.mp4 (vídeo institucional 16:9, 4 cenas; editar textos no index.html)` |
| 📋 | **Brand Story** | História da marca. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Motivational Reel** | Reel motivacional. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Religious Worship Highlights** | Destaques de cultos/eventos religiosos. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Real Estate Showcase** | Vitrine de imóveis. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Legal Educational Content** | Conteúdo jurídico educativo (Provimento 205/2021). | hyperframes, remotion | `Remotion: ReelsJuridico + LegendaDinamica + LowerThird` |
| ✅ | **Social Media Announcement** | Anúncio para redes. | hyperframes, remotion | `python3 scripts/blocos.py renderizar social-proof-card saida.mp4 --var brand=… \| python3 scripts/blocos.py sobrepor video.mp4 social-proof-card saida.mp4 --inicio 1 \| alternativas: cta-lockup` |
| 📋 | **Countdown Event Teaser** | Contagem regressiva. | hyperframes, remotion | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Product Showcase** | Vitrine de produto. | remotion, hyperframes | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Interview Highlights** | Melhores momentos de entrevista com tarjas e legendas. | remotion, hyperframes | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Social Story** | Stories 9:16 de 15 s com CTA. | remotion, hyperframes | Especificação para futura implementação; não presumir que o efeito já execute. |

## Ferramentas do estúdio (`infraestrutura`)

✅ 15 · 🧪 0 · 🔌 0 · 📋 9

| | Recurso | Descrição | Motores | Como usar / observação |
|---|---|---|---|---|
| ✅ | **Multitrack Timeline** | Linha do tempo com trilhas. | hyperframes, orquestracao, remotion | `python3 scripts/projeto.py timeline <projeto> (HyperFrames: trilhas e clipes; Remotion: composições) \| prévia: projeto.py previa iniciar` |
| ✅ | **Keyframe Editor** | Edição de keyframes. | hyperframes, orquestracao, remotion | `python3 scripts/projeto.py keyframes <projeto-hf> [--seletor "#id"] [--imagem onion.png]` |
| ✅ | **Easing Curves** | Easing e curvas. | hyperframes, orquestracao, remotion | `Remotion: curvas.saida / curvas.cinematica / molas.natural (src/curvas.ts) \| GSAP: power3.out, back.out(1.7)…` |
| ✅ | **Preset Library** | Presets de cor, transição, legenda, plataforma e SFX. | ffmpeg, orquestracao, remotion | `python3 scripts/estudio.py <comando> -h lista os presets` |
| ✅ | **Live Preview** | Pré-visualização interativa. | hyperframes, orquestracao, remotion | `python3 scripts/projeto.py previa iniciar\|status\|parar <projeto> [--porta 3000]` |
| ✅ | **Undo History** | Histórico/versões. | git, hyperframes, orquestracao | `python3 scripts/projeto.py historico <projeto> (HyperFrames history + commits Git)` |
| ✅ | **Video Layers** | Composição em camadas. | hyperframes, orquestracao, remotion | `Remotion: camadas com <Sequence>/<AbsoluteFill> — ver composicoes/ReelsJuridico.tsx (vídeo, vinheta, legendas, gancho, tarja, CTA, progresso)` |
| 📋 | **Mask Editor** | Edição de máscaras. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Subtitle Editor** | Revisão de legendas. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Color Editor** | Ajuste fino de cor. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Reusable Templates** | Templates parametrizados. | orquestracao, remotion | `Remotion: ReelsJuridico, Vinheta, Vitrine` |
| ✅ | **Project Management** | Organização por projeto. | git, orquestracao | `projetos/<nome> + midia/brutos + midia/saida` |
| ✅ | **Aspect Ratio Presets** | Proporções e resoluções. | ffmpeg, orquestracao | `python3 scripts/estudio.py reframe / python3 scripts/estudio.py exportar` |
| 📋 | **Batch Export** | Vários formatos de uma vez. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **4K Rendering** | Exportação 3840x2160. | ffmpeg, orquestracao, remotion | `python3 scripts/estudio.py exportar --plataforma youtube-4k \| npx remotion render --scale 2` |
| ✅ | **Social Export Presets** | Resolução, fps, bitrate e loudness por plataforma. | ffmpeg, orquestracao | `python3 scripts/estudio.py exportar --plataforma reels\|tiktok\|shorts\|feed\|youtube\|linkedin\|whatsapp\|stories` |
| 📋 | **Licensed Audio Library** | Banco de músicas/SFX licenciados. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Asset Manager** | Fontes e identidade. | orquestracao, remotion | `projetos/remotion-base/src/marca.ts (Inter + Playfair Display via @fontsource)` |
| 📋 | **Scene Graph** | Grafo de cenas/camadas do projeto. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Render Queue** | Fila de renderizações. | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| 📋 | **Metadata Export** | Exportação de metadados (títulos, capítulos, legendas). | orquestracao | Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Catalog Search** | Busca no catálogo de recursos. | orquestracao, python | `python3 scripts/catalogo.py --buscar "<termo>" [--status implementado] [--categoria ...] [--motor ffmpeg]` |
| 📋 | **Production Checklist** | Checklist de produção e revisão antes da entrega. | orquestracao | `Ver 'Revisão visual' e 'Padrão de qualidade' na skill arthur-video-editor` — Especificação para futura implementação; não presumir que o efeito já execute. |
| ✅ | **Versioned Skill** | Skill do editor versionada no Git como memória técnica. | orquestracao | `Skill .claude/skills/arthur-video-editor/SKILL.md versionada no Git (diário em referencias/aprendizados.md)` |

## Presets

| Preset | Perfil | Formato | Efeitos implementados |
|---|---|---|---|
| **Cinematográfico premium** (`cinematic-premium`) | cinematica | 1080x1920 | 4/5 |
| **Reels dinâmico** (`reels-dinamico`) | social | 1080x1920 | 4/5 |
| **Documentário** (`documentario`) | documental | 1080x1920 | 2/5 |
| **Legendas dinâmicas** (`legendas-virais`) | social | 1080x1920 | 4/4 |
| **Evento emocional** (`evento-emocional`) | eventos | 1080x1920 | 3/5 |
| **Educativo jurídico** (`juridico-sobrio`) | institucional | 1080x1920 | 4/5 |
| **Luxo discreto** (`luxo`) | institucional | 1080x1920 | 2/5 |
| **Podcast vertical** (`podcast`) | social | 1080x1920 | 4/5 |
| **Viagem e aventura** (`viagem`) | eventos | 1080x1920 | 2/5 |
| **Evento religioso** (`religioso`) | eventos | 1080x1920 | 2/5 |
| **Tecnologia futurista** (`tecnologia`) | tech | 1080x1920 | 2/5 |
| **Explicativo animado** (`explicativo`) | educacao | 1080x1920 | 3/5 |
| **Apresentação corporativa** (`institucional`) | institucional | 1080x1920 | 5/5 |
| **Publicidade de produto** (`product-ad`) | publicidade | 1080x1920 | 3/5 |

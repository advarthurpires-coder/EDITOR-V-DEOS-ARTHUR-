# Remotion no Estúdio Arthur

Projeto: `projetos/remotion-base/` (Remotion 4.0.540, React 19, fontes via @fontsource).
Render: `cd projetos/remotion-base && npx remotion render src/index.ts <Composição> out/arquivo.mp4 [--props=props.json]`
Prévia interativa: `npx remotion studio` (porta 3000). Quadro único: `npx remotion still src/index.ts <Comp> q.png --frame=90`.
Tipos: `npx tsc --noEmit -p .` antes de renderizar.
Mídia própria vai em `public/` e é referenciada com `staticFile("pasta/arquivo.mp4")`.

## Composições registradas (`src/Root.tsx`)

| id | Formato | Uso |
|---|---|---|
| `Vinheta` | 1080×1920, 4 s | Abertura simples com nome + subtítulo (props `titulo`, `subtitulo`) |
| `ArthurShowcase` | 1080×1920, ~10,7 s | Demonstração vertical: kinetic hook, chart grow/contador, phone mockup com legenda gigante e pop-up, title card em vidro |
| `Vitrine` | 1920×1080, 12 s | Demonstração de todos os componentes e transições — referência visual e teste |
| `AberturaYoutube` | 1920×1080, 4 s | Abertura de canal: título cinematográfico, vinheta e grão (props `titulo`, `subtitulo`) |
| `EncerramentoYoutube` | 1920×1080, 10 s | Encerramento com chamada e cartões para elementos finais (props `titulo`, `chamada`, `cartoes[]`) |
| `TransicaoShader` | conforme props | Transição GLSL entre dois clipes (use via `estudio.py transicao-shader`) |
| `ReelsJuridico` | 1080×1920, `duracaoSegundos` | Template de Reels: gancho, vídeo de fundo, legendas, tarja, CTA, progresso |

### Props do `ReelsJuridico`
```json
{
  "video": "brutos/fala.mp4",          // opcional; em public/ ou URL. Sem vídeo = fundo em degradê da marca
  "gancho": "Atenção ao prazo!",       // aparece 0–2,5 s, com pop
  "legendas": [ {"text":" palavra","startMs":0,"endMs":300,"timestampMs":150,"confidence":null} ],
  "estiloLegenda": "karaoke",          // palavra | karaoke | pop | destaque | gigante
  "nome": "Dr. Arthur Pires", "cargo": "Advogado",   // tarja 2,5–6,5 s
  "cta": "Siga para mais conteúdos jurídicos",       // últimos 3 s
  "duracaoSegundos": 42
}
```
`legendas: []` usa `public/legendas-exemplo.json` (demonstração). Em produção, use o `.legendas.json`
gerado por `python3 scripts/estudio.py transcrever`.

## Componentes (`src/componentes/`, exportados por `index.ts`)

| Componente | Props principais | Catálogo |
|---|---|---|
| `LegendaDinamica` | `legendas: Caption[]`, `estilo`, `agruparMs=1200`, `posicaoY=0.6`, `corDestaque`, `tamanho` | word-by-word, karaoke, pop-up, bounce, highlight box, giant |
| `LowerThird` | `nome`, `cargo`, `duracaoFrames`, `posicao` | Lower Thirds |
| `TituloCinematico` | `titulo`, `subtitulo`, `fundo` | Cinematic Titles, Text Tracking, Text Reveal |
| `ContadorDados` | `de`, `ate`, `duracaoFrames`, `prefixo`, `sufixo`, `casas`, `rotulo` | Data Counter (pt-BR) |
| `BarraProgresso` | `posicao`, `altura`, `cor` | Progress Bars, Subtitle Progress |
| `ChecklistAnimado` | `itens[]`, `intervaloFrames`, `tamanho` | Animated Checklists, Stagger |
| `KenBurns` | `src`, `movimento` (push-in, pull-back, pan-esquerda, pan-direita, drone), `intensidade` | Push In, Dolly, Virtual Drone |
| `MaquinaEscrever` | `texto`, `caracteresPorFrame`, `tamanho` | Typewriter |
| `Vinheta`, `GraoFilme` | `intensidade` / `opacidade` | Vignette, Film Grain |
| `TremorCamera` | `amplitude`, `velocidade` (envolve filhos) | Handheld, Camera Shake |
| `TransicaoShader` | `videoA`, `videoB`, `shader`, `duracaoA/B`, `transicao`, `largura`, `altura`, `fps` | 9 transições GLSL (shaders em `src/shaders/transicoes.ts`) |
| `Gancho`, `Cta` (em `composicoes/ReelsJuridico.tsx`) | `texto` | Kinetic Hook |

Transições (pacote `@remotion/transitions`, ver `Vitrine.tsx`): `fade()`, `slide({direction})`, `wipe({direction})`,
`flip()`, `clockWipe({width,height})` dentro de `<TransitionSeries>`; timing `linearTiming` ou `springTiming`.

## Curvas de animação

`src/curvas.ts`: `curvas.suave|entrada|saida|expressiva|recuo|elastica|quique|cinematica` (para `interpolate`) e
`molas.suave|natural|elastica|pesada` (para `spring`). Equivalentes GSAP no comentário do arquivo.

## Convenções
- Todo componente novo: arquivo em `src/componentes/`, export em `index.ts`, uso demonstrado na `Vitrine` ou numa
  composição de teste, render conferido por `still`, item atualizado no catálogo.
- Use `marca.ts` para cores/fontes — nunca cores soltas.
- Nada de `Math.random()`: use `random(seed)` do Remotion (render determinístico).
- O Chrome de render é o Chromium local (`REMOTION_BROWSER_EXECUTABLE`); o download do Chrome da Remotion é bloqueado na rede atual.

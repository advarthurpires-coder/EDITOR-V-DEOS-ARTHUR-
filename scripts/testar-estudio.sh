#!/usr/bin/env bash
# Testa todos os comandos do estudio.py com mídia sintética. Uso: bash scripts/testar-estudio.sh
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
E="python3 $ROOT/scripts/estudio.py"
T="${1:-$(mktemp -d)}"; mkdir -p "$T"; cd "$T"
ok=0; falha=0
checa() { # nome arquivo [duracao_min]
  local d; d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$2" 2>/dev/null)
  if [ -s "$2" ] && [ -n "$d" ] && awk "BEGIN{exit !($d > ${3:-0.04})}"; then echo "  ✅ $1 (${d%.*}s)"; ok=$((ok+1)); else echo "  ❌ $1"; falha=$((falha+1)); fi
}
t() { local nome=$1 saida=$2; shift 2; if "$@" >/dev/null 2>"$nome.err"; then checa "$nome" "$saida"; else echo "  ❌ $nome: $(tail -2 "$nome.err")"; falha=$((falha+1)); fi; }

echo "Gerando mídia de teste em $T"
ffmpeg -v error -y -f lavfi -i "testsrc2=size=1920x1080:rate=30" -f lavfi -i "sine=frequency=330:sample_rate=48000" -t 4 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest a.mp4
ffmpeg -v error -y -f lavfi -i "smptebars=size=1920x1080:rate=30" -f lavfi -i "sine=frequency=550:sample_rate=48000" -t 4 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest b.mp4
ffmpeg -v error -y -f lavfi -i "color=c=0x00FF00:s=1920x1080:r=30,drawbox=x=760:y=340:w=400:h=400:color=red:t=fill" -t 3 -c:v libx264 -pix_fmt yuv420p verde.mp4
ffmpeg -v error -y -f lavfi -i "gradients=s=1920x1080:c0=0x0b1d33:c1=0xe8c77a:n=2" -frames:v 1 foto.jpg
# fala sintética: tom com pausas (para remoção de silêncio e ducking)
ffmpeg -v error -y -f lavfi -i "testsrc2=size=1280x720:rate=30" -f lavfi -i "sine=frequency=220:sample_rate=48000,volume='if(lt(mod(t,2),1),1,0)':eval=frame" -t 6 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest fala.mp4
ffmpeg -v error -y -f lavfi -i "sine=frequency=880:sample_rate=48000" -t 8 musica.mp3
printf '1\n00:00:00,000 --> 00:00:02,000\nVocê conhece seus direitos?\n\n2\n00:00:02,000 --> 00:00:04,000\nO prazo é de dez anos.\n' > leg.srt

echo "Cor:";       for p in teal-orange dark-moody warm-film pb luxo-dourado cinematic natural; do t "cor $p" cor-$p.mp4 $E cor a.mp4 cor-$p.mp4 --preset $p; done
t "cor intensidade 0.5" cor-mix.mp4 $E cor a.mp4 cor-mix.mp4 --preset teal-orange --intensidade 0.5
echo "VFX:";       for f in grao vhs aberracao glow rastro tremor handheld zoom-in zoom-out vinheta isolar-cor; do t "vfx $f" vfx-$f.mp4 $E vfx a.mp4 vfx-$f.mp4 --efeito $f; done
echo "Transições:"; for x in fade flash fade-preto wipe-esquerda slide-esquerda push-esquerda zoom circulo-abre pixel radial fade-cinza; do t "transicao $x" tr-$x.mp4 $E transicao a.mp4 b.mp4 tr-$x.mp4 --tipo $x; done
echo "Reframe:";   t "reframe 9:16 crop" rf-crop.mp4 $E reframe a.mp4 rf-crop.mp4 --formato 9:16; t "reframe 9:16 blur" rf-blur.mp4 $E reframe a.mp4 rf-blur.mp4 --formato 9:16 --modo blur
echo "Tempo:";     t "câmera lenta 0.5x" vel-lenta.mp4 $E velocidade a.mp4 vel-lenta.mp4 --fator 0.5; t "acelerado 2x" vel-rapida.mp4 $E velocidade a.mp4 vel-rapida.mp4 --fator 2
                   t "reverso" vel-rev.mp4 $E velocidade a.mp4 vel-rev.mp4 --reverso; t "freeze frame" freeze.mp4 $E congelar a.mp4 freeze.mp4 --em 2 --duracao 1.5
echo "Áudio:";     t "tratamento de voz" aud.mp4 $E audio fala.mp4 aud.mp4 --lufs -14 --ruido --voz-eq --compressor --fade-in 0.3 --fade-out 0.5
                   t "ducking" duck.mp4 $E ducking fala.mp4 musica.mp3 duck.mp4; t "remover silêncio" sil.mp4 $E silencio fala.mp4 sil.mp4
echo "Composição:"; t "chroma key" chroma.mp4 $E chroma verde.mp4 foto.jpg chroma.mp4; t "split screen" split.mp4 $E split a.mp4 b.mp4 split.mp4
                   t "picture in picture" pip.mp4 $E pip a.mp4 b.mp4 pip.mp4; t "foto ken burns" foto.mp4 $E foto foto.jpg foto.mp4 --duracao 3
                   t "foto drone 9:16" foto-drone.mp4 $E foto foto.jpg foto-drone.mp4 --movimento drone --formato 9:16 --duracao 3
echo "Legendas:";  for s in classico reels gigante caixa; do t "legenda $s" leg-$s.mp4 $E legendar a.mp4 leg.srt leg-$s.mp4 --estilo $s; done
echo "Saída:";     t "exportar reels" exp-reels.mp4 $E exportar a.mp4 exp-reels.mp4 --plataforma reels --modo blur; t "exportar whatsapp" exp-wpp.mp4 $E exportar a.mp4 exp-wpp.mp4 --plataforma whatsapp
                   t "cortar" corte.mp4 $E cortar a.mp4 corte.mp4 --inicio 1 --fim 3; t "juntar" junto.mp4 $E juntar junto.mp4 a.mp4 b.mp4 fala.mp4
echo "SFX:";       for x in whoosh impacto sub-boom riser riser-reverso clique pop notificacao drone braam batimento glitch; do t "sfx $x" sfx-$x.wav $E sfx $x sfx-$x.wav; done
c=$($E cenas junto.mp4 2>/dev/null); echo "  cenas: $c"; echo "$c" | grep -q '"total": [1-9]' && ok=$((ok+1)) || { echo "  ❌ cenas"; falha=$((falha+1)); }

echo; echo "Resultado: $ok ok, $falha com falha (arquivos em $T)"
[ "$falha" -eq 0 ]

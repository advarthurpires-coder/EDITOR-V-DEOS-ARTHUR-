/** Capítulos 11–14: áudio/narração, inteligência artificial, templates e infraestrutura. */
import React from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from "remotion";
import audioDemo from "../data/audio-demo.json";
import loud from "../data/loudness.json";
import analise from "../data/audio-analise.json";
import {C, F, STATUS_COR, STATUS_NOME} from "../tema";
import {Chip, Counter, EO, Frame, GoldText, GravityDrop, I, Seq, glass, useSpring} from "../fx";
import {Shot} from "../shots";
import {BLOCOS, DURACAO, EfeitoTag, STAGE, STATS, catStats, rmsAt, sfxRmsAt, useAbsFrame} from "../comum";

const W = STAGE.width;
const tagRow = {left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"} as const;
const fmt = (n: number) => n.toFixed(1).replace(".", ",").replace("-", "−");

// =================================================================== 11 ÁUDIO & NARRAÇÃO
const Wave: React.FC<{data: number[]; color: string; w: number; h: number; reveal?: number}> = ({data, color, w, h, reveal = 1}) => {
  const bw = w / data.length;
  return (
    <svg width={w} height={h}>
      {data.map((v, i) => {
        const bh = Math.max(2, v * h * 0.95);
        return <rect key={i} x={i * bw} y={(h - bh) / 2} width={bw * 0.62} height={bh} rx={1.5} fill={color} opacity={i / data.length <= reveal ? 1 : 0.12} />;
      })}
    </svg>
  );
};
const Limpeza: React.FC = () => {
  const f = useCurrentFrame();
  const rev = I(f, [30, 90], [0, 1], Easing.inOut(Easing.cubic));
  return (
    <div style={{...glass(0.06), padding: 34, width: W}}>
      <div style={{fontFamily: F.mono, fontSize: 22, color: C.cinza, letterSpacing: 3}}>ANTES · VOZ + RUÍDO</div>
      <Wave data={audioDemo.antes} color="#8a93a6" w={W - 68} h={150} />
      <div style={{fontFamily: F.mono, fontSize: 22, color: C.ouroClaro, letterSpacing: 3, marginTop: 18}}>DEPOIS · PRESET limpar-audio</div>
      <Wave data={audioDemo.depois} color={C.ouro} w={W - 68} h={150} reveal={rev} />
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18}}>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.branco}}>
          Ruído de fundo <span style={{color: C.cinza}}>{fmt(audioDemo.ruidoAntesDb)}</span> → <GoldText>{fmt(audioDemo.ruidoDepoisDb)} dBFS</GoldText>
        </div>
      </div>
      <div style={{fontFamily: F.mono, fontSize: 17, color: C.cinza, marginTop: 10}}>{audioDemo.filtro} · amostra de voz em domínio público</div>
    </div>
  );
};
const Fader: React.FC<{label: string; level: number; meter: number; note?: string}> = ({label, level, meter, note}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 150}}>
    <div style={{position: "relative", width: 60, height: 330, borderRadius: 14, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)"}}>
      <div style={{position: "absolute", left: 8, right: 34, bottom: 8, height: Math.max(0, meter) * 310, borderRadius: 6, background: `linear-gradient(0deg, ${C.verde}, ${C.ouro} 70%, #ff6b6b)`}} />
      <div style={{position: "absolute", right: 8, width: 18, top: 8, bottom: 8, borderRadius: 9, background: "rgba(0,0,0,.4)"}} />
      <div style={{position: "absolute", right: -4, width: 42, height: 22, borderRadius: 6, background: C.ouroClaro, bottom: 8 + level * 290, boxShadow: "0 4px 10px #000a"}} />
    </div>
    <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 26, color: C.branco}}>{label}</div>
    {note && <div style={{fontFamily: F.mono, fontSize: 16, color: C.cinza, textAlign: "center"}}>{note}</div>}
  </div>
);
const Mixer: React.FC = () => {
  const f = useCurrentFrame();
  const abs = useAbsFrame();
  const lufs = interpolate(f, [10, 70], [-30, loud.integrado], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const ok = f >= 78;
  const okS = useSpring(78, 10, 200);
  return (
    <div style={{...glass(0.06), padding: 34, width: W, display: "flex", gap: 30, alignItems: "flex-start"}}>
      <Fader label="TRILHA" level={0.72} meter={rmsAt(abs) * 0.9} />
      <Fader label="SFX" level={0.62} meter={sfxRmsAt(abs) * 0.9} />
      <Fader label="VOZ" level={0} meter={0} note={"sem narração\nneste vídeo"} />
      <div style={{flex: 1, paddingTop: 10}}>
        <div style={{fontFamily: F.mono, fontSize: 21, color: C.cinza, letterSpacing: 2}}>LOUDNESS INTEGRADO</div>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 84, color: C.branco, lineHeight: 1.1}}>{fmt(lufs)}<span style={{fontSize: 34, color: C.ouro}}> LUFS</span></div>
        <div style={{fontFamily: F.mono, fontSize: 21, color: C.cinza, marginTop: 6}}>TRUE PEAK {fmt(loud.truePeak)} dBTP · LRA {fmt(loud.lra)} LU</div>
        <div style={{marginTop: 26, transform: `scale(${ok ? okS : 0})`, transformOrigin: "0 50%"}}>
          <Chip label="META REELS −14 LUFS ✓" color={C.verde} size={22} />
        </div>
        <div style={{marginTop: 16}}><Chip label="TTS LICENCIADO: NÃO INSTALADO" color={STATUS_COR.catalogado} size={16} /></div>
      </div>
    </div>
  );
};
export const Cap11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < 120 && <div style={{position: "absolute", top: 40}}><Limpeza /></div>}
      {f >= 120 && <Seq from={120}><div style={{position: "absolute", top: 60}}><Mixer /></div></Seq>}
      <EfeitoTag nome="NOISE REDUCTION · FFMPEG afftdn" at={6} until={118} style={tagRow} />
      <EfeitoTag nome="MIXAGEM · DUCKING · LOUDNESS" at={122} style={tagRow} />
    </AbsoluteFill>
  );
};

// =================================================================== 12 INTELIGÊNCIA ARTIFICIAL
const Rede: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [4, 6, 6, 3];
  const pos = cols.map((n, c) => Array.from({length: n}, (_, i) => [60 + c * 245, 50 + ((i + 0.5) * 380) / n]));
  return (
    <svg width={W} height={430}>
      {pos.slice(0, -1).map((col, c) =>
        col.map((a, i) =>
          pos[c + 1].map((b, j) => {
            const ph = (f / 20 + (i + j) * 0.13 + c * 0.3) % 1;
            return (
              <g key={`${c}-${i}-${j}`}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.azulLuz} strokeOpacity={0.18} strokeWidth={1.5} />
                {random(`n${c}${i}${j}`) > 0.6 && <circle cx={a[0] + (b[0] - a[0]) * ph} cy={a[1] + (b[1] - a[1]) * ph} r={4} fill={C.ouroClaro} />}
              </g>
            );
          }),
        ),
      )}
      {pos.flat().map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={14} fill={C.preto} stroke={C.ouro} strokeWidth={3} style={{filter: `drop-shadow(0 0 ${6 + Math.sin(f / 6 + i) * 5}px ${C.ouro})`}} />
      ))}
    </svg>
  );
};
const Pipeline: React.FC = () => {
  const passos: [string, string, string][] = [["ÁUDIO", "FFmpeg 16 kHz", "exemplo_executavel"], ["WHISPER.CPP", "modelo PT pendente", "integracao_nativa"], ["SRT / VTT", "tempo por palavra", "integracao_nativa"], ["LEGENDA ANIMADA", "Remotion · HyperFrames", "exemplo_executavel"]];
  return (
    <div style={{display: "flex", gap: 10, justifyContent: "space-between"}}>
      {passos.map(([t, s, e], i) => {
        const k = useSpring(20 + i * 8, 14, 160);
        return (
          <div key={t} style={{...glass(0.07), borderRadius: 20, width: 205, padding: "18px 14px", textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 40}px)`, borderColor: `${STATUS_COR[e]}88`}}>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 22, color: C.branco}}>{t}</div>
            <div style={{fontFamily: F.mono, fontSize: 15, color: C.cinza, marginTop: 6}}>{s}</div>
            <div style={{fontFamily: F.mono, fontSize: 14, color: STATUS_COR[e], marginTop: 8, letterSpacing: 1}}>● {STATUS_NOME[e]}</div>
          </div>
        );
      })}
    </div>
  );
};
const Selecao: React.FC = () => {
  const f = useCurrentFrame();
  const scan = I(f, [2, 40], [0, 1]);
  const scores = Array.from({length: 9}, (_, i) => 0.35 + random(`sc${i}`) * 0.6);
  const order = scores.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
  const picks = [38, 56, 74];
  return (
    <div style={{position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, width: W}}>
      {scores.map((s, i) => {
        const rank = order.indexOf(i);
        const picked = rank < 3 && f >= picks[rank];
        return (
          <div key={i} style={{position: "relative", height: 200, borderRadius: 16, overflow: "hidden", boxShadow: picked ? `0 0 0 4px ${C.ouroClaro}, 0 0 30px ${C.ouro}` : "0 0 0 1px #ffffff22", opacity: f > 80 && !picked ? 0.35 : 1}}>
            <Shot v={i} t={f} w={277} h={200} />
            <div style={{position: "absolute", left: 10, right: 10, bottom: 10, height: 10, borderRadius: 5, background: "#0008"}}>
              <div style={{width: `${s * 100 * I(f, [10 + i * 3, 34 + i * 3], [0, 1])}%`, height: "100%", borderRadius: 5, background: rank < 3 ? C.ouro : C.azulLuz}} />
            </div>
            {picked && <div style={{position: "absolute", right: 10, top: 10, fontFamily: F.display, fontWeight: 900, fontSize: 30, color: C.preto, background: C.ouroClaro, borderRadius: 10, padding: "2px 12px"}}>#{rank + 1}</div>}
          </div>
        );
      })}
      <div style={{position: "absolute", left: 0, right: 0, top: scan * 640 - 4, height: 6, background: C.azulLuz, boxShadow: `0 0 30px ${C.azulLuz}`, opacity: scan < 1 ? 1 : 0}} />
    </div>
  );
};
const Quadro: React.FC = () => {
  const ids = ["ai-auto-captions", "smart-scene-detection", "ai-cut-on-beat", "automatic-reframing", "smart-silence-removal", "ai-music-suggestion"];
  const itens = catStats("automacao_ia").itens.filter((x) => ids.includes(x.id.split(".")[1]));
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 14, width: W}}>
      <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 46, color: C.branco, letterSpacing: -1}}>O que roda hoje <GoldText>e o que vem aí</GoldText></div>
      {itens.map((x, i) => {
        const k = useSpring(4 + i * 6, 14, 180);
        return (
          <div key={x.id} style={{...glass(0.06), borderRadius: 18, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: k, transform: `translateX(${(1 - k) * 200}px)`}}>
            <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 30, color: C.branco}}>{x.nome}</span>
            <Chip label={STATUS_NOME[x.status]} color={STATUS_COR[x.status]} size={18} />
          </div>
        );
      })}
    </div>
  );
};
export const Cap12: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < 100 && (
        <div>
          <Rede />
          <div style={{marginTop: 10}}><Pipeline /></div>
        </div>
      )}
      {f >= 100 && f < 200 && <Seq from={100}><div style={{position: "absolute", top: 40}}><Selecao /></div></Seq>}
      {f >= 200 && <Seq from={200}><div style={{position: "absolute", top: 10}}><Quadro /></div></Seq>}
      <EfeitoTag nome="LEGENDAGEM AUTOMÁTICA · PIPELINE" estado="integracao_nativa" at={6} until={98} style={tagRow} />
      <EfeitoTag nome="SELEÇÃO DE CENAS · SIMULAÇÃO VISUAL" estado="catalogado" at={102} until={198} style={tagRow} />
      <EfeitoTag nome="ESTADO REAL DO CATÁLOGO" at={202} style={{...tagRow, top: 760}} />
    </AbsoluteFill>
  );
};

// =================================================================== 13 TEMPLATES
const TplReels: React.FC<{f: number}> = ({f}) => (
  <div style={{position: "relative", width: "100%", height: "100%", background: "#000"}}>
    <Shot v={4} t={f} w={240} h={420} />
    <div style={{position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", fontFamily: F.display, fontWeight: 900, fontSize: 30, color: "#fff", lineHeight: 1.1}}>VOCÊ<br /><span style={{color: C.ouroClaro}}>SABIA?</span></div>
    <div style={{position: "absolute", bottom: 60, left: 16, right: 16, textAlign: "center", fontFamily: F.display, fontWeight: 800, fontSize: 18, color: "#000", background: C.ouro, borderRadius: 8, padding: 4}}>legenda dinâmica</div>
  </div>
);
const TplYoutube: React.FC<{f: number}> = ({f}) => (
  <div style={{position: "relative", width: "100%", height: "100%", background: "#000"}}>
    <Shot v={0} t={f} w={420} h={236} />
    <div style={{position: "absolute", left: 16, bottom: 30, background: `${C.preto}dd`, borderLeft: `5px solid ${C.ouro}`, padding: "6px 12px", fontFamily: F.corpo, fontWeight: 700, fontSize: 18, color: "#fff"}}>Lower third · Nome<br /><span style={{fontWeight: 400, fontSize: 14, color: C.cinza}}>cargo / tema</span></div>
    <div style={{position: "absolute", left: 0, bottom: 0, height: 5, width: `${(f % 120) / 1.2}%`, background: "#ff3333"}} />
  </div>
);
const TplAd: React.FC<{f: number}> = ({f}) => (
  <div style={{position: "relative", width: "100%", height: "100%", background: `linear-gradient(150deg, ${C.azul2}, ${C.preto})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14}}>
    <div style={{fontFamily: F.mono, fontSize: 16, letterSpacing: 6, color: C.ouro}}>LANÇAMENTO</div>
    <div style={{width: 120, height: 120, borderRadius: 30, background: `linear-gradient(145deg, ${C.ouroClaro}, ${C.ouroEscuro})`, transform: `rotate(${Math.sin(f / 12) * 8}deg)`}} />
    <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 30, color: "#fff"}}>SEU PRODUTO</div>
    <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 18, color: C.preto, background: C.ouroClaro, padding: "8px 22px", borderRadius: 999}}>SAIBA MAIS</div>
  </div>
);
const TplEvento: React.FC<{f: number; count: number}> = ({count}) => (
  <div style={{position: "relative", width: "100%", height: "100%", background: "radial-gradient(circle, #2a1a3a, #07050c 75%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
    <div style={{fontFamily: F.mono, fontSize: 18, letterSpacing: 6, color: C.ouro}}>EVENTO · CONTAGEM</div>
    <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 150, color: "#fff", lineHeight: 1}}><GoldText>{count}</GoldText></div>
    <div style={{fontFamily: F.corpo, fontSize: 20, color: C.cinza}}>teaser · countdown</div>
  </div>
);
export const Cap13: React.FC = () => {
  const f = useCurrentFrame();
  const count = f < 201 ? 3 : f < 210 ? 3 : f < 219 ? 2 : 1;
  const cards = [
    {nome: "REELS 9:16", w: 240, h: 420, node: <TplReels f={f} />},
    {nome: "YOUTUBE 16:9", w: 420, h: 236, node: <TplYoutube f={f} />},
    {nome: "PUBLICIDADE", w: 320, h: 320, node: <TplAd f={f} />},
    {nome: "EVENTOS", w: 320, h: 320, node: <TplEvento f={f} count={count} />},
  ];
  const home = [[30, 20], [420, 60], [40, 420], [450, 360]];
  const focusAt = [60, 102, 141, 180];
  const focus = focusAt.filter((t) => f >= t).length - 1;
  return (
    <AbsoluteFill>
      {cards.map((c, i) => {
        const isF = focus === i;
        const fIn = isF ? I(f, [focusAt[i], focusAt[i] + 10], [0, 1], EO) : 0;
        const fOut = isF && i < 3 ? I(f, [focusAt[i + 1] - 6, focusAt[i + 1]], [0, 1]) : 0;
        const z = fIn * (1 - fOut);
        const scale = 1 + z * (i === 1 ? 0.85 : i === 0 ? 0.55 : 0.75);
        const cx = home[i][0] + c.w / 2, cy = home[i][1] + c.h / 2;
        const tx = (W / 2 - cx) * z, ty = (340 - cy) * z;
        return (
          <div key={c.nome} style={{position: "absolute", left: home[i][0], top: home[i][1], zIndex: isF ? 5 : 1, transform: `translate(${tx}px, ${ty}px) scale(${scale})`, opacity: focus >= 0 && !isF ? 0.45 : 1}}>
            <GravityDrop delay={12 + i * 6} from={-1100} rotate={i % 2 ? 14 : -14}>
              <Frame w={c.w} h={c.h} radius={20}>{c.node}</Frame>
              <div style={{fontFamily: F.mono, fontSize: 20, color: C.ouroClaro, marginTop: 10, letterSpacing: 2}}>{c.nome}</div>
            </GravityDrop>
          </div>
        );
      })}
      <EfeitoTag nome="TEMPLATES PARAMETRIZADOS" at={36} style={tagRow} />
    </AbsoluteFill>
  );
};

// =================================================================== 14 INFRAESTRUTURA
const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  const tw = W - 150;
  const x = (frame: number) => (frame / DURACAO) * tw;
  const ph = I(f, [4, 104], [0, DURACAO], Easing.inOut(Easing.quad));
  const tracks = ["VÍDEO", "SFX", "TRILHA"];
  return (
    <div style={{...glass(0.06), padding: 26, width: W}}>
      <div style={{fontFamily: F.mono, fontSize: 21, color: C.cinza, letterSpacing: 2, marginBottom: 14}}>TIMELINE REAL DESTE REELS · {BLOCOS.length} BLOCOS · {analise.cues.length} SFX</div>
      <div style={{position: "relative", marginLeft: 120}}>
        {[0, 30, 60, 90, 120, 150].map((s) => (
          <div key={s} style={{position: "absolute", left: x(s * 30), top: -4, fontFamily: F.mono, fontSize: 14, color: C.cinza}}>{s}s</div>
        ))}
      </div>
      {tracks.map((t, r) => (
        <div key={t} style={{display: "flex", alignItems: "center", height: 84, marginTop: r ? 10 : 24}}>
          <div style={{width: 120, fontFamily: F.display, fontWeight: 800, fontSize: 20, color: C.branco}}>{t}</div>
          <div style={{position: "relative", width: tw, height: 70, background: "rgba(255,255,255,.04)", borderRadius: 10, overflow: "hidden"}}>
            {r === 0 && BLOCOS.map((b, i) => (
              <div key={b.id} style={{position: "absolute", left: x(b.from) + 1, width: Math.max(2, x(b.dur) - 2), top: 6, bottom: 6, borderRadius: 6, background: i % 2 ? C.ouro : C.ouroEscuro, opacity: I(f, [i * 1.5, i * 1.5 + 6], [0, 1])}} />
            ))}
            {r === 1 && analise.cues.map((c, i) => (
              <div key={i} style={{position: "absolute", left: x(c.t * 30), width: 2, top: 10 + (i % 3) * 16, height: 18, background: C.azulLuz, opacity: I(f, [10 + i * 0.3, 16 + i * 0.3], [0, 1])}} />
            ))}
            {r === 2 && (
              <svg width={tw} height={70}>
                {Array.from({length: 140}, (_, i) => {
                  const v = analise.rms[Math.floor((i / 140) * analise.rms.length)] ?? 0;
                  return <rect key={i} x={(i * tw) / 140} y={35 - v * 30} width={tw / 140 - 1} height={v * 60} fill="#7ee0c3" opacity={0.8} />;
                })}
              </svg>
            )}
          </div>
        </div>
      ))}
      <div style={{position: "absolute", left: 26 + 120 + x(ph), top: 70, width: 3, height: 300, background: "#fff", boxShadow: "0 0 12px #fff"}} />
    </div>
  );
};
const Busca: React.FC = () => {
  const f = useCurrentFrame();
  const q = "zoom";
  const typed = q.slice(0, Math.max(0, Math.min(q.length, Math.floor((f - 7) / 6))));
  const res = STATS.buscaZoom;
  return (
    <div style={{width: W}}>
      <div style={{...glass(0.08), borderRadius: 20, padding: "18px 26px", display: "flex", gap: 18, alignItems: "center"}}>
        <span style={{fontFamily: F.mono, fontSize: 26, color: C.ouro}}>$ catalogo.py --buscar</span>
        <span style={{fontFamily: F.mono, fontSize: 30, color: C.branco}}>“{typed}<span style={{opacity: f % 16 < 8 ? 1 : 0}}>|</span>”</span>
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 10, marginTop: 16}}>
        {res.slice(0, 5).map((r, i) => {
          const k = useSpring(34 + i * 4, 15, 180);
          return (
            <div key={r.id} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderRadius: 14, background: "rgba(255,255,255,.05)", opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>
              <span style={{fontFamily: F.mono, fontSize: 21, color: C.branco}}>{r.id}</span>
              <Chip label={STATUS_NOME[r.status]} color={STATUS_COR[r.status]} size={15} />
            </div>
          );
        })}
      </div>
      <div style={{fontFamily: F.mono, fontSize: 20, color: C.cinza, marginTop: 14}}>Total: {res.length} · {STATS.presets.length} PRESETS DE ESTILO</div>
      <div style={{display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10}}>
        {STATS.presets.slice(0, 8).map((p, i) => (
          <span key={p.id} style={{fontFamily: F.mono, fontSize: 16, color: C.ouroClaro, border: `1px solid ${C.ouro}77`, borderRadius: 999, padding: "4px 12px", opacity: I(f, [50 + i * 2, 56 + i * 2], [0, 1])}}>{p.nome}</span>
        ))}
      </div>
    </div>
  );
};
const Export: React.FC = () => {
  const f = useCurrentFrame();
  const p = I(f, [8, 84], [0, 1], Easing.inOut(Easing.quad));
  const done = f >= 89;
  const s = useSpring(89, 9, 200);
  const specs = ["H.264 High · yuv420p · Rec.709", "1080 × 1920 · 30 fps · faststart", "AAC 48 kHz estéreo · 128 kbps", `${fmt(loud.integrado)} LUFS · true peak ${fmt(loud.truePeak)} dBTP`];
  return (
    <div style={{...glass(0.07), padding: 36, width: W}}>
      <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 46, color: C.branco}}>EXPORTAÇÃO <GoldText>INSTAGRAM</GoldText></div>
      <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 20}}>
        {specs.map((x, i) => (
          <div key={x} style={{fontFamily: F.mono, fontSize: 25, color: C.cinza, opacity: I(f, [i * 4, i * 4 + 8], [0, 1])}}><span style={{color: C.verde}}>✓</span> {x}</div>
        ))}
      </div>
      <div style={{marginTop: 30, height: 26, borderRadius: 13, background: "rgba(255,255,255,.1)", overflow: "hidden"}}>
        <div style={{width: `${p * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.ouroEscuro}, ${C.ouroClaro})`, boxShadow: `0 0 20px ${C.ouro}`}} />
      </div>
      <div style={{display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: F.mono, fontSize: 24, color: C.branco}}>
        <span>RENDER {Math.round(p * DURACAO)} / {DURACAO} frames</span>
        <span><Counter to={100} start={8} dur={76} suffix="%" /></span>
      </div>
      <div style={{marginTop: 22, transform: `scale(${done ? s : 0})`, transformOrigin: "0 50%"}}><Chip label="ARQUIVO PRONTO PARA PUBLICAÇÃO" color={C.verde} size={22} /></div>
    </div>
  );
};
export const Cap14: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < 110 && <div style={{position: "absolute", top: 40}}><Timeline /></div>}
      {f >= 110 && f < 190 && <Seq from={110}><div style={{position: "absolute", top: 20}}><Busca /></div></Seq>}
      {f >= 190 && <Seq from={190}><div style={{position: "absolute", top: 40}}><Export /></div></Seq>}
      <EfeitoTag nome="MULTITRACK TIMELINE · DADOS REAIS" at={6} until={108} style={tagRow} />
      <EfeitoTag nome="CATALOG SEARCH · PRESET LIBRARY" at={112} until={188} style={{...tagRow, top: 772}} />
      <EfeitoTag nome="SOCIAL EXPORT PRESET" at={192} style={tagRow} />
    </AbsoluteFill>
  );
};

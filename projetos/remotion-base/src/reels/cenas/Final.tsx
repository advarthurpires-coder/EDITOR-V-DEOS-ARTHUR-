/** 146–158 s grande montagem final · 158–168 s encerramento premium. */
import React from "react";
import {AbsoluteFill, Easing, Sequence, useCurrentFrame} from "remotion";
import {C, F, GRAD_OURO} from "../tema";
import {Counter, EO, EXPO_I, Glitch, GoldText, I, KineticWords, LightLeak, Particles, useSpring} from "../fx";
import {BLOCOS, CapituloFrame, STATS, StartCtx, usePulse} from "../comum";
import {CAPS} from "./registro";

// ------------------------------------------------------------------ montagem
const RECAP: [string, number][] = [
  ["transicoes", 100], ["camera_3d", 60], ["motion_graphics", 150], ["vfx", 88],
  ["interfaces_mockups", 150], ["color_grading", 256], ["montagem", 150], ["automacao_ia", 160],
];
const Recap: React.FC<{cat: string; offset: number}> = ({cat, offset}) => {
  const f = useCurrentFrame();
  const b = BLOCOS.find((x) => x.id === cat)!;
  const Demo = CAPS[cat];
  return (
    <AbsoluteFill style={{transform: `scale(${I(f, [0, 10], [1.14, 1.0], EO)}) rotate(${I(f, [0, 10], [1.5, 0])}deg)`}}>
      <StartCtx.Provider value={b.from}>
        <Sequence from={-offset} layout="none">
          <CapituloFrame b={b}><Demo /></CapituloFrame>
        </Sequence>
      </StartCtx.Provider>
      <AbsoluteFill style={{background: "#fff", opacity: I(f, [0, 4], [0.4, 0])}} />
    </AbsoluteFill>
  );
};
const BigStat: React.FC<{n: number; label: string; sub?: string}> = ({n, label, sub}) => {
  const f = useCurrentFrame();
  const s = useSpring(0, 10, 170);
  const p = usePulse();
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", transform: `scale(${I(f, [0, 80], [1, 1.08])})`}}>
      <LightLeak opacity={I(f, [0, 8, 60], [0.9, 0.4, 0.25])} seed={7} />
      <Particles burstAt={0} count={80} seed={`bs${n}`} speed={1.3} />
      <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 330, lineHeight: 0.9, letterSpacing: -14, transform: `scale(${0.4 + s * 0.6})`, filter: `drop-shadow(0 0 ${30 + p * 40}px ${C.ouro}99)`}}>
        <GoldText><Counter to={n} start={0} dur={26} /></GoldText>
      </div>
      <KineticWords text={label} start={6} stagger={4} size={74} align="center" style={{marginTop: 20}} />
      {sub && <div style={{marginTop: 26, fontFamily: F.mono, fontSize: 26, color: C.cinza, letterSpacing: 4, opacity: I(f, [16, 26], [0, 1])}}>{sub}</div>}
    </AbsoluteFill>
  );
};
const Categorias: React.FC = () => {
  const f = useCurrentFrame();
  const curto: Record<string, string> = {transicoes: "Transições", camera_3d: "Câmera & 3D", motion_graphics: "Motion graphics", legendas_tipografia: "Legendas", vfx: "VFX", estilos: "Estilos de edição", interfaces_mockups: "Interfaces & mockups", montagem: "Montagem", color_grading: "Color grading", efeitos_sonoros: "Efeitos sonoros", audio: "Áudio & narração", automacao_ia: "Inteligência artificial", templates: "Templates", infraestrutura: "Infraestrutura"};
  const cats = Object.entries(STATS.porCategoria as Record<string, {nome: string; total: number}>).map(([k, v]) => ({nome: curto[k] ?? v.nome, total: v.total}));
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 80, right: 120, top: 260}}>
        <div style={{display: "flex", alignItems: "baseline", gap: 26}}>
          <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 230, lineHeight: 0.9, letterSpacing: -10}}><GoldText><Counter to={14} start={0} dur={14} /></GoldText></div>
          <KineticWords text="CATEGORIAS" start={4} size={80} />
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 30}}>
          {cats.map((c, i) => {
            const k = useSpring(8 + i * 2.5, 13, 200);
            return (
              <div key={c.nome} style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderRadius: 16, background: "rgba(255,255,255,.06)", border: `1.5px solid ${C.ouro}55`, transform: `scale(${k})`, opacity: k}}>
                <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 25, color: C.branco}}>{c.nome}</span>
                <span style={{fontFamily: F.mono, fontSize: 22, color: C.ouroClaro}}>{c.total}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{opacity: f >= 0 ? 1 : 0}} />
    </AbsoluteFill>
  );
};
const SemLimites: React.FC = () => {
  const f = useCurrentFrame();
  const g = I(f, [0, 4, 12], [1, 0.7, 0]);
  const z = I(f, [70, 90], [1, 9], EXPO_I);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, opacity: I(f, [84, 90], [1, 0])}}>
      <LightLeak opacity={0.6} seed={9} />
      <Particles count={90} seed="sl" speed={2.2} />
      <Glitch amount={g} seed="sl">
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
          <KineticWords text={"CRIATIVIDADE\nSEM\nLIMITES"} mode="slam" start={0} stagger={6} size={128} align="center" gold={["LIMITES"]} lineHeight={1.02} />
        </AbsoluteFill>
      </Glitch>
    </AbsoluteFill>
  );
};
export const MontagemFinal: React.FC = () => (
  <AbsoluteFill>
    {RECAP.map(([cat, off], i) => (
      <Sequence key={cat} from={i * 15} durationInFrames={15}><Recap cat={cat} offset={off} /></Sequence>
    ))}
    <Sequence from={120} durationInFrames={80}><BigStat n={STATS.total} label={"RECURSOS\nCATALOGADOS"} sub="TODOS COM ESTADO REAL DOCUMENTADO" /></Sequence>
    <Sequence from={200} durationInFrames={70}><Categorias /></Sequence>
    <Sequence from={270} durationInFrames={90}><SemLimites /></Sequence>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ encerramento
const Monograma: React.FC = () => {
  const f = useCurrentFrame();
  const d = (a: number, b: number) => 1 - I(f, [a, b], [0, 1], Easing.inOut(Easing.cubic));
  const L = 1400;
  return (
    <svg width={420} height={420} viewBox="0 0 420 420" style={{overflow: "visible"}}>
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.ouroEscuro} /><stop offset="0.5" stopColor={C.ouroClaro} /><stop offset="1" stopColor={C.ouro} />
        </linearGradient>
      </defs>
      <polygon points="210,10 400,210 210,410 20,210" fill="none" stroke="url(#mg)" strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * d(2, 40)} />
      <polygon points="210,48 362,210 210,372 58,210" fill="none" stroke="url(#mg)" strokeWidth={2} strokeDasharray={L} strokeDashoffset={L * d(10, 48)} opacity={0.7} />
      <path d="M140 300 L210 110 L280 300 M165 235 L255 235" fill="none" stroke="url(#mg)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={700} strokeDashoffset={700 * d(20, 58)} />
      <path d="M196 252 L196 290 L228 271 Z" fill={C.ouroClaro} opacity={I(f, [54, 64], [0, 1])} />
    </svg>
  );
};
export const Encerramento: React.FC = () => {
  const f = useCurrentFrame();
  const p = usePulse();
  const s = useSpring(62, 14, 90);
  const shine = I(f, [92, 150], [200, -60], Easing.inOut(Easing.cubic));
  const fade = I(f, [262, 298], [1, 0]);
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, ${C.azul2}aa, transparent 60%)`}} />
      {Array.from({length: 12}, (_, i) => (
        <div key={i} style={{position: "absolute", left: 530, top: 680, width: 20, height: 1300, transformOrigin: "50% 0%", transform: `rotate(${i * 30 + f * 0.25}deg)`, background: `linear-gradient(${C.ouroClaro}55, transparent 70%)`, filter: "blur(8px)", opacity: I(f, [0, 40], [0, 0.55])}} />
      ))}
      <Particles count={70} seed="enc" speed={0.5} opacity={0.75} />
      <LightLeak opacity={I(f, [0, 10, 60], [0.8, 0.35, 0.2])} seed={11} />
      <div style={{position: "absolute", left: 330, top: 450, transform: `scale(${I(f, [0, 70], [0.92, 1])})`, filter: `drop-shadow(0 0 ${20 + p * 20}px ${C.ouro}88)`}}><Monograma /></div>
      <div style={{position: "absolute", left: 0, right: 0, top: 915, textAlign: "center"}}>
        <div style={{fontFamily: F.luxo, fontWeight: 700, fontSize: 132, letterSpacing: I(f, [62, 110], [44, 12], EO), opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
          <GoldText shine={shine}>ARTHUR</GoldText>
        </div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 22, marginTop: 6, opacity: I(f, [74, 90], [0, 1])}}>
          <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 54, letterSpacing: 12, color: C.branco}}>VIDEO EDITOR</span>
          <span style={{fontFamily: F.display, fontWeight: 900, fontSize: 48, letterSpacing: 6, color: C.preto, background: GRAD_OURO, padding: "4px 20px", borderRadius: 14}}>AI</span>
        </div>
        <div style={{width: I(f, [96, 130], [0, 560], EO), height: 2, background: GRAD_OURO, margin: "34px auto"}} />
        <KineticWords text={"UMA BIBLIOTECA.\nINFINITAS POSSIBILIDADES."} mode="blur" start={124} stagger={7} size={50} weight={800} align="center" gold={["INFINITAS", "POSSIBILIDADES"]} letterSpacing={2} lineHeight={1.3} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: F.mono, fontSize: 19, letterSpacing: 3, color: C.cinza, lineHeight: 1.7, opacity: I(f, [196, 216], [0, 1])}}>
        REMOTION · HYPERFRAMES · FFMPEG · WHISPER · YT-DLP<br />trilha e efeitos sonoros originais, sintetizados para este vídeo
      </div>
    </AbsoluteFill>
  );
};

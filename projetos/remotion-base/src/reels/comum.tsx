/** Estrutura comum do Reels: fundo, transições de capítulo, moldura do capítulo e dados. */
import React, {createContext, useContext} from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import roteiro from "./data/roteiro.json";
import analise from "./data/audio-analise.json";
import stats from "./data/catalogo-stats.json";
import {C, F, SAFE, STATUS_COR} from "./tema";
import {Chip, EO, EXPO_I, EXPO_O, GoldLine, Glitch, I, Karaoke, KineticWords, LightLeak, MotionBlur} from "./fx";

export const FPS = roteiro.fps;
export const sec = (s: number) => Math.round(s * FPS);
export type Entrada = "flash" | "zoom" | "whip" | "orbit" | "drop" | "glitch" | "leak" | "iris" | "none";

export type Bloco = {id: string; from: number; dur: number; entrada: Entrada; saida: Entrada; cap?: (typeof roteiro.capitulos)[number]};

/** Blocos do roteiro em frames, com a transição de entrada e a de saída (= entrada do próximo). */
export const BLOCOS: Bloco[] = (() => {
  const b: Bloco[] = [];
  const ab = roteiro.blocos;
  b.push({id: "abertura", from: 0, dur: sec(ab[0].fim - ab[0].inicio), entrada: "none", saida: "none"});
  b.push({id: "tecnologias", from: sec(ab[1].inicio), dur: sec(ab[1].fim - ab[1].inicio), entrada: ab[1].entrada as Entrada, saida: "none"});
  for (const c of roteiro.capitulos) b.push({id: c.cat, from: sec(c.inicio), dur: sec(c.dur), entrada: c.entrada as Entrada, saida: "none", cap: c});
  b.push({id: "montagem-final", from: sec(ab[2].inicio), dur: sec(ab[2].fim - ab[2].inicio), entrada: ab[2].entrada as Entrada, saida: "none"});
  b.push({id: "encerramento", from: sec(ab[3].inicio), dur: sec(ab[3].fim - ab[3].inicio), entrada: ab[3].entrada as Entrada, saida: "none"});
  for (let i = 0; i < b.length - 1; i++) b[i].saida = b[i + 1].entrada;
  return b;
})();
export const DURACAO = sec(roteiro.duracao);

// ------------------------------------------------------------------ tempo absoluto e áudio
export const StartCtx = createContext(0);
export const useAbsFrame = () => useCurrentFrame() + useContext(StartCtx);
export const pulseAt = (absF: number) => analise.pulso[Math.max(0, Math.min(analise.pulso.length - 1, absF))] ?? 0;
export const rmsAt = (absF: number) => analise.rms[Math.max(0, Math.min(analise.rms.length - 1, absF))] ?? 0;
export const sfxRmsAt = (absF: number) => analise.rmsSfx[Math.max(0, Math.min(analise.rmsSfx.length - 1, absF))] ?? 0;
export const bandasSfx = analise.bandasSfx;
export const usePulse = () => pulseAt(useAbsFrame());

export type CatStats = {nome: string; total: number; estados: Record<string, number>; itens: {id: string; nome: string; status: string}[]};
export const catStats = (cat: string) => (stats.porCategoria as Record<string, CatStats>)[cat];
export const STATS = stats;

// ------------------------------------------------------------------ fundo global (identidade)
export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const p = pulseAt(f);
  const hue = interpolate(f, [0, DURACAO], [0, 1]);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% ${30 + Math.sin(f / 90) * 6}%, ${C.azul2} 0%, ${C.azul} 34%, ${C.grafite} 66%, ${C.preto} 100%)`}}>
      {/* feixes de luz cinematográficos */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 540 - 900,
            top: -400,
            width: 1800,
            height: 2600,
            transformOrigin: "50% 0%",
            transform: `rotate(${-24 + i * 24 + Math.sin(f / (70 + i * 13) + i) * 7}deg)`,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 46%, rgba(${i === 1 ? "212,175,97" : "90,140,230"},${0.05 + p * 0.03}) 50%, rgba(0,0,0,0) 54%)`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      {/* piso em perspectiva */}
      <div style={{position: "absolute", left: -540, right: -540, bottom: -200, height: 900, transform: "perspective(700px) rotateX(68deg)", transformOrigin: "50% 100%", opacity: 0.35 + hue * 0.1}}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(212,175,97,.35) 2px, transparent 2px), linear-gradient(90deg, rgba(75,141,234,.28) 2px, transparent 2px)`,
            backgroundSize: "90px 90px",
            backgroundPosition: `0 ${(f * 2.2) % 90}px`,
            maskImage: "linear-gradient(to top, black 10%, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 85%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ transições de capítulo
const ENTER = 10;
const EXIT = 8;

const enterStyle = (t: Entrada, f: number, fps: number): React.CSSProperties => {
  if (f >= 26) return {};
  switch (t) {
    case "whip":
      return {transform: `translateX(${I(f, [0, 7], [1250, 0], EXPO_O)}px)`};
    case "zoom":
      return {transform: `scale(${I(f, [0, ENTER + 2], [2.4, 1], EXPO_O)})`, opacity: I(f, [0, 4], [0, 1]), filter: f < 8 ? `blur(${I(f, [0, 8], [18, 0])}px)` : undefined};
    case "orbit":
      return {transform: `perspective(1600px) rotateY(${I(f, [0, 12], [-80, 0], EXPO_O)}deg) translateZ(${I(f, [0, 12], [-500, 0], EO)}px)`, opacity: I(f, [0, 3], [0, 1])};
    case "drop": {
      const s = spring({frame: f, fps, config: {damping: 10, stiffness: 140}});
      return {transform: `translateY(${(1 - s) * -1900}px)`};
    }
    case "leak":
      return {opacity: I(f, [0, ENTER + 4], [0, 1]), transform: `scale(${I(f, [0, 20], [1.08, 1], EO)})`};
    case "iris":
      return {clipPath: `circle(${I(f, [0, 14], [0, 80], Easing.inOut(Easing.cubic))}% at 50% 48%)`};
    case "flash":
      return {transform: `scale(${I(f, [0, 12], [1.08, 1], EO)})`};
    default:
      return {};
  }
};

const exitStyle = (t: Entrada, f: number, dur: number): React.CSSProperties => {
  const k = f - (dur - EXIT);
  if (k < 0) return {};
  switch (t) {
    case "whip":
      return {transform: `translateX(${I(k, [2, EXIT], [0, -1250], EXPO_I)}px)`};
    case "zoom":
      return {transform: `scale(${I(k, [0, EXIT], [1, 7], EXPO_I)})`, opacity: I(k, [EXIT - 3, EXIT], [1, 0])};
    case "orbit":
      return {transform: `perspective(1600px) rotateY(${I(k, [0, EXIT], [0, 80], EXPO_I)}deg) translateZ(${I(k, [0, EXIT], [0, -500])}px)`, opacity: I(k, [EXIT - 2, EXIT], [1, 0])};
    case "drop":
      return {transform: `translateY(${I(k, [0, EXIT], [0, 700], EXPO_I)}px)`, opacity: I(k, [0, EXIT], [1, 0.2])};
    case "leak":
    case "flash":
      return {filter: `brightness(${I(k, [0, EXIT], [1, 2.2])})`};
    case "iris":
      return {transform: `scale(${I(k, [0, EXIT], [1, 0.94])})`, filter: `brightness(${I(k, [0, EXIT], [1, 0.5])})`};
    default:
      return {};
  }
};

/** Aplica entrada/saída e liga o motion blur real nos movimentos rápidos. */
export const BlocoShell: React.FC<{b: Bloco; children: React.ReactNode}> = ({b, children}) => {
  const f = useCurrentFrame();
  const fast = (t: Entrada) => t === "whip" || t === "zoom" || t === "orbit";
  const blurIn = fast(b.entrada) && f < 12;
  const blurOut = fast(b.saida) && f >= b.dur - EXIT;
  return (
    <MotionBlur active={blurIn || blurOut} samples={b.entrada === "whip" || b.saida === "whip" ? 8 : 6}>
      <ShellInner b={b}>{children}</ShellInner>
    </MotionBlur>
  );
};
const ShellInner: React.FC<{b: Bloco; children: React.ReactNode}> = ({b, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = enterStyle(b.entrada, f, fps);
  const x = exitStyle(b.saida, f, b.dur);
  const transform = [e.transform, x.transform].filter(Boolean).join(" ") || undefined;
  const filter = [e.filter, x.filter].filter(Boolean).join(" ") || undefined;
  const opacity = Number(e.opacity ?? 1) * Number(x.opacity ?? 1);
  const gIn = b.entrada === "glitch" ? I(f, [0, 9], [1, 0]) : 0;
  const gOut = b.saida === "glitch" ? I(f, [b.dur - 7, b.dur], [0, 1]) : 0;
  return (
    <AbsoluteFill style={{transform, filter, opacity, clipPath: e.clipPath}}>
      <Glitch amount={Math.max(gIn, gOut)} seed={b.id}>
        <AbsoluteFill>{children}</AbsoluteFill>
      </Glitch>
    </AbsoluteFill>
  );
};

/** Camada global sobre os cortes: flashes, light leaks e anel do iris. */
export const CutFX: React.FC = () => {
  const f = useCurrentFrame();
  const layers: React.ReactNode[] = [];
  for (const b of BLOCOS) {
    const k = f - b.from;
    if (k < -12 || k > 26) continue;
    if (b.entrada === "flash" || b.entrada === "zoom") {
      const o = k >= 0 ? I(k, [0, 9], [b.entrada === "flash" ? 0.95 : 0.6, 0], EO) : I(k, [-2, 0], [0, 0.4]);
      if (o > 0.01) layers.push(<AbsoluteFill key={`fl${b.id}`} style={{background: `radial-gradient(circle at 50% 45%, #fff8e6 0%, ${C.ouroClaro} 40%, rgba(212,175,97,0) 85%)`, opacity: o, mixBlendMode: "screen"}} />);
    }
    if (b.entrada === "leak") {
      const o = k < 0 ? I(k, [-12, 0], [0, 1]) : I(k, [0, 24], [1, 0], EO);
      layers.push(<LightLeak key={`lk${b.id}`} opacity={o} seed={3} />);
    }
    if (b.entrada === "iris" && k >= 0 && k < 18) {
      const r = I(k, [0, 14], [0, 80], Easing.inOut(Easing.cubic));
      const d = (r / 100) * Math.hypot(1080, 1920) * 1.0;
      layers.push(
        <div key={`ir${b.id}`} style={{position: "absolute", left: 540 - d, top: 1920 * 0.48 - d, width: d * 2, height: d * 2, borderRadius: "50%", border: `6px solid ${C.ouroClaro}`, boxShadow: `0 0 40px ${C.ouro}, inset 0 0 40px ${C.ouro}`, opacity: I(k, [10, 18], [1, 0])}} />,
      );
    }
  }
  return <AbsoluteFill style={{pointerEvents: "none"}}>{layers}</AbsoluteFill>;
};

// ------------------------------------------------------------------ moldura de capítulo
export const STAGE = {top: 560, height: 830, left: SAFE.left + 20, width: SAFE.right - SAFE.left - 40};

export const StatusLine: React.FC<{cat: string; delay?: number}> = ({cat, delay = 14}) => {
  const f = useCurrentFrame();
  const s = catStats(cat);
  const o = I(f, [delay, delay + 10], [0, 1]);
  const e = s.estados;
  const parts: [string, number, string][] = [
    ["EXECUTÁVEIS", e.exemplo_executavel ?? 0, STATUS_COR.exemplo_executavel],
    ["INTEGRAÇÃO", e.integracao_nativa ?? 0, STATUS_COR.integracao_nativa],
    ["CATALOGADOS", e.catalogado ?? 0, STATUS_COR.catalogado],
  ];
  return (
    <div style={{display: "flex", gap: 16, alignItems: "center", fontFamily: F.mono, fontSize: 22, letterSpacing: 1, color: C.cinza, opacity: o, flexWrap: "wrap"}}>
      <span style={{color: C.branco, fontWeight: 700}}>{s.total} RECURSOS</span>
      {parts.map(([n, v, c]) => (
        <span key={n} style={{display: "inline-flex", alignItems: "center", gap: 8}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: c, boxShadow: `0 0 8px ${c}`}} />
          {v} {n}
        </span>
      ))}
    </div>
  );
};

export const CapituloFrame: React.FC<{b: Bloco; children: React.ReactNode; captionStart?: number}> = ({b, children, captionStart = 18}) => {
  const f = useCurrentFrame();
  const cap = b.cap!;
  const num = String(cap.n).padStart(2, "0");
  const lineP = I(f, [6, 26], [0, 1], EO);
  const p = usePulse();
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: SAFE.left, top: SAFE.top + 6, right: 1080 - SAFE.right}}>
        <div style={{display: "flex", alignItems: "baseline", gap: 18, fontFamily: F.mono, color: C.ouro, fontSize: 26, letterSpacing: 6, opacity: I(f, [0, 8], [0, 1])}}>
          <span>CAPÍTULO</span>
          <span style={{fontFamily: F.display, fontWeight: 900, fontSize: 58, letterSpacing: -1, color: C.ouroClaro, textShadow: `0 0 ${18 + p * 20}px ${C.ouro}88`}}>{num}</span>
          <span style={{color: C.cinza}}>/ 14</span>
        </div>
        <KineticWords text={cap.titulo} start={2} stagger={3} size={cap.titulo.length > 22 ? 56 : 66} style={{marginTop: 8}} />
        <GoldLine progress={lineP} width={360} style={{marginTop: 18, marginBottom: 18}} />
        <StatusLine cat={cap.cat} />
      </div>
      <div style={{position: "absolute", left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height}}>{children}</div>
      <div style={{position: "absolute", left: SAFE.left, right: 1080 - SAFE.right, top: 1400}}>
        <Karaoke text={cap.legenda} start={captionStart} end={b.dur - 40} size={36} />
      </div>
    </AbsoluteFill>
  );
};

/** Rótulo do efeito em execução (nome técnico + estado real). */
export const EfeitoTag: React.FC<{nome: string; at: number; until?: number; estado?: string; style?: React.CSSProperties}> = ({nome, at, until = 9999, estado = "exemplo_executavel", style}) => {
  const f = useCurrentFrame();
  const o = Math.min(I(f, [at, at + 5], [0, 1]), I(f, [until - 4, until], [1, 0]));
  if (o <= 0) return null;
  return (
    <div style={{position: "absolute", opacity: o, transform: `translateY(${(1 - o) * 14}px)`, ...style}}>
      <Chip label={nome} color={STATUS_COR[estado]} size={22} />
    </div>
  );
};

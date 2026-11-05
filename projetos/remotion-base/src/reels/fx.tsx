/**
 * Biblioteca de efeitos executáveis do Arthur Video Editor AI (Remotion).
 * Todos determinísticos (função do frame), prontos para reuso em outros projetos.
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {CameraMotionBlur} from "@remotion/motion-blur";
import {C, F, GRAD_OURO} from "./tema";

// ------------------------------------------------------------------ utilidades
export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const I = (
  f: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) => interpolate(f, input, output, {...clamp, easing});
export const EO = Easing.out(Easing.cubic);
export const EI = Easing.in(Easing.cubic);
export const EXPO_O = Easing.out(Easing.exp);
export const EXPO_I = Easing.in(Easing.exp);
export const useSpring = (delay = 0, damping = 14, stiffness = 120, mass = 1) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness, mass}});
};

// ------------------------------------------------------------------ Motion blur real (amostragem temporal)
/** Ativa o CameraMotionBlur (@remotion/motion-blur) só quando há movimento rápido. */
export const MotionBlur: React.FC<{active: boolean; samples?: number; shutter?: number; children: React.ReactNode}> = ({
  active,
  samples = 7,
  shutter = 220,
  children,
}) => (active ? <CameraMotionBlur samples={samples} shutterAngle={shutter}>{children}</CameraMotionBlur> : <>{children}</>);

// ------------------------------------------------------------------ Kinetic typography
type KWProps = {
  text: string;
  start?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  color?: string;
  gold?: string[];
  align?: "left" | "center";
  font?: string;
  mode?: "rise" | "slam" | "blur";
  lineHeight?: number;
  letterSpacing?: number;
  style?: React.CSSProperties;
};
export const KineticWords: React.FC<KWProps> = ({
  text,
  start = 0,
  stagger = 4,
  size = 96,
  weight = 900,
  color = C.branco,
  gold = [],
  align = "left",
  font = F.display,
  mode = "rise",
  lineHeight = 1.02,
  letterSpacing = -2,
  style,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = text.split("\n");
  let idx = 0;
  return (
    <div style={{fontFamily: font, fontWeight: weight, fontSize: size, lineHeight, letterSpacing, color, textAlign: align, ...style}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: `0 ${size * 0.26}px`}}>
          {line.split(" ").map((w, wi) => {
            const d = start + idx++ * stagger;
            const s = spring({frame: f - d, fps, config: {damping: mode === "slam" ? 11 : 16, stiffness: mode === "slam" ? 220 : 120}});
            const o = I(f, [d, d + 5], [0, 1]);
            const isGold = gold.includes(w.replace(/[.,!?:]/g, ""));
            const tr =
              mode === "slam"
                ? `scale(${interpolate(s, [0, 1], [2.6, 1])})`
                : mode === "blur"
                ? `translateY(${(1 - s) * 30}px)`
                : `translateY(${(1 - s) * size * 0.9}px) rotate(${(1 - s) * 6}deg)`;
            const blur = mode === "blur" ? (1 - s) * 18 : mode === "slam" ? (1 - s) * 10 : 0;
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  opacity: o,
                  transform: tr,
                  filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                  ...(isGold
                    ? {background: GRAD_OURO, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", backgroundSize: "200% 100%", backgroundPosition: `${(f * 2) % 200}% 0`}
                    : {}),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ------------------------------------------------------------------ Legenda dinâmica (karaokê + destaque)
export const Karaoke: React.FC<{text: string; start: number; end: number; size?: number; boxColor?: string; style?: React.CSSProperties}> = ({
  text,
  start,
  end,
  size = 40,
  boxColor = C.ouro,
  style,
}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const per = (end - start) / words.length;
  const cur = Math.floor((f - start) / per);
  return (
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `${size * 0.18}px ${size * 0.22}px`, fontFamily: F.display, fontWeight: 800, fontSize: size, ...style}}>
      {words.map((w, i) => {
        const d = start + i * per;
        const appear = I(f, [d - 4, d + 2], [0, 1], EO);
        const active = i === cur;
        const past = i < cur;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              padding: `${size * 0.06}px ${size * 0.16}px`,
              borderRadius: size * 0.18,
              color: active ? C.preto : past ? C.branco : "rgba(245,242,234,.55)",
              opacity: appear,
              transform: `translateY(${(1 - appear) * 16}px) scale(${active ? 1.08 : 1})`,
              background: active ? boxColor : "transparent",
              boxShadow: active ? `0 0 30px ${boxColor}88` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ Glitch / RGB split / fatias
const GlitchFilters: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <defs>
      <filter id="fx-r"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
      <filter id="fx-g"><feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
      <filter id="fx-b"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
    </defs>
  </svg>
);
/** amount 0..1. Separação RGB + fatias deslocadas + barras digitais. Determinístico por frame. */
export const Glitch: React.FC<{amount: number; seed?: string; children: React.ReactNode}> = ({amount, seed = "g", children}) => {
  const f = useCurrentFrame();
  if (amount <= 0.01) return <>{children}</>;
  const k = Math.floor(f / 2);
  const off = amount * 26;
  const slices = Array.from({length: 7}, (_, i) => {
    const top = random(`${seed}-t-${k}-${i}`) * 100;
    const h = 2 + random(`${seed}-h-${k}-${i}`) * 9;
    const dx = (random(`${seed}-x-${k}-${i}`) - 0.5) * 160 * amount;
    return {top, h, dx};
  });
  return (
    <AbsoluteFill>
      <GlitchFilters />
      <AbsoluteFill style={{background: "#000"}} />
      <AbsoluteFill style={{filter: "url(#fx-r)", transform: `translateX(${off}px)`, mixBlendMode: "screen"}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{filter: "url(#fx-g)", mixBlendMode: "screen"}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{filter: "url(#fx-b)", transform: `translateX(${-off}px)`, mixBlendMode: "screen"}}>{children}</AbsoluteFill>
      {slices.map((s, i) => (
        <AbsoluteFill key={i} style={{clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.h)}% 0)`, transform: `translateX(${s.dx}px)`}}>
          {children}
        </AbsoluteFill>
      ))}
      {slices.slice(0, 3).map((s, i) => (
        <div
          key={`b${i}`}
          style={{position: "absolute", left: 0, right: 0, top: `${(s.top + 37) % 100}%`, height: 4 + s.h, background: i % 2 ? "rgba(80,200,255,.35)" : "rgba(255,60,90,.3)", mixBlendMode: "screen", opacity: amount}}
        />
      ))}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ Light leaks
export const LightLeak: React.FC<{opacity: number; seed?: number; warm?: boolean}> = ({opacity, seed = 1, warm = true}) => {
  const f = useCurrentFrame();
  if (opacity <= 0.01) return null;
  const blobs = [
    {x: 20 + Math.sin(f / 23 + seed) * 25, y: 30 + Math.cos(f / 31 + seed) * 20, r: 900, c: warm ? "rgba(255,170,70,.9)" : "rgba(90,160,255,.9)"},
    {x: 80 + Math.sin(f / 19 + seed * 2) * 20, y: 60 + Math.sin(f / 27) * 25, r: 800, c: warm ? "rgba(255,90,40,.75)" : "rgba(160,90,255,.6)"},
    {x: 50 + Math.cos(f / 17 + seed) * 30, y: 90 + Math.sin(f / 21) * 10, r: 700, c: "rgba(255,225,150,.8)"},
  ];
  return (
    <AbsoluteFill style={{mixBlendMode: "screen", opacity, pointerEvents: "none"}}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{position: "absolute", left: `${b.x}%`, top: `${b.y}%`, width: b.r * 2, height: b.r * 2, marginLeft: -b.r, marginTop: -b.r, borderRadius: "50%", background: `radial-gradient(circle, ${b.c} 0%, rgba(0,0,0,0) 62%)`}}
        />
      ))}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ Partículas
export const Particles: React.FC<{count?: number; seed?: string; color?: string; burstAt?: number; speed?: number; opacity?: number; area?: [number, number]}> = ({
  count = 60,
  seed = "p",
  color = C.ouroClaro,
  burstAt,
  speed = 1,
  opacity = 1,
  area = [1080, 1920],
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none", opacity}}>
      {Array.from({length: count}, (_, i) => {
        const r1 = random(`${seed}${i}a`), r2 = random(`${seed}${i}b`), r3 = random(`${seed}${i}c`), r4 = random(`${seed}${i}d`);
        const size = 2 + r3 * 6;
        let x: number, y: number, o: number;
        if (burstAt !== undefined) {
          const t = Math.max(0, f - burstAt);
          const ang = r1 * Math.PI * 2;
          const v = (6 + r2 * 26) * speed;
          const dist = v * (1 - Math.exp(-t / 14)) * 14;
          x = area[0] / 2 + Math.cos(ang) * dist;
          y = area[1] / 2 + Math.sin(ang) * dist + t * t * 0.02;
          o = f < burstAt ? 0 : Math.max(0, 1 - t / (40 + r4 * 40));
        } else {
          x = (r1 * area[0] + Math.sin(f / (30 + r4 * 40) + i) * 40) % area[0];
          y = (((r2 * area[1] - f * (0.6 + r3 * 1.6) * speed) % area[1]) + area[1]) % area[1];
          o = 0.25 + 0.75 * Math.abs(Math.sin(f / (12 + r4 * 20) + i));
        }
        return (
          <div key={i} style={{position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, opacity: o, boxShadow: `0 0 ${size * 3}px ${color}`}} />
        );
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ Grão de filme (PNG gerado por script) e vinheta
export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{mixBlendMode: "overlay", opacity, pointerEvents: "none"}}>
      <Img src={staticFile(`reels/grain/g${Math.floor(Math.abs(f)) % 8}.png`)} style={{width: "100%", height: "100%", imageRendering: "pixelated"}} />
    </AbsoluteFill>
  );
};
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.65}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: "none"}} />
);

// ------------------------------------------------------------------ Glassmorphism
export const glass = (alpha = 0.08): React.CSSProperties => ({
  background: `linear-gradient(145deg, rgba(255,255,255,${alpha + 0.05}), rgba(255,255,255,${alpha * 0.4}))`,
  border: "1.5px solid rgba(255,255,255,.18)",
  boxShadow: "0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.25)",
  backdropFilter: "blur(22px) saturate(140%)",
  WebkitBackdropFilter: "blur(22px) saturate(140%)",
  borderRadius: 36,
});

// ------------------------------------------------------------------ Gravity drop
export const GravityDrop: React.FC<{delay?: number; from?: number; children: React.ReactNode; style?: React.CSSProperties; rotate?: number}> = ({
  delay = 0,
  from = -1400,
  children,
  style,
  rotate = 0,
}) => {
  const s = useSpring(delay, 9, 140, 1.1);
  return <div style={{transform: `translateY(${(1 - s) * from}px) rotate(${(1 - s) * rotate}deg)`, opacity: s > 0.001 ? 1 : 0, ...style}}>{children}</div>;
};

// ------------------------------------------------------------------ Contador e gráfico
export const Counter: React.FC<{to: number; start: number; dur: number; style?: React.CSSProperties; suffix?: string; prefix?: string; decimals?: number; from?: number}> = ({
  to,
  start,
  dur,
  style,
  suffix = "",
  prefix = "",
  decimals = 0,
  from = 0,
}) => {
  const f = useCurrentFrame();
  const v = I(f, [start, start + dur], [from, to], Easing.out(Easing.poly(4)));
  return <span style={{fontVariantNumeric: "tabular-nums", ...style}}>{prefix}{v.toFixed(decimals).replace(".", ",")}{suffix}</span>;
};

export const ChartGrow: React.FC<{values: number[]; labels: string[]; start: number; height?: number; width?: number}> = ({values, labels, start, height = 420, width = 820}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const max = Math.max(...values);
  const bw = width / values.length;
  return (
    <div style={{position: "relative", width, height: height + 70}}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <div key={g} style={{position: "absolute", left: 0, right: 0, top: height * (1 - g), borderTop: "1px dashed rgba(255,255,255,.12)"}} />
      ))}
      {values.map((v, i) => {
        const s = spring({frame: f - start - i * 6, fps, config: {damping: 12, stiffness: 90}});
        const h = (v / max) * height * Math.max(0, s);
        return (
          <div key={i} style={{position: "absolute", left: i * bw + bw * 0.16, width: bw * 0.68, bottom: 70, height: h, borderRadius: "14px 14px 4px 4px", background: `linear-gradient(180deg, ${C.ouroClaro}, ${C.ouro} 40%, ${C.ouroEscuro})`, boxShadow: `0 0 40px ${C.ouro}55`}}>
            <div style={{position: "absolute", top: -54, width: "100%", textAlign: "center", fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.branco, opacity: I(f, [start + i * 6 + 8, start + i * 6 + 16], [0, 1])}}>
              {Math.round(v * Math.min(1, Math.max(0, s)))}
            </div>
            <div style={{position: "absolute", bottom: -58, width: "100%", textAlign: "center", fontFamily: F.mono, fontSize: 24, color: C.cinza}}>{labels[i]}</div>
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ Speed ramp (remapeamento de tempo)
/** Integra uma curva de velocidade (pontos [frame, velocidade]) para obter o "tempo de mídia". */
export const remapTime = (f: number, curve: [number, number][]) => {
  let t = 0;
  for (let x = 0; x < f; x++) {
    const v = interpolate(x, curve.map((c) => c[0]), curve.map((c) => c[1]), clamp);
    t += v;
  }
  return t;
};

// ------------------------------------------------------------------ Chips e rótulos
export const Chip: React.FC<{label: string; color?: string; style?: React.CSSProperties; dot?: boolean; size?: number}> = ({label, color = C.ouro, style, dot = true, size = 24}) => (
  <div style={{display: "inline-flex", alignItems: "center", gap: 12, padding: `${size * 0.45}px ${size * 0.85}px`, borderRadius: 999, border: `1.5px solid ${color}99`, background: "rgba(5,8,14,.72)", color, fontFamily: F.mono, fontSize: size, letterSpacing: 2, fontWeight: 600, whiteSpace: "nowrap", ...style}}>
    {dot && <span style={{width: size * 0.42, height: size * 0.42, borderRadius: "50%", background: color, boxShadow: `0 0 12px ${color}`}} />}
    {label}
  </div>
);

export const GoldLine: React.FC<{progress: number; width?: number; style?: React.CSSProperties}> = ({progress, width = 300, style}) => (
  <div style={{width: width * progress, height: 3, background: GRAD_OURO, boxShadow: `0 0 14px ${C.ouro}`, ...style}} />
);

export const GoldText: React.FC<{children: React.ReactNode; style?: React.CSSProperties; shine?: number}> = ({children, style, shine}) => {
  const f = useCurrentFrame();
  const pos = shine === undefined ? (f * 1.5) % 200 : shine;
  return (
    <span style={{background: GRAD_OURO, backgroundSize: "200% 100%", backgroundPosition: `${pos}% 0`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", ...style}}>{children}</span>
  );
};

/** Moldura de "monitor" com cantos de enquadramento. */
export const Frame: React.FC<{w: number; h: number; children: React.ReactNode; style?: React.CSSProperties; radius?: number}> = ({w, h, children, style, radius = 34}) => (
  <div style={{position: "relative", width: w, height: h, borderRadius: radius, overflow: "hidden", boxShadow: `0 40px 120px rgba(0,0,0,.7), 0 0 0 1.5px rgba(212,175,97,.35)`, ...style}}>
    {children}
    {[0, 1, 2, 3].map((k) => (
      <div
        key={k}
        style={{position: "absolute", width: 46, height: 46, [k < 2 ? "top" : "bottom"]: 18, [k % 2 ? "right" : "left"]: 18, borderColor: C.ouroClaro, borderStyle: "solid", borderWidth: `${k < 2 ? 3 : 0}px ${k % 2 ? 3 : 0}px ${k >= 2 ? 3 : 0}px ${k % 2 ? 0 : 3}px`, opacity: 0.85}}
      />
    ))}
  </div>
);

/** Re-baseia o tempo dos filhos sem alterar o layout (Sequence com layout="none"). */
export const Seq: React.FC<{from: number; children: React.ReactNode; dur?: number}> = ({from, children, dur}) => (
  <Sequence from={from} durationInFrames={dur} layout="none">{children}</Sequence>
);

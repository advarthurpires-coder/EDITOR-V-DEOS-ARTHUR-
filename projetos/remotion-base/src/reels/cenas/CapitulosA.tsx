/** Capítulos 01–05: transições, câmera/3D, motion graphics, legendas (HyperFrames) e VFX. */
import React from "react";
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import {C, F} from "../tema";
import {Seq, ChartGrow, Counter, EO, EXPO_I, EXPO_O, Frame, Glitch, GoldText, GravityDrop, I, LightLeak, MotionBlur, Particles, useSpring} from "../fx";
import {Shot} from "../shots";
import {EfeitoTag, STAGE} from "../comum";

const W = STAGE.width; // 860
const H = STAGE.height; // 830

// =================================================================== 01 TRANSIÇÕES
const T1 = [50, 100, 150, 200, 250];
const TransMonitor: React.FC = () => {
  const f = useCurrentFrame();
  const mw = 820, mh = 700;
  const idx = T1.filter((t) => f >= t).length; // plano atual
  const layer = (v: number, style: React.CSSProperties, key: string) => (
    <div key={key} style={{position: "absolute", inset: 0, ...style}}>
      <Shot v={v} t={f} w={mw} h={mh} label />
    </div>
  );
  const layers: React.ReactNode[] = [];
  // estado padrão
  let cur: React.CSSProperties = {};
  let prev: React.CSSProperties | null = null;
  const k = (t: number) => f - t;
  if (f >= 42 && f < 62) {
    // ZOOM THROUGH
    if (f < 50) cur = {transform: `scale(${I(f, [42, 50], [1, 5], EXPO_I)})`, opacity: I(f, [46, 50], [1, 0.2])};
    else cur = {transform: `scale(${I(k(50), [0, 12], [2.2, 1], EXPO_O)})`};
  } else if (f >= 93 && f < 108) {
    // WHIP PAN
    if (f < 100) cur = {transform: `translateX(${I(f, [93, 100], [0, -mw], EXPO_I)}px)`};
    else {
      prev = {transform: `translateX(${-mw}px)`};
      cur = {transform: `translateX(${I(k(100), [0, 7], [mw, 0], EXPO_O)}px)`};
    }
  } else if (f >= 142 && f < 165) {
    // GLOW / LIGHT FLASH
    cur = f < 150 ? {filter: `brightness(${I(f, [142, 150], [1, 3.2])}) blur(${I(f, [144, 150], [0, 6])}px)`} : {filter: `brightness(${I(k(150), [0, 14], [3.2, 1], EO)}) blur(${I(k(150), [0, 8], [6, 0])}px)`};
  } else if (f >= 200 && f < 216) {
    // IRIS REVEAL
    prev = {};
    cur = {clipPath: `circle(${I(k(200), [0, 15], [0, 75], Easing.inOut(Easing.cubic))}% at 50% 50%)`};
  }
  if (prev) layers.push(layer(idx - 1, prev, "prev"));
  layers.push(layer(idx, cur, "cur"));
  const glitchA = I(f, [244, 250, 256], [0, 1, 0]);
  const flash = f >= 50 && f < 60 ? I(k(50), [0, 9], [0.8, 0]) : f >= 150 && f < 164 ? I(k(150), [0, 14], [0.7, 0]) : 0;
  const blur = (f >= 93 && f < 108) || (f >= 44 && f < 58);
  return (
    <Frame w={mw} h={mh}>
      <MotionBlur active={blur} samples={8} shutter={240}>
        <Glitch amount={glitchA} seed="t1">
          <AbsoluteFill style={{background: "#000"}}>{layers}</AbsoluteFill>
        </Glitch>
      </MotionBlur>
      {f >= 200 && f < 216 && (
        <div style={{position: "absolute", left: mw / 2 - (k(200) / 15) * 620, top: mh / 2 - (k(200) / 15) * 620, width: (k(200) / 15) * 1240, height: (k(200) / 15) * 1240, borderRadius: "50%", border: `5px solid ${C.ouroClaro}`, boxShadow: `0 0 30px ${C.ouro}`}} />
      )}
      <AbsoluteFill style={{background: `radial-gradient(circle, #fff6dd 0%, ${C.ouroClaro} 40%, transparent 80%)`, opacity: flash, mixBlendMode: "screen"}} />
    </Frame>
  );
};
export const Cap01: React.FC = () => {
  const nomes: [string, number, number][] = [["HARD CUT · PLANO 01", 8, 46], ["ZOOM THROUGH", 50, 96], ["WHIP PAN + MOTION BLUR", 100, 146], ["GLOW / LIGHT FLASH", 150, 196], ["IRIS REVEAL", 200, 246], ["GLITCH CUT · RGB SPLIT", 250, 300]];
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: (W - 820) / 2, top: 10}}><TransMonitor /></div>
      {nomes.map(([n, a, b]) => (
        <EfeitoTag key={n} nome={n} at={a} until={b} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
      ))}
    </AbsoluteFill>
  );
};

// =================================================================== 02 CÂMERA & 3D
const Orbit: React.FC = () => {
  const f = useCurrentFrame();
  const ang = I(f, [0, 120], [20, -200], Easing.inOut(Easing.sin));
  const tilt = I(f, [0, 120], [-18, -6]);
  const R = 470;
  return (
    <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: "50% 40%"}}>
      <div style={{position: "absolute", left: W / 2, top: 360, transformStyle: "preserve-3d", transform: `translateZ(-${R}px) rotateX(${tilt}deg) rotateY(${ang}deg)`}}>
        {Array.from({length: 6}, (_, i) => (
          <div key={i} style={{position: "absolute", left: -150, top: -200, transform: `rotateY(${i * 60}deg) translateZ(${R}px)`, borderRadius: 24, overflow: "hidden", boxShadow: `0 0 0 2px ${C.ouro}88, 0 30px 60px #000a`}}>
            <Shot v={i} t={f} w={300} h={400} />
          </div>
        ))}
        <div style={{position: "absolute", left: -R - 60, top: 230, width: (R + 60) * 2, height: (R + 60) * 2, marginTop: -(R + 60), transform: "rotateX(90deg)", borderRadius: "50%", border: `2px dashed ${C.ouro}66`}} />
      </div>
    </AbsoluteFill>
  );
};
const DollyZoom: React.FC = () => {
  const f = useCurrentFrame();
  const p = I(f, [0, 90], [0, 1], Easing.inOut(Easing.cubic));
  // a câmera recua enquanto a lente fecha: o fundo "comprime" e cresce, o sujeito mantém o tamanho
  const k = 0.42 * (1 - 0.8 * p);
  const rects = Array.from({length: 11}, (_, i) => 1.15 / (1 + i * k));
  return (
    <AbsoluteFill style={{overflow: "hidden", borderRadius: 30, background: "#050a16"}}>
      <div style={{position: "absolute", inset: 0, transform: `scale(${1 + p * 1.4})`, opacity: 0.55}}><Shot v={0} t={f} w={W} h={720} /></div>
      <svg width={W} height={720} style={{position: "absolute", inset: 0}}>
        {Array.from({length: 16}, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <line key={i} x1={W / 2} y1={340} x2={W / 2 + Math.cos(a) * 900} y2={340 + Math.sin(a) * 900} stroke={C.azulLuz} strokeOpacity={0.25} strokeWidth={2} />;
        })}
        {rects.map((s, i) => (
          <rect key={i} x={W / 2 - 400 * s} y={340 - 330 * s} width={800 * s} height={660 * s} fill="none" stroke={i % 2 ? C.azulLuz : C.ouro} strokeWidth={3} strokeOpacity={0.9 - i * 0.06} />
        ))}
      </svg>
      <div style={{position: "absolute", left: W / 2 - 120, top: 340 - 190, width: 240, height: 420}}>
        <svg width={240} height={420} viewBox="0 0 240 420">
          <defs><linearGradient id="dz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.ouroClaro} /><stop offset="1" stopColor={C.ouroEscuro} /></linearGradient></defs>
          <circle cx={120} cy={70} r={52} fill="url(#dz)" />
          <path d="M40 160 Q120 120 200 160 L215 300 L170 300 L160 420 L80 420 L70 300 L25 300Z" fill="url(#dz)" />
        </svg>
      </div>
      <div style={{position: "absolute", left: 24, top: 24, fontFamily: F.mono, fontSize: 24, color: C.ouroClaro, lineHeight: 1.6, background: "#0009", padding: "6px 12px", borderRadius: 8}}>
        LENTE {Math.round(interpolate(p, [0, 1], [18, 85]))} mm<br />DOLLY −{(p * 6).toFixed(1).replace(".", ",")} m
      </div>
    </AbsoluteFill>
  );
};
const Parallax: React.FC = () => {
  const f = useCurrentFrame();
  const cam = I(f, [0, 90], [-1, 1], Easing.inOut(Easing.sin));
  const layer = (depth: number, node: React.ReactNode, key: string) => (
    <div key={key} style={{position: "absolute", inset: 0, transform: `translateX(${-cam * depth * 260}px) scale(${1 + depth * 0.1})`}}>{node}</div>
  );
  return (
    <AbsoluteFill style={{overflow: "hidden", borderRadius: 30, background: "linear-gradient(#071226, #1a2f55 70%, #3a3150)"}}>
      {layer(0.05, <>{Array.from({length: 70}, (_, i) => <div key={i} style={{position: "absolute", left: random(`px${i}`) * 1400 - 270, top: random(`py${i}`) * 420, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.6}} />)}</>, "stars")}
      {layer(0.25, <svg width={1400} height={H} style={{position: "absolute", left: -270}}><path d={`M0 520 L200 330 L380 470 L560 290 L760 470 L940 340 L1140 480 L1400 360 L1400 830 L0 830Z`} fill="#2b2d4f" /></svg>, "far")}
      {layer(0.6, <svg width={1500} height={H} style={{position: "absolute", left: -320}}><path d={`M0 640 L240 500 L470 620 L700 470 L960 640 L1200 520 L1500 610 L1500 830 L0 830Z`} fill="#161a33" /></svg>, "mid")}
      {layer(1.2, <>
        <div style={{position: "absolute", left: 120, top: 380, width: 60, height: 450, background: `linear-gradient(90deg, ${C.ouroEscuro}, ${C.ouro})`}} />
        <div style={{position: "absolute", left: 640, top: 300, width: 70, height: 530, background: `linear-gradient(90deg, ${C.ouroEscuro}, ${C.ouroClaro})`}} />
      </>, "near")}
      <div style={{position: "absolute", left: 0, right: 0, top: 180, textAlign: "center", transform: `translateX(${-cam * 0.25 * 260}px)`, fontFamily: F.display, fontWeight: 900, fontSize: 76, letterSpacing: -2, color: C.branco, textShadow: "0 10px 40px #000"}}>
        PROFUNDIDADE
      </div>
    </AbsoluteFill>
  );
};
export const Cap02: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {f < 120 && <Orbit />}
      {f >= 120 && f < 210 && <Seq from={120}><div style={{position: "absolute", left: 0, top: 0, width: W, height: 720}}><DollyZoom /></div></Seq>}
      {f >= 210 && <Seq from={210}><div style={{position: "absolute", left: 0, top: 0, width: W, height: 720}}><Parallax /></div></Seq>}
      <EfeitoTag nome="CAMERA ORBIT 3D" at={6} until={118} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
      <EfeitoTag nome="DOLLY ZOOM · VERTIGO" at={122} until={208} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
      <EfeitoTag nome="PARALLAX 3D MULTICAMADA" at={212} until={300} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
    </AbsoluteFill>
  );
};


// =================================================================== 03 MOTION GRAPHICS
const Icone: React.FC<{d: React.ReactNode; label: string}> = ({d, label}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
    <div style={{width: 150, height: 150, borderRadius: 38, background: `linear-gradient(145deg, ${C.azul2}, ${C.preto})`, border: `2px solid ${C.ouro}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 20px 40px #0008, 0 0 30px ${C.ouro}33`}}>
      <svg width={84} height={84} viewBox="0 0 96 96" fill="none" stroke={C.ouroClaro} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
    </div>
    <div style={{fontFamily: F.mono, fontSize: 21, color: C.cinza, letterSpacing: 2}}>{label}</div>
  </div>
);
const ProgressRing: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const p = I(f, [start, start + 40], [0, 0.87], EO);
  const r = 92, c = 2 * Math.PI * r;
  return (
    <svg width={230} height={230}>
      <circle cx={115} cy={115} r={r} stroke="rgba(255,255,255,.12)" strokeWidth={18} fill="none" />
      <circle cx={115} cy={115} r={r} stroke={C.ouro} strokeWidth={18} fill="none" strokeDasharray={c} strokeDashoffset={c * (1 - p)} strokeLinecap="round" transform="rotate(-90 115 115)" style={{filter: `drop-shadow(0 0 10px ${C.ouro})`}} />
      <text x={115} y={128} textAnchor="middle" fill={C.branco} fontFamily="Montserrat" fontWeight={900} fontSize={46}>{Math.round(p * 100)}%</text>
    </svg>
  );
};
const LineDraw: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const p = I(f, [start, start + 40], [0, 1], EO);
  const pts = [0, 40, 25, 70, 55, 95, 80, 130].map((v, i) => [i * 52, 150 - v]);
  const d = pts.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");
  return (
    <svg width={380} height={170}>
      <path d={d} stroke={C.azulLuz} strokeWidth={6} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - p)} strokeLinejoin="round" />
      <path d={`M${pts[pts.length - 2][0]} ${pts[pts.length - 2][1]} l20 -6 l-8 18`} stroke={C.azulLuz} strokeWidth={6} fill="none" opacity={p > 0.95 ? 1 : 0} />
    </svg>
  );
};
export const Cap03: React.FC = () => {
  const f = useCurrentFrame();
  const icons: [React.ReactNode, string][] = [
    [<><path d="M48 14v68M24 82h48M18 30h60" /><path d="M18 30l-10 26h20zM78 30l-10 26h20z" /></>, "JUSTIÇA"],
    [<path d="M30 18l50 30-50 30z" />, "PLAY"],
    [<><rect x="34" y="12" width="28" height="46" rx="14" /><path d="M22 46c0 15 12 26 26 26s26-11 26-26M48 72v14" /></>, "VOZ"],
    [<path d="M48 12l11 23 25 3-18 17 5 25-23-12-23 12 5-25-18-17 25-3z" />, "DESTAQUE"],
  ];
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 10, top: 20}}>
        <ChartGrow values={[42, 61, 55, 83, 100]} labels={["SEG", "TER", "QUA", "QUI", "SEX"]} start={15} height={270} width={500} />
      </div>
      <div style={{position: "absolute", left: 560, top: 20, width: 300, textAlign: "center", opacity: I(f, [74, 82], [0, 1])}}>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 120, lineHeight: 1}}>
          <GoldText><Counter to={384} start={78} dur={36} /></GoldText>
        </div>
        <div style={{fontFamily: F.mono, fontSize: 22, color: C.cinza, letterSpacing: 3, marginTop: 6}}>DATA COUNTER</div>
        <div style={{marginTop: 18, display: "flex", justifyContent: "center"}}><ProgressRing start={86} /></div>
      </div>
      <div style={{position: "absolute", left: 0, top: 420, width: W, display: "flex", justifyContent: "space-between", padding: "0 10px"}}>
        {icons.map(([d, l], i) => (
          <GravityDrop key={l} delay={112 + i * 7.5} from={-900} rotate={i % 2 ? 25 : -25}>
            <Icone d={d} label={l} />
          </GravityDrop>
        ))}
      </div>
      <div style={{position: "absolute", left: 20, top: 660, opacity: I(f, [176, 182], [0, 1])}}><LineDraw start={180} /></div>
      <EfeitoTag nome="CHART GROW" at={16} until={240} style={{left: 10, top: 352}} />
      <EfeitoTag nome="GRAVITY DROP · SPRING" at={124} until={240} style={{left: 10, top: 625}} />
      <EfeitoTag nome="PATH DRAW" at={182} until={240} style={{left: 440, top: 740}} />
    </AbsoluteFill>
  );
};

// =================================================================== 04 LEGENDAS (HyperFrames)
export const Cap04: React.FC = () => (
  <AbsoluteFill>
    {/* clipe HTML+GSAP renderizado com alfa pelo HyperFrames, posicionado em coordenadas de tela cheia */}
    <div style={{position: "absolute", left: -STAGE.left, top: -STAGE.top, width: 1080, height: 1920}}>
      <OffthreadVideo src={staticFile("reels/hf-legendas.mov")} transparent muted style={{width: 1080, height: 1920}} />
    </div>
    <EfeitoTag nome="POP-UP · TYPEWRITER · MASKED · BOUNCE" at={6} style={{left: 0, right: 0, top: 690, display: "flex", justifyContent: "center"}} />
    <EfeitoTag nome="RENDERIZADO EM HYPERFRAMES (HTML + GSAP)" at={12} estado="exemplo_executavel" style={{left: 0, right: 0, top: 750, display: "flex", justifyContent: "center"}} />
  </AbsoluteFill>
);

// =================================================================== 05 VFX
const GlitchTitle: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.max(I(f, [18, 24, 34], [0, 1, 0.15]), I(f, [44, 48, 60], [0, 1, 0]), 0.12);
  return (
    <Glitch amount={a} seed="vfx">
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", background: "radial-gradient(circle, #10284d, #04060a 70%)", borderRadius: 30}}>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 260, letterSpacing: -10, color: C.branco}}>VFX</div>
        <div style={{fontFamily: F.mono, fontSize: 30, letterSpacing: 10, color: C.ouroClaro}}>DIGITAL DISTORTION</div>
      </AbsoluteFill>
    </Glitch>
  );
};
const Burst: React.FC = () => {
  const f = useCurrentFrame();
  const glow = I(f, [0, 6, 60], [0, 1, 0.5]);
  return (
    <AbsoluteFill style={{borderRadius: 30, overflow: "hidden", background: "#030509"}}>
      {/* light rays */}
      {Array.from({length: 14}, (_, i) => (
        <div key={i} style={{position: "absolute", left: W / 2 - 10, top: 360, width: 20, height: 900, transformOrigin: "50% 0%", transform: `rotate(${i * (360 / 14) + f * 0.6}deg)`, background: `linear-gradient(${C.ouroClaro}aa, transparent)`, opacity: glow * 0.5, filter: "blur(6px)"}} />
      ))}
      <div style={{position: "absolute", left: W / 2 - 110, top: 250, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, #fff, ${C.ouroClaro} 30%, ${C.ouro}00 70%)`, transform: `scale(${0.6 + glow})`, filter: `blur(${2 + glow * 4}px)`}} />
      <Particles burstAt={0} count={120} seed="vfxb" speed={1.1} area={[W, 720]} />
      <Particles count={30} seed="vfxd" area={[W, 720]} opacity={0.5} />
    </AbsoluteFill>
  );
};
const Tracking: React.FC = () => {
  const f = useCurrentFrame();
  const x = W / 2 + Math.sin(f / 13) * 280;
  const y = 330 + Math.sin(f / 9) * 150;
  const lag = 3;
  const tx = W / 2 + Math.sin((f - lag) / 13) * 280;
  const ty = 330 + Math.sin((f - lag) / 9) * 150;
  return (
    <AbsoluteFill style={{borderRadius: 30, overflow: "hidden"}}>
      <Shot v={0} t={f} w={W} h={720} />
      <div style={{position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: "50%", background: `radial-gradient(circle, #fff, ${C.azulLuz})`, boxShadow: `0 0 40px ${C.azulLuz}`}} />
      <div style={{position: "absolute", left: tx - 70, top: ty - 70, width: 140, height: 140, border: `3px solid ${C.verde}`, boxShadow: `0 0 16px ${C.verde}`}} />
      <div style={{position: "absolute", left: tx - 1, top: 0, width: 2, height: 720, background: `${C.verde}55`}} />
      <div style={{position: "absolute", left: 0, top: ty - 1, width: W, height: 2, background: `${C.verde}55`}} />
      <div style={{position: "absolute", left: tx + 80, top: ty - 60, fontFamily: F.mono, fontSize: 22, color: C.verde, background: "#000a", padding: "6px 10px"}}>
        X {Math.round(tx)} · Y {Math.round(ty)}<br />CONF 0.{90 + Math.round(random(`c${Math.floor(f / 4)}`) * 9)}
      </div>
    </AbsoluteFill>
  );
};
const Layers: React.FC = () => {
  const f = useCurrentFrame();
  const open = Math.min(I(f, [0, 20], [0, 1], EO), I(f, [40, 54], [1, 0], Easing.inOut(Easing.cubic)));
  const nomes = ["FUNDO", "PLANO", "TEXTO", "LUZ"];
  return (
    <AbsoluteFill style={{perspective: 1600, perspectiveOrigin: "50% 30%"}}>
      <div style={{position: "absolute", left: W / 2 - 330, top: 60, width: 660, height: 560, transformStyle: "preserve-3d", transform: `rotateX(${open * 50}deg) rotateZ(${open * -22}deg)`}}>
        {nomes.map((n, i) => (
          <div key={n} style={{position: "absolute", inset: 0, transform: `translateZ(${(i - 1.5) * open * 150}px)`, borderRadius: 26, overflow: "hidden", border: open > 0.05 ? `2px solid ${C.ouro}aa` : undefined}}>
            {i === 0 && <Shot v={1} t={f} w={660} h={560} />}
            {i === 1 && <svg width={660} height={560}><path d="M0 560 L120 380 L260 470 L420 330 L560 450 L660 400 L660 560Z" fill="#0d0a18" /></svg>}
            {i === 2 && <div style={{position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: F.display, fontWeight: 900, fontSize: 80, color: C.branco}}>CAMADAS</div>}
            {i === 3 && <LightLeak opacity={0.7} seed={4} />}
            <div style={{position: "absolute", left: 14, top: 12, fontFamily: F.mono, fontSize: 20, color: C.ouroClaro, opacity: open}}>{String(i + 1).padStart(2, "0")} {n}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
export const Cap05: React.FC = () => {
  const f = useCurrentFrame();
  const box = (node: React.ReactNode) => <div style={{position: "absolute", left: 0, top: 0, width: W, height: 720}}>{node}</div>;
  return (
    <AbsoluteFill>
      {f < 75 && box(<GlitchTitle />)}
      {f >= 75 && f < 150 && <Seq from={75}>{box(<Burst />)}</Seq>}
      {f >= 150 && f < 225 && <Seq from={150}>{box(<Tracking />)}</Seq>}
      {f >= 225 && <Seq from={225}>{box(<Layers />)}</Seq>}
      <EfeitoTag nome="GLITCH · RGB SPLIT" at={8} until={74} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
      <EfeitoTag nome="PARTÍCULAS · LIGHT RAYS · BLOOM" at={76} until={149} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
      <EfeitoTag nome="TRACKING · SIMULAÇÃO PROGRAMÁTICA" estado="catalogado" at={151} until={224} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
      <EfeitoTag nome="COMPOSIÇÃO EM CAMADAS" at={226} until={300} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
    </AbsoluteFill>
  );
};

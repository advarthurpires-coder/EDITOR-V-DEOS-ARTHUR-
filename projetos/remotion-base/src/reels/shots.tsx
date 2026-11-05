/** "Planos" procedurais (SVG) usados como material de demonstração — sem mídia de terceiros. */
import React from "react";
import {random} from "remotion";
import {C, F} from "./tema";

export const SHOT_NOMES = ["NOITE", "AURORA", "OCEANO", "GEOMETRIA", "TRIBUNA", "DADOS"];

type ShotProps = {v: number; t: number; w?: number; h?: number; label?: boolean};

export const Shot: React.FC<ShotProps> = ({v, t, w = 900, h = 1100, label = false}) => {
  const k = ((v % 6) + 6) % 6;
  return (
    <div style={{position: "relative", width: w, height: h, overflow: "hidden"}}>
      <svg width={w} height={h} viewBox="0 0 900 1100" preserveAspectRatio="xMidYMid slice" style={{display: "block"}}>
        {k === 0 && <Noite t={t} />}
        {k === 1 && <Aurora t={t} />}
        {k === 2 && <Oceano t={t} />}
        {k === 3 && <Geometria t={t} />}
        {k === 4 && <Tribuna t={t} />}
        {k === 5 && <Dados t={t} />}
      </svg>
      {label && (
        <div style={{position: "absolute", left: 36, bottom: 30, fontFamily: F.mono, fontSize: 26, letterSpacing: 4, color: "rgba(255,255,255,.8)"}}>
          PLANO {String(k + 1).padStart(2, "0")} · {SHOT_NOMES[k]}
        </div>
      )}
    </div>
  );
};

const Noite: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="sn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#020611" />
        <stop offset="0.7" stopColor="#0b2347" />
        <stop offset="1" stopColor="#1b3d6e" />
      </linearGradient>
    </defs>
    <rect width="900" height="1100" fill="url(#sn)" />
    {Array.from({length: 90}, (_, i) => (
      <circle key={i} cx={random(`sx${i}`) * 900} cy={random(`sy${i}`) * 650} r={0.8 + random(`sr${i}`) * 1.8} fill="#fff" opacity={0.3 + 0.7 * Math.abs(Math.sin(t / 9 + i))} />
    ))}
    <circle cx={640 - t * 0.3} cy={230} r={70} fill={C.ouroClaro} opacity={0.95} />
    <circle cx={640 - t * 0.3} cy={230} r={150} fill={C.ouro} opacity={0.12} />
    {Array.from({length: 16}, (_, i) => {
      const bw = 40 + random(`bw${i}`) * 50;
      const bh = 180 + random(`bh${i}`) * 380;
      const x = i * 58 - 20;
      return (
        <g key={i}>
          <rect x={x} y={1100 - bh} width={bw} height={bh} fill="#050a14" />
          {Array.from({length: Math.floor(bh / 40)}, (_, j) => (
            <rect key={j} x={x + 8 + (j % 2) * 14} y={1100 - bh + 20 + j * 36} width={8} height={12} fill={C.ouroClaro} opacity={random(`w${i}-${j}`) > 0.55 ? 0.75 : 0.08} />
          ))}
        </g>
      );
    })}
  </g>
);

const Aurora: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="sa" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a1446" />
        <stop offset="0.45" stopColor="#8a3a5c" />
        <stop offset="0.72" stopColor="#f0954a" />
        <stop offset="1" stopColor="#ffd38a" />
      </linearGradient>
    </defs>
    <rect width="900" height="1100" fill="url(#sa)" />
    <circle cx={450} cy={760 - t * 0.5} r={120} fill="#fff1c9" opacity={0.95} />
    <circle cx={450} cy={760 - t * 0.5} r={260} fill="#ffcf7a" opacity={0.18} />
    <path d={`M0 820 L${140 + t * 0.2} 640 L300 760 L470 590 L640 770 L780 650 L900 740 L900 1100 L0 1100Z`} fill="#4a2340" opacity={0.85} />
    <path d={`M0 900 L180 760 L360 880 L520 740 L700 900 L900 800 L900 1100 L0 1100Z`} fill="#2a1430" />
    <path d={`M0 990 L250 900 L520 990 L760 920 L900 970 L900 1100 L0 1100Z`} fill="#120814" />
  </g>
);

const Oceano: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="so" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#03101f" />
        <stop offset="0.5" stopColor="#0a3a5a" />
        <stop offset="1" stopColor="#05213a" />
      </linearGradient>
    </defs>
    <rect width="900" height="1100" fill="url(#so)" />
    <rect x={430} y={0} width={40} height={560} fill={C.ouroClaro} opacity={0.08} />
    {Array.from({length: 18}, (_, i) => {
      const y = 520 + i * 34;
      const amp = 8 + i * 1.6;
      let d = `M0 ${y}`;
      for (let x = 0; x <= 900; x += 30) d += ` L${x} ${y + Math.sin(x / 70 + t / 8 + i) * amp}`;
      return <path key={i} d={d} stroke={i % 3 === 0 ? C.ouroClaro : "#7fc4ff"} strokeOpacity={0.18 + i * 0.03} strokeWidth={2 + i * 0.15} fill="none" />;
    })}
  </g>
);

const Geometria: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width="900" height="1100" fill="#07080c" />
    <g transform={`translate(450 550) rotate(${t * 0.8})`}>
      {Array.from({length: 9}, (_, i) => (
        <rect key={i} x={-60 - i * 38} y={-60 - i * 38} width={120 + i * 76} height={120 + i * 76} fill="none" stroke={i % 2 ? C.ouro : C.ouroClaro} strokeOpacity={0.9 - i * 0.08} strokeWidth={3} transform={`rotate(${i * 9 + Math.sin(t / 20) * 10 * i})`} />
      ))}
    </g>
    <circle cx={450} cy={550} r={30} fill={C.ouroClaro} />
  </g>
);

const Tribuna: React.FC<{t: number}> = ({t}) => (
  <g>
    <defs>
      <linearGradient id="st" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1d38" />
        <stop offset="1" stopColor="#030810" />
      </linearGradient>
      <radialGradient id="stl" cx="0.5" cy="0.3" r="0.6">
        <stop offset="0" stopColor={C.ouroClaro} stopOpacity={0.35} />
        <stop offset="1" stopColor={C.ouroClaro} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width="900" height="1100" fill="url(#st)" />
    <rect width="900" height="1100" fill="url(#stl)" opacity={0.7 + 0.3 * Math.sin(t / 15)} />
    <polygon points="150,420 450,260 750,420" fill="none" stroke={C.ouro} strokeWidth={6} />
    <rect x={150} y={430} width={600} height={24} fill={C.ouro} />
    {Array.from({length: 6}, (_, i) => (
      <g key={i}>
        <rect x={185 + i * 104} y={470} width={48} height={420} fill="url(#st)" stroke={C.ouro} strokeWidth={4} />
        {[0, 1, 2].map((j) => (
          <line key={j} x1={197 + i * 104 + j * 12} y1={480} x2={197 + i * 104 + j * 12} y2={880} stroke={C.ouroEscuro} strokeWidth={2} />
        ))}
      </g>
    ))}
    <rect x={120} y={890} width={660} height={26} fill={C.ouro} />
    <rect x={90} y={916} width={720} height={26} fill={C.ouroEscuro} />
  </g>
);

const Dados: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width="900" height="1100" fill="#040a16" />
    {Array.from({length: 24}, (_, i) => (
      <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={1100} stroke="#1d4f8f" strokeOpacity={0.25} />
    ))}
    {Array.from({length: 28}, (_, i) => (
      <line key={`h${i}`} x1={0} y1={i * 40} x2={900} y2={i * 40} stroke="#1d4f8f" strokeOpacity={0.25} />
    ))}
    {[0, 1, 2].map((s) => {
      let d = "";
      for (let x = 0; x <= 900; x += 20) {
        const y = 650 - s * 120 + Math.sin(x / (90 + s * 30) + t / 10 + s) * (60 + s * 20) - x * 0.15;
        d += `${x === 0 ? "M" : "L"}${x} ${y}`;
      }
      return <path key={s} d={d} stroke={[C.ouroClaro, C.azulLuz, "#7ee0c3"][s]} strokeWidth={5} fill="none" opacity={0.9} />;
    })}
    {Array.from({length: 10}, (_, i) => (
      <rect key={i} x={60 + i * 80} y={1000 - (60 + random(`dd${i}`) * 200) * (0.6 + 0.4 * Math.sin(t / 12 + i))} width={44} height={400} fill={C.azulLuz} opacity={0.25} />
    ))}
  </g>
);

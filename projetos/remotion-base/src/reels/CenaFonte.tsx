/** Plano-fonte procedural para as demonstrações de color grading (processado depois pelo FFmpeg). */
import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame} from "remotion";

export const CenaFonte: React.FC = () => {
  const t = useCurrentFrame();
  const z = interpolate(t, [0, 300], [1.0, 1.12]);
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <svg width="100%" height="100%" viewBox="0 0 900 1100" style={{transform: `scale(${z})`}}>
        <defs>
          <linearGradient id="cf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f4f7d" />
            <stop offset="0.38" stopColor="#5b86a8" />
            <stop offset="0.55" stopColor="#e7a76a" />
            <stop offset="0.62" stopColor="#f6c78a" />
          </linearGradient>
          <linearGradient id="cf-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d69a62" />
            <stop offset="0.5" stopColor="#3f6688" />
            <stop offset="1" stopColor="#163250" />
          </linearGradient>
          <radialGradient id="cf-sun">
            <stop offset="0" stopColor="#fff6dc" />
            <stop offset="0.25" stopColor="#ffe0a0" />
            <stop offset="1" stopColor="#ffb860" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="900" height="700" fill="url(#cf-sky)" />
        {Array.from({length: 7}, (_, i) => (
          <ellipse key={i} cx={(random(`c${i}`) * 1100 + t * (0.4 + i * 0.1)) % 1100 - 100} cy={120 + i * 45} rx={150 + random(`cr${i}`) * 120} ry={18 + random(`ch${i}`) * 14} fill="#fbe3c4" opacity={0.25 + i * 0.04} />
        ))}
        <circle cx={560} cy={640 - t * 0.12} r={210} fill="url(#cf-sun)" />
        <circle cx={560} cy={640 - t * 0.12} r={46} fill="#fff3d6" />
        <path d="M0 640 L120 520 L230 600 L380 470 L520 610 L640 540 L760 620 L900 520 L900 700 L0 700Z" fill="#6b4b5e" opacity={0.75} />
        <path d="M0 690 L160 600 L310 680 L470 590 L620 690 L780 620 L900 680 L900 700 L0 700Z" fill="#3a2b3f" />
        <rect y={700} width="900" height="400" fill="url(#cf-water)" />
        {Array.from({length: 26}, (_, i) => (
          <rect key={i} x={560 - 30 - i * 3 + Math.sin(t / 6 + i) * 14} y={712 + i * 14} width={60 + i * 6} height={4} fill="#ffe7b8" opacity={0.75 - i * 0.025} />
        ))}
        {/* figura em silhueta sobre a rocha */}
        <path d="M80 1100 L120 930 L240 880 L380 950 L420 1100Z" fill="#141018" />
        <g transform="translate(250 760)">
          <ellipse cx={0} cy={0} rx={22} ry={26} fill="#c98a68" />
          <path d="M-40 40 Q0 20 40 40 L52 140 L-52 140Z" fill="#2a3550" />
          <rect x={-34} y={140} width={26} height={-2 + 0} fill="#000" />
          <path d="M-34 140 L-30 240 L-8 240 L0 150 L8 240 L30 240 L34 140Z" fill="#1b2233" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

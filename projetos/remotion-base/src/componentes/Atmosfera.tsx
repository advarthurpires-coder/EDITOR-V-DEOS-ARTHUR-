import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

/** Vinheta (escurecimento das bordas). */
export const Vinheta: React.FC<{ intensidade?: number }> = ({ intensidade = 0.55 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${intensidade}) 100%)` }} />
);

/** Grão de filme animado (determinístico por frame). */
export const GraoFilme: React.FC<{ opacidade?: number }> = ({ opacidade = 0.12 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(`grao-${frame}`) * 1000);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: opacidade, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${frame}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Camera shake / handheld: aplica deslocamento e rotação pseudoaleatórios suaves ao conteúdo. */
export const TremorCamera: React.FC<{ children: React.ReactNode; amplitude?: number; velocidade?: number }> = ({ children, amplitude = 8, velocidade = 0.35 }) => {
  const frame = useCurrentFrame();
  const f = frame * velocidade;
  const x = Math.sin(f * 1.7) * amplitude + Math.sin(f * 0.6) * amplitude * 0.6;
  const y = Math.cos(f * 1.3) * amplitude * 0.8 + Math.sin(f * 0.4) * amplitude * 0.4;
  const r = Math.sin(f * 0.9) * amplitude * 0.04;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.04)` }}>{children}</AbsoluteFill>;
};

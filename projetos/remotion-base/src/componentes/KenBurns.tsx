import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";

/** Movimento de câmera sobre foto (Ken Burns): push-in, pull-back, pan e "drone" (zoom + deriva). */
export type MovimentoCamera = "push-in" | "pull-back" | "pan-esquerda" | "pan-direita" | "drone";

export const KenBurns: React.FC<{ src: string; movimento?: MovimentoCamera; intensidade?: number; duracaoFrames?: number }> = ({
  src, movimento = "push-in", intensidade = 0.18, duracaoFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const d = duracaoFrames ?? durationInFrames;
  const t = interpolate(frame, [0, d], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  let escala = 1 + intensidade, x = 0, y = 0;
  if (movimento === "push-in") escala = 1 + intensidade * t;
  if (movimento === "pull-back") escala = 1 + intensidade * (1 - t);
  if (movimento === "pan-esquerda") x = interpolate(t, [0, 1], [intensidade * 40, -intensidade * 40]);
  if (movimento === "pan-direita") x = interpolate(t, [0, 1], [-intensidade * 40, intensidade * 40]);
  if (movimento === "drone") { escala = 1 + intensidade * (0.3 + t); x = -intensidade * 20 * t; y = -intensidade * 12 * t; }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${escala}) translate(${x}%, ${y}%)` }} />
    </AbsoluteFill>
  );
};

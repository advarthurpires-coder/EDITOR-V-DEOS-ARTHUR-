import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { marca } from "../marca";

/** Barra de progresso do vídeo (Subtitle Progress / retenção). */
export const BarraProgresso: React.FC<{ posicao?: "topo" | "base"; altura?: number; cor?: string }> = ({ posicao = "topo", altura = 10, cor = marca.cores.destaque }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames - 1);
  return (
    <AbsoluteFill style={{ justifyContent: posicao === "topo" ? "flex-start" : "flex-end" }}>
      <div style={{ height: altura, width: "100%", backgroundColor: "rgba(255,255,255,0.18)" }}>
        <div style={{ height: "100%", width: `${p * 100}%`, backgroundColor: cor }} />
      </div>
    </AbsoluteFill>
  );
};

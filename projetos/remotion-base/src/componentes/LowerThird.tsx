import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { marca } from "../marca";

/** Lower third (tarja de nome) com entrada por máscara e saída suave. Use dentro de <Sequence>. */
export const LowerThird: React.FC<{ nome: string; cargo?: string; duracaoFrames?: number; posicao?: "esquerda" | "centro" }> = ({
  nome, cargo, duracaoFrames = 120, posicao = "esquerda",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 18 });
  const saida = interpolate(frame, [duracaoFrames - 12, duracaoFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const vertical = height > width;
  const escala = width / 1920;
  const barra = interpolate(entrada, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: posicao === "centro" ? "center" : "flex-start", padding: vertical ? `0 64px 400px` : `0 ${120 * escala}px ${110 * escala}px`, opacity: saida }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 18 * Math.max(escala, 0.6) }}>
        <div style={{ width: 8 * Math.max(escala, 0.7), backgroundColor: marca.cores.destaque, transform: `scaleY(${barra})`, transformOrigin: "bottom" }} />
        <div style={{ overflow: "hidden" }}>
          <div style={{ transform: `translateX(${(1 - entrada) * -105}%)` }}>
            <div style={{ fontFamily: marca.fontes.titulo, fontWeight: 700, fontSize: vertical ? 64 : 58 * Math.max(escala, 0.6), color: marca.cores.texto, lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,.5)" }}>{nome}</div>
            {cargo ? (
              <div style={{ fontFamily: marca.fontes.corpo, fontWeight: 600, fontSize: vertical ? 34 : 30 * Math.max(escala, 0.6), color: marca.cores.destaque, letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>{cargo}</div>
            ) : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

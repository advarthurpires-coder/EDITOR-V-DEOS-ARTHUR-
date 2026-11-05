import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { marca } from "../marca";

/** Título cinematográfico: tracking (espaçamento abrindo), desfoque → foco, linha dourada. */
export const TituloCinematico: React.FC<{ titulo: string; subtitulo?: string; fundo?: string }> = ({ titulo, subtitulo, fundo }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const linha = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const sub = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: fundo ?? "transparent", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ fontFamily: marca.fontes.titulo, fontWeight: 700, fontSize: 120, color: marca.cores.texto, letterSpacing: `${interpolate(t, [0, 1], [0.0, 0.08])}em`, filter: `blur(${(1 - t) * 14}px)`, opacity: t, padding: "0 60px" }}>
        {titulo}
      </div>
      <div style={{ height: 4, width: 420 * linha, backgroundColor: marca.cores.destaque, margin: "28px 0" }} />
      {subtitulo ? (
        <div style={{ fontFamily: marca.fontes.corpo, fontWeight: 600, fontSize: 44, color: marca.cores.destaque, letterSpacing: "0.3em", textTransform: "uppercase", opacity: sub }}>{subtitulo}</div>
      ) : null}
    </AbsoluteFill>
  );
};

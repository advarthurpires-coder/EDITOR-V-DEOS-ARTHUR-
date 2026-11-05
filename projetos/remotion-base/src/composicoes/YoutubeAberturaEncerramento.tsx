import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { marca } from "../marca";
import { curvas } from "../curvas";
import { TituloCinematico, Vinheta, GraoFilme } from "../componentes";

/** Abertura de canal (16:9): título cinematográfico + subtítulo, vinheta e grão. Props: titulo, subtitulo. */
export const AberturaYoutube: React.FC<{ titulo: string; subtitulo: string }> = ({ titulo, subtitulo }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const saida = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curvas.entrada });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${marca.cores.fundoClaro}, ${marca.cores.fundo} 70%)`, opacity: saida }}>
      <TituloCinematico titulo={titulo} subtitulo={subtitulo} />
      <Vinheta intensidade={0.5} />
      <GraoFilme opacidade={0.08} />
    </AbsoluteFill>
  );
};

/** Encerramento (16:9): agradecimento, chamada e cartões para "próximo vídeo". Props: titulo, chamada, cartoes[]. */
export const EncerramentoYoutube: React.FC<{ titulo: string; chamada: string; cartoes: string[] }> = ({ titulo, chamada, cartoes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${marca.cores.fundo}, ${marca.cores.fundoClaro})`, fontFamily: marca.fontes.corpo }}>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 120 }}>
        <div style={{ fontFamily: marca.fontes.titulo, fontWeight: 700, fontSize: 96, color: marca.cores.texto, opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }) }}>{titulo}</div>
        <div style={{ height: 5, width: interpolate(frame, [8, 30], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curvas.cinematica }), background: marca.cores.destaque, margin: "28px 0" }} />
        <div style={{ fontSize: 44, color: marca.cores.destaque, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600 }}>{chamada}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-end", paddingBottom: 140, gap: 60 }}>
        {cartoes.map((c, i) => {
          const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 15, stiffness: 160 } });
          return (
            <Sequence key={i} layout="none">
              <div style={{ width: 640, height: 360, borderRadius: 24, border: `3px solid ${marca.cores.destaque}`, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "flex-end",
                            padding: 32, opacity: s, transform: `translateY(${(1 - s) * 80}px)` }}>
                <div style={{ fontSize: 38, color: marca.cores.texto, fontWeight: 600 }}>{c}</div>
              </div>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <Vinheta intensidade={0.4} />
    </AbsoluteFill>
  );
};

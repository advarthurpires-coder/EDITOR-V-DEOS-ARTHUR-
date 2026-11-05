import React from "react";
import { useCurrentFrame } from "remotion";
import { marca } from "../marca";

/** Typewriter effect com cursor piscante. */
export const MaquinaEscrever: React.FC<{ texto: string; caracteresPorFrame?: number; tamanho?: number; cor?: string; fonte?: string }> = ({
  texto, caracteresPorFrame = 0.7, tamanho = 64, cor = marca.cores.texto, fonte = marca.fontes.corpo,
}) => {
  const frame = useCurrentFrame();
  const n = Math.min(texto.length, Math.floor(frame * caracteresPorFrame));
  const cursor = Math.floor(frame / 15) % 2 === 0 || n < texto.length;
  return (
    <div style={{ fontFamily: fonte, fontSize: tamanho, color: cor, fontWeight: 600, whiteSpace: "pre-wrap" }}>
      {texto.slice(0, n)}
      <span style={{ opacity: cursor ? 1 : 0, color: marca.cores.destaque }}>|</span>
    </div>
  );
};

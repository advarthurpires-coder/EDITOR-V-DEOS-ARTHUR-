import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, createTikTokStyleCaptions, TikTokPage } from "@remotion/captions";
import { marca } from "../marca";

/**
 * Legendas dinâmicas a partir de Caption[] (tempo por palavra).
 * Estilos: "palavra" (word by word), "karaoke", "pop" (pop-up/bounce), "destaque" (highlight box), "gigante".
 */
export type EstiloLegenda = "palavra" | "karaoke" | "pop" | "destaque" | "gigante";

export const LegendaDinamica: React.FC<{
  legendas: Caption[];
  estilo?: EstiloLegenda;
  agruparMs?: number; // janela para agrupar palavras numa "página"
  posicaoY?: number; // 0..1 (0.72 = terço inferior, fora da área dos botões)
  corDestaque?: string;
  tamanho?: number;
}> = ({ legendas, estilo = "karaoke", agruparMs = 1200, posicaoY = 0.6, corDestaque = marca.cores.destaque, tamanho }) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions: legendas, combineTokensWithinMilliseconds: estilo === "palavra" || estilo === "gigante" ? 1 : agruparMs }),
    [legendas, agruparMs, estilo],
  );

  return (
    <AbsoluteFill>
      {pages.map((pagina, i) => {
        const proxima = pages[i + 1]?.startMs ?? pagina.startMs + pagina.durationMs;
        const de = Math.round((pagina.startMs / 1000) * fps);
        const ate = Math.round((Math.min(proxima, pagina.startMs + pagina.durationMs + 400) / 1000) * fps);
        if (ate <= de) return null;
        return (
          <Sequence key={i} from={de} durationInFrames={ate - de} layout="none">
            <Pagina pagina={pagina} estilo={estilo} posicaoY={posicaoY} corDestaque={corDestaque} tamanho={tamanho} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Pagina: React.FC<{ pagina: TikTokPage; estilo: EstiloLegenda; posicaoY: number; corDestaque: string; tamanho?: number }> = ({
  pagina, estilo, posicaoY, corDestaque, tamanho,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const agoraMs = pagina.startMs + (frame / fps) * 1000;
  const entrada = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const fonte = tamanho ?? (estilo === "gigante" ? width * 0.13 : width * 0.068);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", top: `${posicaoY * 100}%` }}>
      <div
        style={{
          maxWidth: "86%", textAlign: "center", fontFamily: marca.fontes.corpo, fontWeight: 800,
          fontSize: fonte, lineHeight: 1.15, color: marca.cores.texto, textTransform: estilo === "gigante" ? "uppercase" : "none",
          transform: estilo === "pop" || estilo === "gigante" ? `scale(${interpolate(entrada, [0, 1], [0.6, 1])})` : undefined,
          opacity: estilo === "palavra" ? 1 : interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
          textShadow: "0 4px 18px rgba(0,0,0,0.65)", WebkitTextStroke: estilo === "gigante" ? "3px #000" : undefined,
        }}
      >
        {pagina.tokens.map((t, i) => {
          const ativa = agoraMs >= t.fromMs && agoraMs < t.toMs;
          const dita = agoraMs >= t.fromMs;
          let estiloPalavra: React.CSSProperties = {};
          if (estilo === "karaoke") estiloPalavra = { color: dita ? corDestaque : marca.cores.texto };
          if (estilo === "pop") estiloPalavra = { color: ativa ? corDestaque : marca.cores.texto, display: "inline-block", transform: ativa ? "scale(1.12)" : "scale(1)" };
          if (estilo === "destaque")
            estiloPalavra = ativa
              ? { backgroundColor: corDestaque, color: marca.cores.fundo, borderRadius: 12, padding: "0 0.15em", boxDecorationBreak: "clone" }
              : {};
          if (estilo === "gigante") estiloPalavra = { color: corDestaque };
          return (
            <span key={i} style={{ whiteSpace: "pre", ...estiloPalavra }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { marca } from "../marca";
import { LegendaDinamica, EstiloLegenda, LowerThird, BarraProgresso, Vinheta } from "../componentes";

/**
 * Template "Reels jurídico" 1080x1920: gancho inicial, vídeo de fundo (ou gradiente),
 * legendas dinâmicas, tarja com nome, barra de progresso e CTA final.
 * Conteúdo deve respeitar o Provimento 205/2021 CFOAB (informativo, sem promessa de resultado).
 */
export type PropsReelsJuridico = {
  video?: string; // arquivo em public/ (ex.: "brutos/fala.mp4") ou URL
  gancho: string;
  legendas: Caption[];
  estiloLegenda: EstiloLegenda;
  nome: string;
  cargo: string;
  cta: string;
  duracaoSegundos: number;
};

export const Gancho: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 170 } });
  const saida = interpolate(frame, [60, 72], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: marca.areaSeguraVertical.topo + 40, opacity: saida }}>
      <div style={{ transform: `scale(${interpolate(s, [0, 1], [1.4, 1])}) rotate(${interpolate(s, [0, 1], [-4, -1.5])}deg)`, opacity: s, backgroundColor: marca.cores.destaque, color: marca.cores.fundo, fontFamily: marca.fontes.corpo, fontWeight: 800, fontSize: 76, lineHeight: 1.1, padding: "22px 36px", borderRadius: 18, maxWidth: 900, textAlign: "center", boxShadow: "0 18px 50px rgba(0,0,0,.45)" }}>
        {texto}
      </div>
    </AbsoluteFill>
  );
};

export const Cta: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(11,29,51,${0.85 * s})`, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: s, transform: `translateY(${(1 - s) * 60}px)`, textAlign: "center", padding: 80 }}>
        <div style={{ fontFamily: marca.fontes.titulo, fontWeight: 700, fontSize: 84, color: marca.cores.texto, lineHeight: 1.15 }}>{texto}</div>
        <div style={{ height: 5, width: 300, backgroundColor: marca.cores.destaque, margin: "36px auto 0" }} />
      </div>
    </AbsoluteFill>
  );
};

export const ReelsJuridico: React.FC<PropsReelsJuridico> = ({ video, gancho, legendas, estiloLegenda, nome, cargo, cta }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const ctaFrames = Math.round(3 * fps);
  const src = video ? (video.startsWith("http") ? video : staticFile(video)) : null;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${marca.cores.fundoClaro}, ${marca.cores.fundo})` }}>
      {src ? <OffthreadVideo src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
      <Vinheta intensidade={0.45} />
      <LegendaDinamica legendas={legendas} estilo={estiloLegenda} />
      <Sequence durationInFrames={75}><Gancho texto={gancho} /></Sequence>
      <Sequence from={Math.round(fps * 2.5)} durationInFrames={Math.round(fps * 4)}><LowerThird nome={nome} cargo={cargo} duracaoFrames={Math.round(fps * 4)} /></Sequence>
      <Sequence from={durationInFrames - ctaFrames}><Cta texto={cta} /></Sequence>
      <BarraProgresso posicao="topo" altura={10} />
    </AbsoluteFill>
  );
};

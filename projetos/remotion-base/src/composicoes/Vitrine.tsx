import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { marca } from "../marca";
import { TituloCinematico, ContadorDados, ChecklistAnimado, KenBurns, MaquinaEscrever, LowerThird, Vinheta, GraoFilme, TremorCamera } from "../componentes";

/** Vitrine dos componentes implementados — serve de teste visual e de referência de uso. */
const Fundo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, ${marca.cores.fundo}, ${marca.cores.fundoClaro})`, justifyContent: "center", alignItems: "center" }}>{children}</AbsoluteFill>
);

export const Vitrine: React.FC = () => {
  const T = 15; // frames de transição
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={75}>
          <Fundo><TituloCinematico titulo="Arthur Pires" subtitulo="Advocacia" /></Fundo>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={70}>
          <Fundo><ContadorDados ate={12500} prefixo="R$ " casas={2} rotulo="Data counter" /></Fundo>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={80}>
          <Fundo><ChecklistAnimado itens={["Documentos", "Prazos", "Provas"]} /></Fundo>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={80}>
          <AbsoluteFill>
            <TremorCamera amplitude={4}><KenBurns src={staticFile("exemplo-foto.jpg")} movimento="push-in" /></TremorCamera>
            <LowerThird nome="Dr. Arthur Pires" cargo="Advogado" duracaoFrames={80} />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flip()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={70}>
          <Fundo><MaquinaEscrever texto="Conheça seus direitos." tamanho={80} /></Fundo>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={clockWipe({ width: 1920, height: 1080 })} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={60}>
          <Fundo><TituloCinematico titulo="Obrigado" /></Fundo>
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Vinheta />
      <GraoFilme />
    </AbsoluteFill>
  );
};

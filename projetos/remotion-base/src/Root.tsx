import React from "react";
import { Composition, staticFile } from "remotion";
import type { Caption } from "@remotion/captions";
import { Vinheta } from "./Vinheta";
import { Vitrine } from "./composicoes/Vitrine";
import { ReelsJuridico, PropsReelsJuridico } from "./composicoes/ReelsJuridico";

const padraoReels: PropsReelsJuridico = {
  gancho: "Atenção ao prazo!",
  legendas: [],
  estiloLegenda: "karaoke",
  nome: "Dr. Arthur Pires",
  cargo: "Advogado",
  cta: "Siga para mais conteúdos jurídicos",
  duracaoSegundos: 11,
};

export const RemotionRoot: React.FC = () => (
  <>
    {/* Vinheta de abertura vertical 9:16 */}
    <Composition id="Vinheta" component={Vinheta} durationInFrames={120} fps={30} width={1080} height={1920} defaultProps={{ titulo: "Arthur Pires", subtitulo: "Advocacia" }} />

    {/* Vitrine dos componentes (16:9) — referência visual */}
    <Composition id="Vitrine" component={Vitrine} durationInFrames={360} fps={30} width={1920} height={1080} />

    {/* Template Reels/TikTok/Shorts jurídico (9:16). Props: video, gancho, legendas (Caption[] ou arquivo JSON), etc. */}
    <Composition
      id="ReelsJuridico"
      component={ReelsJuridico}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={padraoReels}
      calculateMetadata={async ({ props }) => {
        let legendas = props.legendas;
        if (!legendas.length) {
          const r = await fetch(staticFile("legendas-exemplo.json"));
          legendas = (await r.json()) as Caption[];
        }
        return { durationInFrames: Math.round(props.duracaoSegundos * 30), props: { ...props, legendas } };
      }}
    />
  </>
);

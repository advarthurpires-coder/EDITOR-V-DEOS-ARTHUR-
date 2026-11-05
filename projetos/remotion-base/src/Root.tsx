import { Composition, Still } from "remotion";
import { Vinheta } from "./Vinheta";
import { ArthurShowcase } from "./ArthurShowcase";
import { CenaFonte } from "./reels/CenaFonte";
import { ReelsArthur } from "./reels/ReelsArthur";
import { Capa } from "./reels/Capa";
import { DURACAO } from "./reels/comum";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Composição original preservada: vertical 9:16 */}
    <Composition
      id="Vinheta"
      component={Vinheta}
      durationInFrames={120}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ titulo: "Arthur Pires", subtitulo: "Advocacia" }}
    />
    {/* Demonstrações executáveis: hook, zoom, counters, barras, phone mockup, giant captions, glass/CTA */}
    <Composition
      id="ArthurShowcase"
      component={ArthurShowcase}
      durationInFrames={320}
      fps={30}
      width={1080}
      height={1920}
    />
    {/* Reels oficial — plano-fonte para color grading (processado pelo FFmpeg) */}
    {/* Reels oficial: Arthur Video Editor AI (168 s, 9:16) */}
    <Composition id="ReelsArthur" component={ReelsArthur} durationInFrames={DURACAO} fps={30} width={1080} height={1920} defaultProps={{ comAudio: true }} />
    <Still id="CapaReels" component={Capa} width={1080} height={1920} />
    <Composition id="CenaFonte" component={CenaFonte} durationInFrames={300} fps={30} width={900} height={1100} />
  </>
);

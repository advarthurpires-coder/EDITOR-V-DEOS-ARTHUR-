import { Composition } from "remotion";
import { Vinheta } from "./Vinheta";
import { ArthurShowcase } from "./ArthurShowcase";

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
  </>
);

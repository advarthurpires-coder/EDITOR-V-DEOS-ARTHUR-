import { Composition } from "remotion";
import { Vinheta } from "./Vinheta";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Vertical 9:16 — Reels / TikTok / Shorts */}
    <Composition
      id="Vinheta"
      component={Vinheta}
      durationInFrames={120}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ titulo: "Arthur Pires", subtitulo: "Advocacia" }}
    />
  </>
);

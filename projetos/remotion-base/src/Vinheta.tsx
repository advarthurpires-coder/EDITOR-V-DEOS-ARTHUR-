import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Vinheta: React.FC<{ titulo: string; subtitulo: string }> = ({ titulo, subtitulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const opacidadeSub = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1d33", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
      <div style={{ color: "#e8c77a", fontSize: 110, fontWeight: 700, transform: `translateY(${(1 - entrada) * 80}px)`, opacity: entrada }}>
        {titulo}
      </div>
      <div style={{ color: "#ffffff", fontSize: 60, marginTop: 24, opacity: opacidadeSub, letterSpacing: 8 }}>
        {subtitulo.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};

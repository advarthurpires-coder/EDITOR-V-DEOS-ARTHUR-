import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { marca } from "../marca";

/** Checklist animado com stagger: cada item entra e recebe o "check". */
export const ChecklistAnimado: React.FC<{ itens: string[]; intervaloFrames?: number; tamanho?: number }> = ({ itens, intervaloFrames = 14, tamanho = 54 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: tamanho * 0.55 }}>
      {itens.map((item, i) => {
        const s = spring({ frame: frame - i * intervaloFrames, fps, config: { damping: 15, stiffness: 160 } });
        const check = spring({ frame: frame - i * intervaloFrames - 8, fps, config: { damping: 12 } });
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: tamanho * 0.45, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
            <div style={{ width: tamanho * 1.1, height: tamanho * 1.1, borderRadius: tamanho * 0.25, border: `4px solid ${marca.cores.destaque}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" width={tamanho * 0.8} height={tamanho * 0.8}>
                <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={marca.cores.destaque} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={interpolate(check, [0, 1], [30, 0])} />
              </svg>
            </div>
            <div style={{ fontFamily: marca.fontes.corpo, fontWeight: 600, fontSize: tamanho, color: marca.cores.texto }}>{item}</div>
          </div>
        );
      })}
    </div>
  );
};

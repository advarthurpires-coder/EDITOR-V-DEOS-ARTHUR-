import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { marca } from "../marca";

/** Data counter: número que sobe de `de` até `ate` com easing. Formata em pt-BR. */
export const ContadorDados: React.FC<{ de?: number; ate: number; duracaoFrames?: number; prefixo?: string; sufixo?: string; casas?: number; rotulo?: string; tamanho?: number }> = ({
  de = 0, ate, duracaoFrames = 45, prefixo = "", sufixo = "", casas = 0, rotulo, tamanho = 160,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [0, duracaoFrames], [de, ate], { extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
  const texto = v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: marca.fontes.corpo, fontWeight: 800, fontSize: tamanho, color: marca.cores.destaque, fontVariantNumeric: "tabular-nums" }}>
        {prefixo}{texto}{sufixo}
      </div>
      {rotulo ? <div style={{ fontFamily: marca.fontes.corpo, fontSize: tamanho * 0.28, color: marca.cores.textoSuave, marginTop: 8 }}>{rotulo}</div> : null}
    </div>
  );
};

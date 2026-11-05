import { Easing, SpringConfig } from "remotion";

/**
 * Curvas de animação nomeadas do estúdio (catálogo: infraestrutura.easing-curves).
 * Use com interpolate(..., { easing: curvas.saida }) ou spring({ config: molas.suave }).
 * Equivalentes GSAP (HyperFrames): suave="power2.inOut", entrada="power3.in", saida="power3.out",
 * expressiva="expo.out", elastica="elastic.out(1,0.4)", recuo="back.out(1.7)".
 */
export const curvas = {
  linear: Easing.linear,
  suave: Easing.inOut(Easing.quad),
  entrada: Easing.in(Easing.cubic),
  saida: Easing.out(Easing.cubic),
  expressiva: Easing.out(Easing.exp),
  recuo: Easing.out(Easing.back(1.7)),
  elastica: Easing.out(Easing.elastic(1)),
  quique: Easing.bounce,
  cinematica: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

export const molas: Record<string, Partial<SpringConfig>> = {
  suave: { damping: 200 }, // sem overshoot — títulos e tarjas
  natural: { damping: 15, stiffness: 160 }, // leve overshoot — listas, cartões
  elastica: { damping: 8, stiffness: 180 }, // quique evidente — pop-ups, ícones
  pesada: { damping: 30, stiffness: 80, mass: 2 }, // entra devagar — elementos grandes
};

export type NomeCurva = keyof typeof curvas;

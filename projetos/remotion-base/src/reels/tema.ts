import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";

/** Identidade: preto, grafite, azul-escuro, detalhes dourados. */
export const C = {
  preto: "#04060a",
  grafite: "#11141b",
  grafite2: "#1b202a",
  azul: "#081a33",
  azul2: "#10345f",
  azulLuz: "#4b8dea",
  ouro: "#d4af61",
  ouroClaro: "#f3dc9b",
  ouroEscuro: "#8c6a2c",
  branco: "#f5f2ea",
  cinza: "#8d97a8",
  verde: "#4fd1a1",
  azulChip: "#6aa8ff",
} as const;

export const F = {
  display: "Montserrat, Inter, sans-serif",
  corpo: "Inter, sans-serif",
  mono: "'JetBrains Mono', monospace",
  luxo: "Cinzel, serif",
} as const;

/**
 * Área segura do Reels (1080×1920): evita cabeçalho do app (topo), legenda/botões (base)
 * e a coluna de ações à direita. Textos-chave ficam dentro deste retângulo.
 */
export const SAFE = {top: 250, bottom: 1480, left: 80, right: 960} as const;

export const GRAD_OURO = `linear-gradient(100deg, ${C.ouroEscuro} 0%, ${C.ouro} 30%, ${C.ouroClaro} 50%, ${C.ouro} 70%, ${C.ouroEscuro} 100%)`;

export const STATUS_COR: Record<string, string> = {
  exemplo_executavel: C.verde,
  integracao_nativa: C.azulChip,
  catalogado: C.cinza,
};
export const STATUS_NOME: Record<string, string> = {
  exemplo_executavel: "EXECUTÁVEL",
  integracao_nativa: "INTEGRAÇÃO",
  catalogado: "CATALOGADO",
};

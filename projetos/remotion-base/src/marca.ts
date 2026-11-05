// Identidade visual PROVISÓRIA — substitua pelos valores oficiais do escritório quando definidos.
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";

export const marca = {
  cores: {
    fundo: "#0b1d33", // azul-marinho
    fundoClaro: "#132b4a",
    destaque: "#e8c77a", // dourado
    texto: "#ffffff",
    textoSuave: "#c9d3e0",
    alerta: "#e5484d",
  },
  fontes: {
    titulo: "'Playfair Display', Georgia, serif",
    corpo: "Inter, 'Helvetica Neue', Arial, sans-serif",
  },
  // Áreas seguras (px) para 1080x1920 — evitam botões/legendas nativas de Reels/TikTok/Shorts
  areaSeguraVertical: { topo: 220, base: 380, lados: 64 },
} as const;

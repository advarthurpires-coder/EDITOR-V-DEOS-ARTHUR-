# Especificações por plataforma

Limites de duração e regras mudam com frequência — confirme na plataforma antes de projetos longos.
Os presets correspondem a `python3 scripts/estudio.py exportar --plataforma <nome>`.

| Preset | Resolução | Proporção | FPS | Bitrate máx. | Loudness | Observações |
|---|---|---|---|---|---|---|
| reels / tiktok / shorts / stories | 1080×1920 | 9:16 | 30 | 12 Mbps | −14 LUFS | áreas seguras: topo ~220 px, base ~380 px, laterais ~64 px (botões e legenda nativa) |
| feed | 1080×1350 | 4:5 | 30 | 10 Mbps | −14 LUFS | ocupa mais tela no feed do Instagram/Facebook |
| quadrado | 1080×1080 | 1:1 | 30 | 10 Mbps | −14 LUFS | LinkedIn/feed |
| youtube | 1920×1080 | 16:9 | 30 | 16 Mbps | −14 LUFS | miniatura separada 1280×720 |
| youtube-4k | 3840×2160 | 16:9 | 30 | 45 Mbps | −14 LUFS | upscale simples se a fonte for menor (não é IA) |
| linkedin | 1920×1080 | 16:9 | 30 | 10 Mbps | −14 LUFS | legendas queimadas recomendadas (autoplay mudo) |
| whatsapp | 720×1280 | 9:16 | 30 | 2,5 Mbps | −16 LUFS | arquivo leve para envio direto |

## Boas práticas para conteúdo jurídico em vídeo curto
- Gancho em até 2 s com a dúvida do público ("Você sabia que…?").
- Uma ideia por vídeo; 30–60 s rende mais que 3 min em Reels.
- Legendas sempre (a maioria assiste sem som).
- CTA informativo ("Siga para mais conteúdos"), nunca promessa de resultado (Provimento 205/2021).

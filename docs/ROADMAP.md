# Roadmap do Arthur Video Editor AI

## Entregue nesta etapa
- [x] Skill de projeto para Claude e instrução de ativação em `CLAUDE.md`
- [x] Catálogo de 384 recursos por 14 categorias
- [x] 14 presets de direção visual
- [x] Ferramenta de consulta/validação de catálogo com testes
- [x] Showcase Remotion com motions iniciais e registro como composição `ArthurShowcase`
- [x] Script de filtros FFmpeg para operações iniciais
- [x] Prompt mestre e manual de arquitetura

## Entregue no Reels oficial (projetos/reels-arthur)
- [x] Reels 1080×1920 de 168 s com as 14 categorias, renderizado (Remotion + HyperFrames + FFmpeg)
- [x] Biblioteca de efeitos Remotion reutilizável (`src/reels/fx.tsx`): glitch/RGB split, light leaks, partículas, grão, motion blur real (`@remotion/motion-blur`), kinetic type, karaokê, gravity drop, chart grow, speed ramp
- [x] Transições de capítulo: flash, zoom through, whip pan, orbit 3D, gravity drop, glitch, light leak, iris
- [x] Capítulo em HyperFrames renderizado com alfa (MOV ProRes 4444) e composto no Remotion
- [x] Presets FFmpeg `log-flat`, `teal-laranja`, `normalizar-reels`; `limpar-audio` reforçado (afftdn nr=20)
- [x] Trilha e 24 tipos de SFX sintetizados por código (sem material de terceiros), sincronizados ao roteiro
- [x] Loudness em duas passagens (−14 LUFS, TP ≤ −1,4 dBTP) e exportação Instagram automatizada
- [x] 82 recursos promovidos a `exemplo_executavel` após render (`atualizar_catalogo.py`)

## Próximos incrementos (ainda NÃO implementados)
- [ ] Biblioteca genérica de transições com `@remotion/transitions` na mesma versão do core (pacote já instalado, 4.0.540)
- [ ] Editor web com timeline multitrilha, keyframes e reprodução
- [ ] API de orquestração para converter briefings em edit decision lists
- [ ] Geração de legendas palavra-a-palavra com alinhamento confiável
- [ ] Importador multimídia para scripts de pipeline e gerenciamento de assets
- [ ] Templates parametrizados para todos os perfis e formatos
- [ ] 3D, tracking, rotoscopia e efeitos sofisticados com testes
- [ ] Sistema de SFX com catálogo de arquivos realmente licenciados
- [ ] TTS e outras ferramentas de geração de áudio configuradas e autorizadas (o Reels oficial saiu sem narração por falta de motor licenciado)
- [ ] Modelo Whisper PT-BR (`ggml-small.bin`): liberar huggingface.co na rede do ambiente
- [ ] Tracking real sobre footage (o capítulo 05 usa simulação programática)
- [ ] Renderização em lote, testes de vídeo automatizados e CI
- [ ] Captura automática de prévias para cada efeito
- [ ] Aprendizado contínuo por atualização versionada da skill e dos componentes

## Critério de pronto
Um efeito é considerado implementado somente com código funcional, parâmetros documentados, prévia/teste, indicação de dependências e pelo menos um exemplo acessível.

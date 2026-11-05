# Roadmap do Arthur Video Editor AI

## Entregue nesta etapa
- [x] Skill de projeto para Claude e instrução de ativação em `CLAUDE.md`
- [x] Catálogo de 387 recursos por 14 categorias
- [x] 14 presets de direção visual
- [x] Ferramenta de consulta/validação de catálogo com testes
- [x] Showcase Remotion com motions iniciais e registro como composição `ArthurShowcase`
- [x] Script de filtros FFmpeg para operações iniciais
- [x] Prompt mestre e manual de arquitetura
- [x] Kit `scripts/estudio.py` (cor, VFX, transições xfade, reenquadramento, velocidade, freeze, voz, ducking, silêncio, cenas, chroma, split, PiP, Ken Burns, legendas, exportação por plataforma, SFX sintetizados) com bateria de testes
- [x] Biblioteca de transições com `@remotion/transitions` 4.0.540 (mesma versão do core): fade, slide, wipe, flip, clockWipe
- [x] Componentes Remotion reutilizáveis + template parametrizado `ReelsJuridico`
- [x] Legendas palavra a palavra (karaokê, pop, destaque, gigante) a partir de `Caption[]`

## Próximos incrementos (ainda NÃO implementados)
- [ ] Editor web com timeline multitrilha, keyframes e reprodução
- [ ] API de orquestração para converter briefings em edit decision lists
- [ ] Validar transcrição real com whisper.cpp (código pronto; modelo bloqueado pela rede do ambiente — liberar huggingface.co)
- [ ] Importador multimídia para scripts de pipeline e gerenciamento de assets
- [ ] Templates parametrizados para todos os perfis e formatos
- [ ] 3D, tracking, rotoscopia e efeitos sofisticados com testes
- [ ] Sistema de SFX com catálogo de arquivos realmente licenciados (hoje: 12 SFX sintetizados por FFmpeg)
- [ ] TTS e outras ferramentas de geração de áudio configuradas e autorizadas
- [ ] Renderização em lote, testes de vídeo automatizados e CI
- [ ] Captura automática de prévias para cada efeito
- [ ] Aprendizado contínuo por atualização versionada da skill e dos componentes

## Critério de pronto
Um efeito é considerado implementado somente com código funcional, parâmetros documentados, prévia/teste, indicação de dependências e pelo menos um exemplo acessível.

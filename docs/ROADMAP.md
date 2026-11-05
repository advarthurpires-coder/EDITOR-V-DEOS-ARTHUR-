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
- [x] Motor de blocos HyperFrames offline (`scripts/blocos.py`): 91/94 itens testados, overlays com alfa, lote, sugestão
- [x] 9 transições GLSL aplicadas a clipes reais (`estudio.py transicao-shader`)
- [x] Batidas, montagem no ritmo, gate, de-esser, crossfade, tom
- [x] Prévia ao vivo, timeline, keyframes e histórico (`scripts/projeto.py`)
- [x] Abertura/encerramento de YouTube e vídeo institucional (templates próprios)

## Próximos incrementos (ainda NÃO implementados)
- [ ] Editor web com timeline multitrilha, keyframes e reprodução
- [ ] API de orquestração para converter briefings em edit decision lists
- [ ] Validar transcrição real com whisper.cpp (código pronto; modelo bloqueado pela rede do ambiente — liberar huggingface.co)
- [ ] Importador multimídia para scripts de pipeline e gerenciamento de assets
- [ ] Templates parametrizados para todos os perfis e formatos
- [ ] 3D, tracking, rotoscopia e efeitos sofisticados com testes
- [ ] Sistema de SFX com catálogo de arquivos realmente licenciados (hoje: 12 SFX sintetizados por FFmpeg)
- [ ] TTS e outras ferramentas de geração de áudio configuradas e autorizadas
- [ ] CI no GitHub para os testes (render em lote e verificação automática de blocos já existem localmente)
- [ ] Adaptar à mídia do usuário os blocos de transição/câmera do registro que hoje só animam conteúdo de exemplo
- [ ] Modo apresentação ao vivo (`hyperframes present`) — player não exibiu as cenas neste ambiente
- [ ] Captura automática de prévias para cada efeito
- [ ] Aprendizado contínuo por atualização versionada da skill e dos componentes

## Critério de pronto
Um efeito é considerado implementado somente com código funcional, parâmetros documentados, prévia/teste, indicação de dependências e pelo menos um exemplo acessível.

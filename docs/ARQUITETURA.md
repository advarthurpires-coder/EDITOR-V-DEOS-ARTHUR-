# Arquitetura da biblioteca

**Camada de direção:** `CLAUDE.md` e `.claude/skills/arthur-video-editor/SKILL.md`. Determinam quando consultar a biblioteca e o processo obrigatório.

**Camada de catálogo:** `biblioteca/catalogo.json`, com 384 especificações e status, e `biblioteca/presets.json`, com 14 perfis de edição. `scripts/catalogo.py` pesquisa e valida os dados.

**Camada de execução:** `projetos/remotion-base/` (composições React), `projetos/teste-hyperframes/` (composição HTML/GSAP existente), `scripts/efeitos-ffmpeg.sh` (presets FFmpeg executáveis) e `scripts/setup.sh` (dependências). Whisper.cpp e yt-dlp já são cobertos pelo setup original.

**Camada de testes:** `tests/test_catalogo.py` verifica unicidade dos identificadores, integridade dos presets e campos obrigatórios. A renderização visual, a qualidade do áudio e o funcionamento dos motores ainda precisam ser executados no ambiente com as dependências instaladas.

## Regras de segurança e manutenção

1. Preserve `midia/brutos` e `midia/saida` fora do Git. Evite enviar mídia com dados sensíveis.
2. Para criação de conteúdo com IA, confirme autorização/licenças e não reproduza voz ou rosto sem consentimento.
3. Registro no catálogo ≠ implementação. Nunca alegue que todos os 384 itens estão executáveis.
4. Atualize o status somente após implementação e validação.
5. Evite dependências de CDN em execução offline. Ajuste versão do Remotion em conjunto para evitar conflitos entre `remotion` e pacotes `@remotion/*`.
6. Sem permissão para alterar projetos existentes indiscriminadamente; reutilize os exemplos e preserve o histórico.

## Fluxo
Briefing → inventário da mídia → preset + storyboard → efeitos implementados → composição → render de prévia → QA (visual/áudio/legendas) → exportação → atualização documentada.

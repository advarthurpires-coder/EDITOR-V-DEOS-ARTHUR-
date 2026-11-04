# Arthur Video Editor AI

Biblioteca profissional de edição audiovisual + **skill de Claude Code** para o repositório de Arthur.

Este projeto amplia a base existente, sem apagar o kit original de Remotion, HyperFrames, FFmpeg, whisper.cpp e yt-dlp.

## O que há aqui

- **384 recursos catalogados**, em **14 categorias** — biblioteca de técnicas e efeitos, com estado de implementação explícito.
- **14 presets** para Reels, documentário, publicidade, conteúdo jurídico, eventos e outros formatos.
- Skill `.claude/skills/arthur-video-editor/SKILL.md` para o Claude consultar em tarefas de vídeo.
- Showcase Remotion `ArthurShowcase` com demonstrações iniciais executáveis.
- Receitas FFmpeg executáveis e CLI de busca/validação do catálogo.
- Prompt mestre em `docs/PROMPT-CLAUDE.md` e roteiro técnico em `docs/ARQUITETURA.md`.

**Importante:** catalogar um efeito não significa tê-lo implementado. Consulte `status` de cada item. O showcase é uma demonstração inicial, não um editor visual completo.

## Começar

```bash
bash scripts/setup.sh
python3 scripts/catalogo.py --resumo
python3 scripts/catalogo.py --buscar "zoom"
python3 scripts/catalogo.py --validar
python3 -m unittest discover -s tests

cd projetos/remotion-base
npm install
npx remotion compositions src/index.ts
npx remotion render src/index.ts ArthurShowcase out/showcase.mp4
```

## Presets FFmpeg

```bash
bash scripts/efeitos-ffmpeg.sh vertical midia/brutos/original.mp4 midia/saida/vertical.mp4
bash scripts/efeitos-ffmpeg.sh cinematico midia/brutos/original.mp4 midia/saida/cinematico.mp4
bash scripts/efeitos-ffmpeg.sh vhs midia/brutos/original.mp4 midia/saida/vhs.mp4
```

O script também oferece `preto-e-branco`, `limpar-audio` e `normalizar-audio`. Os dois últimos produzem arquivo de áudio e precisam da extensão adequada, por exemplo `.m4a`.

## Pedir ao Claude

Abra o Claude Code no repositório e peça, por exemplo:
> Use a skill arthur-video-editor para criar um Reels de 30 segundos, com legendas dinâmicas e ritmo cinematográfico. Consulte o catálogo e o preset adequado, liste o que é realmente executável e renderize uma prévia.

A skill e o `CLAUDE.md` registram como trabalhar, mas não armazenam memória automática do Claude fora dos arquivos versionados.

## Responsabilidade

Utilize apenas material com licença ou autorização. Preserve sigilo profissional, LGPD e ética da advocacia. Evite colocar dados de clientes no repositório público.

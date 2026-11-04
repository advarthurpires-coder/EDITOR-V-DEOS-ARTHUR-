# Biblioteca de recursos audiovisuais

Esta pasta contém **384 recursos catalogados** em **14 categorias** e **14 presets de edição**. Um item catalogado é uma especificação: NÃO significa que foi programado.

- `catalogo.json`: nomes, categorias, motores preferenciais, parâmetros e estado real de cada recurso.
- `presets.json`: combinações sugeridas de estilos e efeitos.
- `scripts/catalogo.py`: CLI de pesquisa/validação sem dependências externas.
- `projetos/remotion-base/src/ArthurShowcase.tsx`: composição que demonstra um conjunto inicial de motions executáveis.

## Consultar

```bash
python3 scripts/catalogo.py --resumo
python3 scripts/catalogo.py --buscar "Glass"
python3 scripts/catalogo.py --categoria motion_graphics
python3 scripts/catalogo.py --status exemplo_executavel
python3 scripts/catalogo.py --validar
```

## Estados

- **exemplo_executavel:** existe pelo menos um uso de código no showcase; não constitui plugin genérico pronto.
- **integracao_nativa:** há recursos similares na plataforma, mas requer implementação, instalação e testes.
- **catalogado:** apenas conceito descrito para desenvolvimento.

Para adicionar um efeito: criar código parametrizado, exemplo de uso, teste/render de validação, atualizar o JSON e citar o arquivo implementado.

## Fontes de referência
- https://www.remotion.dev/docs/transitions/
- https://hyperframes.app/docs/5-packages/cli
- https://ffmpeg.org/ffmpeg-filters.html
- https://github.com/ggml-org/whisper.cpp
- https://github.com/yt-dlp/yt-dlp

Atenção a licenças, vídeos e sons de terceiros. O repositório não inclui bibliotecas de arquivos de áudio protegidos.

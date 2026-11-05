#!/usr/bin/env python3
"""
Motor de blocos HyperFrames do Estúdio Arthur — instala, adapta (offline), parametriza, renderiza e aplica
os ~450 blocos/componentes do registro HyperFrames sobre os vídeos do escritório.

  python3 scripts/blocos.py preparar                      # baixa (npm) as bibliotecas usadas pelos itens instalados
  python3 scripts/blocos.py instalar whip-pan snow ...     # instala do registro e reescreve CDNs para cópias locais
  python3 scripts/blocos.py instalar --catalogo            # instala todos os itens citados em biblioteca/catalogo.json
  python3 scripts/blocos.py listar [--busca texto]         # itens instalados (tipo, tamanho, duração, nº de variáveis)
  python3 scripts/blocos.py variaveis kinetic-type-swap    # parâmetros configuráveis do item
  python3 scripts/blocos.py renderizar snow saida.mp4 [--var chave=valor ...] [--duracao 4] [--qualidade draft]
  python3 scripts/blocos.py lote yt-logo-intro linhas.json pasta/   # uma saída por linha de variáveis
  python3 scripts/blocos.py sobrepor video.mp4 snow saida.mp4 --inicio 1 [--duracao 4] [--modo alfa|tela] [--opacidade 0.8]
  python3 scripts/blocos.py sugerir "lower third podcast"  # busca no registro (termos em inglês)
  python3 scripts/blocos.py previa snow                    # folha de quadros em biblioteca/previas/snow.jpg
  python3 scripts/blocos.py testar [itens...]              # renderiza e verifica (não preto, movimento) → relatório JSON

Transições shader com os SEUS clipes: ver `python3 scripts/estudio.py transicao-shader` (Remotion + GLSL extraído dos blocos).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
BIB = RAIZ / "projetos" / "hf-biblioteca"
COMP = BIB / "compositions"
VENDOR = BIB / "vendor"            # gerado por `preparar` (fora do Git)
PREVIAS = RAIZ / "biblioteca" / "previas"
CACHE_REG = Path("/tmp/claude-0/hfcat.json")

RE_NPM = re.compile(r"https://cdn\.jsdelivr\.net/npm/(?P<pkg>@?[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)?)@(?P<ver>[0-9][A-Za-z0-9_.-]*)(?P<path>/[^\"'`\s)]*)?")
RE_FONTSOURCE = re.compile(r"https://cdn\.jsdelivr\.net/fontsource/fonts/(?P<fam>[a-z0-9-]+)@latest/(?P<arq>[a-z0-9-]+\.woff2)")
RE_CDNJS_THREE = re.compile(r"https://cdnjs\.cloudflare\.com/ajax/libs/three\.js/r(?P<r>\d+)/three\.min\.js")


def run(cmd, cwd=None, silencioso=True, timeout=None) -> subprocess.CompletedProcess:
    r = subprocess.run([str(c) for c in cmd], cwd=cwd, capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0:
        if not silencioso:
            sys.stderr.write(r.stdout[-2000:] + r.stderr[-3000:])
        raise RuntimeError(f"{cmd[0]} {cmd[1] if len(cmd) > 1 else ''} falhou ({r.returncode}): {(r.stderr or r.stdout).strip()[-600:]}")
    return r


# ------------------------------------------------------------------ projeto-biblioteca

def garantir_projeto() -> None:
    if (BIB / "hyperframes.json").exists():
        return
    BIB.parent.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ, HYPERFRAMES_SKIP_SKILLS="1")
    tmp = Path(tempfile.mkdtemp(prefix="hfinit-"))
    subprocess.run(["hyperframes", "init", "hf-biblioteca", "--example", "blank", "--non-interactive", "--skip-transcribe", "--skip-skills"],
                   cwd=tmp, env=env, capture_output=True, text=True)
    shutil.copytree(tmp / "hf-biblioteca", BIB, dirs_exist_ok=True)
    shutil.rmtree(tmp, ignore_errors=True)


def arquivo_item(nome: str) -> Path | None:
    for p in (COMP / f"{nome}.html", COMP / "components" / f"{nome}.html", COMP / nome / f"{nome}.html"):
        if p.exists():
            return p
    return None


def itens_instalados() -> list[str]:
    nomes = set()
    for p in COMP.rglob("*.html"):
        s = p.read_text(encoding="utf-8", errors="ignore")
        m = re.search(r"hyperframes-registry-item: ([a-z0-9-]+)", s)
        nomes.add(m.group(1) if m else p.stem)
    return sorted(n for n in nomes if arquivo_item(n))


# ------------------------------------------------------------------ dependências locais (offline)

def caminho_vendor_npm(pkg: str, ver: str, caminho: str) -> tuple[str, bool]:
    """Converte URL jsDelivr em caminho dentro de vendor/npm. Retorna (caminho relativo a vendor, precisa_importmap)."""
    caminho = caminho or ""
    precisa_map = False
    if caminho.endswith("/+esm"):
        caminho = caminho[: -len("/+esm")]
        precisa_map = True
    if caminho in ("", "/+esm"):
        caminho = "/build/three.module.js" if pkg == "three" else "/index.js"
        precisa_map = pkg == "three"
    return f"npm/{pkg}@{ver}{caminho}", precisa_map


def reescrever_cdn(arquivo: Path) -> dict:
    """Troca CDNs bloqueados por caminhos locais em vendor/ e injeta importmap quando addons de three usam import 'three'."""
    s = arquivo.read_text(encoding="utf-8")
    # caminho absoluto a partir da raiz do projeto: o runtime monta itens como subcomposições servidas na raiz,
    # então "../vendor" quebraria (e o runtime tentaria o GSAP no CDN bloqueado)
    # O compilador do HyperFrames troca pelo CDN qualquer GSAP cujo caminho não exista em relação à pasta do projeto
    # (rewriteUnresolvableGsapToCdn); "./vendor/..." é resolvível por ele e é especificador válido para módulos ES.
    rel = "./" + VENDOR.relative_to(BIB).as_posix()
    pacotes: set[tuple[str, str]] = set()
    fontes: set[tuple[str, str]] = set()
    three_map: set[str] = set()

    def sub_npm(m):
        pkg, ver, caminho = m.group("pkg"), m.group("ver"), m.group("path")
        destino, precisa = caminho_vendor_npm(pkg, ver, caminho)
        pacotes.add((pkg, ver))
        if precisa or pkg == "three":
            three_map.add(ver)
        return f"{rel}/{destino}"

    def sub_font(m):
        fontes.add((m.group("fam"), m.group("arq")))
        return f"{rel}/npm/@fontsource/{m.group('fam')}/files/{m.group('fam')}-{m.group('arq')}"

    def sub_cdnjs(m):
        ver = f"0.{m.group('r')}.0"
        pacotes.add(("three", ver))
        return f"{rel}/npm/three@{ver}/build/three.min.js"

    s2 = RE_FONTSOURCE.sub(sub_font, s)
    s2 = RE_NPM.sub(sub_npm, s2)
    s2 = RE_CDNJS_THREE.sub(sub_cdnjs, s2)
    # módulos de exemplo do three importam o especificador nu "three": precisa de importmap
    if three_map and "type=\"importmap\"" not in s2 and re.search(r"examples/jsm", s2):
        ver = sorted(three_map)[-1]
        mapa = json.dumps({"imports": {"three": f"{rel}/npm/three@{ver}/build/three.module.js",
                                       "three/addons/": f"{rel}/npm/three@{ver}/examples/jsm/"}})
        s2 = s2.replace("<head>", f"<head>\n    <script type=\"importmap\">{mapa}</script>", 1)
    if s2 != s:
        arquivo.write_text(s2, encoding="utf-8")
    return {"pacotes": sorted(pacotes), "fontes": sorted(fontes)}


def normalizar_caminhos_antigos() -> None:
    for p in list(COMP.rglob("*.html")) + [BIB / "index.html"]:
        if not p.exists():
            continue
        s = p.read_text(encoding="utf-8")
        s2 = re.sub(r"(?:(?:\.\./)+|(?<![\w.])/)vendor/npm/", "./vendor/npm/", s)
        if s2 != s:
            p.write_text(s2, encoding="utf-8")
        reescrever_cdn(p)


def dependencias_instaladas() -> set[tuple[str, str]]:
    deps = set()
    for p in list(COMP.rglob("*.html")) + [BIB / "index.html"]:
        if not p.exists():
            continue
        s = p.read_text(encoding="utf-8", errors="ignore")
        for m in re.finditer(r"vendor/npm/(@?[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)?)@([0-9][A-Za-z0-9_.-]*)/", s):
            deps.add((m.group(1), m.group(2)))
        if "vendor/npm/@fontsource/" in s:
            for fam in set(re.findall(r"vendor/npm/@fontsource/([a-z0-9-]+)/", s)):
                deps.add((f"@fontsource/{fam}", "latest"))
    return deps


def baixar_pacote(pkg: str, ver: str) -> Path:
    destino = VENDOR / "npm" / (f"{pkg}" if ver == "latest" else f"{pkg}@{ver}")
    if (destino / "package.json").exists():
        return destino
    destino.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="npmpack-"))
    spec = pkg if ver == "latest" else f"{pkg}@{ver}"
    r = run(["npm", "pack", spec, "--silent", "--pack-destination", tmp], timeout=600)
    tgz = tmp / r.stdout.strip().splitlines()[-1]
    with tarfile.open(tgz) as t:
        for membro in t.getmembers():
            if not membro.name.startswith("package/") or membro.issym() or membro.islnk() or ".." in Path(membro.name).parts:
                continue
            membro.name = membro.name[len("package/"):]
            if membro.name:
                t.extract(membro, destino, filter="data")
    shutil.rmtree(tmp, ignore_errors=True)
    return destino


def cmd_preparar(a):
    garantir_projeto()
    normalizar_caminhos_antigos()
    deps = dependencias_instaladas()
    for pkg, ver in sorted(deps):
        d = baixar_pacote(pkg, ver)
        print(f"ok {pkg}@{ver} → {d.relative_to(RAIZ)}")
    print(f"{len(deps)} pacote(s) prontos em {VENDOR.relative_to(RAIZ)}")


# ------------------------------------------------------------------ instalação

def nomes_do_catalogo() -> list[str]:
    cat = json.loads((RAIZ / "biblioteca" / "catalogo.json").read_text(encoding="utf-8"))
    nomes = set()
    for x in cat:
        uso = x.get("como_usar", "")
        nomes |= set(re.findall(r"hyperframes add ([a-z0-9-]+)", uso)) | set(re.findall(r"blocos\.py (?:renderizar|sobrepor) (?:\S+ )?([a-z0-9-]+)", uso))
    nomes.discard("hyperframes")
    return sorted(nomes)


def cmd_instalar(a):
    garantir_projeto()
    nomes = nomes_do_catalogo() if a.catalogo else a.nomes
    falhas = {}
    for n in nomes:
        if arquivo_item(n) and not a.forcar:
            print(f"= {n} (já instalado)")
            continue
        try:
            r = run(["hyperframes", "add", n, "--json"], cwd=BIB, timeout=180)
            info = json.loads(r.stdout.strip().splitlines()[-1])
            for f in info.get("written", []):
                if f.endswith(".html"):
                    reescrever_cdn(Path(f))
            print(f"+ {n} ({info.get('type', '').split(':')[-1]})")
        except Exception as e:  # rede bloqueada para assets, item inexistente...
            msg = str(e)
            m = re.search(r"File fetch failed: (\S+)", msg)
            falhas[n] = f"asset bloqueado: {m.group(1)}" if m else msg[-300:]
            print(f"! {n}: {falhas[n]}")
    if falhas:
        (BIB / "instalacao-falhas.json").write_text(json.dumps(falhas, ensure_ascii=False, indent=1), encoding="utf-8")
    cmd_preparar(a)


# ------------------------------------------------------------------ metadados

def meta_item(nome: str) -> dict:
    p = arquivo_item(nome)
    if not p:
        raise SystemExit(f"'{nome}' não instalado. Use: python3 scripts/blocos.py instalar {nome}")
    s = p.read_text(encoding="utf-8")
    m = re.search(r"data-composition-variables='(.*?)'", s, re.S)
    variaveis = json.loads(m.group(1)) if m else []
    w = re.search(r'data-width="(\d+)"', s); h = re.search(r'data-height="(\d+)"', s); d = re.search(r'data-duration="([\d.]+)"', s)
    return {"nome": nome, "arquivo": str(p.relative_to(RAIZ)), "tipo": "component" if "/components/" in str(p) else "block",
            "largura": int(w.group(1)) if w else 1920, "altura": int(h.group(1)) if h else 1080,
            "duracao": float(d.group(1)) if d else 4.0, "variaveis": variaveis,
            "ficha_demo": "bp-prompt" in s or "bp-right" in s}


def cmd_listar(a):
    for n in itens_instalados():
        m = meta_item(n)
        txt = f"{n:30} {m['tipo']:9} {m['largura']}x{m['altura']} {m['duracao']:>5.1f}s vars={len(m['variaveis'])}" + (" [ficha demo]" if m["ficha_demo"] else "")
        if not a.busca or a.busca.lower() in txt.lower():
            print(txt)


def cmd_variaveis(a):
    m = meta_item(a.nome)
    print(f"{a.nome}: {m['largura']}x{m['altura']}, {m['duracao']} s ({m['tipo']})")
    for v in m["variaveis"]:
        extra = f" opções={[o['value'] for o in v.get('options', [])]}" if v.get("options") else ""
        print(f"  --var {v['id']}=…   ({v.get('type')}) {v.get('label', '')} · padrão: {json.dumps(v.get('default'), ensure_ascii=False)}{extra}")
    if not m["variaveis"]:
        print("  (sem variáveis declaradas — edite o HTML do item para mudar textos/cores)")


def converter_var(valor: str, tipo: str | None):
    if tipo == "number":
        return float(valor) if "." in valor else int(valor)
    if tipo == "boolean":
        return valor.lower() in ("1", "true", "sim", "yes")
    if valor.startswith(("[", "{")):
        try:
            return json.loads(valor)
        except json.JSONDecodeError:
            pass
    return valor


def montar_variaveis(nome: str, pares: list[str]) -> dict:
    tipos = {v["id"]: v.get("type") for v in meta_item(nome)["variaveis"]}
    out = {}
    for par in pares or []:
        if "=" not in par:
            raise SystemExit(f"--var espera chave=valor (recebi '{par}')")
        k, v = par.split("=", 1)
        if k not in tipos:
            raise SystemExit(f"Variável '{k}' não existe em {nome}. Disponíveis: {', '.join(tipos) or 'nenhuma'}")
        out[k] = converter_var(v, tipos[k])
    return out


# ------------------------------------------------------------------ renderização

def id_raiz(arquivo: Path) -> str:
    s = arquivo.read_text(encoding="utf-8")
    corpo = s[s.find("<body"):] if "<body" in s else s
    m = re.search(r'data-composition-id\s*=\s*"([^"]+)"', corpo)
    return m.group(1) if m else "main"


def cabecalho_item(arquivo: Path) -> str:
    """Conteúdo do <head> do item (estilos, fontes, importmap, scripts), sem o GSAP: o host fornece o seu."""
    s = arquivo.read_text(encoding="utf-8")
    m = re.search(r"<head[^>]*>(.*?)</head>", s, re.S | re.I)
    if not m:
        return ""
    h = m.group(1)
    h = re.sub(r'<script[^>]+src="[^"]*gsap[^"]*/dist/gsap(?:\.min)?\.js"[^>]*>\s*</script>', "", h)
    h = re.sub(r"<meta[^>]*>|<title>.*?</title>", "", h, flags=re.S | re.I)
    return h


def criar_host(nome: str, variaveis: dict | None, duracao: float | None, fundo: str | None) -> Path:
    """Gera _render-<nome>.html na raiz do projeto montando o item (caminho oficial: data-composition-src)."""
    m = meta_item(nome)
    arq = RAIZ / m["arquivo"]
    W, H = m["largura"], m["altura"]
    D = duracao or m["duracao"]
    fundo_css = "transparent" if not fundo else fundo
    vals = f" data-variable-values='{json.dumps(variaveis, ensure_ascii=False)}'" if variaveis else ""
    host_id = f"host-{nome}"
    html = f"""<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <script src="./vendor/npm/gsap@3.15.0/dist/gsap.min.js"></script>
{cabecalho_item(arq)}
    <style>html,body{{margin:0;width:{W}px;height:{H}px;overflow:hidden;background:{fundo_css}}}
      #root-{nome}{{position:relative;width:{W}px;height:{H}px;overflow:hidden;background:{fundo_css}}}</style>
  </head>
  <body>
    <div id="root-{nome}" data-composition-id="{host_id}" data-start="0" data-duration="{D}" data-width="{W}" data-height="{H}">
      <div data-composition-id="{id_raiz(arq)}" data-composition-src="{arq.relative_to(BIB).as_posix()}" data-start="0" data-duration="{D}"
           data-track-index="1" data-width="{W}" data-height="{H}"{vals}></div>
    </div>
    <script>window.__timelines = window.__timelines || {{}}; window.__timelines["{host_id}"] = gsap.timeline({{ paused: true }});</script>
  </body>
</html>
"""
    host = BIB / f"_render-{nome}.html"
    host.write_text(html, encoding="utf-8")
    return host


def eh_trecho(texto: str) -> bool:
    """Componente-trecho: marcação + CSS + script para colar numa cena (sem documento nem composição raiz)."""
    corpo = re.sub(r"^\s*(<!--.*?-->\s*)*", "", texto, flags=re.S)
    return not corpo.lower().startswith(("<!doctype", "<html")) and not re.search(r"<div[^>]*data-composition-id", texto)


def receita_timeline(texto: str) -> str:
    """Código do comentário 'Timeline integration' (usa a variável tl)."""
    m = re.search(r"<!--\s*Timeline integration:?(.*?)-->", texto, re.S | re.I)
    return m.group(1).strip() if m else ""


def criar_host_trecho(nome: str, duracao: float | None, fundo: str | None, escala: float = 1.0) -> Path:
    m = meta_item(nome)
    texto = (RAIZ / m["arquivo"]).read_text(encoding="utf-8")
    trecho = re.sub(r"<!--.*?-->", "", texto, flags=re.S).strip()
    receita = receita_timeline(texto)
    W, H = m["largura"], m["altura"]
    D = duracao or m["duracao"]
    host_id = f"host-{nome}"
    plugins = "".join(f'    <script src="./vendor/npm/gsap@3.15.0/dist/{pl}.min.js"></script>\n'
                      for pl in ("MotionPathPlugin", "CustomEase", "DrawSVGPlugin", "MorphSVGPlugin", "SplitText"))
    fundo_css = fundo or "transparent"
    html = f"""<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <script src="./vendor/npm/gsap@3.15.0/dist/gsap.min.js"></script>
{plugins}    <style>html,body{{margin:0;width:{W}px;height:{H}px;overflow:hidden;background:{fundo_css}}}
      #root-{nome}{{position:relative;width:{W}px;height:{H}px;overflow:hidden;display:grid;place-items:center;background:{fundo_css}}}</style>
  </head>
  <body>
    <div id="root-{nome}" data-composition-id="{host_id}" data-start="0" data-duration="{D}" data-width="{W}" data-height="{H}">
      <div style="transform:scale({escala});transform-origin:center">
{trecho}
      </div>
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      var tl = gsap.timeline({{ paused: true }});
      try {{
{receita}
      }} catch (e) {{ console.error("receita do trecho falhou:", e); }}
      if (tl.duration() < {D}) tl.to({{}}, {{ duration: {D} - tl.duration() }}, tl.duration());
      window.__timelines["{host_id}"] = tl;
    </script>
  </body>
</html>
"""
    host = BIB / f"_render-{nome}.html"
    host.write_text(html, encoding="utf-8")
    return host


def modo_render(nome: str) -> str:
    """'trecho' para componentes sem documento; 'host' para componentes e itens com assets relativos (assetUrl); 'direto' para blocos."""
    m = meta_item(nome)
    texto = (RAIZ / m["arquivo"]).read_text(encoding="utf-8")
    if eh_trecho(texto):
        return "trecho"
    if m["tipo"] == "component":
        return "host"
    # itens com pasta própria (compositions/<nome>/<nome>.html) resolvem seus assets no modo direto
    proprio = (RAIZ / m["arquivo"]).parent.name == nome
    return "host" if ("assetUrl(" in texto and not proprio) else "direto"


def _executar_render(cmd: list, limite_s: float) -> None:
    run(cmd, cwd=BIB, timeout=limite_s)


def renderizar(nome: str, saida: Path, variaveis: dict | None = None, qualidade: str = "looks", fps: int | None = None,
               formato: str = "mp4", duracao: float | None = None, fundo: str | None = None, modo: str | None = None,
               escala: float = 1.0) -> Path:
    """Renderiza o item. Blocos: direto (-c arquivo do item, --variables). Componentes/itens com assets relativos: montados num host.
    Se o modo escolhido falhar, tenta o outro. MOV/WebM preservam transparência (overlays)."""
    m = meta_item(nome)
    saida = Path(saida).resolve()
    saida.parent.mkdir(parents=True, exist_ok=True)
    D = duracao or m["duracao"]
    limite = max(240.0, D * 45)
    base = ["-o", str(saida), "--quality", qualidade, "--format", formato, "--quiet"] + (["--fps", str(fps)] if fps else [])
    ordem = [modo or modo_render(nome)]
    if ordem[0] != "trecho":
        ordem.append("host" if ordem[0] == "direto" else "direto")
    erros = []
    for md in ordem:
        try:
            if md == "direto":
                cmd = ["hyperframes", "render", str(BIB), "-c", os.path.relpath(RAIZ / m["arquivo"], BIB), *base]
                if variaveis:
                    cmd += ["--variables", json.dumps(variaveis, ensure_ascii=False)]
                if duracao and duracao < m["duracao"] and formato == "mp4":
                    cmd += ["--end", str(duracao)]
                _executar_render(cmd, limite)
            elif md == "trecho":
                f = fundo if fundo else (None if formato in ("mov", "webm") else "#0b1d33")
                host = criar_host_trecho(nome, duracao, f, escala)
                cmd = ["hyperframes", "render", str(BIB), "-c", host.name, *base]
                if variaveis:
                    cmd += ["--variables", json.dumps(variaveis, ensure_ascii=False)]
                try:
                    _executar_render(cmd, limite)
                finally:
                    host.unlink(missing_ok=True)
            else:
                f = fundo if fundo else (None if formato in ("mov", "webm") else "#0b1d33")
                host = criar_host(nome, variaveis, duracao, f)
                try:
                    _executar_render(["hyperframes", "render", str(BIB), "-c", host.name, *base], limite)
                finally:
                    host.unlink(missing_ok=True)
            if saida.exists() and saida.stat().st_size > 0:
                return saida
            erros.append(f"{md}: sem arquivo de saída")
        except (RuntimeError, subprocess.TimeoutExpired) as e:
            erros.append(f"{md}: {str(e)[-500:]}")
            subprocess.run(["pkill", "-f", f"_render-{nome}.html"], capture_output=True)
    raise RuntimeError(" | ".join(erros))


def cmd_renderizar(a):
    v = montar_variaveis(a.nome, a.var)
    out = renderizar(a.nome, Path(a.saida), v, a.qualidade, a.fps, formato=a.formato, duracao=a.duracao, fundo=a.fundo, escala=a.escala)
    print(f"Renderizado: {out}")


def cmd_lote(a):
    linhas = json.loads(Path(a.linhas).read_text(encoding="utf-8"))
    linhas = linhas.get("rows", linhas) if isinstance(linhas, dict) else linhas
    pasta = Path(a.pasta); pasta.mkdir(parents=True, exist_ok=True)
    tipos = {v["id"]: v.get("type") for v in meta_item(a.nome)["variaveis"]}
    for i, linha in enumerate(linhas, 1):
        desconhecidas = set(linha) - set(tipos)
        if desconhecidas:
            raise SystemExit(f"Linha {i}: variáveis inexistentes {sorted(desconhecidas)}")
        out = renderizar(a.nome, pasta / f"{a.nome}-{i:02d}.mp4", linha, a.qualidade)
        print(f"{i}/{len(linhas)} {out}")


def cmd_sobrepor(a):
    """Renderiza o item com canal alfa (MOV ProRes 4444) e compõe sobre o vídeo a partir de --inicio.
    --modo tela: para itens opacos sobre fundo escuro (light leaks, flares) — mistura 'screen'."""
    m = meta_item(a.nome)
    tmp = Path(tempfile.mkdtemp(prefix="sobrepor-"))
    v = montar_variaveis(a.nome, a.var)
    vinfo = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:stream_side_data=rotation",
                            "-of", "json", a.video]).stdout)["streams"][0]
    W, H = vinfo["width"], vinfo["height"]
    if any(abs(int(float(sd.get("rotation", 0)))) % 180 == 90 for sd in vinfo.get("side_data_list", []) or []):
        W, H = H, W
    if a.ajuste == "conter":
        escala = f"scale={W}:{H}:force_original_aspect_ratio=decrease:flags=lanczos,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=black@0"
    else:
        escala = f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H}"
    atraso = f"setpts=PTS-STARTPTS+{a.inicio}/TB"
    if a.modo == "tela":
        bloco = renderizar(a.nome, tmp / "bloco.mp4", v, a.qualidade, duracao=a.duracao, fundo="#000000", escala=a.escala)
        fc = (f"[1:v]{escala},format=gbrp,{atraso}[b];[0:v]format=gbrp[v];"
              f"[v][b]blend=all_mode=screen:all_opacity={a.opacidade}:eof_action=pass,format=yuv420p[o]")
    else:
        bloco = renderizar(a.nome, tmp / "bloco.mov", v, a.qualidade, duracao=a.duracao, formato="mov", escala=a.escala)
        fc = (f"[1:v]{escala},format=yuva444p,colorchannelmixer=aa={a.opacidade},{atraso}[b];"
              f"[0:v][b]overlay=eof_action=pass:format=auto,format=yuv420p[o]")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", a.video, "-i", bloco, "-filter_complex", fc, "-map", "[o]", "-map", "0:a:0?",
         "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", a.saida], silencioso=False)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"Sobreposto: {a.saida} ({m['nome']} a partir de {a.inicio}s, modo {a.modo})")


def cmd_sugerir(a):
    r = run(["hyperframes", "catalog", "--query", a.consulta, "--json"], cwd=BIB, timeout=120)
    try:
        itens = json.loads(r.stdout)
    except json.JSONDecodeError:
        itens = json.loads(r.stdout[r.stdout.index("["):])
    if isinstance(itens, dict):
        itens = itens.get("items", itens.get("results", []))
    inst = set(itens_instalados())
    for i in itens[: a.limite]:
        marca = "✅" if i["name"] in inst else "  "
        print(f"{marca} {i['name']:30} {i.get('type', ''):9} {i.get('title', '')} — {i.get('description', '')[:110]}")
    print(f"\n{min(len(itens), a.limite)} de {len(itens)} (✅ = já instalado). Consulta em inglês funciona melhor.")


# ------------------------------------------------------------------ verificação

def analisar_video(arq: Path) -> dict:
    """Mede brilho médio e variação entre quadros (detecta render preto/vazio/parado)."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(arq), "-vf", "fps=4,scale=160:-1,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"],
                       capture_output=True, text=True)
    yavg = [float(x) for x in re.findall(r"YAVG=([\d.]+)", r.stdout)]
    r2 = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(arq), "-vf", "fps=4,scale=160:-1,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"],
                        capture_output=True, text=True)
    mov = [float(x) for x in re.findall(r"YAVG=([\d.]+)", r2.stdout)]
    dur = float(json.loads(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(arq)]).stdout)["format"]["duration"])
    return {"duracao": round(dur, 2), "brilho_medio": round(sum(yavg) / max(1, len(yavg)), 1), "movimento": round(sum(mov) / max(1, len(mov)), 2),
            "movimento_pico": round(max(mov or [0]), 2),
            "quadros_analisados": len(yavg)}


def cmd_previa(a):
    PREVIAS.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="previa-"))
    vid = renderizar(a.nome, tmp / "p.mp4", montar_variaveis(a.nome, a.var), "draft", duracao=a.duracao)
    gerar_folha(vid, PREVIAS / f"{a.nome}.jpg")
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"Prévia: {(PREVIAS / f'{a.nome}.jpg').relative_to(RAIZ)}")


def gerar_folha(video: Path, destino: Path, colunas: int = 4) -> None:
    dur = float(json.loads(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(video)]).stdout)["format"]["duration"])
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(video), "-vf",
         f"fps={colunas}/{max(dur, 0.5):.3f},scale=240:-2,tile={colunas}x1", "-frames:v", "1", "-q:v", "5", str(destino)])


def cmd_testar(a):
    nomes = a.nomes or itens_instalados()
    rel_arq = BIB / "relatorio-testes.json"
    relatorio = json.loads(rel_arq.read_text(encoding="utf-8")) if rel_arq.exists() else {}
    PREVIAS.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="testehf-"))
    for n in nomes:
        try:
            m = meta_item(n)
            limite = min(m["duracao"], a.max_segundos)
            # renderiza com alfa e compõe sobre a cor da marca: overlays transparentes (neve, partículas) ficam visíveis
            mov = renderizar(n, tmp / f"{n}.mov", None, "draft", duracao=limite, formato="mov")
            vid = tmp / f"{n}.mp4"
            run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x0b1d33:s={m['largura']}x{m['altura']}:r=30",
                 "-i", str(mov), "-filter_complex", "[0][1]overlay=shortest=1:format=auto,format=yuv420p", "-c:v", "libx264", "-crf", "23",
                 "-preset", "veryfast", str(vid)])
            mov.unlink(missing_ok=True)
            med = analisar_video(vid)
            # fundo do host é a cor da marca (YAVG ~25); exige movimento entre quadros (render vivo, não congelado)
            ok = med["movimento"] > 0.05 or med["movimento_pico"] > 0.3   # pico: animações pequenas e localizadas
            gerar_folha(vid, PREVIAS / f"{n}.jpg")
            relatorio[n] = {"ok": ok, **med, "ficha_demo": m["ficha_demo"], "tipo": m["tipo"], "variaveis": len(m["variaveis"])}
            print(f"{'✅' if ok else '⚠️ '} {n:30} brilho={med['brilho_medio']:>5} movimento={med['movimento']:>6} dur={med['duracao']}s")
        except Exception as e:
            relatorio[n] = {"ok": False, "erro": str(e)[-400:]}
            print(f"❌ {n}: {str(e)[-200:]}")
        (tmp / f"{n}.mp4").unlink(missing_ok=True)
        rel_arq.write_text(json.dumps(relatorio, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")  # salva a cada item
    rel_arq.write_text(json.dumps(relatorio, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
    ok = sum(1 for v in relatorio.values() if v.get("ok"))
    print(f"\n{ok}/{len(relatorio)} itens renderizados e verificados → {rel_arq.relative_to(RAIZ)}")
    shutil.rmtree(tmp, ignore_errors=True)


def main():
    if not shutil.which("hyperframes"):
        raise SystemExit("HyperFrames não instalado. Rode bash scripts/setup.sh")
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("preparar"); s.set_defaults(fn=cmd_preparar)
    s = sp.add_parser("instalar"); s.add_argument("nomes", nargs="*"); s.add_argument("--catalogo", action="store_true"); s.add_argument("--forcar", action="store_true"); s.set_defaults(fn=cmd_instalar)
    s = sp.add_parser("listar"); s.add_argument("--busca"); s.set_defaults(fn=cmd_listar)
    s = sp.add_parser("variaveis"); s.add_argument("nome"); s.set_defaults(fn=cmd_variaveis)
    s = sp.add_parser("renderizar"); s.add_argument("nome"); s.add_argument("saida"); s.add_argument("--var", action="append")
    s.add_argument("--qualidade", default="looks", choices=["draft", "looks", "delivery"]); s.add_argument("--fps", type=int)
    s.add_argument("--formato", default="mp4", choices=["mp4", "webm", "mov", "gif"], help="mov/webm = fundo transparente (overlay)")
    s.add_argument("--duracao", type=float, help="duração da montagem (itens elásticos se adaptam)"); s.add_argument("--fundo", help="cor CSS de fundo no MP4 (padrão: azul da marca)")
    s.add_argument("--escala", type=float, default=1.0, help="amplia componentes-trecho (ex.: 4 para um ícone de interface)")
    s.set_defaults(fn=cmd_renderizar)
    s = sp.add_parser("lote"); s.add_argument("nome"); s.add_argument("linhas", help="JSON: lista de objetos de variáveis"); s.add_argument("pasta")
    s.add_argument("--qualidade", default="looks"); s.set_defaults(fn=cmd_lote)
    s = sp.add_parser("sobrepor"); s.add_argument("video"); s.add_argument("nome"); s.add_argument("saida"); s.add_argument("--var", action="append")
    s.add_argument("--inicio", type=float, default=0.0); s.add_argument("--duracao", type=float); s.add_argument("--modo", default="alfa", choices=["alfa", "tela"])
    s.add_argument("--opacidade", type=float, default=1.0); s.add_argument("--escala", type=float, default=1.0)
    s.add_argument("--ajuste", default="conter", choices=["conter", "cobrir"]); s.add_argument("--qualidade", default="looks"); s.set_defaults(fn=cmd_sobrepor)
    s = sp.add_parser("sugerir"); s.add_argument("consulta"); s.add_argument("--limite", type=int, default=12); s.set_defaults(fn=cmd_sugerir)
    s = sp.add_parser("previa"); s.add_argument("nome"); s.add_argument("--var", action="append"); s.add_argument("--duracao", type=float); s.set_defaults(fn=cmd_previa)
    s = sp.add_parser("testar"); s.add_argument("nomes", nargs="*"); s.add_argument("--max-segundos", type=float, default=6.0); s.set_defaults(fn=cmd_testar)
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()

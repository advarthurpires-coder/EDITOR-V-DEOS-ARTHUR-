#!/usr/bin/env python3
"""
Catálogo de recursos audiovisuais do Estúdio Arthur — pesquisa, presets, manutenção e validação.
Fonte de verdade: biblioteca/catalogo.json e biblioteca/presets.json (sem dependências externas).

Consultar
  python3 scripts/catalogo.py --resumo                         # contagem por categoria e estado
  python3 scripts/catalogo.py --buscar "zoom"                  # termos combinados (E); acentos ignorados
  python3 scripts/catalogo.py --buscar legenda --status implementado
  python3 scripts/catalogo.py --categoria transicoes [--motor ffmpeg] [--status integracao_nativa]
  python3 scripts/catalogo.py --ver motion_graphics.data-counter
  python3 scripts/catalogo.py --presets                        # lista presets
  python3 scripts/catalogo.py --preset juridico-sobrio         # efeitos do preset com o estado real de cada um

Manter
  python3 scripts/catalogo.py --marcar <id> implementado --uso "comando/componente" --arquivo caminho --testado
  python3 scripts/catalogo.py --adicionar <categoria> "<Nome>" --descricao "..." [--status catalogado] [--motores a,b] [--uso ...]
  python3 scripts/catalogo.py --validar                        # integridade + referências a comandos/componentes/arquivos
  python3 scripts/catalogo.py --md                             # regenera biblioteca/CATALOGO.md

Estados (do mais maduro ao menos):
  implementado        código reutilizável e parametrizado no repo, testado (testado=false => teste real pendente)
  exemplo_executavel  existe demonstração em código (ex.: ArthurShowcase), não é componente genérico
  integracao_nativa   disponível numa ferramenta instalada (bloco HyperFrames, filtro FFmpeg, recurso Remotion) — requer adaptação/teste
  catalogado          apenas especificação; NÃO implementado
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAT = ROOT / "biblioteca" / "catalogo.json"
PRE = ROOT / "biblioteca" / "presets.json"
MD = ROOT / "biblioteca" / "CATALOGO.md"
FIELDS = {"id", "nome", "categoria", "tipo", "motores", "status", "parametros"}
STATUS = ("implementado", "exemplo_executavel", "integracao_nativa", "catalogado")
ICONE = {"implementado": "✅", "exemplo_executavel": "🧪", "integracao_nativa": "🔌", "catalogado": "📋"}
LEGENDA = {
    "implementado": "Código reutilizável no repositório, parametrizado e testado (ver `como_usar`).",
    "exemplo_executavel": "Demonstração em código (ex.: ArthurShowcase); não é componente genérico.",
    "integracao_nativa": "Disponível numa ferramenta instalada; requer adaptação e teste no projeto.",
    "catalogado": "Apenas especificação — não implementado.",
}


# ------------------------------------------------------------------ leitura/escrita (API usada pelos testes)

def read():
    return json.loads(CAT.read_text(encoding="utf-8")), json.loads(PRE.read_text(encoding="utf-8"))


def write(items) -> None:
    CAT.write_text(json.dumps(items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def norm(s: str) -> str:
    return unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().casefold()


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", norm(s)).strip("-")


# ------------------------------------------------------------------ validação

def validate(items, presets):
    errors = []
    ids = [e.get("id") for e in items]
    dup = [i for i, n in Counter(ids).items() if n > 1]
    if dup:
        errors.append(f"IDs duplicados no catálogo: {dup}")
    if len(items) < 250:
        errors.append("Catálogo deve conter ao menos 250 recursos.")
    estudio = (ROOT / "scripts" / "estudio.py").read_text(encoding="utf-8") if (ROOT / "scripts" / "estudio.py").exists() else ""
    comandos = set(re.findall(r'sp\.add_parser\("([a-z-]+)"', estudio))
    fontes = " ".join(p.read_text(encoding="utf-8") for p in (ROOT / "projetos" / "remotion-base" / "src").rglob("*.tsx"))
    projeto_py = (ROOT / "scripts" / "projeto.py").read_text(encoding="utf-8") if (ROOT / "scripts" / "projeto.py").exists() else ""
    cmds_projeto = set(re.findall(r'sp\.add_parser\("([a-z-]+)"', projeto_py))
    comp_hf = ROOT / "projetos" / "hf-biblioteca" / "compositions"
    rel_arq = ROOT / "projetos" / "hf-biblioteca" / "relatorio-testes.json"
    relatorio = json.loads(rel_arq.read_text(encoding="utf-8")) if rel_arq.exists() else None

    def bloco_instalado(nome: str) -> bool:
        return any(p.exists() for p in (comp_hf / f"{nome}.html", comp_hf / "components" / f"{nome}.html", comp_hf / nome / f"{nome}.html"))
    for i, item in enumerate(items):
        absent = FIELDS - set(item)
        if absent:
            errors.append(f"Item {i}: campos ausentes: {sorted(absent)}")
        st = item.get("status")
        if st not in STATUS:
            errors.append(f"Item {i} ({item.get('id')}): status inválido.")
        if st in ("implementado", "exemplo_executavel"):
            arq = item.get("arquivo_exemplo")
            if not arq or not (ROOT / arq).exists():
                errors.append(f"{item['id']}: arquivo_exemplo ausente ou inexistente ({arq}).")
        if st == "implementado":
            uso = item.get("como_usar", "")
            if not uso:
                errors.append(f"{item['id']}: implementado sem 'como_usar'.")
            for cmd in re.findall(r"estudio\.py ([a-z-]+)", uso):
                if cmd not in comandos:
                    errors.append(f"{item['id']}: comando inexistente 'estudio.py {cmd}'.")
            for bloco in re.findall(r"blocos\.py (?:renderizar|previa|variaveis) ([a-z0-9-]+)", uso) + re.findall(r"blocos\.py sobrepor \S+ ([a-z0-9-]+)", uso):
                if not bloco_instalado(bloco):
                    errors.append(f"{item['id']}: bloco HyperFrames não instalado '{bloco}'.")
                elif relatorio is not None and not relatorio.get(bloco, {}).get("ok"):
                    errors.append(f"{item['id']}: bloco '{bloco}' não aprovado no relatório de testes (blocos.py testar).")
            for cmd in re.findall(r"projeto\.py ([a-z-]+)", uso):
                if cmd not in cmds_projeto:
                    errors.append(f"{item['id']}: comando inexistente 'projeto.py {cmd}'.")
            for comp in re.findall(r"Remotion: <?([A-Z][A-Za-z]+)", uso):
                if f"export const {comp}" not in fontes:
                    errors.append(f"{item['id']}: componente Remotion inexistente '{comp}'.")
    valid = set(ids)
    for p in presets:
        for eid in p.get("efeitos", []):
            if eid not in valid:
                errors.append(f"Preset {p.get('id')}: efeito inexistente {eid}.")
    return errors


# ------------------------------------------------------------------ apresentação

def linha(x, detalhado=True) -> str:
    pend = " (teste pendente)" if x["status"] == "implementado" and not x.get("testado", True) else ""
    s = f"{ICONE.get(x['status'], '?')} {x['id']} | {x['nome']} | {x['status']}{pend} | {','.join(x['motores'])}"
    if detalhado and x.get("como_usar"):
        s += f"\n      ↳ {x['como_usar']}"
    return s


def filtrar(items, a):
    termos = norm(a.buscar).split() if a.buscar else []
    for x in items:
        if a.categoria and x["categoria"] != a.categoria:
            continue
        if a.status and x["status"] != a.status:
            continue
        if a.motor and a.motor not in x["motores"]:
            continue
        if termos:
            texto = norm(" ".join([x["nome"], x["id"], x["categoria"], x.get("categoria_nome", ""), x["tipo"], " ".join(x["motores"]),
                                   x.get("descricao", ""), x.get("como_usar", ""), x.get("observacao", "")]))
            if not all(t in texto for t in termos):
                continue
        yield x


def resumo(items, presets):
    print(f"Catálogo: {len(items)} recursos em {len({x['categoria'] for x in items})} categorias; {len(presets)} presets.")
    por = defaultdict(Counter)
    nomes = {}
    for x in items:
        por[x["categoria"]][x["status"]] += 1
        nomes[x["categoria"]] = x.get("categoria_nome", x["categoria"])
    print(f"\n{'categoria':44} {'✅impl':>7} {'🧪exem':>7} {'🔌integ':>8} {'📋catal':>8} {'total':>6}")
    tot = Counter()
    for cat in dict.fromkeys(x["categoria"] for x in items):
        k = por[cat]; tot.update(k)
        print(f"{nomes[cat][:44]:44} {k['implementado']:>7} {k['exemplo_executavel']:>7} {k['integracao_nativa']:>8} {k['catalogado']:>8} {sum(k.values()):>6}")
    print(f"{'TOTAL':44} {tot['implementado']:>7} {tot['exemplo_executavel']:>7} {tot['integracao_nativa']:>8} {tot['catalogado']:>8} {sum(tot.values()):>6}")
    pend = [x["id"] for x in items if x["status"] == "implementado" and not x.get("testado", True)]
    if pend:
        print(f"\nImplementados com teste real pendente: {', '.join(pend)}")


def mostrar_preset(pid, items, presets):
    p = next((q for q in presets if q["id"] == pid), None)
    if not p:
        raise SystemExit(f"Preset não encontrado. Opções: {', '.join(q['id'] for q in presets)}")
    por_id = {x["id"]: x for x in items}
    print(f"{p['nome']} ({p['id']}) — perfil {p.get('perfil')}, {p.get('formatoPadrao')} @ {p.get('fps')} fps")
    if p.get("nota"):
        print(f"Nota: {p['nota']}")
    for eid in p.get("efeitos", []):
        print("  " + linha(por_id[eid]))
    prontos = sum(por_id[e]["status"] == "implementado" for e in p.get("efeitos", []))
    print(f"\n{prontos}/{len(p.get('efeitos', []))} efeitos do preset implementados.")


def gerar_md(items, presets) -> None:
    tot = Counter(x["status"] for x in items)
    L = ["# Catálogo de recursos — Estúdio Arthur", "",
         "> Gerado de `biblioteca/catalogo.json` por `python3 scripts/catalogo.py --md`. Não edite à mão.", "",
         f"**{len(items)} recursos** · ✅ {tot['implementado']} implementados · 🧪 {tot['exemplo_executavel']} exemplos executáveis · "
         f"🔌 {tot['integracao_nativa']} por integração nativa · 📋 {tot['catalogado']} catalogados · {len(presets)} presets", "",
         "| | Estado | Significado |", "|---|---|---|"]
    L += [f"| {ICONE[s]} | `{s}` | {LEGENDA[s]} |" for s in STATUS]
    L += ["", "Itens implementados marcados com *(teste pendente)* têm código pronto mas ainda sem validação real.", "",
          "Busca: `python3 scripts/catalogo.py --buscar \"<termo>\" [--status implementado]`", ""]
    for cat in dict.fromkeys(x["categoria"] for x in items):
        its = [x for x in items if x["categoria"] == cat]
        k = Counter(x["status"] for x in its)
        L += [f"## {its[0].get('categoria_nome', cat)} (`{cat}`)", "",
              f"✅ {k['implementado']} · 🧪 {k['exemplo_executavel']} · 🔌 {k['integracao_nativa']} · 📋 {k['catalogado']}", "",
              "| | Recurso | Descrição | Motores | Como usar / observação |", "|---|---|---|---|---|"]
        for x in its:
            pend = " *(teste pendente)*" if x["status"] == "implementado" and not x.get("testado", True) else ""
            uso = x.get("como_usar", "").replace("|", "\\|")
            obs = x.get("observacao", "") if x["status"] != "implementado" or not x.get("testado", True) else ""
            cel = " — ".join(filter(None, [f"`{uso}`" if uso else "", obs.replace("|", "\\|")]))
            L.append(f"| {ICONE[x['status']]} | **{x['nome']}**{pend} | {x.get('descricao', '')} | {', '.join(x['motores'])} | {cel} |")
        L.append("")
    L += ["## Presets", "", "| Preset | Perfil | Formato | Efeitos implementados |", "|---|---|---|---|"]
    por_id = {x["id"]: x for x in items}
    for p in presets:
        ef = p.get("efeitos", [])
        ok = sum(por_id[e]["status"] == "implementado" for e in ef if e in por_id)
        L.append(f"| **{p['nome']}** (`{p['id']}`) | {p.get('perfil', '')} | {p.get('formatoPadrao', '')} | {ok}/{len(ef)} |")
    MD.write_text("\n".join(L) + "\n", encoding="utf-8")


# ------------------------------------------------------------------ CLI

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--buscar", metavar="TEXTO")
    ap.add_argument("--categoria")
    ap.add_argument("--status", choices=STATUS)
    ap.add_argument("--motor", help="ffmpeg, remotion, hyperframes, whisper...")
    ap.add_argument("--resumo", action="store_true")
    ap.add_argument("--validar", action="store_true")
    ap.add_argument("--ver", metavar="ID")
    ap.add_argument("--presets", action="store_true")
    ap.add_argument("--preset", metavar="ID")
    ap.add_argument("--md", action="store_true")
    ap.add_argument("--marcar", nargs=2, metavar=("ID", "STATUS"))
    ap.add_argument("--adicionar", nargs=2, metavar=("CATEGORIA", "NOME"))
    ap.add_argument("--descricao"); ap.add_argument("--uso"); ap.add_argument("--arquivo"); ap.add_argument("--obs")
    ap.add_argument("--motores", help="lista separada por vírgula"); ap.add_argument("--testado", action="store_true")
    ap.add_argument("--compacto", action="store_true", help="uma linha por item")
    a = ap.parse_args()
    items, presets = read()

    if a.validar:
        errors = validate(items, presets)
        if errors:
            print("\n".join(errors), file=sys.stderr)
            return 1
        print(f"OK: {len(items)} recursos e {len(presets)} presets válidos.")
        return 0
    if a.ver:
        x = next((i for i in items if i["id"] == a.ver), None)
        if not x:
            raise SystemExit("Item não encontrado; use --buscar.")
        print(json.dumps(x, ensure_ascii=False, indent=2)); return 0
    if a.presets:
        for p in presets:
            print(f"{p['id']:22} {p['nome']} — {p.get('formatoPadrao', '')} ({len(p.get('efeitos', []))} efeitos)")
        return 0
    if a.preset:
        mostrar_preset(a.preset, items, presets); return 0
    if a.md:
        gerar_md(items, presets); print(f"Gerado {MD.relative_to(ROOT)}"); return 0
    if a.marcar:
        iid, st = a.marcar
        if st not in STATUS:
            raise SystemExit(f"Estado inválido. Opções: {', '.join(STATUS)}")
        x = next((i for i in items if i["id"] == iid), None)
        if not x:
            raise SystemExit("Item não encontrado.")
        x["status"] = st
        if a.uso is not None: x["como_usar"] = a.uso
        if a.arquivo is not None: x["arquivo_exemplo"] = a.arquivo
        if a.obs is not None: x["observacao"] = a.obs
        if a.motores: x["motores"] = sorted(set(x["motores"]) | set(a.motores.split(",")))
        x["testado"] = bool(a.testado) and st in ("implementado", "exemplo_executavel")
        errs = [e for e in validate(items, presets) if iid in e]
        if errs:
            raise SystemExit("Não salvo:\n" + "\n".join(errs))
        write(items); gerar_md(items, presets); print("Atualizado:\n" + linha(x)); return 0
    if a.adicionar:
        cat, nome = a.adicionar
        base = next((i for i in items if i["categoria"] == cat), None)
        if not base:
            raise SystemExit(f"Categoria inválida. Opções: {', '.join(dict.fromkeys(i['categoria'] for i in items))}")
        iid = f"{cat}.{slug(nome)}"
        if any(i["id"] == iid for i in items):
            raise SystemExit(f"Já existe: {iid} (use --marcar)")
        st = a.status or "catalogado"
        x = {"id": iid, "nome": nome, "categoria": cat, "categoria_nome": base.get("categoria_nome", cat), "tipo": base["tipo"],
             "motores": (a.motores or "orquestracao").split(","), "status": st, "parametros": ["entrada", "saida"],
             "arquivo_exemplo": a.arquivo, "observacao": a.obs or LEGENDA[st], "descricao": a.descricao or "",
             "como_usar": a.uso or "", "testado": bool(a.testado) and st in ("implementado", "exemplo_executavel")}
        pos = max(i for i, it in enumerate(items) if it["categoria"] == cat) + 1
        items.insert(pos, x)
        errs = [e for e in validate(items, presets) if iid in e]
        if errs:
            raise SystemExit("Não salvo:\n" + "\n".join(errs))
        write(items); gerar_md(items, presets); print("Adicionado:\n" + linha(x)); return 0
    if a.resumo or not any((a.buscar, a.categoria, a.status, a.motor)):
        resumo(items, presets); return 0

    sel = list(filtrar(items, a))
    for x in sel:
        print(linha(x, detalhado=not a.compacto))
    print(f"Total: {len(sel)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

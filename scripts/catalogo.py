#!/usr/bin/env python3
"""
Catálogo de efeitos e recursos do Estúdio Arthur.

  python3 scripts/catalogo.py buscar "zoom"                    # busca em nome, descrição, uso e ferramentas
  python3 scripts/catalogo.py buscar legenda --status implementado
  python3 scripts/catalogo.py listar --categoria transicoes [--status integracao] [--ferramenta ffmpeg]
  python3 scripts/catalogo.py ver transicoes.flash-cut          # ficha completa de um item
  python3 scripts/catalogo.py stats                             # contagem por categoria e status
  python3 scripts/catalogo.py status <id> <implementado|integracao|catalogado> [--uso "..."] [--obs "..."] [--testado]
  python3 scripts/catalogo.py adicionar <categoria> "<Nome>" --descricao "..." --status ... [--ferramentas a,b] [--uso "..."]
  python3 scripts/catalogo.py validar                           # consistência do JSON e das referências
  python3 scripts/catalogo.py md                                # regenera catalogo/CATALOGO.md

Status: implementado (existe no repositório e foi testado) · integracao (disponível em ferramenta instalada,
sem componente próprio) · catalogado (planejado; requer desenvolvimento, modelo ou biblioteca externa).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARQ = RAIZ / "catalogo" / "catalogo.json"
MD = RAIZ / "catalogo" / "CATALOGO.md"
STATUS = ("implementado", "integracao", "catalogado")
ICONE = {"implementado": "✅", "integracao": "🔌", "catalogado": "📋"}


def carregar() -> dict:
    return json.loads(ARQ.read_text(encoding="utf-8"))


def salvar(c: dict) -> None:
    c["atualizado_em"] = dt.date.today().isoformat()
    ARQ.write_text(json.dumps(c, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def norm(s: str) -> str:
    return unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", norm(s)).strip("-")


def filtrar(itens, a):
    for it in itens:
        if getattr(a, "categoria", None) and it["categoria"] != a.categoria:
            continue
        if getattr(a, "status", None) and it["status"] != a.status:
            continue
        if getattr(a, "ferramenta", None) and a.ferramenta not in it["ferramentas"]:
            continue
        yield it


def linha(it) -> str:
    uso = f"\n      ↳ {it['como_usar']}" if it["como_usar"] else ""
    teste = "" if it["testado"] or it["status"] != "implementado" else " (teste pendente)"
    return f"{ICONE[it['status']]} {it['id']}  —  {it['nome']}{teste}: {it['descricao']}{uso}"


def cmd_buscar(a):
    c = carregar()
    termos = norm(a.termo).split()
    achados = []
    for it in filtrar(c["itens"], a):
        texto = norm(" ".join([it["nome"], it["descricao"], it["como_usar"], it["parametros"], " ".join(it["ferramentas"]), it["categoria"], it["observacoes"]]))
        if all(t in texto for t in termos):
            achados.append(it)
    for it in achados:
        print(linha(it))
    print(f"\n{len(achados)} resultado(s).")


def cmd_listar(a):
    c = carregar()
    n = 0
    for it in filtrar(c["itens"], a):
        print(linha(it)); n += 1
    print(f"\n{n} item(ns).")


def cmd_ver(a):
    c = carregar()
    it = next((x for x in c["itens"] if x["id"] == a.id), None)
    if not it:
        raise SystemExit("Item não encontrado. Use 'buscar'.")
    print(json.dumps(it, ensure_ascii=False, indent=2))


def cmd_stats(a):
    c = carregar()
    por = defaultdict(Counter)
    for it in c["itens"]:
        por[it["categoria"]][it["status"]] += 1
    print(f"{'categoria':38} {'✅ impl':>8} {'🔌 integ':>9} {'📋 catal':>9} {'total':>6}")
    tot = Counter()
    for cid, meta in sorted(c["categorias"].items(), key=lambda kv: kv[1]["numero"]):
        k = por[cid]; tot.update(k)
        print(f"{meta['numero']:>2}. {meta['nome'][:34]:34} {k['implementado']:>8} {k['integracao']:>9} {k['catalogado']:>9} {sum(k.values()):>6}")
    print(f"{'TOTAL':38} {tot['implementado']:>8} {tot['integracao']:>9} {tot['catalogado']:>9} {sum(tot.values()):>6}")


def cmd_status(a):
    c = carregar()
    it = next((x for x in c["itens"] if x["id"] == a.id), None)
    if not it:
        raise SystemExit("Item não encontrado.")
    it["status"] = a.novo
    if a.uso is not None:
        it["como_usar"] = a.uso
    if a.obs is not None:
        it["observacoes"] = a.obs
    it["testado"] = bool(a.testado) and a.novo == "implementado"
    salvar(c); cmd_md(a, silencioso=True)
    print("Atualizado:", linha(it))


def cmd_adicionar(a):
    c = carregar()
    if a.categoria not in c["categorias"]:
        raise SystemExit(f"Categoria inválida. Opções: {', '.join(c['categorias'])}")
    iid = f"{a.categoria}.{slug(a.nome)}"
    if any(x["id"] == iid for x in c["itens"]):
        raise SystemExit(f"Já existe: {iid} (use 'status' para atualizar)")
    it = {"id": iid, "nome": a.nome, "categoria": a.categoria, "descricao": a.descricao,
          "ferramentas": [f for f in (a.ferramentas or "").split(",") if f], "status": a.status, "como_usar": a.uso or "",
          "parametros": a.parametros or "", "compatibilidade": (a.compat or "16:9,9:16,1:1,4:5").split(","),
          "testado": bool(a.testado) and a.status == "implementado", "observacoes": a.obs or ""}
    c["itens"].append(it)
    salvar(c); cmd_md(a, silencioso=True)
    print("Adicionado:", linha(it))


def cmd_validar(a):
    c = carregar()
    erros = []
    ids = Counter(x["id"] for x in c["itens"])
    erros += [f"id duplicado: {i}" for i, n in ids.items() if n > 1]
    comandos = set(re.findall(r'sp\.add_parser\("([a-z-]+)"', (RAIZ / "scripts" / "estudio.py").read_text(encoding="utf-8")))
    comp_dir = RAIZ / "projetos" / "remotion-base" / "src"
    fontes_remotion = " ".join(p.read_text(encoding="utf-8") for p in comp_dir.rglob("*.tsx"))
    for it in c["itens"]:
        for campo in ("id", "nome", "categoria", "descricao", "status", "como_usar", "ferramentas"):
            if campo not in it:
                erros.append(f"{it.get('id')}: falta campo {campo}")
        if it["status"] not in STATUS:
            erros.append(f"{it['id']}: status inválido {it['status']}")
        if it["categoria"] not in c["categorias"]:
            erros.append(f"{it['id']}: categoria inexistente")
        if it["status"] == "implementado":
            if not it["como_usar"]:
                erros.append(f"{it['id']}: implementado sem 'como_usar'")
            for cmd in re.findall(r"estudio\.py ([a-z-]+)", it["como_usar"]):
                if cmd not in comandos:
                    erros.append(f"{it['id']}: comando estudio inexistente '{cmd}'")
            for comp in re.findall(r"Remotion: <?([A-Z][A-Za-z]+)", it["como_usar"]):
                if f"export const {comp}" not in fontes_remotion and comp not in ("Easing",):
                    erros.append(f"{it['id']}: componente Remotion inexistente '{comp}'")
    if erros:
        print("\n".join(erros)); raise SystemExit(1)
    print(f"OK — {len(c['itens'])} itens válidos.")


def cmd_md(a, silencioso: bool = False):
    c = carregar()
    tot = Counter(x["status"] for x in c["itens"])
    L = ["# Catálogo de efeitos e recursos — Estúdio Arthur", "",
         "> Gerado automaticamente a partir de `catalogo/catalogo.json` por `python3 scripts/catalogo.py md`. Não edite à mão.", "",
         f"Atualizado em {c.get('atualizado_em', '')} · **{len(c['itens'])} itens** · "
         f"✅ {tot['implementado']} implementados · 🔌 {tot['integracao']} por integração · 📋 {tot['catalogado']} catalogados", "",
         "| Ícone | Status | Significado |", "|---|---|---|"]
    for s in STATUS:
        L.append(f"| {ICONE[s]} | {s} | {c['status_legenda'][s]} |")
    L += ["", "Busca rápida: `python3 scripts/catalogo.py buscar <termo> [--status implementado]`", ""]
    for cid, meta in sorted(c["categorias"].items(), key=lambda kv: kv[1]["numero"]):
        its = [x for x in c["itens"] if x["categoria"] == cid]
        k = Counter(x["status"] for x in its)
        L += [f"## {meta['numero']}. {meta['nome']}", "",
              f"✅ {k['implementado']} · 🔌 {k['integracao']} · 📋 {k['catalogado']}", "",
              "| | Recurso | Descrição | Ferramentas | Como usar / observações |", "|---|---|---|---|---|"]
        for x in its:
            uso = x["como_usar"].replace("|", "\\|")
            extra = " ".join(filter(None, [x["parametros"], x["observacoes"]])).replace("|", "\\|")
            pend = " *(teste pendente)*" if x["status"] == "implementado" and not x["testado"] else ""
            celula = " — ".join(filter(None, [f"`{uso}`" if uso else "", extra]))
            L.append(f"| {ICONE[x['status']]} | **{x['nome']}**{pend} | {x['descricao']} | {', '.join(x['ferramentas'])} | {celula} |")
        L.append("")
    MD.write_text("\n".join(L), encoding="utf-8")
    if not silencioso:
        print(f"Gerado {MD.relative_to(RAIZ)}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    def filtros(s):
        s.add_argument("--categoria"); s.add_argument("--status", choices=STATUS); s.add_argument("--ferramenta")
    s = sp.add_parser("buscar"); s.add_argument("termo"); filtros(s); s.set_defaults(fn=cmd_buscar)
    s = sp.add_parser("listar"); filtros(s); s.set_defaults(fn=cmd_listar)
    s = sp.add_parser("ver"); s.add_argument("id"); s.set_defaults(fn=cmd_ver)
    s = sp.add_parser("stats"); s.set_defaults(fn=cmd_stats)
    s = sp.add_parser("status"); s.add_argument("id"); s.add_argument("novo", choices=STATUS)
    s.add_argument("--uso"); s.add_argument("--obs"); s.add_argument("--testado", action="store_true"); s.set_defaults(fn=cmd_status)
    s = sp.add_parser("adicionar"); s.add_argument("categoria"); s.add_argument("nome"); s.add_argument("--descricao", required=True)
    s.add_argument("--status", choices=STATUS, default="catalogado"); s.add_argument("--ferramentas"); s.add_argument("--uso")
    s.add_argument("--parametros"); s.add_argument("--compat"); s.add_argument("--obs"); s.add_argument("--testado", action="store_true")
    s.set_defaults(fn=cmd_adicionar)
    s = sp.add_parser("validar"); s.set_defaults(fn=cmd_validar)
    s = sp.add_parser("md"); s.set_defaults(fn=cmd_md)
    a = p.parse_args(); a.fn(a)


if __name__ == "__main__":
    main()

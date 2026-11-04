#!/usr/bin/env python3
"""Pesquisa, resumo e validação da biblioteca, sem dependências extras."""
import argparse
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAT = ROOT / "biblioteca" / "catalogo.json"
PRE = ROOT / "biblioteca" / "presets.json"
FIELDS = {"id", "nome", "categoria", "tipo", "motores", "status", "parametros"}

def read():
    return json.loads(CAT.read_text(encoding="utf-8")), json.loads(PRE.read_text(encoding="utf-8"))

def validate(items, presets):
    errors = []
    ids = [e.get("id") for e in items]
    if len(ids) != len(set(ids)):
        errors.append("IDs duplicados no catálogo.")
    if len(items) < 250:
        errors.append("Catálogo deve conter ao menos 250 recursos.")
    for i, item in enumerate(items):
        absent = FIELDS - set(item)
        if absent:
            errors.append(f"Item {i}: campos ausentes: {sorted(absent)}")
        if item.get("status") not in ("catalogado", "integracao_nativa", "exemplo_executavel"):
            errors.append(f"Item {i}: status inválido.")
    valid = set(ids)
    for p in presets:
        for eid in p.get("efeitos", []):
            if eid not in valid:
                errors.append(f"Preset {p.get('id')}: efeito inexistente {eid}.")
    return errors

def main():
    parser = argparse.ArgumentParser(description="Catálogo de edição audiovisual de Arthur")
    g = parser.add_mutually_exclusive_group()
    g.add_argument("--buscar", metavar="TEXTO")
    g.add_argument("--categoria", metavar="CATEGORIA")
    g.add_argument("--status", metavar="STATUS")
    g.add_argument("--resumo", action="store_true")
    g.add_argument("--validar", action="store_true")
    args = parser.parse_args()
    items, presets = read()
    if args.validar:
        errors = validate(items, presets)
        if errors:
            print("\n".join(errors), file=sys.stderr)
            return 1
        print(f"OK: {len(items)} recursos e {len(presets)} presets válidos.")
        return 0
    if args.resumo or not any((args.buscar, args.categoria, args.status)):
        print(f"Catálogo: {len(items)} recursos em {len(set(x['categoria'] for x in items))} categorias; {len(presets)} presets.")
        print("Por categoria:")
        for key, n in Counter(x["categoria"] for x in items).most_common():
            print(f"  {key}: {n}")
        print("Por estado:")
        for key, n in Counter(x["status"] for x in items).most_common():
            print(f"  {key}: {n}")
        return 0
    selected = items
    if args.buscar:
        q = args.buscar.casefold()
        selected = [x for x in selected if q in (x["nome"]+" "+x["categoria"]+" "+x["tipo"]+" "+" ".join(x["motores"])).casefold()]
    if args.categoria:
        selected = [x for x in selected if x["categoria"] == args.categoria]
    if args.status:
        selected = [x for x in selected if x["status"] == args.status]
    for x in selected:
        print(f"{x['id']} | {x['nome']} | {x['status']} | {','.join(x['motores'])}")
    print(f"Total: {len(selected)}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

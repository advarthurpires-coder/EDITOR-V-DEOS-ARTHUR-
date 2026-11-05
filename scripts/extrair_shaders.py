#!/usr/bin/env python3
"""Extrai (estaticamente, sem executar JS) o fragment shader de transição das fichas HyperFrames
(contrato u_from/u_to/u_progress/u_resolution/v_uv) e gera projetos/remotion-base/src/shaders/transicoes.ts.
Uso: python3 scripts/extrair_shaders.py <pasta-com-os-html> [nomes...]"""
import json, re, sys
from pathlib import Path

PADRAO = ["whip-pan", "glitch", "light-leak", "ridged-burn", "ripple-waves", "thermal-distortion",
          "cross-warp-morph", "domain-warp-dissolve", "chromatic-radial-split"]
RE_STR = re.compile(r'"((?:[^"\\]|\\.)*)"')


def literal(txt: str) -> str:
    return json.loads(f'"{txt}"')


def avaliar(expr: str, vars_: dict) -> str:
    """Avalia concatenação JS de literais "..." e identificadores conhecidos."""
    partes, i = [], 0
    for tok in re.finditer(r'"(?:[^"\\]|\\.)*"|[A-Za-z_$][\w$]*|\+|\s+|,', expr):
        t = tok.group(0)
        if t.startswith('"'):
            partes.append(literal(t[1:-1]))
        elif t in vars_:
            partes.append(vars_[t])
        elif t.strip() in ("+", ",", ""):
            continue
        else:
            raise ValueError(f"identificador desconhecido: {t}")
    return "".join(partes)


def argumento_ate_fechar(s: str, i: int) -> str:
    """Lê a partir de i até o ')' que fecha a chamada, ignorando parênteses dentro de literais "..."."""
    prof, j = 1, i
    while j < len(s):
        c = s[j]
        if c == '"':
            j += 1
            while s[j] != '"':
                j += 2 if s[j] == "\\" else 1
        elif c == "(":
            prof += 1
        elif c == ")":
            prof -= 1
            if prof == 0:
                return s[i:j]
        j += 1
    raise ValueError("parêntese não fechado")


def extrair(html: str) -> str:
    vars_ = {}
    for m in re.finditer(r'var\s+([A-Za-z_$][\w$]*)\s*=\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*|[A-Za-z_$][\w$]*\s*\+\s*)+);', html):
        try:
            vars_[m.group(1)] = avaliar(m.group(2), vars_)
        except ValueError:
            pass
    m = re.search(r'var\s+progTrans\s*=\s*mkProg\(', html)
    if not m:
        raise ValueError("progTrans não encontrado")
    corpo = argumento_ate_fechar(html, m.end()).strip().rstrip(",")
    src = avaliar(corpo, vars_)
    assert "u_from" in src and "u_to" in src and "u_progress" in src and "void main" in src
    return src


def main():
    pasta = Path(sys.argv[1])
    nomes = sys.argv[2:] or PADRAO
    saida = {}
    for n in nomes:
        saida[n] = extrair((pasta / f"{n}.html").read_text(encoding="utf-8"))
        print(f"ok {n}: {len(saida[n])} caracteres")
    destino = Path(__file__).resolve().parent.parent / "projetos" / "remotion-base" / "src" / "shaders" / "transicoes.ts"
    linhas = ["// Gerado por scripts/extrair_shaders.py a partir dos blocos do registro HyperFrames (OSS).",
              "// Contrato: uniform sampler2D u_from,u_to; uniform float u_progress; uniform vec2 u_resolution; varying vec2 v_uv.",
              "export const SHADERS_TRANSICAO = {"]
    for n, src in saida.items():
        linhas.append(f"  {json.dumps(n)}: {json.dumps(src)},")
    linhas += ["} as const;", "", "export type NomeShader = keyof typeof SHADERS_TRANSICAO;", ""]
    destino.write_text("\n".join(linhas), encoding="utf-8")
    print(f"Gerado {destino}")


if __name__ == "__main__":
    main()

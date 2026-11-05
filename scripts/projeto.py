#!/usr/bin/env python3
"""
Ferramentas de projeto do Estúdio Arthur (Remotion e HyperFrames): prévia ao vivo, linha do tempo, keyframes e histórico.

  python3 scripts/projeto.py previa iniciar projetos/remotion-base [--porta 3000]   # servidor em segundo plano
  python3 scripts/projeto.py previa status  projetos/remotion-base
  python3 scripts/projeto.py previa parar   projetos/remotion-base
  python3 scripts/projeto.py timeline  projetos/teste-hyperframes                    # trilhas e clipes (HyperFrames)
  python3 scripts/projeto.py timeline  projetos/remotion-base                        # composições, duração, tamanho (Remotion)
  python3 scripts/projeto.py keyframes projetos/teste-hyperframes [--seletor "#title"] [--imagem onion.png]
  python3 scripts/projeto.py historico projetos/teste-hyperframes [--limite 15]      # alterações do HyperFrames + commits Git
"""
from __future__ import annotations

import argparse
import json
import os
import signal
import socket
import subprocess
import sys
import time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ESTADO = RAIZ / "tools" / "previas.json"


def tipo_projeto(p: Path) -> str:
    if (p / "hyperframes.json").exists() or (p / "index.html").exists() and "data-composition-id" in (p / "index.html").read_text(errors="ignore"):
        return "hyperframes"
    if (p / "remotion.config.ts").exists() or (p / "node_modules" / "remotion").exists():
        return "remotion"
    raise SystemExit(f"Não reconheci {p} como projeto Remotion nem HyperFrames.")


def env_remotion() -> dict:
    env = dict(os.environ)
    hs = sorted(Path("/opt/pw-browsers").glob("chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell"))
    if hs and not env.get("REMOTION_BROWSER_EXECUTABLE"):
        env["REMOTION_BROWSER_EXECUTABLE"] = str(hs[-1])
    return env


def porta_ouvindo(porta: int) -> bool:
    with socket.socket() as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", porta)) == 0


def ler_estado() -> dict:
    try:
        return json.loads(ESTADO.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def gravar_estado(e: dict) -> None:
    ESTADO.parent.mkdir(parents=True, exist_ok=True)
    ESTADO.write_text(json.dumps(e, indent=1), encoding="utf-8")


def cmd_previa(a):
    proj = Path(a.projeto).resolve()
    tipo = tipo_projeto(proj)
    chave = str(proj)
    estado = ler_estado()
    if a.acao == "status":
        info = estado.get(chave)
        if info and porta_ouvindo(info["porta"]):
            print(f"Prévia {tipo} ativa: http://localhost:{info['porta']} (pid {info.get('pid')})")
        else:
            print("Nenhuma prévia ativa para este projeto.")
        return
    if a.acao == "parar":
        info = estado.pop(chave, None)
        if tipo == "hyperframes":
            subprocess.run(["hyperframes", "preview", str(proj), "--stop"], capture_output=True, text=True)
        if info and info.get("pid"):
            try:
                os.killpg(info["pid"], signal.SIGTERM)
            except (ProcessLookupError, PermissionError):
                pass
        gravar_estado(estado)
        print("Prévia encerrada.")
        return
    porta = a.porta or (3000 if tipo == "remotion" else 3002)
    if porta_ouvindo(porta):
        raise SystemExit(f"A porta {porta} já está em uso. Use --porta.")
    log = RAIZ / "tools" / f"previa-{proj.name}.log"
    log.parent.mkdir(parents=True, exist_ok=True)
    if tipo == "remotion":
        cmd = ["npx", "remotion", "studio", "src/index.ts", "--port", str(porta), "--no-open"]
        p = subprocess.Popen(cmd, cwd=proj, env=env_remotion(), stdout=open(log, "w"), stderr=subprocess.STDOUT, start_new_session=True)
        pid = p.pid
    else:
        r = subprocess.run(["hyperframes", "preview", str(proj), "--background", "--port", str(porta)], capture_output=True, text=True)
        log.write_text(r.stdout + r.stderr, encoding="utf-8")
        pid = None
    for _ in range(90):
        if porta_ouvindo(porta):
            break
        time.sleep(1)
    else:
        raise SystemExit(f"A prévia não respondeu na porta {porta}. Veja {log.relative_to(RAIZ)}")
    estado[chave] = {"tipo": tipo, "porta": porta, "pid": pid}
    gravar_estado(estado)
    print(f"Prévia {tipo} ativa em http://localhost:{porta}  (encerrar: python3 scripts/projeto.py previa parar {a.projeto})")


def cmd_timeline(a):
    proj = Path(a.projeto).resolve()
    if tipo_projeto(proj) == "hyperframes":
        r = subprocess.run(["hyperframes", "timeline", str(proj)] + (["--json"] if a.json else []), capture_output=True, text=True)
        print(r.stdout or r.stderr)
    else:
        r = subprocess.run(["npx", "remotion", "compositions", "src/index.ts", "--log=error"], cwd=proj, env=env_remotion(), capture_output=True, text=True)
        print(r.stdout or r.stderr)


def cmd_keyframes(a):
    alvo = Path(a.alvo).resolve()
    cmd = ["hyperframes", "keyframes", str(alvo)]
    if a.seletor:
        cmd += ["--selector", a.seletor]
    if a.imagem:
        cmd += ["--shot", str(Path(a.imagem).resolve())]
    if a.json:
        cmd += ["--json"]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=alvo if alvo.is_dir() else alvo.parent)
    print(r.stdout or r.stderr)
    if r.returncode != 0:
        raise SystemExit(r.returncode)


def cmd_historico(a):
    proj = Path(a.projeto).resolve()
    if tipo_projeto(proj) == "hyperframes":
        r = subprocess.run(["hyperframes", "history"], cwd=proj, capture_output=True, text=True)
        print("== Alterações registradas pelo HyperFrames ==")
        print((r.stdout or r.stderr).strip() or "(nenhuma)")
    r = subprocess.run(["git", "log", f"-{a.limite}", "--date=short", "--pretty=format:%h %ad %s", "--", str(proj)], cwd=RAIZ, capture_output=True, text=True)
    print("\n== Commits Git que tocaram o projeto ==")
    print(r.stdout.strip() or "(nenhum commit ainda)")
    print("\nDesfazer: git checkout <commit> -- <arquivo>  ·  HyperFrames: hyperframes history undo|restore <projeto>")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("previa"); s.add_argument("acao", choices=["iniciar", "status", "parar"]); s.add_argument("projeto"); s.add_argument("--porta", type=int)
    s.set_defaults(fn=cmd_previa)
    s = sp.add_parser("timeline"); s.add_argument("projeto"); s.add_argument("--json", action="store_true"); s.set_defaults(fn=cmd_timeline)
    s = sp.add_parser("keyframes"); s.add_argument("alvo"); s.add_argument("--seletor"); s.add_argument("--imagem"); s.add_argument("--json", action="store_true")
    s.set_defaults(fn=cmd_keyframes)
    s = sp.add_parser("historico"); s.add_argument("projeto"); s.add_argument("--limite", type=int, default=15); s.set_defaults(fn=cmd_historico)
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()

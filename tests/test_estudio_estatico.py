"""Testes rápidos (sem render) do kit: comandos registrados, shaders extraídos, motor de blocos."""
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class TestEstudio(unittest.TestCase):
    def test_comandos_estudio(self):
        r = subprocess.run([sys.executable, str(ROOT / "scripts" / "estudio.py"), "-h"], capture_output=True, text=True, check=True)
        for cmd in ("transicao-shader", "batidas", "montagem-ritmo", "crossfade-musica", "tom", "audio", "exportar", "sfx"):
            self.assertIn(cmd, r.stdout)

    def test_shaders_extraidos(self):
        ts = (ROOT / "projetos" / "remotion-base" / "src" / "shaders" / "transicoes.ts").read_text(encoding="utf-8")
        nomes = re.findall(r'^\s+"([a-z-]+)": "', ts, re.M)
        self.assertEqual(9, len(nomes))
        for n in nomes:
            self.assertIn(n, (ROOT / "scripts" / "estudio.py").read_text(encoding="utf-8"))
        self.assertEqual(9, ts.count("void main"))

    def test_blocos_sem_cdn(self):
        comp = ROOT / "projetos" / "hf-biblioteca" / "compositions"
        for p in comp.rglob("*.html"):
            s = p.read_text(encoding="utf-8", errors="ignore")
            self.assertNotRegex(s, r'(src|from)\s*=?\s*["\']https://cdn\.jsdelivr\.net/npm/', p.name)

    def test_projeto_comandos(self):
        r = subprocess.run([sys.executable, str(ROOT / "scripts" / "projeto.py"), "-h"], capture_output=True, text=True, check=True)
        for cmd in ("previa", "timeline", "keyframes", "historico"):
            self.assertIn(cmd, r.stdout)


if __name__ == "__main__":
    unittest.main()

"""Testes unitários offline de integridade da biblioteca."""
import subprocess
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from catalogo import read, validate, STATUS

ROOT = Path(__file__).resolve().parents[1]


class TestCatalogo(unittest.TestCase):
    def test_catalogo_e_presets(self):
        items, presets = read()
        self.assertEqual([], validate(items, presets))
        self.assertGreaterEqual(len(items), 250)
        self.assertGreaterEqual(len(presets), 10)

    def test_exemplos_remotion_possuem_arquivo(self):
        items, _ = read()
        examples = [x for x in items if x["status"] == "exemplo_executavel"]
        self.assertTrue(examples)
        for effect in examples:
            self.assertTrue((ROOT / effect["arquivo_exemplo"]).exists(), effect["id"])

    def test_implementados_tem_uso_e_arquivo(self):
        items, _ = read()
        impl = [x for x in items if x["status"] == "implementado"]
        self.assertTrue(impl)
        for x in impl:
            self.assertTrue(x.get("como_usar"), x["id"])
            self.assertTrue((ROOT / x["arquivo_exemplo"]).exists(), x["id"])
            self.assertIn("testado", x, x["id"])

    def test_estados_conhecidos(self):
        items, _ = read()
        self.assertTrue({x["status"] for x in items} <= set(STATUS))

    def test_busca_cli(self):
        r = subprocess.run([sys.executable, str(ROOT / "scripts" / "catalogo.py"), "--buscar", "karaoke", "--status", "implementado", "--compacto"],
                           capture_output=True, text=True, check=True)
        self.assertIn("legendas_tipografia.karaoke-captions", r.stdout)


if __name__ == "__main__":
    unittest.main()

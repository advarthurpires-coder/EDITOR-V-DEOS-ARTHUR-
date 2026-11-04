"""Testes unitários offline de integridade da biblioteca."""
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from catalogo import read, validate

class TestCatalogo(unittest.TestCase):
    def test_catalogo_e_presets(self):
        items, presets = read()
        self.assertEqual([], validate(items, presets))
        self.assertGreaterEqual(len(items), 250)
        self.assertGreaterEqual(len(presets), 10)
    def test_exemplos_remotion_possuem_arquivo(self):
        items, _ = read()
        root = Path(__file__).resolve().parents[1]
        examples = [x for x in items if x["status"] == "exemplo_executavel"]
        self.assertTrue(examples)
        for effect in examples:
            self.assertTrue((root / effect["arquivo_exemplo"]).exists(), effect["id"])

if __name__ == "__main__":
    unittest.main()

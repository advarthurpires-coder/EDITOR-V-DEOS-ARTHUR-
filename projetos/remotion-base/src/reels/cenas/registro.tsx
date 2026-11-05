/** Mapa categoria → demonstração do capítulo. */
import React from "react";
import {Cap01, Cap02, Cap03, Cap04, Cap05} from "./CapitulosA";
import {Cap06, Cap07, Cap08, Cap09, Cap10} from "./CapitulosB";
import {Cap11, Cap12, Cap13, Cap14} from "./CapitulosC";

export const CAPS: Record<string, React.FC> = {
  transicoes: Cap01,
  camera_3d: Cap02,
  motion_graphics: Cap03,
  legendas_tipografia: Cap04,
  vfx: Cap05,
  estilos: Cap06,
  interfaces_mockups: Cap07,
  montagem: Cap08,
  color_grading: Cap09,
  efeitos_sonoros: Cap10,
  audio: Cap11,
  automacao_ia: Cap12,
  templates: Cap13,
  infraestrutura: Cap14,
};

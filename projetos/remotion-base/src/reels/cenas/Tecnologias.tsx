/** 08–20 s — as cinco tecnologias em carrossel 3D (camera orbit) e o fluxo de produção. */
import React from "react";
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from "remotion";
import {C, F, SAFE, STATUS_COR} from "../tema";
import {Chip, EO, GoldLine, I, KineticWords, glass, useSpring} from "../fx";
import {usePulse} from "../comum";

type Tool = {nome: string; papel: string; itens: string[]; icone: React.ReactNode; estado?: [string, string]};

const Ico: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{width: 150, height: 150, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(145deg, ${C.azul2}, ${C.preto})`, border: `2px solid ${C.ouro}88`, boxShadow: `0 0 40px ${C.ouro}33`}}>
    {children}
  </div>
);
const svgP = {width: 96, height: 96, viewBox: "0 0 96 96", fill: "none", stroke: C.ouroClaro, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};

export const TOOLS: Tool[] = [
  {nome: "yt-dlp", papel: "Captura de mídia própria ou autorizada", itens: ["URL → arquivo", "áudio ou vídeo", "metadados"],
    icone: <svg {...svgP}><path d="M48 14v50M28 46l20 20 20-20M18 80h60" /></svg>, estado: ["INSTALADO E TESTADO", STATUS_COR.exemplo_executavel]},
  {nome: "Whisper", papel: "Transcrição em português e legendas", itens: ["SRT / VTT / JSON", "tempo por palavra", "whisper.cpp"],
    icone: <svg {...svgP}><rect x="34" y="12" width="28" height="46" rx="14" /><path d="M22 46c0 15 12 26 26 26s26-11 26-26M48 72v14" /></svg>, estado: ["MODELO PT-BR PENDENTE", STATUS_COR.integracao_nativa]},
  {nome: "Remotion", papel: "Vídeos em React com padrão fixo", itens: ["templates com dados", "séries visuais", "motion blur real"],
    icone: <svg {...svgP}><path d="M30 26L12 48l18 22M66 26l18 22-18 22M54 18L42 78" /></svg>, estado: ["INSTALADO E TESTADO", STATUS_COR.exemplo_executavel]},
  {nome: "HyperFrames", papel: "HTML + GSAP renderizado em vídeo", itens: ["tipografia cinética", "legendas animadas", "canal alfa"],
    icone: <svg {...svgP}><path d="M14 22h68v52H14zM14 36h68M30 54l10 8-10 8M48 70h16" /></svg>, estado: ["INSTALADO E TESTADO", STATUS_COR.exemplo_executavel]},
  {nome: "FFmpeg", papel: "Corte, cor, áudio e exportação", itens: ["color grading", "loudness −14 LUFS", "H.264 + AAC"],
    icone: <svg {...svgP}><path d="M10 48h10l8-24 12 50 10-40 8 26 6-12h22" /></svg>, estado: ["INSTALADO E TESTADO", STATUS_COR.exemplo_executavel]},
];

const Card: React.FC<{t: Tool; i: number; focus: number}> = ({t, i, focus}) => (
  <div style={{...glass(0.07), width: 660, height: 760, padding: 56, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26, opacity: 0.35 + 0.65 * focus}}>
    <div style={{display: "flex", alignItems: "center", gap: 30}}>
      <Ico>{t.icone}</Ico>
      <div>
        <div style={{fontFamily: F.mono, color: C.ouro, fontSize: 24, letterSpacing: 4}}>{String(i + 1).padStart(2, "0")} / 05</div>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 60, letterSpacing: -2, color: C.branco}}>{t.nome}</div>
      </div>
    </div>
    <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 40, lineHeight: 1.2, color: C.branco}}>{t.papel}</div>
    <div style={{display: "flex", flexDirection: "column", gap: 16, marginTop: 4}}>
      {t.itens.map((x) => (
        <div key={x} style={{fontFamily: F.corpo, fontSize: 34, color: C.cinza, display: "flex", gap: 16, alignItems: "center"}}>
          <span style={{width: 12, height: 12, borderRadius: 6, background: C.ouro}} />
          {x}
        </div>
      ))}
    </div>
    <div style={{marginTop: "auto"}}>{t.estado && <Chip label={t.estado[0]} color={t.estado[1]} size={22} />}</div>
  </div>
);

const Pipeline: React.FC = () => {
  const f = useCurrentFrame();
  const etapas = ["CAPTURA", "TRANSCRIÇÃO", "COMPOSIÇÃO", "ANIMAÇÃO", "EXPORTAÇÃO"];
  const flow = I(f, [8, 40], [0, 1], EO);
  return (
    <div style={{position: "absolute", left: SAFE.left, right: 1080 - SAFE.right, top: 640}}>
      <div style={{position: "absolute", left: 66, top: 40, width: 4, height: 640 * flow, background: `linear-gradient(${C.ouroClaro}, ${C.ouro})`, boxShadow: `0 0 20px ${C.ouro}`}} />
      {etapas.map((e, i) => {
        const s = useSpring(4 + i * 5, 14, 160);
        return (
          <div key={e} style={{display: "flex", alignItems: "center", gap: 34, height: 128, transform: `translateX(${(1 - s) * 300}px)`, opacity: s}}>
            <div style={{width: 136, height: 84, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <div style={{width: 40, height: 40, borderRadius: 20, background: C.preto, border: `4px solid ${C.ouroClaro}`, boxShadow: `0 0 ${flow * i >= i * 0.99 ? 24 : 0}px ${C.ouro}`}} />
            </div>
            <div>
              <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 52, color: C.branco, letterSpacing: -1}}>{e}</div>
              <div style={{fontFamily: F.mono, fontSize: 26, color: C.ouro, letterSpacing: 3}}>{TOOLS[i].nome}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Tecnologias: React.FC = () => {
  const f = useCurrentFrame();
  const p = usePulse();
  // câmera orbitando: cada ferramenta assume a frente a cada 60 frames (sincronizado com os whooshes)
  const idx = interpolate(f, [30, 50, 90, 110, 150, 170, 210, 230, 270, 290], [0, 0, 0, 1, 1, 2, 2, 3, 3, 4], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
  const ringIn = I(f, [14, 44], [0, 1], EO);
  const ringOut = I(f, [296, 312], [1, 0], Easing.in(Easing.cubic));
  const R = 540;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: SAFE.left, top: SAFE.top + 10, right: 1080 - SAFE.right}}>
        <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 8, color: C.ouro, opacity: I(f, [0, 10], [0, 1])}}>O MOTOR POR TRÁS</div>
        <KineticWords text={f < 300 ? "5 TECNOLOGIAS." : "UM SÓ FLUXO."} start={f < 300 ? 3 : 300} stagger={4} size={84} gold={["TECNOLOGIAS", "FLUXO"]} style={{marginTop: 10}} />
        <GoldLine progress={I(f, [8, 30], [0, 1], EO)} width={320} style={{marginTop: 16}} />
      </div>
      {ringOut > 0.001 && (
        <AbsoluteFill style={{perspective: 2200, perspectiveOrigin: "50% 45%"}}>
          <div style={{position: "absolute", left: 540, top: 1010, transformStyle: "preserve-3d", transform: `translateZ(${-R}px) rotateY(${-idx * 72}deg) scale(${ringIn * ringOut})`}}>
            {TOOLS.map((t, i) => {
              const ang = i * 72;
              const d = Math.abs(((idx * 72 - ang + 540) % 360) - 180);
              const focus = interpolate(d, [0, 72], [1, 0], {extrapolateRight: "clamp"});
              return (
                <div key={t.nome} style={{position: "absolute", left: -330, top: -380, transform: `rotateY(${ang}deg) translateZ(${R}px)`, backfaceVisibility: "hidden", filter: `drop-shadow(0 0 ${focus * (20 + p * 25)}px ${C.ouro}66)`}}>
                  <Card t={t} i={i} focus={focus} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
      <Sequence from={300} layout="none"><Pipeline /></Sequence>
    </AbsoluteFill>
  );
};

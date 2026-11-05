/** Capa vertical (1080×1920) do Reels. */
import React from "react";
import {AbsoluteFill} from "remotion";
import {C, F, GRAD_OURO} from "./tema";
import {GoldText, LightLeak, Particles, Vignette} from "./fx";
import {Backdrop} from "./comum";
import {Shot} from "./shots";
import {useFontes} from "./ReelsArthur";

export const Capa: React.FC = () => {
  useFontes();
  return (
    <AbsoluteFill style={{background: C.preto}}>
      <Backdrop />
      <div style={{position: "absolute", left: 140, top: 330, transform: "perspective(1600px) rotateY(-18deg) rotateX(6deg)", opacity: 0.9}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: "absolute", left: i * 170, top: i * 90, borderRadius: 26, overflow: "hidden", boxShadow: `0 0 0 2px ${C.ouro}88, 0 40px 80px #000c`}}>
            <Shot v={[4, 1, 5][i]} t={40} w={420} h={560} />
          </div>
        ))}
      </div>
      <LightLeak opacity={0.45} seed={2} />
      <Particles count={70} seed="capa" />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(4,6,10,0) 30%, rgba(4,6,10,.92) 62%)"}} />
      <div style={{position: "absolute", left: 80, right: 80, top: 1080, textAlign: "center"}}>
        <div style={{fontFamily: F.mono, fontSize: 28, letterSpacing: 12, color: C.ouro}}>APRESENTAÇÃO OFICIAL</div>
        <div style={{fontFamily: F.luxo, fontWeight: 700, fontSize: 150, letterSpacing: 14, marginTop: 14, filter: `drop-shadow(0 0 30px ${C.ouro}88)`}}><GoldText shine={60}>ARTHUR</GoldText></div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 20}}>
          <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 60, letterSpacing: 12, color: C.branco}}>VIDEO EDITOR</span>
          <span style={{fontFamily: F.display, fontWeight: 900, fontSize: 52, color: C.preto, background: GRAD_OURO, padding: "2px 20px", borderRadius: 14}}>AI</span>
        </div>
        <div style={{width: 520, height: 2, background: GRAD_OURO, margin: "40px auto"}} />
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 44, color: C.branco, lineHeight: 1.3}}>384 recursos · 14 categorias</div>
        <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 36, color: C.cinza, marginTop: 10}}>Uma biblioteca. Infinitas possibilidades.</div>
      </div>
      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};

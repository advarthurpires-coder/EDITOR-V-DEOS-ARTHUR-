/** 00–08 s — abertura explosiva: kinetic typography, zoom through e revelação da identidade. */
import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame} from "remotion";
import {C, F} from "../tema";
import {EO, EXPO_I, EXPO_O, Glitch, GoldText, I, KineticWords, LightLeak, Particles, useSpring} from "../fx";
import {usePulse} from "../comum";

const Streak: React.FC = () => {
  const f = useCurrentFrame();
  const w = I(f, [0, 8], [0, 1400], EXPO_O);
  return <div style={{position: "absolute", left: 540 - w / 2, top: 958, width: w, height: 4, background: `linear-gradient(90deg, transparent, ${C.ouroClaro}, #fff, ${C.ouroClaro}, transparent)`, boxShadow: `0 0 40px ${C.ouro}`, opacity: I(f, [6, 14], [1, 0])}} />;
};

const Frase1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", transform: `scale(${I(f, [0, 34], [1, 1.12])})`}}>
      <KineticWords text={"VOCÊ\nJÁ\nIMAGINOU"} mode="slam" start={0} stagger={9} size={150} align="center" gold={["IMAGINOU"]} lineHeight={1.0} />
    </AbsoluteFill>
  );
};

const Frase2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", transform: `scale(${I(f, [0, 32], [1.15, 1])})`}}>
      <KineticWords text="TER UM" start={0} stagger={3} size={70} align="center" weight={800} color={C.cinza} />
      <KineticWords text={"ESTÚDIO\nDE EDIÇÃO"} mode="slam" start={5} stagger={4} size={128} align="center" gold={["ESTÚDIO"]} style={{marginTop: 10}} />
    </AbsoluteFill>
  );
};

const Frase3: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(0, 9, 260);
  return (
    <Glitch amount={I(f, [0, 3, 8, 12], [1, 0.8, 0.5, 0])} seed="inteiro">
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 210, letterSpacing: -8, color: C.branco, transform: `scale(${2.2 - s * 1.2}) translateY(${I(f, [0, 30], [0, -10])}px)`, textShadow: `0 0 60px ${C.azulLuz}66`}}>
          INTEIRO
        </div>
      </AbsoluteFill>
    </Glitch>
  );
};

const Frase4: React.FC = () => {
  const f = useCurrentFrame();
  // zoom through: a câmera mergulha no ponto da interrogação (frames 48–63)
  const z = I(f, [46, 63], [1, 16], EXPO_I);
  const q = useSpring(22, 8, 180);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: "540px 1330px", filter: f > 52 ? `blur(${I(f, [52, 63], [0, 10])}px)` : undefined}}>
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", paddingBottom: 260}}>
        <KineticWords text="COM" start={0} size={64} align="center" weight={800} color={C.cinza} />
        <KineticWords text={"INTELIGÊNCIA\nARTIFICIAL"} start={4} stagger={6} size={112} align="center" gold={["ARTIFICIAL"]} style={{marginTop: 6}} />
      </AbsoluteFill>
      <div style={{position: "absolute", left: 0, right: 0, top: 1090, textAlign: "center", fontFamily: F.display, fontWeight: 900, fontSize: 300, lineHeight: 1, transform: `scale(${q})`, transformOrigin: "50% 80%"}}>
        <GoldText>?</GoldText>
      </div>
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const p = usePulse();
  const s = useSpring(0, 13, 90);
  const sub = useSpring(10, 16, 110);
  const shine = I(f, [8, 50], [200, -40], EO);
  const ring = I(f, [0, 30], [0, 1], EO);
  return (
    <AbsoluteFill>
      <LightLeak opacity={I(f, [0, 6, 40, 70], [0, 0.95, 0.55, 0.35])} seed={2} />
      <Particles burstAt={0} count={90} seed="logo" speed={1.4} />
      <Particles count={40} seed="dust" opacity={0.6} />
      <div style={{position: "absolute", left: 540 - 520 * ring, top: 930 - 520 * ring, width: 1040 * ring, height: 1040 * ring, borderRadius: "50%", border: `3px solid ${C.ouro}`, opacity: 1 - ring, boxShadow: `0 0 50px ${C.ouro}`}} />
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", transform: `scale(${I(f, [0, 75], [1.0, 1.06])})`}}>
        <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 14, color: C.ouro, opacity: sub, marginBottom: 26}}>APRESENTANDO</div>
        <div style={{fontFamily: F.luxo, fontWeight: 700, fontSize: 168, letterSpacing: I(f, [0, 40], [60, 14], EO), transform: `scale(${0.6 + s * 0.4})`, opacity: s, filter: `drop-shadow(0 0 ${24 + p * 30}px ${C.ouro}aa)`}}>
          <GoldText shine={shine}>ARTHUR</GoldText>
        </div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 64, letterSpacing: 16, color: C.branco, marginTop: 10, opacity: sub, transform: `translateY(${(1 - sub) * 40}px)`}}>
          VIDEO EDITOR
        </div>
        <div style={{marginTop: 34, padding: "12px 46px", borderRadius: 999, border: `2px solid ${C.ouro}`, fontFamily: F.display, fontWeight: 900, fontSize: 56, letterSpacing: 10, color: C.preto, background: `linear-gradient(100deg, ${C.ouroEscuro}, ${C.ouroClaro}, ${C.ouro})`, transform: `scale(${useSpring(18, 9, 200)})`, boxShadow: `0 0 ${30 + p * 40}px ${C.ouro}`}}>
          AI
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Abertura: React.FC = () => (
  <AbsoluteFill>
    <Particles count={50} seed="ab" opacity={0.5} />
    <Sequence durationInFrames={20}><Streak /></Sequence>
    <Sequence from={4} durationInFrames={34}><Frase1 /></Sequence>
    <Sequence from={38} durationInFrames={34}><Frase2 /></Sequence>
    <Sequence from={72} durationInFrames={30}><Frase3 /></Sequence>
    <Sequence from={102} durationInFrames={63}><Frase4 /></Sequence>
    <Sequence from={165} durationInFrames={75}><Logo /></Sequence>
  </AbsoluteFill>
);

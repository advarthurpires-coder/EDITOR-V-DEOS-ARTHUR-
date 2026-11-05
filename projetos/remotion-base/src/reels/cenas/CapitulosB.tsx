/** Capítulos 06–10: estilos, interfaces/mockups, montagem, color grading (FFmpeg real) e efeitos sonoros. */
import React from "react";
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import grades from "../data/grades.json";
import analise from "../data/audio-analise.json";
import {C, F} from "../tema";
import {Counter, EO, EXPO_I, EXPO_O, FilmGrain, Frame, Glitch, GoldText, I, LightLeak, MotionBlur, Particles, Seq, glass, remapTime, useSpring} from "../fx";
import {Shot} from "../shots";
import {EfeitoTag, STAGE, bandasSfx, sfxRmsAt, useAbsFrame} from "../comum";

const W = STAGE.width;
const tagRow = {left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"} as const;

// =================================================================== 06 ESTILOS
const Cinematico: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", inset: 0, transform: `scale(${I(f, [0, 60], [1.05, 1.15])})`}}><Shot v={1} t={f} w={820} h={700} /></div>
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "#000"}} />
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "#000"}} />
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
        <div style={{fontFamily: F.luxo, fontWeight: 700, fontSize: 64, letterSpacing: I(f, [0, 50], [30, 10]), color: C.ouroClaro, opacity: I(f, [4, 20], [0, 1]), textShadow: "0 6px 30px #000"}}>O INÍCIO</div>
      </AbsoluteFill>
      <FilmGrain opacity={0.14} />
    </AbsoluteFill>
  );
};
const Corporativo: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSpring(4, 18, 120);
  return (
    <AbsoluteFill style={{background: "linear-gradient(160deg, #f4f6fa, #dfe6f1)", padding: 56}}>
      <div style={{fontFamily: F.corpo, fontWeight: 800, fontSize: 52, color: "#0c2340", letterSpacing: -1, opacity: s, transform: `translateX(${(1 - s) * -60}px)`}}>Resultados claros.</div>
      <div style={{width: 120 * s, height: 6, background: "#1f5fbf", marginTop: 18}} />
      <div style={{display: "flex", gap: 24, marginTop: 50}}>
        {[["+38%", "Alcance"], ["2,4 mi", "Visualizações"], ["94%", "Retenção"]].map(([v, l], i) => {
          const k = useSpring(12 + i * 5, 16, 140);
          return (
            <div key={l} style={{flex: 1, background: "#fff", borderRadius: 18, padding: 26, boxShadow: "0 12px 30px rgba(12,35,64,.12)", transform: `translateY(${(1 - k) * 60}px)`, opacity: k}}>
              <div style={{fontFamily: F.corpo, fontWeight: 800, fontSize: 44, color: "#1f5fbf"}}>{v}</div>
              <div style={{fontFamily: F.corpo, fontSize: 24, color: "#5a6b85"}}>{l}</div>
            </div>
          );
        })}
      </div>
      <svg width={700} height={220} style={{marginTop: 40}}>
        <path d="M0 200 C120 180 180 120 300 130 S520 40 700 20" stroke="#1f5fbf" strokeWidth={6} fill="none" strokeDasharray={900} strokeDashoffset={900 * (1 - I(f, [10, 50], [0, 1], EO))} />
      </svg>
      <div style={{position: "absolute", right: 40, bottom: 30, fontFamily: F.corpo, fontSize: 22, color: "#5a6b85"}}>dados ilustrativos</div>
    </AbsoluteFill>
  );
};
const Emocional: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 40% 40%, #5a3a2a, #1a0f0c 75%)"}}>
      <div style={{position: "absolute", inset: 0, opacity: 0.55, filter: "blur(3px) saturate(1.2)", transform: `scale(${I(f, [0, 60], [1.1, 1.0])})`}}><Shot v={1} t={f * 0.4} w={820} h={700} /></div>
      <LightLeak opacity={0.55} seed={5} />
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", textAlign: "center"}}>
        <div style={{fontFamily: "'EB Garamond', 'Liberation Serif', serif", fontStyle: "italic", fontSize: 72, color: "#fff4e4", opacity: I(f, [6, 30], [0, 1]), filter: `blur(${I(f, [6, 30], [8, 0])}px)`, textShadow: "0 4px 30px #000a"}}>
          Histórias<br />que tocam.
        </div>
      </AbsoluteFill>
      <Particles count={26} seed="emo" area={[820, 700]} opacity={0.6} speed={0.4} />
    </AbsoluteFill>
  );
};
const Dinamico: React.FC = () => {
  const f = useCurrentFrame();
  const words = ["RÁPIDO", "FORTE", "DIRETO", "AGORA"];
  const i = Math.min(3, Math.floor(f / 15));
  const k = f % 15;
  const shake = (random(`sh${f}`) - 0.5) * 18 * I(k, [0, 6], [1, 0]);
  return (
    <AbsoluteFill style={{background: i % 2 ? C.ouro : "#05070c", transform: `translate(${shake}px, ${-shake}px)`}}>
      <div style={{position: "absolute", inset: 0, opacity: i % 2 ? 0.15 : 0.35}}><Shot v={[5, 3, 0, 4][i]} t={f} w={820} h={700} /></div>
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
        <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 124, letterSpacing: -5, color: i % 2 ? C.preto : C.branco, transform: `rotate(-6deg) scale(${I(k, [0, 5], [1.6, 1], EXPO_O)})`}}>{words[i]}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: "#fff", opacity: I(k, [0, 3], [0.3, 0])}} />
    </AbsoluteFill>
  );
};
export const Cap06: React.FC = () => {
  const f = useCurrentFrame();
  const seg = Math.min(3, Math.floor(f / 60));
  const k = f - seg * 60;
  const whipIn = seg > 0 && k < 7 ? I(k, [0, 7], [820, 0], EXPO_O) : 0;
  const whipOut = seg < 3 && k > 54 ? I(k, [54, 60], [0, -820], EXPO_I) : 0;
  const views = [<Cinematico key="c" />, <Corporativo key="o" />, <Emocional key="e" />, <Dinamico key="d" />];
  const nomes = ["CINEMATOGRÁFICO", "CORPORATIVO", "EMOCIONAL", "DINÂMICO"];
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: (W - 820) / 2, top: 10}}>
        <Frame w={820} h={700}>
          <MotionBlur active={whipIn !== 0 || whipOut !== 0} samples={7}>
            <WhipBox x={whipIn + whipOut} seg={seg}>{views[seg]}</WhipBox>
          </MotionBlur>
        </Frame>
      </div>
      {nomes.map((n, i) => (
        <EfeitoTag key={n} nome={`ESTILO ${n}`} at={i * 60 + 2} until={i * 60 + 58} style={tagRow} />
      ))}
    </AbsoluteFill>
  );
};
const WhipBox: React.FC<{x: number; seg: number; children: React.ReactNode}> = ({x, seg, children}) => (
  <AbsoluteFill style={{transform: `translateX(${x}px)`, background: "#000"}}>
    <Seq from={seg * 60}>{children}</Seq>
  </AbsoluteFill>
);

// =================================================================== 07 INTERFACES & MOCKUPS
const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const enter = useSpring(0, 15, 90);
  const ry = I(f, [0, 240], [-30, 16], Easing.inOut(Easing.sin));
  const likes = Math.round(interpolate(f, [135, 175], [1204, 1287], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const heart = useSpring(135, 8, 220);
  return (
    <div style={{perspective: 1400}}>
      <div style={{width: 390, height: 790, borderRadius: 64, background: "#0a0c12", border: "12px solid #2c313b", boxShadow: `0 50px 90px #000c, 0 0 0 2px ${C.ouro}66`, padding: 12, transform: `rotateY(${ry}deg) rotateX(6deg) translateY(${(1 - enter) * 500}px)`, transformStyle: "preserve-3d"}}>
        <div style={{position: "relative", width: "100%", height: "100%", borderRadius: 48, overflow: "hidden"}}>
          <Shot v={4} t={f} w={342} h={742} />
          <div style={{position: "absolute", top: 14, left: 121, width: 100, height: 26, borderRadius: 16, background: "#000"}} />
          <div style={{position: "absolute", top: 50, left: 20, fontFamily: F.corpo, fontWeight: 700, fontSize: 22, color: "#fff"}}>Reels</div>
          <div style={{position: "absolute", right: 14, bottom: 150, display: "flex", flexDirection: "column", gap: 26, alignItems: "center", color: "#fff", fontFamily: F.corpo, fontSize: 16}}>
            <div style={{transform: `scale(${1 + heart * 0.4 - Math.max(0, heart - 1) * 0.4})`, color: heart > 0.1 ? "#ff3b5c" : "#fff", fontSize: 40}}>♥</div>
            <div>{likes.toLocaleString("pt-BR")}</div>
            <div style={{fontSize: 34}}>💬</div>
            <div style={{fontSize: 34}}>➤</div>
          </div>
          <div style={{position: "absolute", left: 18, right: 70, bottom: 40, fontFamily: F.corpo, fontSize: 18, color: "#fff", lineHeight: 1.35}}>
            <b>@arthurvideoeditor</b><br />Uma biblioteca. Infinitas possibilidades.
          </div>
          <div style={{position: "absolute", left: 0, bottom: 0, height: 4, width: `${(f / 240) * 100}%`, background: C.ouro}} />
        </div>
      </div>
    </div>
  );
};
const Notif: React.FC<{at: number; title: string; body: string; icon: string}> = ({at, title, body, icon}) => {
  const s = useSpring(at, 13, 170);
  return (
    <div style={{...glass(0.1), borderRadius: 26, padding: "20px 24px", display: "flex", gap: 18, alignItems: "center", width: 420, transform: `translateX(${(1 - s) * 500}px) scale(${0.8 + s * 0.2})`, opacity: s}}>
      <div style={{width: 58, height: 58, borderRadius: 16, background: `linear-gradient(145deg, ${C.ouroClaro}, ${C.ouroEscuro})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30}}>{icon}</div>
      <div>
        <div style={{fontFamily: F.corpo, fontWeight: 700, fontSize: 24, color: C.branco}}>{title}</div>
        <div style={{fontFamily: F.corpo, fontSize: 21, color: C.cinza}}>{body}</div>
      </div>
    </div>
  );
};
const Browser: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{width: 560, height: 360, borderRadius: 18, background: "#0e1420", border: "1.5px solid #2c3546", overflow: "hidden", boxShadow: "0 30px 60px #000a", transform: `translateX(${I(f, [0, 240], [30, -40])}px)`}}>
      <div style={{height: 40, background: "#1a2130", display: "flex", alignItems: "center", gap: 8, padding: "0 14px"}}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />)}
        <div style={{marginLeft: 14, flex: 1, height: 22, borderRadius: 11, background: "#0e1420", fontFamily: F.mono, fontSize: 14, color: C.cinza, padding: "2px 12px"}}>biblioteca/catalogo.json</div>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: 14}}>
        {Array.from({length: 12}, (_, i) => <div key={i} style={{height: 80, borderRadius: 10, overflow: "hidden", opacity: I(f, [10 + i * 3, 20 + i * 3], [0, 1])}}><Shot v={i} t={f} w={124} h={80} /></div>)}
      </div>
    </div>
  );
};
export const Cap07: React.FC = () => {
  const f = useCurrentFrame();
  const flash = f >= 192 ? I(f, [192, 200], [0.8, 0]) : 0;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 330, top: 30, opacity: 0.85}}><Browser /></div>
      <div style={{position: "absolute", left: 10, top: 0}}><Phone /></div>
      <div style={{position: "absolute", left: 430, top: 420, display: "flex", flexDirection: "column", gap: 18}}>
        <Notif at={45} icon="👤" title="Novo seguidor" body="agora mesmo" />
        <Notif at={90} icon="💬" title="Comentário" body="“Que edição!”" />
        <Notif at={156} icon="✓" title="Exportação concluída" body="1080×1920 · H.264" />
      </div>
      <AbsoluteFill style={{background: "#fff", opacity: flash, borderRadius: 30}} />
      <EfeitoTag nome="PHONE MOCKUP 3D" at={6} until={110} style={{left: 450, top: 330}} />
      <EfeitoTag nome="NOTIFICATION POP · GLASS UI" at={112} until={240} style={{left: 450, top: 330}} />
    </AbsoluteFill>
  );
};

// =================================================================== 08 MONTAGEM & RITMO
const BeatCuts: React.FC = () => {
  const f = useCurrentFrame();
  const beat = Math.floor(f / 15);
  const k = f % 15;
  return (
    <AbsoluteFill>
      <Frame w={820} h={560}>
        <div style={{transform: `scale(${I(k, [0, 8], [1.12, 1], EO)})`}}><Shot v={beat} t={f} w={820} h={560} label /></div>
        <AbsoluteFill style={{background: "#fff", opacity: I(k, [0, 3], [0.28, 0])}} />
      </Frame>
      <div style={{display: "flex", gap: 14, justifyContent: "center", marginTop: 34}}>
        {Array.from({length: 8}, (_, i) => (
          <div key={i} style={{width: 64, height: 64, borderRadius: 14, border: `2px solid ${C.ouro}`, background: i === beat % 8 ? C.ouro : "transparent", boxShadow: i === beat % 8 ? `0 0 30px ${C.ouro}` : undefined, transform: `scale(${i === beat % 8 ? I(k, [0, 6], [1.25, 1]) : 1})`}} />
        ))}
      </div>
      <div style={{textAlign: "center", fontFamily: F.mono, color: C.cinza, fontSize: 24, marginTop: 20, letterSpacing: 3}}>120 BPM · CORTE A CADA BEAT (0,5 s)</div>
    </AbsoluteFill>
  );
};
const RAMP: [number, number][] = [[0, 1], [28, 1], [40, 0.18], [72, 0.18], [84, 3], [116, 3], [120, 1]];
const SpeedRamp: React.FC = () => {
  const f = useCurrentFrame();
  const t = remapTime(f, RAMP);
  const v = interpolate(f, RAMP.map((r) => r[0]), RAMP.map((r) => r[1]), {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const gx = (x: number) => 40 + (x / 120) * 740;
  const gy = (s: number) => 150 - (s / 3) * 120;
  const path = RAMP.map((r, i) => `${i ? "L" : "M"}${gx(r[0])} ${gy(r[1])}`).join(" ");
  const ox = 80 + ((t * 7) % 700);
  return (
    <AbsoluteFill>
      <Frame w={820} h={460}>
        <Shot v={2} t={t * 2} w={820} h={460} />
        {Array.from({length: 8}, (_, i) => (
          <div key={i} style={{position: "absolute", left: 80 + ((remapTime(Math.max(0, f - i * 2), RAMP) * 7) % 700) - 30, top: 200, width: 60, height: 60, borderRadius: 30, background: C.ouroClaro, opacity: 0.6 - i * 0.07, filter: `blur(${i * 1.5}px)`}} />
        ))}
        <div style={{position: "absolute", left: ox - 30, top: 200, width: 60, height: 60, borderRadius: 30, background: "#fff", boxShadow: `0 0 40px ${C.ouro}`}} />
        <div style={{position: "absolute", right: 26, top: 22, fontFamily: F.display, fontWeight: 900, fontSize: 72, color: C.branco, textShadow: "0 4px 20px #000"}}>
          <GoldText>{v.toFixed(2).replace(".", ",")}×</GoldText>
        </div>
      </Frame>
      <svg width={820} height={180} style={{marginTop: 24}}>
        <path d={path} stroke={C.ouro} strokeWidth={5} fill="none" />
        <line x1={gx(f)} y1={20} x2={gx(f)} y2={170} stroke={C.branco} strokeWidth={3} />
        <circle cx={gx(f)} cy={gy(v)} r={10} fill={C.ouroClaro} />
        <text x={40} y={176} fill={C.cinza} fontFamily="JetBrains Mono" fontSize={18}>CURVA DE VELOCIDADE (TIME REMAPPING)</text>
      </svg>
    </AbsoluteFill>
  );
};
const MiniTimeline: React.FC = () => {
  const f = useCurrentFrame();
  const clips = [[0, 180, C.azulLuz], [190, 160, C.ouro], [360, 220, "#7ee0c3"], [590, 200, "#c78bff"]] as const;
  return (
    <AbsoluteFill style={{justifyContent: "center"}}>
      <div style={{...glass(0.06), padding: 30, borderRadius: 26}}>
        {["V1", "A1"].map((tr, r) => (
          <div key={tr} style={{position: "relative", height: 90, marginBottom: 16, background: "rgba(255,255,255,.04)", borderRadius: 12}}>
            <div style={{position: "absolute", left: -2, top: 30, fontFamily: F.mono, fontSize: 20, color: C.cinza}}>{tr}</div>
            {clips.map(([x, w, c], i) => {
              const s = useSpring(i * 12 + r * 3, 14, 200);
              return <div key={i} style={{position: "absolute", left: 40 + x * 0.92, width: w * 0.92 - 6, top: 8, height: 74, borderRadius: 10, background: r ? `${c}55` : c, transform: `translateY(${(1 - s) * -160}px)`, opacity: s}} />;
            })}
          </div>
        ))}
        <div style={{position: "absolute", left: 30 + I(f, [0, 60], [40, 780]), top: 20, width: 3, height: 210, background: C.branco, boxShadow: `0 0 10px #fff`}} />
      </div>
    </AbsoluteFill>
  );
};
export const Cap08: React.FC = () => {
  const f = useCurrentFrame();
  const box = (n: React.ReactNode) => <div style={{position: "absolute", left: (W - 820) / 2, top: 10, width: 820, height: 720}}>{n}</div>;
  return (
    <AbsoluteFill>
      {f < 120 && box(<BeatCuts />)}
      {f >= 120 && f < 240 && <Seq from={120}>{box(<SpeedRamp />)}</Seq>}
      {f >= 240 && <Seq from={240}>{box(<MiniTimeline />)}</Seq>}
      <EfeitoTag nome="BEAT CUT · PUNCH-IN" at={4} until={118} style={tagRow} />
      <EfeitoTag nome="SPEED RAMP · TIME REMAPPING" at={122} until={238} style={tagRow} />
      <EfeitoTag nome="RHYTHM EDITING · TIMELINE" at={242} until={300} style={tagRow} />
    </AbsoluteFill>
  );
};

// =================================================================== 09 COLOR GRADING (FFmpeg real)
const G = [
  {k: "log", nome: "ANTES · LOG / SEM TRATAMENTO", preset: "log-flat"},
  {k: "cinematico", nome: "CINEMÁTICO", preset: "cinematico"},
  {k: "teal", nome: "TEAL & ORANGE", preset: "teal-laranja"},
  {k: "pb", nome: "P&B ALTO CONTRASTE", preset: "preto-e-branco"},
  {k: "vhs", nome: "VHS", preset: "vhs"},
] as const;
const Vid: React.FC<{k: string; w: number; h: number}> = ({k, w, h}) => (
  <OffthreadVideo src={staticFile(`reels/grade-${k}.mp4`)} muted style={{width: w, height: h, objectFit: "cover"}} />
);
export const Cap09: React.FC = () => {
  const f = useCurrentFrame();
  const mw = 600, mh = 734;
  const wipes = [45, 105, 165, 225];
  const cur = wipes.filter((t) => f >= t + 15).length;
  const wiping = wipes.findIndex((t) => f >= t && f < t + 15);
  const grid = f >= 246;
  const gs = useSpring(246, 16, 120);
  return (
    <AbsoluteFill>
      {!grid && (
        <div style={{position: "absolute", left: (W - mw) / 2, top: 0}}>
          <Frame w={mw} h={mh}>
            <Vid k={G[cur].k} w={mw} h={mh} />
            {wiping >= 0 && (
              <>
                <div style={{position: "absolute", inset: 0, clipPath: `inset(0 ${100 - I(f, [wipes[wiping], wipes[wiping] + 15], [0, 100], Easing.inOut(Easing.cubic))}% 0 0)`}}>
                  <Vid k={G[wiping + 1].k} w={mw} h={mh} />
                </div>
                <div style={{position: "absolute", top: 0, bottom: 0, left: (I(f, [wipes[wiping], wipes[wiping] + 15], [0, 100], Easing.inOut(Easing.cubic)) / 100) * mw - 3, width: 6, background: C.ouroClaro, boxShadow: `0 0 20px ${C.ouro}`}} />
              </>
            )}
            <div style={{position: "absolute", left: 20, top: 20}}>
              <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 34, color: C.branco, textShadow: "0 2px 12px #000"}}>{G[wiping >= 0 ? wiping + 1 : cur].nome}</div>
            </div>
          </Frame>
          <div style={{width: mw, marginTop: 12, fontFamily: F.mono, fontSize: 17, color: C.cinza, lineHeight: 1.4, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
            efeitos-ffmpeg.sh {G[wiping >= 0 ? wiping + 1 : cur].preset} · {(grades as Record<string, string>)[G[wiping >= 0 ? wiping + 1 : cur].k]}
          </div>
        </div>
      )}
      {grid && (
        <div style={{position: "absolute", left: (W - 820) / 2, top: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: 820, transform: `scale(${0.9 + gs * 0.1})`, opacity: gs}}>
          {G.slice(1).map((g) => (
            <div key={g.k} style={{position: "relative", width: 402, height: 340, borderRadius: 20, overflow: "hidden", boxShadow: `0 0 0 2px ${C.ouro}88`}}>
              <Vid k={g.k} w={402} h={340} />
              <div style={{position: "absolute", left: 14, bottom: 12, fontFamily: F.display, fontWeight: 800, fontSize: 24, color: "#fff", textShadow: "0 2px 10px #000"}}>{g.nome}</div>
            </div>
          ))}
        </div>
      )}
      <EfeitoTag nome="BEFORE / AFTER WIPE · PROCESSADO NO FFMPEG" at={6} until={244} style={{left: 0, right: 0, top: 790, display: "flex", justifyContent: "center"}} />
      <EfeitoTag nome="MESMO PLANO · QUATRO LOOKS" at={250} style={{left: 0, right: 0, top: 742, display: "flex", justifyContent: "center"}} />
    </AbsoluteFill>
  );
};

// =================================================================== 10 EFEITOS SONOROS (visualizador real)
const SFX_NOMES: Record<string, string> = {whoosh: "WHOOSH", impact: "IMPACTO", riser_s: "RISER", glitch: "GLITCH", pop: "POP", shimmer: "SHIMMER"};
export const Cap10: React.FC = () => {
  const f = useCurrentFrame();
  const abs = useAbsFrame();
  const fps = analise.fps;
  const bi = Math.max(0, Math.min(bandasSfx.valores.length - 1, abs - Math.round(bandasSfx.inicio * fps)));
  const bands = bandasSfx.valores[bi] as number[];
  const r = sfxRmsAt(abs);
  const cues = analise.cues.filter((c) => c.t >= bandasSfx.inicio && c.t < bandasSfx.fim && SFX_NOMES[c.sfx]);
  const now = abs / fps;
  const atual = [...cues].reverse().find((c) => now >= c.inicio);
  const kinds = new Set(analise.cues.map((c) => c.sfx)).size;
  const ring = 200 + r * 140;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: W / 2 - 300, top: 40, width: 600, height: 600, display: "flex", alignItems: "center", justifyContent: "center"}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: "absolute", width: ring * 2 + i * 70, height: ring * 2 + i * 70, borderRadius: "50%", border: `${3 - i}px solid ${i ? C.azulLuz : C.ouro}`, opacity: 0.9 - i * 0.3, boxShadow: i ? undefined : `0 0 ${30 + r * 60}px ${C.ouro}`}} />
        ))}
        <div style={{textAlign: "center"}}>
          <div style={{fontFamily: F.display, fontWeight: 900, fontSize: 76, letterSpacing: -2, color: C.branco, transform: `scale(${1 + r * 0.2})`}}>{atual ? SFX_NOMES[atual.sfx] : "SFX"}</div>
          <div style={{fontFamily: F.mono, fontSize: 22, color: C.ouroClaro, letterSpacing: 3}}>{atual ? `t = ${atual.t.toFixed(2).replace(".", ",")} s` : "PRONTO"}</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 10, top: 610, width: W - 20, height: 120, display: "flex", alignItems: "flex-end", gap: 6}}>
        {bands.map((b, i) => (
          <div key={i} style={{flex: 1, height: 8 + b * 112, borderRadius: 6, background: `linear-gradient(0deg, ${C.ouroEscuro}, ${i % 3 ? C.ouro : C.ouroClaro})`, boxShadow: `0 0 ${b * 20}px ${C.ouro}`}} />
        ))}
      </div>
      <div style={{position: "absolute", left: 10, top: 0, fontFamily: F.mono, fontSize: 21, color: C.cinza, lineHeight: 1.5}}>
        ESPECTRO REAL DO CANAL DE SFX<br /><span style={{color: C.verde}}>{kinds} TIPOS SINTETIZADOS · {analise.cues.length} DISPAROS</span>
      </div>
      <EfeitoTag nome="SOUND DESIGN SINCRONIZADO AO CORTE" at={8} style={{left: 0, right: 0, top: 758, display: "flex", justifyContent: "center"}} />
    </AbsoluteFill>
  );
};
void Counter;
void Glitch;
void Particles;

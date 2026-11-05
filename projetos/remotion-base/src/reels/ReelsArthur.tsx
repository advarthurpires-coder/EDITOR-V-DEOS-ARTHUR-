/**
 * ARTHUR VIDEO EDITOR AI — Reels oficial (1080×1920, 30 fps, 168 s).
 * Tempos: src/reels/data/roteiro.json (fonte única usada também pela trilha sintetizada).
 */
import React, {useEffect, useState} from "react";
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from "remotion";
import {Backdrop, BLOCOS, BlocoShell, CapituloFrame, CutFX, StartCtx} from "./comum";
import {FilmGrain, Vignette} from "./fx";
import {Abertura} from "./cenas/Abertura";
import {Tecnologias} from "./cenas/Tecnologias";
import {Encerramento, MontagemFinal} from "./cenas/Final";
import {CAPS} from "./cenas/registro";

/** Garante as fontes carregadas antes de capturar qualquer frame. */
export const useFontes = () => {
  const [handle] = useState(() => delayRender("fontes"));
  useEffect(() => {
    Promise.all(
      ["900 80px Montserrat", "800 80px Montserrat", "600 80px Montserrat", "700 80px Cinzel", "400 40px Inter", "700 40px 'JetBrains Mono'"].map((x) => document.fonts.load(x)),
    )
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

const Bloco: React.FC<{id: string}> = ({id}) => {
  if (id === "abertura") return <Abertura />;
  if (id === "tecnologias") return <Tecnologias />;
  if (id === "montagem-final") return <MontagemFinal />;
  if (id === "encerramento") return <Encerramento />;
  const b = BLOCOS.find((x) => x.id === id)!;
  const Demo = CAPS[id];
  return (
    <CapituloFrame b={b}>
      <Demo />
    </CapituloFrame>
  );
};

export const ReelsArthur: React.FC<{comAudio?: boolean}> = ({comAudio = true}) => {
  useFontes();
  return (
    <AbsoluteFill style={{background: "#04060a"}}>
      <Backdrop />
      {BLOCOS.map((b) => (
        <Sequence key={b.id} from={b.from} durationInFrames={b.dur} name={b.id}>
          <StartCtx.Provider value={b.from}>
            <BlocoShell b={b}>
              <Bloco id={b.id} />
            </BlocoShell>
          </StartCtx.Provider>
        </Sequence>
      ))}
      <CutFX />
      <Vignette strength={0.55} />
      <FilmGrain opacity={0.06} />
      {comAudio && <Audio src={staticFile("reels/mix-14lufs.wav")} />}
    </AbsoluteFill>
  );
};

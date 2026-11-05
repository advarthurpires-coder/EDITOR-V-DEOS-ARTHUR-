import React, { useCallback, useEffect, useRef } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SHADERS_TRANSICAO, NomeShader } from "../shaders/transicoes";

/**
 * Transição GLSL entre dois clipes reais (A → B), usando os shaders extraídos dos blocos HyperFrames
 * (whip-pan, glitch, light-leak, ridged-burn, ripple-waves, thermal-distortion, cross-warp-morph,
 * domain-warp-dissolve, chromatic-radial-split). Contrato GLSL: u_from, u_to, u_progress, u_resolution, v_uv.
 *
 * Linha do tempo: A toca de 0 até o fim; a transição ocupa os últimos `transicaoFrames` de A,
 * já com B começando por baixo; depois B segue sozinho. Áudio faz crossfade no mesmo intervalo.
 */
export type PropsTransicaoShader = {
  largura: number;
  altura: number;
  fps: number;
  videoA: string; // arquivo em public/ ou URL
  videoB: string;
  shader: NomeShader;
  duracaoA: number; // segundos
  duracaoB: number;
  transicao: number; // segundos
};

const VERT = "attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0,1);}";

const src = (s: string) => (s.startsWith("http") ? s : staticFile(s));

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

type GLState = { canvas: HTMLCanvasElement; gl: WebGLRenderingContext; prog: WebGLProgram; tex: [WebGLTexture, WebGLTexture] };

function criarGL(canvas: HTMLCanvasElement, frag: string): GLState {
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, premultipliedAlpha: false });
  if (!gl) throw new Error("WebGL indisponível");
  const compilar = (tipo: number, codigo: string) => {
    const sh = gl.createShader(tipo)!;
    gl.shaderSource(sh, codigo);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || "erro de shader");
    return sh;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "erro de link");
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  // Inverte Y no upload: nas fichas do registro a cena é cor sólida e a inversão não aparece; em vídeo real, aparece.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const novaTex = () => {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  };
  return { canvas, gl, prog, tex: [novaTex(), novaTex()] };
}

/** Desenha a fonte em "cover" num canvas 2D do tamanho final (texturas com a mesma proporção da saída). */
function cobrir(fonte: CanvasImageSource, w: number, h: number, alvo: HTMLCanvasElement) {
  alvo.width = w;
  alvo.height = h;
  const ctx = alvo.getContext("2d")!;
  const fw = (fonte as HTMLVideoElement).videoWidth || (fonte as HTMLImageElement).naturalWidth || (fonte as ImageBitmap).width;
  const fh = (fonte as HTMLVideoElement).videoHeight || (fonte as HTMLImageElement).naturalHeight || (fonte as ImageBitmap).height;
  const esc = Math.max(w / fw, h / fh);
  const dw = fw * esc, dh = fh * esc;
  ctx.drawImage(fonte, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

export const TransicaoShader: React.FC<PropsTransicaoShader> = ({ videoA, videoB, shader, duracaoA, transicao }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const fimA = Math.round(duracaoA * fps);
  const T = Math.max(1, Math.round(transicao * fps));
  const inicioB = fimA - T;
  const emTransicao = frame >= inicioB && frame < fimA;
  const progresso = easeInOut(interpolate(frame, [inicioB, fimA - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<GLState | null>(null);
  const quadros = useRef<{ a: HTMLCanvasElement | null; b: HTMLCanvasElement | null }>({ a: null, b: null });

  const desenhar = useCallback(() => {
    const c = canvasRef.current;
    const { a, b } = quadros.current;
    if (!c || !a || !b) return;
    if (!glRef.current || glRef.current.canvas !== c) glRef.current = criarGL(c, SHADERS_TRANSICAO[shader]);
    const { gl, prog, tex } = glRef.current;
    gl.viewport(0, 0, width, height);
    gl.useProgram(prog);
    [a, b].forEach((img, i) => {
      gl.activeTexture(i === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex[i]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    });
    gl.uniform1i(gl.getUniformLocation(prog, "u_from"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "u_to"), 1);
    gl.uniform1f(gl.getUniformLocation(prog, "u_progress"), progresso);
    gl.uniform2f(gl.getUniformLocation(prog, "u_resolution"), width, height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [shader, width, height, progresso]);

  const receber = (qual: "a" | "b") => (img: CanvasImageSource) => {
    const alvo = quadros.current[qual] ?? document.createElement("canvas");
    cobrir(img, width, height, alvo);
    quadros.current[qual] = alvo;
    desenhar();
  };

  useEffect(() => {
    if (emTransicao) desenhar();
  }, [emTransicao, desenhar]);

  // volume: crossfade de áudio no intervalo da transição
  const volA = (f: number) => interpolate(f, [inicioB, fimA], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const volB = (f: number) => interpolate(f, [0, T], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={fimA}>
        <OffthreadVideo src={src(videoA)} volume={volA} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: emTransicao ? 0 : 1 }}
          onVideoFrame={emTransicao ? receber("a") : undefined} />
      </Sequence>
      <Sequence from={inicioB}>
        <OffthreadVideo src={src(videoB)} volume={volB} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: emTransicao ? 0 : 1 }}
          onVideoFrame={emTransicao ? receber("b") : undefined} />
      </Sequence>
      {emTransicao ? <canvas ref={canvasRef} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} /> : null}
    </AbsoluteFill>
  );
};

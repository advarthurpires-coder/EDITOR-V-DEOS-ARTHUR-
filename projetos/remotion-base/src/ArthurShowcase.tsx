import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

type MotionProps = {children: React.ReactNode; color?: string};

const BG: React.FC<MotionProps> = ({children, color = "#08111e"}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 80% 15%, #153655 0%, ${color} 58%, #070a10 100%)`, color:"#f7f4ed", fontFamily:"Arial, Helvetica, sans-serif", overflow:"hidden"}}>
    {children}
  </AbsoluteFill>
);
const pill: React.CSSProperties={display:"inline-block",border:"1px solid #bfa46b",borderRadius:50,padding:"15px 26px",color:"#e9cc8f",fontSize:28,letterSpacing:3};
const caption: React.CSSProperties={fontWeight:800,fontSize:94,lineHeight:1.08,letterSpacing:-3};
const glass:React.CSSProperties={border:"1px solid rgba(255,255,255,.25)",background:"rgba(255,255,255,.085)",boxShadow:"0 20px 80px #0008",borderRadius:40};

const Header:React.FC<{label:string}> = ({label}) => (
 <div style={{position:"absolute",left:72,top:115,...pill}}>{label}</div>
);
const Intro:React.FC = () => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const t=spring({frame:f,fps,config:{damping:16,stiffness:90}});
 const opacity=interpolate(f,[0,12,67,79],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const z=interpolate(f,[0,80],[1,1.12],{extrapolateRight:"clamp"});
 return <BG><AbsoluteFill style={{justifyContent:"center",padding:72,opacity,transform:`scale(${z})`}}>
   <Header label="01 / KINETIC HOOK"/>
   <div style={{...caption,transform:`translateY(${(1-t)*190}px)`,opacity:t}}>
     EDITE.<br/><span style={{color:"#e9c78a"}}>IMPACTE.</span><br/>EMOCIONE.
   </div><div style={{fontSize:38,marginTop:65,opacity:interpolate(f,[20,40],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})}}>Motion, ritmo e narrativa em uma só ferramenta.</div>
 </AbsoluteFill></BG>;
};
const Charts:React.FC = () => {
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const items=[{n:82,l:"Cortes",d:0},{n:96,l:"Legendas",d:9},{n:74,l:"Motions",d:18}];
 return <BG color="#0c1830"><Header label="02 / CHART GROW"/><AbsoluteFill style={{justifyContent:"center",padding:75}}>
 <div style={{fontSize:40,color:"#e9c78a",marginBottom:30}}>DATA COUNTER + PROGRESS BAR</div>
 <div style={{...caption,fontSize:70,marginBottom:65}}>Mais criatividade.<br/>Mais precisão.</div>
 {items.map(x=>{const p=spring({frame:f-x.d,fps,config:{damping:22,stiffness:80}});const safe=Math.max(0,Math.min(1,p));
 return <div key={x.l} style={{marginBottom:58}}>
   <div style={{display:"flex",justifyContent:"space-between",fontSize:38,marginBottom:15}}><span>{x.l}</span><span style={{color:"#e9c78a"}}>{Math.round(x.n*safe)}%</span></div>
   <div style={{height:26,background:"#ffffff24",borderRadius:20,overflow:"hidden"}}><div style={{width:`${x.n*safe}%`,height:"100%",borderRadius:20,background:"linear-gradient(90deg,#b48f49,#f3dc9b)"}}/></div>
 </div>})}
 </AbsoluteFill></BG>;
};
const Phone:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const k=spring({frame:f,fps,config:{damping:15}});
 const bounce=spring({frame:f-28,fps,config:{damping:11}});
 return <BG color="#10131e"><Header label="03 / PHONE MOCKUP"/><AbsoluteFill style={{justifyContent:"center",alignItems:"center"}}>
 <div style={{transform:`translateY(${(1-k)*250}px) rotate(${(1-k)*-9}deg)`,width:530,height:970,background:"#0a0c12",border:"16px solid #343943",borderRadius:80,boxShadow:"0 35px 90px #000a",padding:18}}>
   <div style={{height:"100%",borderRadius:56,background:"linear-gradient(160deg,#254e68,#0d1828 70%)",display:"flex",justifyContent:"center",alignItems:"center",position:"relative",overflow:"hidden"}}>
     <div style={{position:"absolute",top:20,width:148,height:28,background:"#05060a",borderRadius:30}}/>
     <div style={{textAlign:"center",fontSize:58,fontWeight:900}}>LEGENDA<br/><span style={{color:"#f5d393"}}>GIGANTE</span></div>
     <div style={{position:"absolute",bottom:110,left:28,right:28,textAlign:"center",borderRadius:20,background:"#0009",fontSize:34,padding:22}}>Vídeos que <span style={{color:"#f5d393"}}>prendem</span> a atenção.</div>
   </div>
 </div>
 <div style={{position:"absolute",bottom:265,right:45,background:"#d1ad67",color:"#182033",fontSize:35,fontWeight:800,padding:"35px 44px",borderRadius:24,transform:`scale(${Math.max(0,bounce)})`}}>POP-UP!</div>
 </AbsoluteFill></BG>;
};
const Outro:React.FC=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const p=spring({frame:f,fps,config:{damping:18,stiffness:70}});
 const glow=18+Math.sin(f/7)*9;
 return <BG color="#151827"><Header label="04 / TITLE CARD"/><AbsoluteFill style={{justifyContent:"center",alignItems:"center",padding:65}}>
 <div style={{...glass,width:"100%",padding:"130px 55px",textAlign:"center",transform:`scale(${0.82+p*.18})`,opacity:p}}>
   <div style={{fontSize:33,letterSpacing:5,color:"#ebd5a6"}}>ARTHUR VIDEO EDITOR AI</div>
   <div style={{fontSize:86,fontWeight:900,letterSpacing:-3,marginTop:55,marginBottom:55,textShadow:`0 0 ${glow}px #d7b36caa`}}>CRIE O<br/><span style={{color:"#e5c17a"}}>EXTRAORDINÁRIO.</span></div>
   <div style={{fontSize:32,opacity:.85}}>Claude + Remotion + HyperFrames + FFmpeg</div>
 </div></AbsoluteFill></BG>;
};
export const ArthurShowcase:React.FC=()=>(
 <AbsoluteFill>
   <Sequence from={0} durationInFrames={80}><Intro/></Sequence>
   <Sequence from={80} durationInFrames={80}><Charts/></Sequence>
   <Sequence from={160} durationInFrames={80}><Phone/></Sequence>
   <Sequence from={240} durationInFrames={80}><Outro/></Sequence>
 </AbsoluteFill>
);

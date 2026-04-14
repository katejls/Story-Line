import { useState, useRef, useEffect } from “react”;

const SCENARIOS = [
{ id: “billionaire”, emoji: “💎”, label: “Billionaire Romance”, desc: “The CEO who can’t stop thinking about you”, color: “#c9a84c”, bg: “linear-gradient(135deg, #1a1508, #0a0a0f)” },
{ id: “revenge”, emoji: “🗡️”, label: “Revenge”, desc: “They destroyed your life. You came back stronger.”, color: “#c0392b”, bg: “linear-gradient(135deg, #150808, #0a0a0f)” },
{ id: “reborn”, emoji: “🔄”, label: “Reborn”, desc: “You died. You woke up 10 years in the past.”, color: “#2e86de”, bg: “linear-gradient(135deg, #080d15, #0a0a0f)” },
{ id: “mafia”, emoji: “🖤”, label: “Mafia Love”, desc: “Dangerous. Possessive. Completely obsessed with you.”, color: “#6c5ce7”, bg: “linear-gradient(135deg, #0d0a15, #0a0a0f)” },
{ id: “werewolf”, emoji: “🐺”, label: “Fated Mate”, desc: “The Alpha who’s been searching for you his whole life”, color: “#e17055”, bg: “linear-gradient(135deg, #150d08, #0a0a0f)” },
{ id: “enemies”, emoji: “🔥”, label: “Enemies to Lovers”, desc: “You hate each other. Until you don’t.”, color: “#fd79a8”, bg: “linear-gradient(135deg, #150a10, #0a0a0f)” },
{ id: “royal”, emoji: “👑”, label: “Royal Affair”, desc: “A forbidden love with the crown prince”, color: “#ffeaa7”, bg: “linear-gradient(135deg, #15140a, #0a0a0f)” },
{ id: “thriller”, emoji: “🔪”, label: “Dark Thriller”, desc: “Trust no one. Especially the one you love.”, color: “#636e72”, bg: “linear-gradient(135deg, #0d0d0d, #0a0a0f)” },
];

const NAMES = [“Kael”,“Damon”,“Lucian”,“Ren”,“Atlas”,“Cassian”,“Ezra”,“Zane”,“Orion”,“Silas”,“Aria”,“Luna”,“Seraphina”,“Ivy”,“Nova”,“Celeste”,“Elara”,“Freya”,“Scarlett”,“Violet”];
const rName = () => NAMES[Math.floor(Math.random() * NAMES.length)];

const HINTS = { revenge:“cunning plans, betrayal reveals, power shifts”, reborn:“memories from past life, using future knowledge”, mafia:“danger, possessiveness, forbidden attraction”, billionaire:“power dynamics, luxury settings, intense attraction”, werewolf:“the mate bond, pack dynamics, primal instincts”, enemies:“banter, tension, forced proximity”, royal:“duty vs desire, elegance, forbidden love”, thriller:“suspense, paranoia, dangerous attraction” };
const TITLES = { mafia:“THE DON”, billionaire:“CEO”, werewolf:“ALPHA”, royal:“CROWN PRINCE”, revenge:“YOUR ALLY”, reborn:“PAST LIFE”, enemies:“YOUR RIVAL”, thriller:“SUSPECT” };
const LMSGS = [“Writing your fate…”,“The plot thickens…”,“Crafting the tension…”,“Building your world…”,“Adding the cliffhanger…”];

const FONT = “‘Cormorant Garamond’,‘Georgia’,serif”;
const MONO = “‘DM Mono’,‘Courier New’,monospace”;

export default function App() {
const [screen, setScreen] = useState(“splash”);
const [scenario, setScenario] = useState(null);
const [pName, setPName] = useState(””);
const [lName, setLName] = useState(””);
const [nMode, setNMode] = useState(null);
const [lMode, setLMode] = useState(null);

const [chapters, setChapters] = useState([]);
const [curText, setCurText] = useState(””);
const [shown, setShown] = useState(””);
const [chNum, setChNum] = useState(0);
const [hist, setHist] = useState([]);
const [busy, setBusy] = useState(false);
const [lmsg, setLmsg] = useState(LMSGS[0]);

const [cMsgs, setCMsgs] = useState([]);
const [cIn, setCIn] = useState(””);
const [cBusy, setCBusy] = useState(false);
const [cHist, setCHist] = useState([]);
const [err, setErr] = useState(””);

const sRef = useRef(null);
const cRef = useRef(null);
const twRef = useRef(null);
// We store scenario/names in refs too so async functions always read latest
const stateRef = useRef({ scenario: null, pName: “”, lName: “”, chNum: 0, curText: “”, hist: [] });

// Keep ref in sync
useEffect(() => { stateRef.current = { scenario, pName, lName, chNum, curText, hist }; });

const sel = SCENARIOS.find(s => s.id === scenario);
const accent = sel?.color || “#c9a84c”;

// Typewriter
useEffect(() => {
if (!curText) return;
let i = 0; setShown(””);
if (twRef.current) clearInterval(twRef.current);
twRef.current = setInterval(() => { i++; setShown(curText.slice(0,i)); if(i>=curText.length) clearInterval(twRef.current); }, 10);
return () => { if(twRef.current) clearInterval(twRef.current); };
}, [curText]);

useEffect(() => { if(sRef.current) sRef.current.scrollTop = sRef.current.scrollHeight; }, [shown]);
useEffect(() => { if(cRef.current) cRef.current.scrollTop = cRef.current.scrollHeight; }, [cMsgs, cBusy]);

// Loading msg rotation
useEffect(() => {
if(!busy) return;
setLmsg(LMSGS[Math.floor(Math.random()*LMSGS.length)]);
const iv = setInterval(() => setLmsg(LMSGS[Math.floor(Math.random()*LMSGS.length)]), 2500);
return () => clearInterval(iv);
}, [busy]);

// ─── GENERATE ───
async function gen(isNew, scId, p, l, prevHist, prevChNum, prevCurText) {
setBusy(true); setErr(””);
const num = isNew ? 1 : prevChNum + 1;
const sc = SCENARIOS.find(s => s.id === scId);
const sys = `You are a bestselling novelist writing a personalized ${sc.label} novel.
RULES:

- Reader is “${p}” — second person (“you”)
- Key character is “${l}”
- Write Chapter ${num} — 500-700 words
- Start with “**Chapter ${num}: [Title]**”
- Vivid detail, sharp dialogue, emotional depth
- End with a devastating cliffhanger
- Make ${l} magnetic and unforgettable
- Include ${HINTS[scId]||“tension and depth”}
- Write like a real published novel
- Be BOLD and surprising`;
  
  const uMsg = isNew
  ? `Write Chapter 1. Drop me into a pivotal moment. Make me feel ${l}'s presence immediately.`
  : `Write Chapter ${num}. Raise the stakes. Deepen the connection with ${l}. End with something devastating.`;
  const msgs = isNew ? [{role:“user”,content:uMsg}] : […prevHist, {role:“user”,content:uMsg}];
  
  try {
  const res = await fetch(“https://api.anthropic.com/v1/messages”, {
  method:“POST”, headers:{“Content-Type”:“application/json”},
  body: JSON.stringify({model:“claude-sonnet-4-20250514”,max_tokens:1200,system:sys,messages:msgs}),
  });
  const d = await res.json();
  const txt = d.content?.map(c=>c.text||””).join(”\n”)||””;
  if(!txt){setErr(“Something went wrong. Try again!”);setBusy(false);return;}
  
  ```
  const nh = [...msgs,{role:"assistant",content:txt}];
  setHist(nh);
  if(isNew){setChapters([]);setChNum(1);}
  else{setChapters(prev=>[...prev,{text:prevCurText,num:prevChNum}]);setChNum(num);}
  setCurText(txt);
  setScreen("story");
  setCMsgs([]);
  setCHist([
    {role:"user",content:"You are " + l + " from a " + sc.label + " story. Chapter " + num + " just happened. Stay in character. Use the name " + p + ". 1-3 sentences. Emotionally engaging. Never break character or mention AI."},
    {role:"assistant",content:"I understand."}
    ]);
  ```
  
  } catch(e) { setErr(“Network error.”); }
  setBusy(false);
  }
  
  function quickStart(scId) {
  const a = rName(); let b = rName(); while(b===a) b=rName();
  setScenario(scId); setPName(a); setLName(b);
  gen(true, scId, a, b, [], 0, “”);
  }
  
  function customStart() {
  gen(true, scenario, pName, lName, [], 0, “”);
  }
  
  function nextChapter() {
  const s = stateRef.current;
  gen(false, s.scenario, s.pName, s.lName, s.hist, s.chNum, s.curText);
  }
  
  function reset() {
  setScreen(“scenario”); setScenario(null); setChapters([]); setCurText(””); setChNum(0); setHist([]); setCMsgs([]); setCHist([]);
  }
  
  // ─── CHAT ───
  async function sendChat() {
  if(!cIn.trim()||cBusy) return;
  const msg = cIn.trim(); setCIn(””);
  setCMsgs(p=>[…p,{role:“user”,text:msg}]);
  setCBusy(true);
  const sc = SCENARIOS.find(s=>s.id===scenario);
  const sys = `You are ${lName}, from a ${sc.label} story, talking to ${pName}. Stay in character. 1-3 sentences. Emotionally engaging. Use ${pName}'s name sometimes. NEVER mention AI. Personality: ${HINTS[scenario]||"intense"}`;
  const msgs = […cHist,{role:“user”,content:msg}];
  try {
  const res = await fetch(“https://api.anthropic.com/v1/messages”, {
  method:“POST”,headers:{“Content-Type”:“application/json”},
  body:JSON.stringify({model:“claude-sonnet-4-20250514”,max_tokens:200,system:sys,messages:msgs}),
  });
  const d = await res.json();
  const reply = d.content?.map(c=>c.text||””).join(””)||”…”;
  setCMsgs(p=>[…p,{role:“li”,text:reply}]);
  setCHist([…msgs,{role:“assistant”,content:reply}]);
  } catch(e) { setCMsgs(p=>[…p,{role:“li”,text:”…”}]); }
  setCBusy(false);
  }
  
  // ─── FMT ───
  function fmt(text) {
  return text.split(”\n”).map((ln,i)=>{
  if(ln.startsWith(”**”)&&ln.endsWith(”**”)) return <h3 key={i} style={{fontSize:19,fontWeight:600,color:accent,margin:“18px 0 12px”,lineHeight:1.3}}>{ln.replace(/**/g,””)}</h3>;
  if(ln===”—”) return <div key={i} style={{height:1,background:“linear-gradient(90deg,transparent,#1a1a24,transparent)”,margin:“20px 0”}}/>;
  if(!ln.trim()) return <br key={i}/>;
  const ps = ln.split(/(**[^*]+**)/g);
  return <p key={i} style={{marginBottom:6}}>{ps.map((p,j)=>p.startsWith(”**”)&&p.endsWith(”**”)?<strong key={j} style={{color:”#e8e0d4”}}>{p.replace(/**/g,””)}</strong>:<span key={j}>{p}</span>)}</p>;
  });
  }
  
  // ─── STYLES ───
  const cd = (isSel,clr) => ({padding:“16px”,borderRadius:16,border:isSel?`1.5px solid ${clr}`:“1.5px solid #18181f”,background:isSel?`${clr}10`:”#0d0d14”,cursor:“pointer”,transition:“all 0.3s”,display:“flex”,gap:14,alignItems:“center”});
  const bt = (off) => ({width:“100%”,padding:“16px”,borderRadius:14,border:“none”,background:off?”#1a1a24”:`linear-gradient(135deg,${accent},${accent}bb)`,color:off?”#4a4540”:”#fff”,fontSize:15,fontWeight:600,fontFamily:FONT,cursor:off?“default”:“pointer”,letterSpacing:1,boxShadow:off?“none”:`0 4px 30px ${accent}30`});
  const b2 = {width:“100%”,padding:“14px”,borderRadius:14,border:“1px solid #1a1a24”,background:“transparent”,color:”#6b645a”,fontSize:13,fontFamily:FONT,cursor:“pointer”};
  const inp = {width:“100%”,padding:“14px 16px”,borderRadius:12,border:“1px solid #222230”,background:”#0d0d14”,color:”#e8e0d4”,fontSize:16,fontFamily:FONT,outline:“none”,boxSizing:“border-box”};
  const pl = {display:“inline-block”,padding:“5px 14px”,borderRadius:20,background:`${accent}18`,color:accent,fontSize:11,fontFamily:MONO,letterSpacing:1};
  const W = {minHeight:“100vh”,background:”#07070b”,color:”#e8e0d4”,fontFamily:FONT,position:“relative”,overflow:“hidden”};
  const G = {position:“fixed”,inset:0,background:sel?.bg||“linear-gradient(135deg,#1a1508,#0a0a0f)”,pointerEvents:“none”,zIndex:0,transition:“background 0.8s”};
  const C = {position:“relative”,zIndex:1,maxWidth:480,margin:“0 auto”,padding:“16px 20px 40px”,minHeight:“100vh”};
  const LO = {fontSize:10,letterSpacing:8,textTransform:“uppercase”,color:accent,fontFamily:MONO};
  const nb = (a) => ({flex:1,padding:“12px”,background:a?`${accent}15`:“transparent”,color:a?accent:”#4a4540”,border:“none”,fontSize:12,fontFamily:MONO,letterSpacing:1,cursor:“pointer”,borderBottom:a?`2px solid ${accent}`:“2px solid transparent”});
  
  const css = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1a1a24;border-radius:4px}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}input::placeholder{color:#3a3530}`;
  
  // ═══ SPLASH ═══
  if(screen===“splash”) return (
  
    <div style={W} onClick={()=>setScreen("scenario")}>
      <div style={G}/>
      <div style={{...C,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:10,color:"#3a3530",fontFamily:MONO,marginBottom:24}}>INTRODUCING</div>
        <h1 style={{fontSize:56,fontWeight:300,lineHeight:1.05,background:"linear-gradient(135deg,#e8e0d4 30%,#c9a84c)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Storyline</h1>
        <p style={{fontSize:14,color:"#6b645a",fontStyle:"italic",lineHeight:1.6,maxWidth:280,marginTop:12}}>Live the story. Chat the character.<br/>An AI novel experience written for you.</p>
        <div style={{marginTop:48,animation:"pulse 2s ease-in-out infinite"}}><div style={{fontSize:11,letterSpacing:6,color:"#3a3530",fontFamily:MONO}}>TAP TO BEGIN</div></div>
      </div>
      <style>{css}</style>
    </div>
  );
  
  // ═══ LOADING ═══
  if(busy) return (
  
    <div style={W}><div style={G}/>
      <div style={{...C,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",textAlign:"center"}}>
        <div style={{width:48,height:48,borderRadius:"50%",border:`2px solid ${accent}30`,borderTopColor:accent,animation:"spin 1s linear infinite"}}/>
        <h2 style={{fontSize:22,fontWeight:300,marginTop:20}}>{lmsg}</h2>
        <div style={{display:"flex",gap:8,marginTop:20}}>
          {sel&&<span style={pl}>{sel.emoji} {sel.label}</span>}
          {pName&&<span style={pl}>{pName}</span>}
        </div>
      </div>
      <style>{css}</style>
    </div>
  );
  
  // ═══ SCENARIO ═══
  if(screen===“scenario”) return (
  
    <div style={W}><div style={G}/>
      <div style={C}>
        <div style={{textAlign:"center",padding:"24px 0 8px"}}><div style={LO}>storyline</div></div>
        <div style={{fontSize:10,letterSpacing:4,color:"#3a3530",fontFamily:MONO,marginBottom:14}}>CHOOSE YOUR STORY</div>
        <h2 style={{fontSize:26,fontWeight:300,marginBottom:6}}>What world do you<br/>want to live in?</h2>
        <p style={{fontSize:13,color:"#5a544a",marginBottom:16,fontStyle:"italic"}}>Tap ▶ to jump in instantly, or tap a card to customize names.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {SCENARIOS.map(s=>(
            <div key={s.id} style={cd(scenario===s.id,s.color)} onClick={()=>setScenario(s.id)}>
              <div style={{fontSize:28,width:44,textAlign:"center",flexShrink:0}}>{s.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:600,color:scenario===s.id?s.color:"#e8e0d4"}}>{s.label}</div>
                <div style={{fontSize:12,color:"#5a544a",marginTop:2,lineHeight:1.4}}>{s.desc}</div>
              </div>
              <div onClick={(e)=>{e.stopPropagation();quickStart(s.id);}} style={{width:40,height:40,borderRadius:"50%",background:`${s.color}25`,border:`1.5px solid ${s.color}50`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,fontSize:16,color:s.color}}>▶</div>
            </div>
          ))}
        </div>
        {scenario&&(
          <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:8}}>
            <button style={bt(false)} onClick={()=>quickStart(scenario)}>⚡ Quick Start — Random Names</button>
            <button style={b2} onClick={()=>setScreen("nameSetup")}>✍️ Customize Names</button>
          </div>
        )}
      </div>
      <style>{css}</style>
    </div>
  );
  
  // ═══ NAME SETUP ═══
  if(screen===“nameSetup”) return (
  
    <div style={W}><div style={G}/>
      <div style={C}>
        <div style={{textAlign:"center",padding:"24px 0 8px"}}><div style={LO}>storyline</div></div>
        <div style={{fontSize:10,letterSpacing:4,color:"#3a3530",fontFamily:MONO,marginBottom:14}}>NAME YOUR CHARACTERS</div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:12,letterSpacing:3,color:"#5a544a",fontFamily:MONO,textTransform:"uppercase",marginBottom:10}}>You</div>
          <div style={cd(nMode==="custom",accent)} onClick={()=>{setNMode("custom");setPName("");}}><div style={{fontSize:22,width:36,textAlign:"center"}}>✍️</div><div style={{fontSize:14,fontWeight:600}}>Type your name</div></div>
          {nMode==="custom"&&<input style={{...inp,marginTop:8}} placeholder="Your name..." value={pName} onChange={e=>setPName(e.target.value)} autoFocus/>}
          <div style={{...cd(nMode==="random",accent),marginTop:8}} onClick={()=>{setNMode("random");setPName(rName());}}><div style={{fontSize:22,width:36,textAlign:"center"}}>🎲</div><div style={{fontSize:14,fontWeight:600}}>Random name</div></div>
          {nMode==="random"&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}><span style={pl}>{pName}</span><button style={{...b2,width:"auto",padding:"6px 14px"}} onClick={()=>setPName(rName())}>🎲</button></div>}
        </div>
        <div style={{height:1,background:"linear-gradient(90deg,transparent,#1a1a24,transparent)",margin:"20px 0"}}/>
        <div>
          <div style={{fontSize:12,letterSpacing:3,color:"#5a544a",fontFamily:MONO,textTransform:"uppercase",marginBottom:10}}>Love interest</div>
          <div style={cd(lMode==="custom",accent)} onClick={()=>{setLMode("custom");setLName("");}}><div style={{fontSize:22,width:36,textAlign:"center"}}>✍️</div><div style={{fontSize:14,fontWeight:600}}>Type their name</div></div>
          {lMode==="custom"&&<input style={{...inp,marginTop:8}} placeholder="Their name..." value={lName} onChange={e=>setLName(e.target.value)}/>}
          <div style={{...cd(lMode==="random",accent),marginTop:8}} onClick={()=>{setLMode("random");setLName(rName());}}><div style={{fontSize:22,width:36,textAlign:"center"}}>🎲</div><div style={{fontSize:14,fontWeight:600}}>Random name</div></div>
          {lMode==="random"&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}><span style={pl}>{lName}</span><button style={{...b2,width:"auto",padding:"6px 14px"}} onClick={()=>setLName(rName())}>🎲</button></div>}
        </div>
        <div style={{display:"flex",gap:10,marginTop:24}}>
          <button style={{...b2,flex:1}} onClick={()=>setScreen("scenario")}>← Back</button>
          <button style={{...bt(!pName||!lName),flex:2}} onClick={()=>{if(pName&&lName)customStart();}} disabled={!pName||!lName}>Begin My Story ✦</button>
        </div>
      </div>
      <style>{css}</style>
    </div>
  );
  
  // ═══ STORY ═══
  if(screen===“story”) return (
  
    <div style={W}><div style={G}/>
      <div style={{...C,paddingBottom:100}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={LO}>storyline</div>
          <button style={{background:"none",border:"none",color:"#3a3530",fontSize:11,cursor:"pointer",fontFamily:MONO,letterSpacing:2}} onClick={reset}>NEW</button>
        </div>
        <div style={{display:"flex",gap:0,background:"#0d0d12",borderRadius:14,overflow:"hidden",border:"1px solid #1a1a24",marginBottom:16}}>
          <button style={nb(true)}>📖 STORY</button>
          <button style={nb(false)} onClick={()=>setScreen("chat")}>💬 CHAT WITH {lName.toUpperCase()}</button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          <span style={pl}>{sel?.emoji} {sel?.label}</span>
          <span style={pl}>Ch. {chNum}</span>
        </div>
        <div ref={sRef} style={{maxHeight:"58vh",overflowY:"auto",padding:"20px",background:"#09090f",borderRadius:16,border:"1px solid #141420",lineHeight:1.9,fontSize:15.5,whiteSpace:"pre-wrap"}}>
          {chapters.map((ch,i)=><div key={i} style={{marginBottom:20,opacity:0.7}}>{fmt(ch.text)}<div style={{height:1,background:"linear-gradient(90deg,transparent,#1a1a24,transparent)",margin:"20px 0"}}/></div>)}
          {fmt(shown)}
        </div>
        {err&&<p style={{color:"#c0392b",marginTop:10,fontSize:13}}>{err}</p>}
        <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"16px 20px 28px",background:"linear-gradient(transparent,#07070b 30%)",zIndex:10}}>
          <div style={{maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",gap:8}}>
            <button style={bt(false)} onClick={()=>setScreen("chat")}>💬 {lName} wants to talk to you...</button>
            <button style={b2} onClick={nextChapter}>Next Chapter →</button>
          </div>
        </div>
      </div>
      <style>{css}</style>
    </div>
  );
  
  // ═══ CHAT ═══
  if(screen===“chat”) return (
  
    <div style={W}><div style={G}/>
      <div style={{...C,display:"flex",flexDirection:"column",height:"100vh",paddingBottom:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexShrink:0}}>
          <div style={LO}>storyline</div>
        </div>
        <div style={{display:"flex",gap:0,background:"#0d0d12",borderRadius:14,overflow:"hidden",border:"1px solid #1a1a24",marginBottom:12,flexShrink:0}}>
          <button style={nb(false)} onClick={()=>setScreen("story")}>📖 STORY</button>
          <button style={nb(true)}>💬 CHAT WITH {lName.toUpperCase()}</button>
        </div>
        <div style={{textAlign:"center",padding:"12px 0",flexShrink:0}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${accent}40,${accent}15)`,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`2px solid ${accent}30`}}>{sel?.emoji}</div>
          <div style={{fontSize:18,fontWeight:600,color:accent}}>{lName}</div>
          <div style={{fontSize:11,color:"#3a3530",fontFamily:MONO,letterSpacing:2,marginTop:2}}>{TITLES[scenario]||"UNKNOWN"}</div>
        </div>
        <div ref={cRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,padding:"8px 0"}}>
          {cMsgs.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#3a3530",fontStyle:"italic",fontSize:13}}>Say something to {lName}...<br/>They're waiting.</div>}
          {cMsgs.map((m,i)=>(
            <div key={i} style={m.role==="user"?{alignSelf:"flex-end",background:`${accent}20`,color:"#e8e0d4",padding:"10px 16px",borderRadius:"16px 16px 4px 16px",maxWidth:"80%",fontSize:14,lineHeight:1.5}:{alignSelf:"flex-start",background:"#141420",color:"#e8e0d4",padding:"10px 16px",borderRadius:"16px 16px 16px 4px",maxWidth:"80%",fontSize:14,lineHeight:1.5}}>
              {m.role==="li"&&<div style={{fontSize:10,color:accent,fontFamily:MONO,letterSpacing:2,marginBottom:4}}>{lName.toUpperCase()}</div>}
              {m.text}
            </div>
          ))}
          {cBusy&&<div style={{alignSelf:"flex-start",background:"#141420",padding:"10px 16px",borderRadius:"16px 16px 16px 4px",maxWidth:"80%",fontSize:14}}>
            <div style={{fontSize:10,color:accent,fontFamily:MONO,letterSpacing:2,marginBottom:4}}>{lName.toUpperCase()}</div>
            <span style={{animation:"pulse 1.2s ease-in-out infinite",color:"#e8e0d4"}}>typing...</span>
          </div>}
        </div>
        <div style={{display:"flex",gap:10,padding:"12px 0 16px",flexShrink:0,alignItems:"center"}}>
          <input style={{flex:1,padding:"12px 16px",borderRadius:24,border:"1px solid #222230",background:"#0d0d14",color:"#e8e0d4",fontSize:14,fontFamily:FONT,outline:"none"}} placeholder={`Message ${lName}...`} value={cIn} onChange={e=>setCIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendChat();}}/>
          <button onClick={sendChat} style={{width:44,height:44,borderRadius:"50%",border:"none",background:accent,color:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>→</button>
        </div>
        <div style={{flexShrink:0,paddingBottom:12}}>
          <button style={b2} onClick={nextChapter}>📖 Continue to Chapter {chNum+1} →</button>
        </div>
      </div>
      <style>{css}</style>
    </div>
  );
  
  return null;
  }
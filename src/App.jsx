import { useState, useRef, useEffect } from "react";

var SCENARIOS = [
  { id: "billionaire", emoji: "\u{1F48E}", label: "Billionaire Romance", desc: "The CEO who can not stop thinking about you", color: "#c9a84c", bg: "linear-gradient(135deg, #1a1508, #0a0a0f)" },
  { id: "revenge", emoji: "\u{1F5E1}\uFE0F", label: "Revenge", desc: "They destroyed your life. You came back stronger.", color: "#c0392b", bg: "linear-gradient(135deg, #150808, #0a0a0f)" },
  { id: "reborn", emoji: "\u{1F504}", label: "Reborn", desc: "You died. You woke up 10 years in the past.", color: "#2e86de", bg: "linear-gradient(135deg, #080d15, #0a0a0f)" },
  { id: "mafia", emoji: "\u{1F5A4}", label: "Mafia Love", desc: "Dangerous. Possessive. Completely obsessed with you.", color: "#6c5ce7", bg: "linear-gradient(135deg, #0d0a15, #0a0a0f)" },
  { id: "werewolf", emoji: "\u{1F43A}", label: "Fated Mate", desc: "The Alpha who has been searching for you his whole life", color: "#e17055", bg: "linear-gradient(135deg, #150d08, #0a0a0f)" },
  { id: "enemies", emoji: "\u{1F525}", label: "Enemies to Lovers", desc: "You hate each other. Until you do not.", color: "#fd79a8", bg: "linear-gradient(135deg, #150a10, #0a0a0f)" },
  { id: "royal", emoji: "\u{1F451}", label: "Royal Affair", desc: "A forbidden love with the crown prince", color: "#ffeaa7", bg: "linear-gradient(135deg, #15140a, #0a0a0f)" },
  { id: "thriller", emoji: "\u{1F52A}", label: "Dark Thriller", desc: "Trust no one. Especially the one you love.", color: "#636e72", bg: "linear-gradient(135deg, #0d0d0d, #0a0a0f)" }
];

var NAMES = ["Kael","Damon","Lucian","Ren","Atlas","Cassian","Ezra","Zane","Orion","Silas","Aria","Luna","Seraphina","Ivy","Nova","Celeste","Elara","Freya","Scarlett","Violet"];
var VILLAIN_NAMES = ["Malakai","Thorne","Ravenna","Draven","Lilith","Viktor","Morgana","Cain","Nyx","Soren","Bellatrix","Nero"];
function rName() { return NAMES[Math.floor(Math.random() * NAMES.length)]; }
function rVillain() { return VILLAIN_NAMES[Math.floor(Math.random() * VILLAIN_NAMES.length)]; }

var HINTS = { revenge:"cunning plans, betrayal reveals, power shifts", reborn:"memories from past life, using future knowledge", mafia:"danger, possessiveness, forbidden attraction", billionaire:"power dynamics, luxury settings, intense attraction", werewolf:"the mate bond, pack dynamics, primal instincts", enemies:"banter, tension, forced proximity", royal:"duty vs desire, elegance, forbidden love", thriller:"suspense, paranoia, dangerous attraction" };
var TITLES_MAP = { mafia:"THE DON", billionaire:"CEO", werewolf:"ALPHA", royal:"CROWN PRINCE", revenge:"YOUR ALLY", reborn:"PAST LIFE", enemies:"YOUR RIVAL", thriller:"SUSPECT" };
var LMSGS = ["Writing your fate...","The plot thickens...","Crafting the tension...","Building your world...","Adding the cliffhanger..."];

var FONT = "Cormorant Garamond,Georgia,serif";
var MONO = "DM Mono,Courier New,monospace";
var CSS_TEXT = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1a1a24;border-radius:4px}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}input::placeholder{color:#3a3530}";

function callAPI(system, messages, maxTokens) {
  return fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system: system, messages: messages, max_tokens: maxTokens || 1200 })
  }).then(function(r) { return r.json(); });
}

export default function App() {
  var _s = useState("splash"); var screen = _s[0]; var setScreen = _s[1];
  var _sc = useState(null); var scenario = _sc[0]; var setScenario = _sc[1];
  var _pn = useState(""); var pName = _pn[0]; var setPName = _pn[1];
  var _ln = useState(""); var lName = _ln[0]; var setLName = _ln[1];
  var _vn = useState(""); var vName = _vn[0]; var setVName = _vn[1];
  var _nm = useState(null); var nMode = _nm[0]; var setNMode = _nm[1];
  var _lm = useState(null); var lMode = _lm[0]; var setLMode = _lm[1];
  var _vm = useState(null); var vMode = _vm[0]; var setVMode = _vm[1];

  var _ch = useState([]); var chapters = _ch[0]; var setChapters = _ch[1];
  var _ct = useState(""); var curText = _ct[0]; var setCurText = _ct[1];
  var _sh = useState(""); var shown = _sh[0]; var setShown = _sh[1];
  var _cn = useState(0); var chNum = _cn[0]; var setChNum = _cn[1];
  var _hi = useState([]); var hist = _hi[0]; var setHist = _hi[1];
  var _bu = useState(false); var busy = _bu[0]; var setBusy = _bu[1];
  var _lms = useState(LMSGS[0]); var lmsg = _lms[0]; var setLmsg = _lms[1];

  var _cm = useState([]); var cMsgs = _cm[0]; var setCMsgs = _cm[1];
  var _ci = useState(""); var cIn = _ci[0]; var setCIn = _ci[1];
  var _cb = useState(false); var cBusy = _cb[0]; var setCBusy = _cb[1];
  var _cht = useState([]); var cHist = _cht[0]; var setCHist = _cht[1];
  var _er = useState(""); var err = _er[0]; var setErr = _er[1];

  var sRef = useRef(null);
  var cRef = useRef(null);
  var twRef = useRef(null);
  var stateRef = useRef({});

  useEffect(function() { stateRef.current = { scenario: scenario, pName: pName, lName: lName, vName: vName, chNum: chNum, curText: curText, hist: hist }; });

  var sel = SCENARIOS.find(function(s) { return s.id === scenario; });
  var accent = (sel && sel.color) ? sel.color : "#c9a84c";

  useEffect(function() {
    if (!curText) return;
    var i = 0; setShown("");
    if (twRef.current) clearInterval(twRef.current);
    twRef.current = setInterval(function() { i++; setShown(curText.slice(0, i)); if (i >= curText.length) clearInterval(twRef.current); }, 10);
    return function() { if (twRef.current) clearInterval(twRef.current); };
  }, [curText]);

  useEffect(function() { if (sRef.current) sRef.current.scrollTop = sRef.current.scrollHeight; }, [shown]);
  useEffect(function() { if (cRef.current) cRef.current.scrollTop = cRef.current.scrollHeight; }, [cMsgs, cBusy]);

  useEffect(function() {
    if (!busy) return;
    setLmsg(LMSGS[Math.floor(Math.random() * LMSGS.length)]);
    var iv = setInterval(function() { setLmsg(LMSGS[Math.floor(Math.random() * LMSGS.length)]); }, 2500);
    return function() { clearInterval(iv); };
  }, [busy]);

  function gen(isNew, scId, p, l, v, prevHist, prevChNum, prevCurText) {
    console.log("gen called", {isNew: isNew, scId: scId, p: p, l: l, v: v, chNum: prevChNum});
    setBusy(true); setErr("");
    var num = isNew ? 1 : prevChNum + 1;
    var sc = SCENARIOS.find(function(s) { return s.id === scId; });
    var villainLine = v ? "\n- The villain/antagonist is " + v + " - make them menacing, cunning, and a real threat" : "";
    var sys = "You are a bestselling novelist writing a personalized " + sc.label + " novel.\nRULES:\n- The main character (reader) is named " + p + " - write in second person (you)\n- The love interest / key ally is " + l + "\n- Write Chapter " + num + " - 500-700 words\n- Start with **Chapter " + num + ": [Title]**\n- Vivid detail, sharp dialogue, emotional depth\n- End with a devastating cliffhanger\n- Make " + l + " magnetic and unforgettable\n- Include " + (HINTS[scId] || "tension and depth") + "\n- Write like a real published novel\n- Be BOLD and surprising" + villainLine;

    var uMsg = isNew
      ? "Write Chapter 1. Drop " + p + " right into a pivotal moment. Make " + p + " feel " + l + " presence immediately." + (v ? " Introduce the threat of " + v + " early." : "")
      : "Write Chapter " + num + ". Raise the stakes. Deepen the connection between " + p + " and " + l + "." + (v ? " " + v + " should become more dangerous." : "") + " End with something devastating.";

    var msgs;
    if (isNew) { msgs = [{role: "user", content: uMsg}]; }
    else { msgs = prevHist.concat([{role: "user", content: uMsg}]); }

    callAPI(sys, msgs, 1200).then(function(d) {
      console.log("API response", d);
      var txt = "";
      if (d.content) { for (var ci = 0; ci < d.content.length; ci++) { txt += (d.content[ci].text || ""); } }
      if (d.error) { setErr("API Error: " + (d.error.message || d.error)); setBusy(false); return; }
      if (!txt) { setErr("No content returned. Check your API key in Vercel settings."); setBusy(false); return; }

      var nh = msgs.concat([{role: "assistant", content: txt}]);
      setHist(nh);
      if (isNew) { setChapters([]); setChNum(1); }
      else { setChapters(function(prev) { return prev.concat([{text: prevCurText, num: prevChNum}]); }); setChNum(num); }
      setCurText(txt);
      setScreen("story");
      setCMsgs([]);
      setCHist([
        {role: "user", content: "You are " + l + " from a " + sc.label + " story. Chapter " + num + " just happened. Stay in character. Use the name " + p + ". 1-3 sentences. Emotionally engaging. Never break character or mention AI."},
        {role: "assistant", content: "I understand."}
      ]);
      setBusy(false);
    }).catch(function(e) {
      setErr("Network error: " + e.message);
      setBusy(false);
    });
  }

  function quickStart(scId) {
    var a = rName(); var b = rName(); var v = rVillain();
    while (b === a) b = rName();
    while (v === a || v === b) v = rVillain();
    setScenario(scId); setPName(a); setLName(b); setVName(v);
    gen(true, scId, a, b, v, [], 0, "");
  }

  function customStart() {
    gen(true, scenario, pName, lName, vName, [], 0, "");
  }

  function nextChapter() {
    var s = stateRef.current;
    console.log("nextChapter called", s);
    if (!s.scenario || !s.pName || !s.lName) {
      console.error("Missing state for next chapter", s);
      setErr("Missing data. Please start a new story.");
      return;
    }
    gen(false, s.scenario, s.pName, s.lName, s.vName || "", s.hist, s.chNum, s.curText);
  }

  function doReset() {
    setScreen("scenario"); setScenario(null); setChapters([]); setCurText(""); setShown(""); setChNum(0); setHist([]); setCMsgs([]); setCHist([]); setErr("");
    setNMode(null); setLMode(null); setVMode(null); setPName(""); setLName(""); setVName("");
  }

  function sendChat() {
    if (!cIn.trim() || cBusy) return;
    var msg = cIn.trim(); setCIn("");
    setCMsgs(function(p) { return p.concat([{role: "user", text: msg}]); });
    setCBusy(true);
    var sc = SCENARIOS.find(function(s) { return s.id === scenario; });
    var sys = "You are " + lName + ", from a " + sc.label + " story, talking to " + pName + ". Stay in character. 1-3 sentences. Emotionally engaging. Use " + pName + " name sometimes. NEVER mention AI. Personality: " + (HINTS[scenario] || "intense");
    var msgs = cHist.concat([{role: "user", content: msg}]);
    callAPI(sys, msgs, 200).then(function(d) {
      var reply = "";
      if (d.content) { for (var ci = 0; ci < d.content.length; ci++) { reply += (d.content[ci].text || ""); } }
      if (!reply) reply = "...";
      setCMsgs(function(p) { return p.concat([{role: "li", text: reply}]); });
      setCHist(msgs.concat([{role: "assistant", content: reply}]));
      setCBusy(false);
    }).catch(function() {
      setCMsgs(function(p) { return p.concat([{role: "li", text: "..."}]); });
      setCBusy(false);
    });
  }

  function fmt(text) {
    var lines = text.split("\n");
    var result = [];
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (ln.indexOf("**") === 0 && ln.lastIndexOf("**") === ln.length - 2) {
        result.push(<h3 key={i} style={{ fontSize: 19, fontWeight: 600, color: accent, margin: "18px 0 12px", lineHeight: 1.3 }}>{ln.split("**").join("")}</h3>);
      } else if (ln === "---") {
        result.push(<div key={i} style={{ height: 1, background: "linear-gradient(90deg,transparent,#1a1a24,transparent)", margin: "20px 0" }} />);
      } else if (!ln.trim()) {
        result.push(<br key={i} />);
      } else {
        result.push(<p key={i} style={{ marginBottom: 6 }}>{ln}</p>);
      }
    }
    return result;
  }

  // STYLES
  function cd(isSel, clr) { return {padding: "16px", borderRadius: 16, border: isSel ? "1.5px solid " + clr : "1.5px solid #18181f", background: isSel ? clr + "10" : "#0d0d14", cursor: "pointer", transition: "all 0.3s", display: "flex", gap: 14, alignItems: "center"}; }
  function bt(off) { return {width: "100%", padding: "16px", borderRadius: 14, border: "none", background: off ? "#1a1a24" : "linear-gradient(135deg," + accent + "," + accent + "bb)", color: off ? "#4a4540" : "#fff", fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: off ? "default" : "pointer", letterSpacing: 1, boxShadow: off ? "none" : "0 4px 30px " + accent + "30"}; }
  var b2 = {width: "100%", padding: "14px", borderRadius: 14, border: "1px solid #1a1a24", background: "transparent", color: "#6b645a", fontSize: 13, fontFamily: FONT, cursor: "pointer"};
  var inp = {width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #222230", background: "#0d0d14", color: "#e8e0d4", fontSize: 16, fontFamily: FONT, outline: "none", boxSizing: "border-box"};
  var pl = {display: "inline-block", padding: "5px 14px", borderRadius: 20, background: accent + "18", color: accent, fontSize: 11, fontFamily: MONO, letterSpacing: 1};
  var W = {minHeight: "100vh", background: "#07070b", color: "#e8e0d4", fontFamily: FONT, position: "relative", overflow: "hidden"};
  var G = {position: "fixed", inset: 0, background: (sel && sel.bg) ? sel.bg : "linear-gradient(135deg,#1a1508,#0a0a0f)", pointerEvents: "none", zIndex: 0, transition: "background 0.8s"};
  var C = {position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "16px 20px 40px", minHeight: "100vh"};
  var LO = {fontSize: 10, letterSpacing: 8, textTransform: "uppercase", color: accent, fontFamily: MONO};
  function nb(a) { return {flex: 1, padding: "12px", background: a ? accent + "15" : "transparent", color: a ? accent : "#4a4540", border: "none", fontSize: 12, fontFamily: MONO, letterSpacing: 1, cursor: "pointer", borderBottom: a ? "2px solid " + accent : "2px solid transparent"}; }
  var divider = {height: 1, background: "linear-gradient(90deg,transparent,#1a1a24,transparent)", margin: "20px 0"};

  // ═══ SPLASH ═══
  if (screen === "splash") return (
    <div style={W} onClick={function() { setScreen("scenario"); }}>
      <div style={G} />
      <div style={Object.assign({}, C, {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center"})}>
        <div style={{fontSize: 10, letterSpacing: 10, color: "#3a3530", fontFamily: MONO, marginBottom: 24}}>INTRODUCING</div>
        <h1 style={{fontSize: 56, fontWeight: 300, lineHeight: 1.05, background: "linear-gradient(135deg,#e8e0d4 30%,#c9a84c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Storyline</h1>
        <p style={{fontSize: 14, color: "#6b645a", fontStyle: "italic", lineHeight: 1.6, maxWidth: 280, marginTop: 12}}>Live the story. Chat the character.<br />Your personalized AI novel experience.</p>
        <div style={{marginTop: 48, animation: "pulse 2s ease-in-out infinite"}}><div style={{fontSize: 11, letterSpacing: 6, color: "#3a3530", fontFamily: MONO}}>TAP TO BEGIN</div></div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ═══ LOADING ═══
  if (busy) return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center"})}>
        <div style={{width: 48, height: 48, borderRadius: "50%", border: "2px solid " + accent + "30", borderTopColor: accent, animation: "spin 1s linear infinite"}} />
        <h2 style={{fontSize: 22, fontWeight: 300, marginTop: 20}}>{lmsg}</h2>
        <div style={{display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center"}}>
          {sel && <span style={pl}>{sel.emoji} {sel.label}</span>}
          {pName && <span style={pl}>{pName}</span>}
          {lName && <span style={pl}>{lName}</span>}
          {vName && <span style={Object.assign({}, pl, {background: "#c0392b18", color: "#c0392b"})}>{vName}</span>}
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ═══ ERROR SCREEN (when not busy but has error) ═══
  if (err && screen !== "story" && screen !== "chat") return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center"})}>
        <div style={{fontSize: 48, marginBottom: 16}}>&#9888;&#65039;</div>
        <h2 style={{fontSize: 20, fontWeight: 400, marginBottom: 12, color: "#c0392b"}}>{err}</h2>
        <p style={{fontSize: 13, color: "#6b645a", marginBottom: 24, maxWidth: 300, lineHeight: 1.5}}>Make sure your ANTHROPIC_API_KEY is set in Vercel Settings and you have redeployed.</p>
        <button style={bt(false)} onClick={function() { setErr(""); setScreen("scenario"); }}>Try Again</button>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ═══ SCENARIO ═══
  if (screen === "scenario") return (
    <div style={W}><div style={G} />
      <div style={C}>
        <div style={{textAlign: "center", padding: "24px 0 8px"}}><div style={LO}>storyline</div></div>
        <div style={{fontSize: 10, letterSpacing: 4, color: "#3a3530", fontFamily: MONO, marginBottom: 14}}>STEP 1 OF 2</div>
        <h2 style={{fontSize: 26, fontWeight: 300, marginBottom: 6}}>What world do you<br />want to live in?</h2>
        <p style={{fontSize: 13, color: "#5a544a", marginBottom: 16, fontStyle: "italic"}}>Pick your story. Then personalize it.</p>
        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
          {SCENARIOS.map(function(s) { return (
            <div key={s.id} style={cd(scenario === s.id, s.color)} onClick={function() { setScenario(s.id); }}>
              <div style={{fontSize: 28, width: 44, textAlign: "center", flexShrink: 0}}>{s.emoji}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 16, fontWeight: 600, color: scenario === s.id ? s.color : "#e8e0d4"}}>{s.label}</div>
                <div style={{fontSize: 12, color: "#5a544a", marginTop: 2, lineHeight: 1.4}}>{s.desc}</div>
              </div>
            </div>
          ); })}
        </div>
        {scenario && (
          <div style={{marginTop: 20, display: "flex", flexDirection: "column", gap: 8}}>
            <button style={bt(false)} onClick={function() { setScreen("nameSetup"); }}>Personalize My Story</button>
            <button style={b2} onClick={function() { quickStart(scenario); }}>Skip - Use Random Names</button>
          </div>
        )}
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ═══ NAME SETUP ═══
  if (screen === "nameSetup") return (
    <div style={W}><div style={G} />
      <div style={C}>
        <div style={{textAlign: "center", padding: "24px 0 8px"}}><div style={LO}>storyline</div></div>
        <div style={{fontSize: 10, letterSpacing: 4, color: "#3a3530", fontFamily: MONO, marginBottom: 14}}>STEP 2 OF 2</div>
        <h2 style={{fontSize: 24, fontWeight: 300, marginBottom: 16}}>Name your characters</h2>

        {/* PLAYER NAME */}
        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 12, letterSpacing: 3, color: "#5a544a", fontFamily: MONO, textTransform: "uppercase", marginBottom: 10}}>You (the main character)</div>
          <div style={cd(nMode === "custom", accent)} onClick={function() { setNMode("custom"); setPName(""); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u270D\uFE0F"}</div>
            <div style={{fontSize: 14, fontWeight: 600}}>Type my name</div>
          </div>
          {nMode === "custom" && <input style={Object.assign({}, inp, {marginTop: 8})} placeholder="Your name..." value={pName} onChange={function(e) { setPName(e.target.value); }} autoFocus />}
          <div style={Object.assign({}, cd(nMode === "random", accent), {marginTop: 8})} onClick={function() { setNMode("random"); setPName(rName()); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u{1F3B2}"}</div>
            <div style={{fontSize: 14, fontWeight: 600}}>Random name</div>
          </div>
          {nMode === "random" && <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 8}}><span style={pl}>{pName}</span><button style={Object.assign({}, b2, {width: "auto", padding: "6px 14px"})} onClick={function() { setPName(rName()); }}>{"\u{1F3B2}"}</button></div>}
        </div>

        <div style={divider} />

        {/* LOVE INTEREST */}
        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 12, letterSpacing: 3, color: "#5a544a", fontFamily: MONO, textTransform: "uppercase", marginBottom: 10}}>Love interest / ally</div>
          <div style={cd(lMode === "custom", accent)} onClick={function() { setLMode("custom"); setLName(""); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u270D\uFE0F"}</div>
            <div style={{fontSize: 14, fontWeight: 600}}>Type their name</div>
          </div>
          {lMode === "custom" && <input style={Object.assign({}, inp, {marginTop: 8})} placeholder="Love interest name..." value={lName} onChange={function(e) { setLName(e.target.value); }} />}
          <div style={Object.assign({}, cd(lMode === "random", accent), {marginTop: 8})} onClick={function() { setLMode("random"); setLName(rName()); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u{1F3B2}"}</div>
            <div style={{fontSize: 14, fontWeight: 600}}>Random name</div>
          </div>
          {lMode === "random" && <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 8}}><span style={pl}>{lName}</span><button style={Object.assign({}, b2, {width: "auto", padding: "6px 14px"})} onClick={function() { setLName(rName()); }}>{"\u{1F3B2}"}</button></div>}
        </div>

        <div style={divider} />

        {/* VILLAIN */}
        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 12, letterSpacing: 3, color: accent === "#c0392b" ? "#c0392b" : "#8b4545", fontFamily: MONO, textTransform: "uppercase", marginBottom: 10}}>Villain / antagonist (optional)</div>
          <div style={cd(vMode === "custom", "#c0392b")} onClick={function() { setVMode("custom"); setVName(""); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u270D\uFE0F"}</div>
            <div style={{fontSize: 14, fontWeight: 600}}>Type villain name</div>
          </div>
          {vMode === "custom" && <input style={Object.assign({}, inp, {marginTop: 8})} placeholder="Villain name..." value={vName} onChange={function(e) { setVName(e.target.value); }} />}
          <div style={Object.assign({}, cd(vMode === "random", "#c0392b"), {marginTop: 8})} onClick={function() { setVMode("random"); setVName(rVillain()); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u{1F3B2}"}</div>
            <div style={{fontSize: 14, fontWeight: 600}}>Random villain</div>
          </div>
          {vMode === "random" && <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 8}}><span style={Object.assign({}, pl, {background: "#c0392b18", color: "#c0392b"})}>{vName}</span><button style={Object.assign({}, b2, {width: "auto", padding: "6px 14px"})} onClick={function() { setVName(rVillain()); }}>{"\u{1F3B2}"}</button></div>}
          <div style={Object.assign({}, cd(vMode === "skip", "#636e72"), {marginTop: 8})} onClick={function() { setVMode("skip"); setVName(""); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u2796"}</div>
            <div style={{fontSize: 14, fontWeight: 600, color: "#636e72"}}>No villain</div>
          </div>
        </div>

        <div style={{display: "flex", gap: 10, marginTop: 16}}>
          <button style={Object.assign({}, b2, {flex: 1})} onClick={function() { setScreen("scenario"); }}>Back</button>
          <button style={Object.assign({}, bt(!pName || !lName), {flex: 2})} onClick={function() { if (pName && lName) customStart(); }} disabled={!pName || !lName}>Begin My Story</button>
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ═══ STORY ═══
  if (screen === "story") return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {paddingBottom: 120})}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
          <div style={LO}>storyline</div>
          <button style={{background: "none", border: "none", color: "#3a3530", fontSize: 11, cursor: "pointer", fontFamily: MONO, letterSpacing: 2}} onClick={doReset}>NEW</button>
        </div>
        <div style={{display: "flex", gap: 0, background: "#0d0d12", borderRadius: 14, overflow: "hidden", border: "1px solid #1a1a24", marginBottom: 16}}>
          <button style={nb(true)}>STORY</button>
          <button style={nb(false)} onClick={function() { setScreen("chat"); }}>CHAT WITH {lName.toUpperCase()}</button>
        </div>
        <div style={{display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap"}}>
          {sel && <span style={pl}>{sel.emoji} {sel.label}</span>}
          <span style={pl}>Ch. {chNum}</span>
          <span style={pl}>{pName}</span>
        </div>
        <div ref={sRef} style={{maxHeight: "55vh", overflowY: "auto", padding: "20px", background: "#09090f", borderRadius: 16, border: "1px solid #141420", lineHeight: 1.9, fontSize: 15.5, whiteSpace: "pre-wrap"}}>
          {chapters.map(function(ch, i) { return <div key={i} style={{marginBottom: 20, opacity: 0.7}}>{fmt(ch.text)}<div style={divider} /></div>; })}
          {fmt(shown)}
        </div>
        {err && <p style={{color: "#c0392b", marginTop: 10, fontSize: 13, textAlign: "center"}}>{err}</p>}
        <div style={{position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px 28px", background: "linear-gradient(transparent,#07070b 30%)", zIndex: 10}}>
          <div style={{maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8}}>
            <button style={bt(false)} onClick={function() { setScreen("chat"); }}>{lName} wants to talk to you...</button>
            <button style={b2} onClick={nextChapter}>Next Chapter</button>
          </div>
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ═══ CHAT ═══
  if (screen === "chat") return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {display: "flex", flexDirection: "column", height: "100vh", paddingBottom: 0})}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexShrink: 0}}>
          <div style={LO}>storyline</div>
        </div>
        <div style={{display: "flex", gap: 0, background: "#0d0d12", borderRadius: 14, overflow: "hidden", border: "1px solid #1a1a24", marginBottom: 12, flexShrink: 0}}>
          <button style={nb(false)} onClick={function() { setScreen("story"); }}>STORY</button>
          <button style={nb(true)}>CHAT WITH {lName.toUpperCase()}</button>
        </div>
        <div style={{textAlign: "center", padding: "12px 0", flexShrink: 0}}>
          <div style={{width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg," + accent + "40," + accent + "15)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "2px solid " + accent + "30"}}>{sel && sel.emoji}</div>
          <div style={{fontSize: 18, fontWeight: 600, color: accent}}>{lName}</div>
          <div style={{fontSize: 11, color: "#3a3530", fontFamily: MONO, letterSpacing: 2, marginTop: 2}}>{TITLES_MAP[scenario] || "UNKNOWN"}</div>
        </div>
        <div ref={cRef} style={{flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "8px 0"}}>
          {cMsgs.length === 0 && <div style={{textAlign: "center", padding: "40px 20px", color: "#3a3530", fontStyle: "italic", fontSize: 13}}>Say something to {lName}...<br />They are waiting.</div>}
          {cMsgs.map(function(m, i) { return (
            <div key={i} style={m.role === "user" ? {alignSelf: "flex-end", background: accent + "20", color: "#e8e0d4", padding: "10px 16px", borderRadius: "16px 16px 4px 16px", maxWidth: "80%", fontSize: 14, lineHeight: 1.5} : {alignSelf: "flex-start", background: "#141420", color: "#e8e0d4", padding: "10px 16px", borderRadius: "16px 16px 16px 4px", maxWidth: "80%", fontSize: 14, lineHeight: 1.5}}>
              {m.role === "li" && <div style={{fontSize: 10, color: accent, fontFamily: MONO, letterSpacing: 2, marginBottom: 4}}>{lName.toUpperCase()}</div>}
              {m.text}
            </div>
          ); })}
          {cBusy && <div style={{alignSelf: "flex-start", background: "#141420", padding: "10px 16px", borderRadius: "16px 16px 16px 4px", maxWidth: "80%", fontSize: 14}}>
            <div style={{fontSize: 10, color: accent, fontFamily: MONO, letterSpacing: 2, marginBottom: 4}}>{lName.toUpperCase()}</div>
            <span style={{animation: "pulse 1.2s ease-in-out infinite", color: "#e8e0d4"}}>typing...</span>
          </div>}
        </div>
        <div style={{display: "flex", gap: 10, padding: "12px 0 16px", flexShrink: 0, alignItems: "center"}}>
          <input style={{flex: 1, padding: "12px 16px", borderRadius: 24, border: "1px solid #222230", background: "#0d0d14", color: "#e8e0d4", fontSize: 14, fontFamily: FONT, outline: "none"}} placeholder={"Message " + lName + "..."} value={cIn} onChange={function(e) { setCIn(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") sendChat(); }} />
          <button onClick={sendChat} style={{width: 44, height: 44, borderRadius: "50%", border: "none", background: accent, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>{"\u2192"}</button>
        </div>
        <div style={{flexShrink: 0, paddingBottom: 12}}>
          <button style={b2} onClick={nextChapter}>Continue to Chapter {chNum + 1}</button>
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  return null;
}

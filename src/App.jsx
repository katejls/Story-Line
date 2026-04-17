import { useState, useRef, useEffect } from "react";

var SCENARIOS = [
  { id: "billionaire", emoji: "\u{1F48E}", label: "Billionaire Romance", desc: "The CEO who can not stop thinking about you", color: "#c9a84c", bg: "linear-gradient(135deg, #1a1508, #0a0a0f)" },
  { id: "revenge", emoji: "\u{1F5E1}\uFE0F", label: "Revenge", desc: "They destroyed your life. You came back stronger.", color: "#c0392b", bg: "linear-gradient(135deg, #150808, #0a0a0f)" },
  { id: "reborn", emoji: "\u{1F504}", label: "Reborn", desc: "You died. You woke up 10 years in the past.", color: "#2e86de", bg: "linear-gradient(135deg, #080d15, #0a0a0f)" },
  { id: "mafia", emoji: "\u{1F5A4}", label: "Mafia Love", desc: "Dangerous. Possessive. Completely obsessed with you.", color: "#6c5ce7", bg: "linear-gradient(135deg, #0d0a15, #0a0a0f)" },
  { id: "werewolf", emoji: "\u{1F43A}", label: "Fated Mate", desc: "The Alpha who has been searching for you their whole life", color: "#e17055", bg: "linear-gradient(135deg, #150d08, #0a0a0f)" },
  { id: "enemies", emoji: "\u{1F525}", label: "Enemies to Lovers", desc: "You hate each other. Until you do not.", color: "#fd79a8", bg: "linear-gradient(135deg, #150a10, #0a0a0f)" },
  { id: "royal", emoji: "\u{1F451}", label: "Royal Affair", desc: "A forbidden love with someone of royal blood", color: "#ffeaa7", bg: "linear-gradient(135deg, #15140a, #0a0a0f)" },
  { id: "thriller", emoji: "\u{1F52A}", label: "Dark Thriller", desc: "Trust no one. Especially the one you love.", color: "#636e72", bg: "linear-gradient(135deg, #0d0d0d, #0a0a0f)" }
];

var ENDINGS = [
  { id: "happy", emoji: "\u{1F970}", label: "Happy Ending", desc: "Love wins. Everything falls into place.", color: "#27ae60" },
  { id: "sad", emoji: "\u{1F494}", label: "Tragic Ending", desc: "Beautiful but heartbreaking. You will cry.", color: "#636e72" },
  { id: "twist", emoji: "\u{1F92F}", label: "Plot Twist", desc: "Nothing is what it seems. Jaw-dropping finale.", color: "#e84393" },
  { id: "open", emoji: "\u{1F32C}\uFE0F", label: "Open Ending", desc: "Leaves you wondering. The story lingers.", color: "#0984e3" },
  { id: "dark", emoji: "\u{1F480}", label: "Dark Ending", desc: "The villain wins. Or does the hero become one?", color: "#2d3436" },
  { id: "surprise", emoji: "\u{1F381}", label: "Surprise Me", desc: "Let fate decide. No spoilers.", color: "#fdcb6e" }
];

var MALE_NAMES = ["Kael","Damon","Lucian","Ren","Atlas","Cassian","Ezra","Zane","Orion","Silas","Jace","Rhys","Asher","Rowan","Felix","Theo","Axel","Cruz","Sterling","Kai","Cole","Marcus","Adrian","Dante","Rafael","Matteo","Levi","Elias","Caleb","Xavier"];
var FEMALE_NAMES = ["Aria","Luna","Seraphina","Ivy","Nova","Celeste","Elara","Freya","Scarlett","Violet","Mira","Lena","Jade","Harlow","Suki","Cleo","Lyra","Ember","Sage","Wren","Elena","Maya","Zara","Valentina","Iris","Camille","Nadia","Kira","Aurora","Stella"];
var NEUTRAL_NAMES = ["Quinn","River","Blake","Emery","Phoenix","Sage","Rowan","Kai","Wren","Avery","Morgan","Dakota","Finley","Skyler","Reese","Jordan","Hayden","Remi","Shiloh","Arden"];
var MALE_VILLAINS = ["Malakai","Thorne","Draven","Viktor","Cain","Soren","Nero","Dante","Azazel","Cyrus","Thanatos","Damien","Ragnar","Alaric","Mordecai","Fenrir","Scorpius","Obsidian"];
var FEMALE_VILLAINS = ["Ravenna","Lilith","Morgana","Nyx","Bellatrix","Vesper","Lucrezia","Delilah","Isolde","Selene","Jezebel","Electra","Tempest","Sarai","Viper","Crimson","Raven"];
var NEUTRAL_VILLAINS = ["Vex","Wraith","Crimson","Raven","Obsidian","Tempest","Phoenix","Storm","Shadow","Onyx"];

function rName(gender) {
  if (gender === "male") return MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)];
  if (gender === "female") return FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
  return NEUTRAL_NAMES[Math.floor(Math.random() * NEUTRAL_NAMES.length)];
}
function rVillain(gender) {
  if (gender === "male") return MALE_VILLAINS[Math.floor(Math.random() * MALE_VILLAINS.length)];
  if (gender === "female") return FEMALE_VILLAINS[Math.floor(Math.random() * FEMALE_VILLAINS.length)];
  return NEUTRAL_VILLAINS[Math.floor(Math.random() * NEUTRAL_VILLAINS.length)];
}

var HINTS = { revenge:"cunning plans, betrayal reveals, power shifts", reborn:"memories from past life, using future knowledge", mafia:"danger, possessiveness, forbidden attraction", billionaire:"power dynamics, luxury settings, intense attraction", werewolf:"the mate bond, pack dynamics, primal instincts", enemies:"banter, tension, forced proximity", royal:"duty vs desire, elegance, forbidden love", thriller:"suspense, paranoia, dangerous attraction" };
var TITLES_MAP = { mafia:"THE DON", billionaire:"CEO", werewolf:"ALPHA", royal:"CROWN PRINCE", revenge:"YOUR ALLY", reborn:"PAST LIFE", enemies:"YOUR RIVAL", thriller:"SUSPECT" };
var LMSGS = ["Writing your fate...","The plot thickens...","Crafting the tension...","Building your world...","Choosing your destiny...","Sealing the ending..."];
var SETTINGS = ["modern day big city", "small coastal town", "1920s noir", "futuristic dystopia", "medieval kingdom", "tropical island", "snowy mountain lodge", "underground world", "boarding school", "war-torn country", "luxury yacht", "haunted mansion", "desert oasis", "neon-lit Tokyo", "Parisian streets", "Las Vegas penthouse", "ancient temple ruins", "Victorian London", "cyberpunk megacity", "remote countryside estate"];
var OPENINGS = ["a chance encounter", "a shocking discovery", "a desperate escape", "a mistaken identity", "a forbidden meeting", "a deadly accident", "waking up with no memory", "receiving a mysterious letter", "witnessing something forbidden", "being betrayed by someone close", "arriving somewhere new", "a funeral", "a high-stakes negotiation", "a storm that changes everything", "a wedding that goes wrong", "a secret revealed at midnight"];

var ENDING_PROMPTS = {
  happy: "End with a satisfying, heartwarming happy ending. Love wins, the characters find peace, and the reader feels warm inside.",
  sad: "End with a beautiful but tragic ending. Make the reader feel deep emotion - loss, sacrifice, or bittersweet acceptance. Make them cry.",
  twist: "End with a massive, jaw-dropping plot twist that recontextualizes everything. The reader should gasp. Nothing was what it seemed.",
  open: "End with an open, ambiguous ending that lingers in the mind. Leave questions unanswered. Let the reader imagine what comes next.",
  dark: "End with a dark, unsettling ending. The villain may win, or the hero crosses a moral line. Leave the reader shaken.",
  surprise: "End with whatever ending fits the story best - could be happy, tragic, twisted, or anything. Surprise the reader."
};

var FONT = "Cormorant Garamond,Georgia,serif";
var MONO = "DM Mono,Courier New,monospace";
var CSS_TEXT = "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1a1a24;border-radius:4px}@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}input::placeholder{color:#3a3530}";

function callAPI(system, messages, maxTokens) {
  try {
    var payload = {
      system: system,
      messages: messages,
      max_tokens: maxTokens || 1500
    };
    return fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function(r) {
      if (!r.ok) {
        return r.text().then(function(t) {
          return { error: "HTTP " + r.status + ": " + t.substring(0, 100) };
        });
      }
      return r.json();
    });
  } catch(e) {
    return Promise.resolve({ error: "Fetch failed: " + e.message });
  }
}

export default function App() {
  var _s = useState("splash"); var screen = _s[0]; var setScreen = _s[1];
  var _sc = useState(null); var scenario = _sc[0]; var setScenario = _sc[1];
  var _pn = useState(""); var pName = _pn[0]; var setPName = _pn[1];
  var _ln = useState(""); var lName = _ln[0]; var setLName = _ln[1];
  var _vn = useState(""); var vName = _vn[0]; var setVName = _vn[1];
  var _en = useState(null); var ending = _en[0]; var setEnding = _en[1];
  var _pg = useState(null); var pGender = _pg[0]; var setPGender = _pg[1];
  var _lg = useState(null); var lGender = _lg[0]; var setLGender = _lg[1];
  var _vg = useState(null); var vGender = _vg[0]; var setVGender = _vg[1];
  var _nm = useState(null); var nMode = _nm[0]; var setNMode = _nm[1];
  var _lm = useState(null); var lMode = _lm[0]; var setLMode = _lm[1];
  var _vm = useState(null); var vMode = _vm[0]; var setVMode = _vm[1];

  var _ct = useState(""); var curText = _ct[0]; var setCurText = _ct[1];
  var _sh = useState(""); var shown = _sh[0]; var setShown = _sh[1];
  var _bu = useState(false); var busy = _bu[0]; var setBusy = _bu[1];
  var _lms = useState(LMSGS[0]); var lmsg = _lms[0]; var setLmsg = _lms[1];

  var _cm = useState([]); var cMsgs = _cm[0]; var setCMsgs = _cm[1];
  var _ct2 = useState("love"); var chatTarget = _ct2[0]; var setChatTarget = _ct2[1];
  var _ci = useState(""); var cIn = _ci[0]; var setCIn = _ci[1];
  var _cb = useState(false); var cBusy = _cb[0]; var setCBusy = _cb[1];
  var _cht = useState([]); var cHist = _cht[0]; var setCHist = _cht[1];
  var _er = useState(""); var err = _er[0]; var setErr = _er[1];

  var sRef = useRef(null);
  var cRef = useRef(null);
  var twRef = useRef(null);

  var sel = SCENARIOS.find(function(s) { return s.id === scenario; });
  var accent = (sel && sel.color) ? sel.color : "#c9a84c";

  useEffect(function() {
    if (!curText) return;
    setShown(curText);
    window.scrollTo(0, 0);
    if (sRef.current) sRef.current.scrollTop = 0;
  }, [curText]);

  useEffect(function() { if (cRef.current) cRef.current.scrollTop = cRef.current.scrollHeight; }, [cMsgs, cBusy]);

  useEffect(function() {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(function() {
    if (!busy) return;
    setLmsg(LMSGS[Math.floor(Math.random() * LMSGS.length)]);
    var iv = setInterval(function() { setLmsg(LMSGS[Math.floor(Math.random() * LMSGS.length)]); }, 2500);
    return function() { clearInterval(iv); };
  }, [busy]);

  function generateStory(scId, p, l, v, endingType, pg, lg, vg) {
    setBusy(true); setErr("");
    var sc = SCENARIOS.find(function(s) { return s.id === scId; });
    var pronounMap = { male: "he/him/his", female: "she/her/her", nonbinary: "they/them/their" };
    var pPro = pronounMap[pg] || "they/them/their";
    var lPro = pronounMap[lg] || "they/them/their";
    var villainLine = "";
    if (v) {
      var vPro = pronounMap[vg] || "they/them/their";
      villainLine = "The villain is " + v + " (pronouns: " + vPro + ") who is menacing, cunning, and a real threat.";
    }
    var setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];
    var opening = OPENINGS[Math.floor(Math.random() * OPENINGS.length)];
    var storyId = Math.floor(Math.random() * 99999);
    var endingInstruction = ENDING_PROMPTS[endingType] || ENDING_PROMPTS.surprise;

    var sys = "You write addictive " + sc.label + " stories in Wattpad and Dreame style. RULES: Main character is " + p + " (pronouns: " + pPro + ") in second person (you). Love interest is " + l + " (pronouns: " + lPro + "). Write a COMPLETE short story with beginning, middle, and ending. 800-1000 words. Start with a creative unique title in bold. Modern casual emotional style, not formal. Short punchy sentences. Heavy dialogue and internal thoughts. Make reader feel butterflies, heartbreak, rage, tension. Make " + l + " irresistible. Include " + (HINTS[scId] || "tension and depth") + ". Be dramatic and addictive. ENDING STYLE: " + endingInstruction + ". Story number " + storyId + " must be unique." + (villainLine ? " " + villainLine : "");

    var uMsg = "Write a complete personalized " + sc.label + " short story. Setting: " + setting + ". The story begins with " + opening + ". Main character: " + p + ". Love interest: " + l + "." + (v ? " Villain: " + v + "." : "") + " Include a powerful beginning, an emotional middle with rising tension, and a memorable ending. Make it unforgettable.";

    var msgs = [{role: "user", content: uMsg}];

    callAPI(sys, msgs, 1500).then(function(d) {
      console.log("API response", d);
      var txt = "";
      if (d.content) { for (var ci = 0; ci < d.content.length; ci++) { txt += (d.content[ci].text || ""); } }
      if (d.error) { setErr("API Error: " + (d.error.message || d.error)); setBusy(false); return; }
      if (!txt) { setErr("No content returned. Check your API key in Vercel settings."); setBusy(false); return; }

      setCurText(txt);
      setScreen("story");
      setCMsgs([]);
      setCHist([
        {role: "user", content: "You are " + l + " from a " + sc.label + " story, texting " + p + " after the story just ended. Stay in character. 1-3 sentences max. Text casually like a real person. DO NOT use asterisks or action text like *smiles* or *leans in*. Just write normal messages like texting. Be flirty, intense, or emotional depending on the mood. Never mention AI."},
        {role: "assistant", content: "I understand."}
      ]);
      setBusy(false);
    }).catch(function(e) {
      setErr("Network error: " + e.message);
      setBusy(false);
    });
  }

  function quickStart(scId) {
    var genders = ["male","female"];
    var rpg = genders[Math.floor(Math.random() * genders.length)];
    var rlg = genders[Math.floor(Math.random() * genders.length)];
    var rvg = genders[Math.floor(Math.random() * genders.length)];
    var a = rName(rpg); var b = rName(rlg); var v = rVillain(rvg);
    while (b === a) b = rName(rlg);
    while (v === a || v === b) v = rVillain(rvg);
    var endings = ["happy","sad","twist","open","dark","surprise"];
    var randEnding = endings[Math.floor(Math.random() * endings.length)];
    setScenario(scId); setPName(a); setLName(b); setVName(v); setEnding(randEnding);
    setPGender(rpg); setLGender(rlg); setVGender(rvg);
    generateStory(scId, a, b, v, randEnding, rpg, rlg, rvg);
  }

  function customStart() {
    generateStory(scenario, pName, lName, vName, ending, pGender, lGender, vGender);
  }

  function doReset() {
    setScreen("scenario"); setScenario(null); setCurText(""); setShown(""); setErr("");
    setNMode(null); setLMode(null); setVMode(null); setEnding(null);
    setPGender(null); setLGender(null); setVGender(null);
    setPName(""); setLName(""); setVName("");
    setCMsgs([]); setCHist([]);
  }

  function sendChat() {
    if (!cIn.trim() || cBusy) return;
    var msg = cIn.trim(); setCIn("");
    var chatName = chatTarget === "villain" ? vName : lName;
    setCMsgs(function(p) { return p.concat([{role: "user", text: msg}]); });
    setCBusy(true);
    var sc = SCENARIOS.find(function(s) { return s.id === scenario; });
    var sys;
    if (chatTarget === "villain") {
      sys = "You are " + vName + ", the villain from a " + sc.label + " story, texting " + pName + ". Rules: Stay in character always. 1-3 sentences max. Text casually like a real person. DO NOT use asterisks or action text like *smiles*. Just write normal text messages. Be menacing, manipulative, darkly charming, or threatening depending on context. NEVER mention being AI.";
    } else {
      sys = "You are " + lName + " from a " + sc.label + " story, texting " + pName + ". Rules: Stay in character always. 1-3 sentences max. Text casually like a real person. DO NOT use asterisks or action text like *smiles*. Just write normal text messages. Be emotionally engaging - flirty, intense, protective, jealous, or vulnerable. Use " + pName + " name sometimes. NEVER mention being AI.";
    }
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

  // SPLASH
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

  // LOADING
  if (busy) return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center"})}>
        <div style={{width: 48, height: 48, borderRadius: "50%", border: "2px solid " + accent + "30", borderTopColor: accent, animation: "spin 1s linear infinite"}} />
        <h2 style={{fontSize: 22, fontWeight: 300, marginTop: 20}}>{lmsg}</h2>
        <div style={{display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center"}}>
          {sel && <span style={pl}>{sel.emoji} {sel.label}</span>}
          {pName && <span style={pl}>{pName}</span>}
          {lName && <span style={pl}>{lName}</span>}
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ERROR
  if (err && screen !== "story" && screen !== "chat") return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center"})}>
        <div style={{fontSize: 48, marginBottom: 16}}>{"\u26A0\uFE0F"}</div>
        <h2 style={{fontSize: 20, fontWeight: 400, marginBottom: 12, color: "#c0392b"}}>{err}</h2>
        <p style={{fontSize: 13, color: "#6b645a", marginBottom: 24, maxWidth: 300, lineHeight: 1.5}}>Make sure your ANTHROPIC_API_KEY is set in Vercel Settings.</p>
        <button style={bt(false)} onClick={function() { setErr(""); setScreen("scenario"); }}>Try Again</button>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // SCENARIO SELECT
  if (screen === "scenario") return (
    <div style={W}><div style={G} />
      <div style={C}>
        <div style={{textAlign: "center", padding: "24px 0 8px"}}><div style={LO}>storyline</div></div>
        <div style={{fontSize: 10, letterSpacing: 4, color: "#3a3530", fontFamily: MONO, marginBottom: 14}}>STEP 1 OF 3</div>
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
            <button style={b2} onClick={function() { quickStart(scenario); }}>Skip - Random Everything</button>
          </div>
        )}
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // NAME SETUP
  if (screen === "nameSetup") return (
    <div style={W}><div style={G} />
      <div style={C}>
        <div style={{textAlign: "center", padding: "24px 0 8px"}}><div style={LO}>storyline</div></div>
        <div style={{fontSize: 10, letterSpacing: 4, color: "#3a3530", fontFamily: MONO, marginBottom: 14}}>STEP 2 OF 3</div>
        <h2 style={{fontSize: 24, fontWeight: 300, marginBottom: 16}}>Create your characters</h2>

        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 12, letterSpacing: 3, color: "#5a544a", fontFamily: MONO, textTransform: "uppercase", marginBottom: 10}}>You (main character)</div>
          <div style={{fontSize: 11, color: "#3a3530", fontFamily: MONO, marginBottom: 6}}>YOUR GENDER</div>
          <div style={{display: "flex", gap: 6, marginBottom: 10}}>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: pGender === "female" ? accent + "20" : "transparent", color: pGender === "female" ? accent : "#6b645a", borderColor: pGender === "female" ? accent : "#1a1a24"})} onClick={function() { setPGender("female"); if (nMode === "random") setPName(rName("female")); }}>Female</button>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: pGender === "male" ? accent + "20" : "transparent", color: pGender === "male" ? accent : "#6b645a", borderColor: pGender === "male" ? accent : "#1a1a24"})} onClick={function() { setPGender("male"); if (nMode === "random") setPName(rName("male")); }}>Male</button>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: pGender === "nonbinary" ? accent + "20" : "transparent", color: pGender === "nonbinary" ? accent : "#6b645a", borderColor: pGender === "nonbinary" ? accent : "#1a1a24"})} onClick={function() { setPGender("nonbinary"); if (nMode === "random") setPName(rName("nonbinary")); }}>Non-binary</button>
          </div>
          {pGender && <div>
            <div style={cd(nMode === "custom", accent)} onClick={function() { setNMode("custom"); setPName(""); }}>
              <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u270D\uFE0F"}</div>
              <div style={{fontSize: 14, fontWeight: 600}}>Type my name</div>
            </div>
            {nMode === "custom" && <input style={Object.assign({}, inp, {marginTop: 8})} placeholder="Your name..." value={pName} onChange={function(e) { setPName(e.target.value); }} autoFocus />}
            <div style={Object.assign({}, cd(nMode === "random", accent), {marginTop: 8})} onClick={function() { setNMode("random"); setPName(rName(pGender)); }}>
              <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u{1F3B2}"}</div>
              <div style={{fontSize: 14, fontWeight: 600}}>Random name</div>
            </div>
            {nMode === "random" && <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 8}}><span style={pl}>{pName}</span><button style={Object.assign({}, b2, {width: "auto", padding: "6px 14px"})} onClick={function() { setPName(rName(pGender)); }}>{"\u{1F3B2}"}</button></div>}
          </div>}
        </div>

        <div style={divider} />

        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 12, letterSpacing: 3, color: "#5a544a", fontFamily: MONO, textTransform: "uppercase", marginBottom: 10}}>Love interest / ally</div>
          <div style={{fontSize: 11, color: "#3a3530", fontFamily: MONO, marginBottom: 6}}>THEIR GENDER</div>
          <div style={{display: "flex", gap: 6, marginBottom: 10}}>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: lGender === "female" ? accent + "20" : "transparent", color: lGender === "female" ? accent : "#6b645a", borderColor: lGender === "female" ? accent : "#1a1a24"})} onClick={function() { setLGender("female"); if (lMode === "random") setLName(rName("female")); }}>Female</button>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: lGender === "male" ? accent + "20" : "transparent", color: lGender === "male" ? accent : "#6b645a", borderColor: lGender === "male" ? accent : "#1a1a24"})} onClick={function() { setLGender("male"); if (lMode === "random") setLName(rName("male")); }}>Male</button>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: lGender === "nonbinary" ? accent + "20" : "transparent", color: lGender === "nonbinary" ? accent : "#6b645a", borderColor: lGender === "nonbinary" ? accent : "#1a1a24"})} onClick={function() { setLGender("nonbinary"); if (lMode === "random") setLName(rName("nonbinary")); }}>Non-binary</button>
          </div>
          {lGender && <div>
            <div style={cd(lMode === "custom", accent)} onClick={function() { setLMode("custom"); setLName(""); }}>
              <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u270D\uFE0F"}</div>
              <div style={{fontSize: 14, fontWeight: 600}}>Type their name</div>
            </div>
            {lMode === "custom" && <input style={Object.assign({}, inp, {marginTop: 8})} placeholder="Love interest name..." value={lName} onChange={function(e) { setLName(e.target.value); }} />}
            <div style={Object.assign({}, cd(lMode === "random", accent), {marginTop: 8})} onClick={function() { setLMode("random"); setLName(rName(lGender)); }}>
              <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u{1F3B2}"}</div>
              <div style={{fontSize: 14, fontWeight: 600}}>Random name</div>
            </div>
            {lMode === "random" && <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 8}}><span style={pl}>{lName}</span><button style={Object.assign({}, b2, {width: "auto", padding: "6px 14px"})} onClick={function() { setLName(rName(lGender)); }}>{"\u{1F3B2}"}</button></div>}
          </div>}
        </div>

        <div style={divider} />

        <div style={{marginBottom: 20}}>
          <div style={{fontSize: 12, letterSpacing: 3, color: "#8b4545", fontFamily: MONO, textTransform: "uppercase", marginBottom: 10}}>Villain (optional)</div>
          <div style={{fontSize: 11, color: "#3a3530", fontFamily: MONO, marginBottom: 6}}>VILLAIN GENDER</div>
          <div style={{display: "flex", gap: 6, marginBottom: 10}}>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: vGender === "female" ? "#c0392b20" : "transparent", color: vGender === "female" ? "#c0392b" : "#6b645a", borderColor: vGender === "female" ? "#c0392b" : "#1a1a24"})} onClick={function() { setVGender("female"); if (vMode === "random") setVName(rVillain("female")); }}>Female</button>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: vGender === "male" ? "#c0392b20" : "transparent", color: vGender === "male" ? "#c0392b" : "#6b645a", borderColor: vGender === "male" ? "#c0392b" : "#1a1a24"})} onClick={function() { setVGender("male"); if (vMode === "random") setVName(rVillain("male")); }}>Male</button>
            <button style={Object.assign({}, b2, {flex: 1, padding: "10px", background: vGender === "nonbinary" ? "#c0392b20" : "transparent", color: vGender === "nonbinary" ? "#c0392b" : "#6b645a", borderColor: vGender === "nonbinary" ? "#c0392b" : "#1a1a24"})} onClick={function() { setVGender("nonbinary"); if (vMode === "random") setVName(rVillain("nonbinary")); }}>Non-binary</button>
          </div>
          {vGender && <div>
            <div style={cd(vMode === "custom", "#c0392b")} onClick={function() { setVMode("custom"); setVName(""); }}>
              <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u270D\uFE0F"}</div>
              <div style={{fontSize: 14, fontWeight: 600}}>Type villain name</div>
            </div>
            {vMode === "custom" && <input style={Object.assign({}, inp, {marginTop: 8})} placeholder="Villain name..." value={vName} onChange={function(e) { setVName(e.target.value); }} />}
            <div style={Object.assign({}, cd(vMode === "random", "#c0392b"), {marginTop: 8})} onClick={function() { setVMode("random"); setVName(rVillain(vGender)); }}>
              <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u{1F3B2}"}</div>
              <div style={{fontSize: 14, fontWeight: 600}}>Random villain</div>
            </div>
            {vMode === "random" && <div style={{display: "flex", alignItems: "center", gap: 8, marginTop: 8}}><span style={Object.assign({}, pl, {background: "#c0392b18", color: "#c0392b"})}>{vName}</span><button style={Object.assign({}, b2, {width: "auto", padding: "6px 14px"})} onClick={function() { setVName(rVillain(vGender)); }}>{"\u{1F3B2}"}</button></div>}
          </div>}
          <div style={Object.assign({}, cd(vMode === "skip", "#636e72"), {marginTop: 8})} onClick={function() { setVMode("skip"); setVName(""); setVGender(null); }}>
            <div style={{fontSize: 20, width: 32, textAlign: "center"}}>{"\u2796"}</div>
            <div style={{fontSize: 14, fontWeight: 600, color: "#636e72"}}>No villain</div>
          </div>
        </div>

        <div style={{display: "flex", gap: 10, marginTop: 16}}>
          <button style={Object.assign({}, b2, {flex: 1})} onClick={function() { setScreen("scenario"); }}>Back</button>
          <button style={Object.assign({}, bt(!pName || !lName || !pGender || !lGender), {flex: 2})} onClick={function() { if (pName && lName && pGender && lGender) setScreen("endingSelect"); }} disabled={!pName || !lName || !pGender || !lGender}>Choose Ending</button>
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // ENDING SELECT
  if (screen === "endingSelect") return (
    <div style={W}><div style={G} />
      <div style={C}>
        <div style={{textAlign: "center", padding: "24px 0 8px"}}><div style={LO}>storyline</div></div>
        <div style={{fontSize: 10, letterSpacing: 4, color: "#3a3530", fontFamily: MONO, marginBottom: 14}}>STEP 3 OF 3</div>
        <h2 style={{fontSize: 24, fontWeight: 300, marginBottom: 6}}>How should it end?</h2>
        <p style={{fontSize: 13, color: "#5a544a", marginBottom: 16, fontStyle: "italic"}}>Choose your destiny before the story begins.</p>

        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
          {ENDINGS.map(function(e) { return (
            <div key={e.id} style={cd(ending === e.id, e.color)} onClick={function() { setEnding(e.id); }}>
              <div style={{fontSize: 28, width: 44, textAlign: "center", flexShrink: 0}}>{e.emoji}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 16, fontWeight: 600, color: ending === e.id ? e.color : "#e8e0d4"}}>{e.label}</div>
                <div style={{fontSize: 12, color: "#5a544a", marginTop: 2, lineHeight: 1.4}}>{e.desc}</div>
              </div>
            </div>
          ); })}
        </div>

        {ending && (
          <div style={{marginTop: 20, display: "flex", flexDirection: "column", gap: 8}}>
            <button style={bt(false)} onClick={customStart}>Write My Story</button>
          </div>
        )}
        <button style={Object.assign({}, b2, {marginTop: 8})} onClick={function() { setScreen("nameSetup"); }}>Back</button>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // STORY
  if (screen === "story") return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {paddingBottom: 120})}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
          <div style={LO}>storyline</div>
          <button style={{background: "none", border: "none", color: "#3a3530", fontSize: 11, cursor: "pointer", fontFamily: MONO, letterSpacing: 2}} onClick={doReset}>NEW STORY</button>
        </div>
        <div style={{display: "flex", gap: 0, background: "#0d0d12", borderRadius: 14, overflow: "hidden", border: "1px solid #1a1a24", marginBottom: 16}}>
          <button style={nb(true)}>STORY</button>
          <button style={nb(false)} onClick={function() { setScreen("chat"); }}>CHAT WITH {lName.toUpperCase()}</button>
        </div>
        <div style={{display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap"}}>
          {sel && <span style={pl}>{sel.emoji} {sel.label}</span>}
          <span style={pl}>{pName}</span>
          {ending && <span style={Object.assign({}, pl, {background: (ENDINGS.find(function(e){return e.id===ending;})||{}).color + "18", color: (ENDINGS.find(function(e){return e.id===ending;})||{}).color})}>{(ENDINGS.find(function(e){return e.id===ending;})||{}).emoji} {(ENDINGS.find(function(e){return e.id===ending;})||{}).label}</span>}
        </div>
        <div ref={sRef} style={{maxHeight: "60vh", overflowY: "auto", padding: "20px", background: "#09090f", borderRadius: 16, border: "1px solid #141420", lineHeight: 1.9, fontSize: 15.5, whiteSpace: "pre-wrap"}}>
          {fmt(shown)}
        </div>
        {err && <p style={{color: "#c0392b", marginTop: 10, fontSize: 13, textAlign: "center"}}>{err}</p>}
        <div style={{position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px 28px", background: "linear-gradient(transparent,#07070b 30%)", zIndex: 10}}>
          <div style={{maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8}}>
            <button style={bt(false)} onClick={function() { setChatTarget("love"); setCMsgs([]); setCHist([{role: "user", content: "You are " + lName + " from a " + (sel && sel.label) + " story, texting " + pName + ". Stay in character. 1-3 sentences. Text casually. NO asterisks or action text. Never mention AI."}, {role: "assistant", content: "I understand."}]); setScreen("chat"); }}>{lName} wants to talk to you...</button>
            {vName && <button style={Object.assign({}, b2, {borderColor: "#c0392b40", color: "#c0392b"})} onClick={function() { setChatTarget("villain"); setCMsgs([]); setCHist([{role: "user", content: "You are " + vName + ", the villain from a " + (sel && sel.label) + " story, texting " + pName + ". Stay in character. Be menacing, manipulative, or darkly charming. 1-3 sentences. Text casually. NO asterisks or action text. Never mention AI."}, {role: "assistant", content: "I understand."}]); setScreen("chat"); }}>{vName} sent you a message...</button>}
            <button style={b2} onClick={doReset}>New Story</button>
          </div>
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  // CHAT
  var chatName = chatTarget === "villain" ? vName : lName;
  var chatColor = chatTarget === "villain" ? "#c0392b" : accent;
  var chatTitle = chatTarget === "villain" ? "VILLAIN" : (TITLES_MAP[scenario] || "UNKNOWN");

  if (screen === "chat") return (
    <div style={W}><div style={G} />
      <div style={Object.assign({}, C, {display: "flex", flexDirection: "column", height: "100vh", paddingBottom: 0})}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexShrink: 0}}>
          <div style={LO}>storyline</div>
        </div>
        <div style={{display: "flex", gap: 0, background: "#0d0d12", borderRadius: 14, overflow: "hidden", border: "1px solid #1a1a24", marginBottom: 12, flexShrink: 0}}>
          <button style={nb(false)} onClick={function() { setScreen("story"); }}>STORY</button>
          <button style={nb(true)}>CHAT WITH {chatName.toUpperCase()}</button>
        </div>
        <div style={{textAlign: "center", padding: "12px 0", flexShrink: 0}}>
          <div style={{width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg," + chatColor + "40," + chatColor + "15)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "2px solid " + chatColor + "30"}}>{chatTarget === "villain" ? "\u{1F480}" : (sel && sel.emoji)}</div>
          <div style={{fontSize: 18, fontWeight: 600, color: chatColor}}>{chatName}</div>
          <div style={{fontSize: 11, color: "#3a3530", fontFamily: MONO, letterSpacing: 2, marginTop: 2}}>{chatTitle}</div>
        </div>
        <div ref={cRef} style={{flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "8px 0"}}>
          {cMsgs.length === 0 && <div style={{textAlign: "center", padding: "40px 20px", color: "#3a3530", fontStyle: "italic", fontSize: 13}}>Say something to {chatName}...<br />They are waiting.</div>}
          {cMsgs.map(function(m, i) { return (
            <div key={i} style={m.role === "user" ? {alignSelf: "flex-end", background: chatColor + "20", color: "#e8e0d4", padding: "10px 16px", borderRadius: "16px 16px 4px 16px", maxWidth: "80%", fontSize: 14, lineHeight: 1.5} : {alignSelf: "flex-start", background: "#141420", color: "#e8e0d4", padding: "10px 16px", borderRadius: "16px 16px 16px 4px", maxWidth: "80%", fontSize: 14, lineHeight: 1.5}}>
              {m.role === "li" && <div style={{fontSize: 10, color: chatColor, fontFamily: MONO, letterSpacing: 2, marginBottom: 4}}>{chatName.toUpperCase()}</div>}
              {m.text}
            </div>
          ); })}
          {cBusy && <div style={{alignSelf: "flex-start", background: "#141420", padding: "10px 16px", borderRadius: "16px 16px 16px 4px", maxWidth: "80%", fontSize: 14}}>
            <div style={{fontSize: 10, color: chatColor, fontFamily: MONO, letterSpacing: 2, marginBottom: 4}}>{chatName.toUpperCase()}</div>
            <span style={{animation: "pulse 1.2s ease-in-out infinite", color: "#e8e0d4"}}>typing...</span>
          </div>}
        </div>
        <div style={{display: "flex", gap: 10, padding: "12px 0 16px", flexShrink: 0, alignItems: "center"}}>
          <input style={{flex: 1, padding: "12px 16px", borderRadius: 24, border: "1px solid #222230", background: "#0d0d14", color: "#e8e0d4", fontSize: 14, fontFamily: FONT, outline: "none"}} placeholder={"Message " + chatName + "..."} value={cIn} onChange={function(e) { setCIn(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") sendChat(); }} />
          <button onClick={sendChat} style={{width: 44, height: 44, borderRadius: "50%", border: "none", background: accent, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>{"\u2192"}</button>
        </div>
        <div style={{flexShrink: 0, paddingBottom: 12, display: "flex", gap: 8}}>
          <button style={Object.assign({}, b2, {flex: 1})} onClick={function() { setScreen("story"); }}>Back to Story</button>
          <button style={Object.assign({}, b2, {flex: 1})} onClick={doReset}>New Story</button>
        </div>
      </div>
      <style>{CSS_TEXT}</style>
    </div>
  );

  return null;
}

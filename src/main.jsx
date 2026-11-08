import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Volume2, VolumeX, Share2, Sparkles, PartyPopper, Flame } from "lucide-react";
import "./style.css";

const jokes = [
  { tag: "REACTION MEME", title: "Jab mummy bole: ‘Patakhe mat jalana’", punch: "Aur andar se dimaag bole: BASS… EK PHULJHADI TOH BANTI HAI! 😂", emoji: "😳" },
  { tag: "BHOJPURI COMEDY ENERGY", title: "Diwali ka budget: ₹500", punch: "Expectation: poora mahal roshan. Reality: ek packet lights aur do samose. 😭", emoji: "🤣" },
  { tag: "SAVAGE MODE", title: "Is Diwali toxic logon ko bhi mithai bhejo…", punch: "…par dabbe mein sirf karela rakhna. Personal growth, samjhe? 💀", emoji: "😈" }
];

function App() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(new URLSearchParams(location.search).get("to") || "");
  const [musicOn, setMusicOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [jokeIndex, setJokeIndex] = useState(0);
  const audioRef = useRef(null);
  const recipient = name.trim() || "Dost";
  const currentUrl = useMemo(() => {
    const url = new URL(location.href);
    if (name.trim()) url.searchParams.set("to", name.trim());
    else url.searchParams.delete("to");
    return url.toString();
  }, [name]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("to")) setName(params.get("to"));
  }, []);

  function audioContext() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioRef.current) audioRef.current = new Ctx();
    if (audioRef.current.state === "suspended") audioRef.current.resume();
    return audioRef.current;
  }

  function tone(freq, duration = 0.16, type = "sine", volume = 0.08, delay = 0) {
    if (!soundOn) return;
    const ctx = audioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + duration + 0.03);
  }

  function funnySound() {
    tone(520, .12, "square", .045); tone(780, .13, "square", .04, .12); tone(1040, .2, "triangle", .05, .25);
  }
  function sparkleSound() {
    [660, 880, 990, 1320].forEach((f, i) => tone(f, .32, "sine", .045, i * .11));
  }

  useEffect(() => {
    if (!musicOn) return;
    const ctx = audioContext();
    if (!ctx) return;
    const notes = [523, 659, 784, 659, 587, 698, 880, 698];
    let i = 0;
    const play = () => {
      if (!audioRef.current || audioRef.current.state !== "running") return;
      const f = notes[i % notes.length];
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine"; osc.frequency.value = f;
      gain.gain.setValueAtTime(.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.025, ctx.currentTime + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .28);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + .3); i++;
    };
    play();
    const id = window.setInterval(play, 360);
    return () => window.clearInterval(id);
  }, [musicOn]);

  function next() {
    funnySound();
    setStep(s => Math.min(s + 1, 3));
    if (step === 2) sparkleSound();
  }
  function share() {
    const message = `🪔 ${recipient}, tere liye ek Diwali surprise hai! 😂✨ Open this: ${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }
  function copyLink() {
    navigator.clipboard?.writeText(currentUrl).then(() => alert("Surprise link copied! Ab WhatsApp pe bhej do 😎")).catch(() => share());
  }

  return <main className="app">
    <div className="stars" aria-hidden="true">{Array.from({length: 34}, (_, i) => <i key={i} style={{left:`${(i*37)%100}%`, top:`${(i*61)%100}%`, animationDelay:`${(i%7)*.4}s`}} />)}</div>
    <header className="topbar"><div className="brand"><span className="brand-icon">🪔</span> DIWALI <b>DHAMAKA</b></div><div className="audio-controls">
      <button className={musicOn ? "sound active" : "sound"} onClick={() => { audioContext(); setMusicOn(v => !v); }} title="Toggle festive tune">{musicOn ? <Volume2 size={17}/> : <VolumeX size={17}/>} <span>Music</span></button>
      <button className={soundOn ? "sound active" : "sound"} onClick={() => setSoundOn(v => !v)} title="Toggle funny effects"><Sparkles size={17}/><span>FX</span></button>
    </div></header>

    <section className="hero">
      <div className="eyebrow"><span className="pulse"/> SPECIAL DELIVERY FROM DIWALI HQ</div>
      {step === 0 && <div className="panel intro">
        <div className="diyas"><span>🪔</span><span>✨</span><span>🪔</span></div>
        <p className="kicker">EK MINUTE… SCROLL MAT KARNA!</p>
        <h1>Oye <em>{recipient}</em>,<br/>tere liye kuch<br/><span className="gold">special hai.</span></h1>
        <p className="sub">Is message ko kholne se pehle apni hasi control kar lena. Guarantee nahi hai. 😂</p>
        <div className="name-field"><label>Surprise kisko bhejna hai?</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Naam likho (optional)" maxLength={32}/></div>
        <button className="primary" onClick={next}>Surprise kholo <span>→</span></button>
        <div className="tiny">WARNING: Overacting aur hasi dono ho sakti hai.</div>
      </div>}

      {step === 1 && <div className="panel suspense">
        <div className="warning">⚠️ CONFIDENTIAL DIWALI NOTICE ⚠️</div>
        <div className="big-emoji">🤨</div>
        <h2>Ruko zara…<br/><span className="gold">sabar karo!</span></h2>
        <p>Itni jaldi kya hai bhai? Pehle apni shakal pe smile lao. Diwali hai, income-tax raid nahi. 😭</p>
        <div className="stamp">100% DESI<br/>DRAMA</div>
        <button className="primary" onClick={next}>Theek hai, aage dikhao 😂 <span>→</span></button>
      </div>}

      {step === 2 && <div className="panel meme-panel">
        <div className="warning">😂 MEME BREAK — {jokes[jokeIndex].tag}</div>
        <div className="meme-face">{jokes[jokeIndex].emoji}</div>
        <h2>{jokes[jokeIndex].title}</h2>
        <p className="punchline">{jokes[jokeIndex].punch}</p>
        <div className="meme-actions"><button className="secondary" onClick={()=>{setJokeIndex(i=>(i+1)%jokes.length);funnySound();}}>Next meme ↻</button><button className="primary" onClick={next}>Ab asli wish dikhao <span>→</span></button></div>
        <p className="tiny">Ravi Kishan-style full desi comedy energy — original meme captions, no copied movie clips.</p>
      </div>}

      {step === 3 && <div className="panel finale">
        <div className="fireworks">🎆 ✨ 🎇</div>
        <div className="eyebrow">MISSION COMPLETE • KHUSHI DELIVERED</div>
        <h1>Happy Diwali,<br/><em>{recipient}!</em></h1>
        <p className="wish">Teri life mein itni khushiyan aayein jitne Diwali pe WhatsApp forwards aate hain. Paisa itna aaye ki UPI PIN yaad rakhna pade… aur problems aise gayab ho jaayein jaise party ke baad mithai ka dabba! 😂</p>
        <div className="blessing">🪔 Khush raho • Safe raho • Mithai share karo 🪔</div>
        <button className="primary share-btn" onClick={share}><Share2 size={19}/> WhatsApp pe surprise bhejo</button>
        <button className="secondary copy-btn" onClick={copyLink}>🔗 Copy personalized link</button>
        <button className="restart" onClick={()=>{setStep(0);setJokeIndex(0);}}>↻ Replay surprise</button>
      </div>}
      <div className="progress"><span style={{width:`${(step+1)*25}%`}}/></div>
    </section>

    <footer><span>MADE WITH ❤️, THODA DRAMA & LOTS OF DIYAS</span><span>© DIWALI DHAMAKA</span></footer>
    {step === 3 && <div className="confetti" aria-hidden="true">{Array.from({length:45},(_,i)=><b key={i} style={{left:`${(i*19)%100}%`,animationDelay:`${(i%12)*.22}s`,transform:`rotate(${i*37}deg)`}}/>)}</div>}
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
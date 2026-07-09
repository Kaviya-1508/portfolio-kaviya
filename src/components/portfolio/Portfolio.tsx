import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as RM } from "react";
import { PROJECTS, SKILLS, ACHIEVEMENTS, type SkillCategory } from "./data";
import { addRipple, useReveal } from "./hooks";
import { useIsMobile } from "../../hooks/use-mobile";

/* ====================================================================== */
/* CURSOR                                                                  */
/* ====================================================================== */
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = -100, my = -100, rx = -100, ry = -100;
    let raf = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const click = () => {
      [dot, ring].forEach((r) => {
        if (!r.current) return;
        r.current.style.transform += " scale(0.7)";
        setTimeout(() => {
          if (r.current) r.current.style.transition = "transform 0.25s cubic-bezier(0.2,0.8,0.2,1)";
        }, 0);
      });
    };
    const enter = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("a,button,[data-cursor='hover']")) {
        dot.current?.style.setProperty("--s", "1.5");
        ring.current?.style.setProperty("--s", "1.5");
        ring.current?.style.setProperty("--bg", "rgba(0,245,255,0.08)");
      } else {
        dot.current?.style.setProperty("--s", "1");
        ring.current?.style.setProperty("--s", "1");
        ring.current?.style.setProperty("--bg", "rgba(0,245,255,0.05)");
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${mx - 6}px, ${my - 6}px) scale(var(--s,1))`;
      if (ring.current) ring.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(var(--s,1))`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", enter);
    window.addEventListener("mousedown", click);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
      window.removeEventListener("mousedown", click);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" style={{
        position: "fixed", left: 0, top: 0, width: 12, height: 12, borderRadius: "50%",
        border: "2px solid #00f5ff", pointerEvents: "none", zIndex: 9999, mixBlendMode: "screen",
      }} />
      <div ref={ring} className="cursor-ring" style={{
        position: "fixed", left: 0, top: 0, width: 40, height: 40, borderRadius: "50%",
        background: "var(--bg, rgba(0,245,255,0.05))",
        border: "1px solid rgba(0,245,255,0.3)", pointerEvents: "none", zIndex: 9998,
        transition: "background 0.2s",
      }} />
    </>
  );
}

/* ====================================================================== */
/* LOADER                                                                  */
/* ====================================================================== */
function Loader() {
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);
  const [step, setStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 900);
    const t3 = setTimeout(() => setStep(3), 1400);
    const tFade = setTimeout(() => setFading(true), 1800);
    const tDone = setTimeout(() => setDone(true), 2300);
    return () => [t1, t2, t3, tFade, tDone].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let cols = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    };
    resize();

    const chars = "01010101001101010011アイウエオカキクケコ01100101";

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(5, 6, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'Fira Code', monospace`;
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00f5ff";
          ctx.shadowBlur = 8;
        } else {
          const bright = Math.random() > 0.5;
          ctx.fillStyle = bright ? "#00ff88" : "#005533";
          ctx.shadowColor = bright ? "#00ff88" : "transparent";
          ctx.shadowBlur = bright ? 4 : 0;
        }
        ctx.fillText(char, x, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const matrixInterval = setInterval(drawMatrix, 33);
    window.addEventListener("resize", resize);
    return () => {
      clearInterval(matrixInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (done) return null;
  const lines = [
    "> INITIALIZING...",
    "> Loading portfolio assets...",
    "> Establishing secure connection...",
    "> Access granted. Welcome. ✓",
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000, background: "#05060a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transition: "opacity 0.5s", opacity: fading ? 0 : 1,
    }}>
      <canvas
        ref={canvasRef}
        id="matrix-canvas"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
      />
      <div style={{
        position: "relative", zIndex: 10,
        background: "rgba(5,6,10,0.75)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(0,245,255,0.2)", borderRadius: 12,
        padding: "32px 40px", textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div className="font-code" style={{ color: "#00f5ff", fontSize: 12, letterSpacing: "0.2em", marginBottom: 16 }}>
          INITIALIZING...
        </div>
        <div style={{ width: 200, height: 2, background: "#1a1d26", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", background: "linear-gradient(90deg,#00f5ff,#00ff88)",
            width: `${((step) / 3) * 100}%`, transition: "width 0.45s ease",
          }} />
        </div>
        <div className="font-code" style={{ marginTop: 24, color: "#8892a4", fontSize: 12, minHeight: 80, textAlign: "left" }}>
          {lines.slice(0, step + 1).map((l, i) => (
            <div key={i} style={{ color: i === 3 && step >= 3 ? "#00ff88" : i === 0 ? "#00f5ff" : "#8892a4" }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
/* SCROLL PROGRESS                                                         */
/* ====================================================================== */
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setW(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, pointerEvents: "none" }}>
      <div style={{
        height: "100%", width: `${w}%`,
        background: "linear-gradient(90deg,#00f5ff,#00ff88,#7c3aed)",
        boxShadow: "4px 0 12px rgba(255,255,255,0.8)",
        transition: "width 0.1s linear",
      }} />
    </div>
  );
}

/* ====================================================================== */
/* NAV                                                                     */
/* ====================================================================== */
const NAV_ITEMS = ["about", "skills", "projects", "resume", "platforms", "education", "achievements", "contact"];
function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");
  useEffect(() => {
    const onScroll = () => {
      for (const id of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 120 && r.bottom > 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 64, zIndex: 90,
      background: "rgba(5,6,10,0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,245,255,0.1)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px",
    }}>
      <a href="#top" className="font-mono" style={{
        fontSize: 20, color: "#00f5ff", textShadow: "0 0 20px #00f5ff",
        textDecoration: "none", display: "flex", alignItems: "center", gap: 2,
      }}>
        KA.<span style={{ animation: "blink 1s steps(2) infinite" }}>█</span>
      </a>

      <nav className="hidden md:flex font-mono" style={{ gap: 28, fontSize: 13 }}>
        {NAV_ITEMS.map((n) => (
          <a key={n} href={`#${n}`} style={{
            position: "relative", textDecoration: "none",
            color: active === n ? "#00f5ff" : "#8892a4",
            transition: "color 0.2s",
          }} onMouseEnter={(e) => (e.currentTarget.style.color = "#00f5ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = active === n ? "#00f5ff" : "#8892a4")}>
            {n.charAt(0).toUpperCase() + n.slice(1)}
            {active === n && <span style={{
              position: "absolute", left: 0, right: 0, bottom: -6, height: 1,
              background: "#00f5ff", boxShadow: "0 0 8px #00f5ff",
            }} />}
          </a>
        ))}
      </nav>

      <div className="hidden md:flex items-center" style={{ gap: 8 }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%", background: "#00ff88",
          boxShadow: "0 0 10px #00ff88", animation: "glow-pulse 2s ease-in-out infinite",
        }} />
        <span className="font-code" style={{ color: "#00ff88", fontSize: 11, letterSpacing: "0.15em" }}>ONLINE</span>
      </div>

      <button className="md:hidden" onClick={() => setOpen(!open)}
        aria-label="Menu"
        style={{ display: "flex", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 8 }}>
        <span style={{ width: 20, height: 2, background: "#00f5ff", transition: "all 0.3s", transform: open ? "rotate(45deg) translate(4px,4px)" : "" }} />
        <span style={{ width: 20, height: 2, background: "#00f5ff", transition: "all 0.3s", opacity: open ? 0 : 1 }} />
        <span style={{ width: 20, height: 2, background: "#00f5ff", transition: "all 0.3s", transform: open ? "rotate(-45deg) translate(4px,-4px)" : "" }} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{
            position: "fixed", inset: 0, top: 64, background: "rgba(0,0,0,0.5)", zIndex: 80,
          }} />
          <div style={{
            position: "fixed", top: 64, right: 0, bottom: 0, width: 280, zIndex: 81,
            background: "rgba(5,6,10,0.97)", borderLeft: "1px solid rgba(0,245,255,0.2)",
            backdropFilter: "blur(20px)", padding: "16px 0",
          }}>
            {NAV_ITEMS.map((n) => (
              <a key={n} href={`#${n}`} onClick={() => setOpen(false)}
                className="font-mono"
                style={{
                  display: "flex", alignItems: "center", gap: 12, height: 48, padding: "0 24px",
                  color: "#e2e8f0", textDecoration: "none", fontSize: 14,
                }}>
                <span style={{ color: "#00f5ff" }}>{">"}</span>
                {n.charAt(0).toUpperCase() + n.slice(1)}
              </a>
            ))}
          </div>
        </>
      )}
    </header>
  );
}

/* ====================================================================== */
/* PARTICLES                                                               */
/* ====================================================================== */
function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 40 : 80;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const p = canvas.parentElement!;
      canvas.width = p.clientWidth * dpr;
      canvas.height = p.clientHeight * dpr;
      canvas.style.width = p.clientWidth + "px";
      canvas.style.height = p.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const W = () => canvas.width / dpr;
    const H = () => canvas.height / dpr;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      vx: (Math.random() - 0.5), vy: (Math.random() - 0.5),
    }));
    let mx = -1000, my = -1000;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMove);
    let raf = 0;
    let running = true;
    const obs = new IntersectionObserver(([e]) => { running = e.isIntersecting; });
    obs.observe(canvas);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      ctx.clearRect(0, 0, W(), H());
      for (const p of particles) {
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.hypot(dx, dy);
        if (d < 150 && d > 0) {
          const f = (1 - d / 150) * 0.5;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 4) { p.vx = (p.vx / sp) * 4; p.vy = (p.vy / sp) * 4; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;
        p.x = Math.max(0, Math.min(W(), p.x));
        p.y = Math.max(0, Math.min(H(), p.y));
        ctx.fillStyle = "rgba(0,245,255,0.8)";
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(0,245,255,${(1 - d / 120) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      obs.disconnect();
    };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

/* ====================================================================== */
/* MAGNETIC + RIPPLE BUTTON                                                */
/* ====================================================================== */
function MagButton({
  children, style, onClick, href, target,
}: {
  children: React.ReactNode; style?: CSSProperties; onClick?: (e: RM<HTMLElement>) => void;
  href?: string; target?: string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      if (Math.hypot(dx, dy) > 80) return;
      el.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
      if (textRef.current) textRef.current.style.transform = `translate(${-dx * 0.15}px, ${-dy * 0.15}px)`;
    };
    const leave = () => {
      el.style.transform = "";
      if (textRef.current) textRef.current.style.transform = "";
    };
    (el as HTMLElement).addEventListener("mousemove", move as EventListener);
    (el as HTMLElement).addEventListener("mouseleave", leave as EventListener);
    return () => {
      (el as HTMLElement).removeEventListener("mousemove", move as EventListener);
      (el as HTMLElement).removeEventListener("mouseleave", leave as EventListener);
    };
  }, []);
  const handle = (e: RM<HTMLElement>) => { addRipple(e); onClick?.(e); };
  const baseStyle: CSSProperties = {
    position: "relative", overflow: "hidden", display: "inline-flex", alignItems: "center",
    justifyContent: "center", height: 48, padding: "0 24px", borderRadius: 12,
    fontFamily: '"JetBrains Mono", monospace', fontSize: 14, cursor: "pointer",
    transition: "transform 0.4s cubic-bezier(0.2,0.8,0.2,1), background 0.2s, box-shadow 0.2s, border-color 0.2s",
    textDecoration: "none", ...style,
  };
  if (href) return (
    <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} target={target} rel="noreferrer"
      onClick={handle} style={baseStyle}>
      <span ref={textRef} style={{ display: "inline-flex", alignItems: "center", gap: 6, transition: "transform 0.4s cubic-bezier(0.2,0.8,0.2,1)" }}>
        {children}
      </span>
    </a>
  );
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} onClick={handle} style={baseStyle}>
      <span ref={textRef} style={{ display: "inline-flex", alignItems: "center", gap: 6, transition: "transform 0.4s cubic-bezier(0.2,0.8,0.2,1)" }}>
        {children}
      </span>
    </button>
  );
}

/* ====================================================================== */
/* HERO                                                                    */
/* ====================================================================== */
const ROLES = [
  "CSE Undergraduate 🎓",
  "Cybersecurity Enthusiast 🔐",
  "Game Developer 🎮",
  "CTF Player 🚩",
  "Web Developer 💻",
  "Database Nerd 🗄️",
];
const ORBIT_LABELS = ["Python", "Java", "React", "Flutter", "SQL"];

function Hero() {
  const [text, setText] = useState("");
  const [ri, setRi] = useState(0);
  const [del, setDel] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const role = ROLES[ri];
    if (!del && text === role) {
      const t = setTimeout(() => setDel(true), 1400);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false); setRi((ri + 1) % ROLES.length); return;
    }
    const t = setTimeout(() => {
      setText(del ? role.slice(0, text.length - 1) : role.slice(0, text.length + 1));
    }, del ? 40 : 70);
    return () => clearTimeout(t);
  }, [text, ri, del]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 20;
      const ny = (e.clientY / window.innerHeight - 0.5) * 20;
      tx = nx; ty = ny;
    };
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      if (textBlockRef.current) textBlockRef.current.style.transform = `translate(${cx * 0.3}px, ${cy * 0.3}px)`;
      if (glowRef.current) glowRef.current.style.transform = `translate(${-cx * 0.1}px, ${-cy * 0.1}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={heroRef} id="top" style={{
      position: "relative", minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", overflow: "hidden", paddingTop: 64,
    }}>
      <ParticleField />

      <div ref={glowRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "30%", left: "25%", width: 400, height: 400,
          background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)",
          opacity: 0.12, animation: "glow-pulse 4s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "20%", width: 400, height: 400,
          background: "radial-gradient(circle, #00ff88 0%, transparent 70%)",
          opacity: 0.1, animation: "glow-pulse 4s ease-in-out infinite reverse",
        }} />
      </div>

      {/* Orbit labels */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ position: "relative", width: 0, height: 0 }}>
          {ORBIT_LABELS.map((l, i) => (
            <span key={l} className="font-code" style={{
              position: "absolute", left: 0, top: 0,
              color: "rgba(0,245,255,0.15)", fontSize: 12, whiteSpace: "nowrap",
              animation: `orbit ${20 + i * 5}s linear infinite`,
              animationDelay: `-${i * 4}s`,
            }}>{l}</span>
          ))}
        </div>
      </div>

      <div ref={textBlockRef} style={{ position: "relative", zIndex: 2, textAlign: "center", padding: 24, maxWidth: 900 }}>
        <h1 className="font-mono" style={{
          fontSize: "clamp(48px, 9vw, 80px)", fontWeight: 800, color: "white", margin: 0,
          textShadow: "0 0 30px rgba(0,245,255,0.5)", letterSpacing: "-0.02em",
        }}>
          {"Kaviya A".split("").map((ch, i) => (
            <span key={i} style={{
              display: "inline-block", whiteSpace: "pre",
              opacity: 0, animation: `reveal 0.6s cubic-bezier(0.2,0.8,0.2,1) ${1.9 + i * 0.07}s forwards, glitch 6s ${4 + i * 0.3}s infinite`,
            }}>{ch}</span>
          ))}
        </h1>

        <div className="font-code" style={{
          marginTop: 24, fontSize: 24, color: "#00ff88",
          textShadow: "0 0 15px rgba(0,255,136,0.6)", minHeight: 36,
        }}>
          {text}
          <span style={{
            display: "inline-block", width: 2, height: 20, marginLeft: 2, verticalAlign: "middle",
            background: "#00ff88", animation: "blink 1s steps(2) infinite",
          }} />
        </div>

        <p className="font-sans" style={{
          marginTop: 16, color: "rgba(255,255,255,0.6)", fontSize: 18,
          maxWidth: 500, marginLeft: "auto", marginRight: "auto",
        }}>
          Building secure systems, one line of code at a time.
        </p>

        <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          <MagButton href="#projects" style={{
            border: "1px solid #00f5ff", background: "transparent", color: "#00f5ff",
          }} onClick={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.1)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(0,245,255,0.4)";
          }}>[ View My Projects ]</MagButton>

          <MagButton href="https://drive.google.com/file/d/1CKaCLH46O9YWX6qK4zcttmZKdIbW21fW/view?usp=drivesdk"
            target="_blank" style={{
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.04)", color: "#e2e8f0",
            }}>[ Download Resume ↓ ]</MagButton>

          <MagButton href="#contact" style={{
            background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
            border: "none", color: "white",
          }}>[ Contact Me ]</MagButton>
        </div>
      </div>

      <a href="#about" style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        color: "#00f5ff", textDecoration: "none", animation: "bounce-down 2s ease-in-out infinite",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  );
}

/* ====================================================================== */
/* MATRIX RAIN                                                             */
/* ====================================================================== */
function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => {
      const p = canvas.parentElement!;
      canvas.width = p.clientWidth;
      canvas.height = p.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZあア".split("");
    const fs = 14;
    let cols = Math.floor(canvas.width / 16);
    let drops = Array(cols).fill(1).map(() => Math.random() * canvas.height);
    let raf = 0, running = true;
    const obs = new IntersectionObserver(([e]) => { running = e.isIntersecting; });
    obs.observe(canvas);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      ctx.fillStyle = "rgba(5,6,10,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,255,136,0.4)";
      ctx.font = `${fs}px "Fira Code", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * 16, drops[i]);
        if (drops[i] > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += fs;
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); obs.disconnect(); };
  }, []);
  return <canvas ref={ref} style={{
    position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none", zIndex: 0,
  }} />;
}

/* ====================================================================== */
/* TERMINAL                                                                */
/* ====================================================================== */
type TermLine = { type: "prompt" | "out" | "json"; text?: string; json?: object };
const TERMINAL_BLOCKS: TermLine[][] = [
  [
    { type: "prompt", text: "┌──(kaviya㉿portfolio)-[~]\n└─$ whoami" },
    { type: "out", text: "> Kaviya A\n> CSE Undergraduate | Builder & Breaker 🔐" },
  ],
  [
    { type: "prompt", text: "└─$ cat about.txt" },
    { type: "out", text: '> "I write code by day,\n>  break systems (ethically) by night,\n>  and doodle in between." 🎨' },
  ],
  [
    { type: "prompt", text: "└─$ ls skills/" },
    { type: "out", text: "🔐 cybersecurity/     🎮 game-dev/\n🌐 web-dev/           🧠 problem-solving/\n📱 mobile-dev/        🚩 ctf-challenges/" },
  ],
  [
    { type: "prompt", text: "└─$ cat status.json" },
    {
      type: "json", json: {
        location: "Chennai, Tamil Nadu 📍",
        college: "SSN College of Engineering",
        currently: "Building cool things 🚀",
        learning: "Deeper into Cybersecurity",
        open_to: ["Collaborations 🤝", "CTF Teams 🚩", "Cool Projects ✨"],
        hobbies: ["Drawing 🎨", "Reading Fiction 📚", "Breaking CTFs 💀"],
      }
    },
  ],
  [
    { type: "prompt", text: "└─$ ping kaviya" },
    { type: "out", text: '> Pinging kaviya...\n> Response: "Hey! Let\'s build\n>            something awesome 👋"\n> Status: ONLINE ✅' },
  ],
];

function jsonHighlight(obj: object): string {
  const json = JSON.stringify(obj, null, 2);
  return json
    .replace(/("[^"]+")(\s*:)/g, '<span style="color:#00ff88">$1</span>$2')
    .replace(/: ("[^"]*")/g, ': <span style="color:#ffd60a">$1</span>')
    .replace(/([{}[\],])/g, '<span style="color:#7c3aed">$1</span>');
}

function Terminal() {
  const [output, setOutput] = useState<{ type: string; html: string }[]>([]);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!termRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); }
    }, { threshold: 0.2 });
    obs.observe(termRef.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    (async () => {
      for (const block of TERMINAL_BLOCKS) {
        for (const line of block) {
          if (cancelled) return;
          if (line.type === "json" && line.json) {
            setOutput((o) => [...o, { type: "json", html: jsonHighlight(line.json!) }]);
            await new Promise((r) => setTimeout(r, 200));
          } else {
            const speed = line.type === "prompt" ? 25 : 15;
            const txt = line.text || "";
            const color = line.type === "prompt" ? "#00f5ff" : "#9beaff";
            setOutput((o) => [...o, { type: line.type, html: `<span style="color:${color}"></span>` }]);
            for (let i = 1; i <= txt.length; i++) {
              if (cancelled) return;
              await new Promise((r) => setTimeout(r, speed));
              setOutput((o) => {
                const last = o[o.length - 1];
                const sub = txt.slice(0, i).replace(/\n/g, "<br/>");
                return [...o.slice(0, -1), { ...last, html: `<span style="color:${color}">${sub}</span>` }];
              });
              if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
            }
            await new Promise((r) => setTimeout(r, 200));
          }
          if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
      setDone(true);
    })();
    return () => { cancelled = true; };
  }, [started]);

  return (
    <div ref={termRef} className="glass" style={{ overflow: "hidden", padding: 0 }}>
      <div style={{
        height: 36, background: "#0d0e14", borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", padding: "0 12px", position: "relative",
      }}>
        {[
          { c: "#ff5f57", g: "rgba(255,95,87,0.6)" },
          { c: "#febc2e", g: "rgba(254,188,46,0.6)" },
          { c: "#28c840", g: "rgba(40,200,64,0.6)" },
        ].map((d, i) => (
          <span key={i} style={{
            width: 12, height: 12, borderRadius: "50%", background: d.c,
            boxShadow: `0 0 8px ${d.g}`, marginRight: 8,
          }} />
        ))}
        <span className="font-code" style={{
          position: "absolute", left: 0, right: 0, textAlign: "center",
          color: "#8892a4", fontSize: 12, pointerEvents: "none",
        }}>kaviya@portfolio: ~</span>
      </div>
      <div ref={bodyRef} className="font-code scanlines" style={{
        background: "#080910", padding: 20, height: 480, overflowY: "auto",
        fontSize: 13, lineHeight: 1.8, position: "relative",
      }}>
        {output.map((l, i) => (
          <div key={i} style={{ whiteSpace: l.type === "json" ? "pre" : "normal", color: "#9beaff" }}
            dangerouslySetInnerHTML={{ __html: l.html }} />
        ))}
        {done && <span style={{
          display: "inline-block", width: 8, height: 14, background: "#00f5ff",
          animation: "blink 1s steps(2) infinite", verticalAlign: "middle",
        }} />}
      </div>
    </div>
  );
}

/* ====================================================================== */
/* SECTION TITLE                                                           */
/* ====================================================================== */
function SectionTitle({ prefix, prefixColor, title, gradient, subtitle, center }: {
  prefix: string; prefixColor: string; title: React.ReactNode;
  gradient?: string; subtitle?: string; center?: boolean;
}) {
  return (
    <div style={{ marginBottom: 48, textAlign: center ? "center" : "left" }}>
      <h2 className="font-mono" style={{
        fontSize: "clamp(32px, 5vw, 44px)", margin: 0, fontWeight: 700, color: "white",
        letterSpacing: "-0.01em",
      }}>
        <span style={{ color: prefixColor }}>{prefix}</span>
        {title}
        {gradient && <span className="gradient-text"> {gradient}</span>}
      </h2>
      {subtitle && (
        <div className="font-code" style={{ marginTop: 8, color: "#3d4555", fontSize: 16, fontStyle: "italic" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

/* ====================================================================== */
/* ABOUT                                                                   */
/* ====================================================================== */
function About() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="about" style={{ position: "relative", padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%", overflow: "hidden", opacity: 0.6 }}>
        <MatrixRain />
      </div>
      <div ref={ref} className="reveal" style={{ position: "relative", zIndex: 1 }}>
        <SectionTitle prefix="> " prefixColor="#00f5ff" title="About " gradient="Me" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
          <Terminal />
          <IdentityCard />
        </div>
      </div>
    </section>
  );
}

function IdentityCard() {
  return (
    <div className="glass" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 260, height: 300 }}>
        <div style={{
          position: "absolute", inset: 0, background: "linear-gradient(135deg,#00f5ff,#00ff88)",
        }} className="hex-clip" />
        <div className="hex-clip" style={{
          position: "absolute", inset: 3, background: "#05060a",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span className="font-mono gradient-text" style={{
            fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em",
          }}>KA</span>
        </div>
        <div className="hex-clip" style={{
          position: "absolute", inset: -10, border: "1px solid rgba(0,245,255,0.4)",
          animation: "pulse-ring 2s ease-out infinite",
        }} />
      </div>
      <div style={{
        marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%",
      }}>
        {[
          { l: "📍 Chennai, TN", c: "#00f5ff", b: "rgba(0,245,255,0.3)", bg: "rgba(0,245,255,0.08)" },
          { l: "🎓 SSN College", c: "#00f5ff", b: "rgba(0,245,255,0.3)", bg: "rgba(0,245,255,0.08)" },
          { l: "🚀 Building things", c: "#00ff88", b: "rgba(0,255,136,0.3)", bg: "rgba(0,255,136,0.08)" },
          { l: "🚩 CTF Active", c: "#ff8da3", b: "rgba(255,45,85,0.3)", bg: "rgba(255,45,85,0.08)" },
        ].map((c, i) => (
          <div key={i} className="font-code" style={{
            padding: "8px 12px", borderRadius: 999, border: `1px solid ${c.b}`,
            background: c.bg, color: c.c, fontSize: 12, textAlign: "center",
          }}>{c.l}</div>
        ))}
      </div>
    </div>
  );
}

/* ====================================================================== */
/* SKILLS                                                                  */
/* ====================================================================== */
function Skills() {
  const cats = Object.keys(SKILLS) as SkillCategory[];
  const [active, setActive] = useState<SkillCategory>("Languages");
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="skills" style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div ref={ref} className="reveal">
        <SectionTitle
          prefix="$ "
          prefixColor="#00ff88"
          title={<><span style={{ color: "#00ff88" }}>SELECT</span> <span style={{ color: "white" }}>*</span> <span style={{ color: "#00ff88" }}>FROM</span> <span style={{ color: "white" }}>skills</span><span style={{ color: "#7c3aed" }}>;</span></>}
          subtitle="-- Query returns all abilities"
        />
        <div style={{
          display: "flex", gap: 4, borderBottom: "2px solid #1a1d26",
          marginBottom: 32, overflowX: "auto",
        }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setActive(c)} className="font-code" style={{
              minWidth: 140, height: 40, padding: "0 12px", background: active === c ? "rgba(0,255,136,0.05)" : "transparent",
              border: "none", borderBottom: active === c ? "2px solid #00ff88" : "2px solid transparent",
              marginBottom: -2, color: active === c ? "#00ff88" : "#8892a4",
              fontSize: 13, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
            }}>{c}</button>
          ))}
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16,
        }}>
          {SKILLS[active].map((s, i) => (
            <SkillCard key={s.name} name={s.name} level={s.level} cat={active} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ name, level, cat, i }: { name: string; level: number; cat: string; i: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    setW(0);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setTimeout(() => setW(level), i * 60);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [level, i, cat]);
  return (
    <div ref={ref} className="glass" style={{ padding: 16, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="font-sans" style={{ color: "white", fontSize: 14 }}>{name}</span>
        <span className="font-code" style={{ color: "#00f5ff", fontSize: 14 }}>{level}%</span>
      </div>
      <div className="font-code" style={{
        color: "#8892a4", fontSize: 10, letterSpacing: "0.12em",
        textTransform: "uppercase", marginTop: 4,
      }}>{cat}</div>
      <div style={{
        marginTop: 12, height: 6, background: "#1a1d26", borderRadius: 3, overflow: "hidden", position: "relative",
      }}>
        <div style={{
          height: "100%", width: `${w}%`,
          background: "linear-gradient(90deg,#00f5ff,#00ff88)",
          boxShadow: w > 0 ? "0 0 8px rgba(0,245,255,0.5)" : "none",
          transition: "width 0.8s cubic-bezier(0.2,0.8,0.2,1)",
          position: "relative",
        }}>
          {w > 0 && <span style={{
            position: "absolute", right: -2, top: -1, width: 4, height: 8,
            background: "white", boxShadow: "0 0 8px white", borderRadius: 2,
          }} />}
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
/* PROJECTS                                                                */
/* ====================================================================== */
const FILTERS = ["All", "Security", "Game", "Web"] as const;
function Projects() {
  const [f, setF] = useState<typeof FILTERS[number]>("All");
  const filtered = PROJECTS.filter((p) => f === "All" || p.category === f);
  const ref = useReveal<HTMLDivElement>();
  const isMobile = useIsMobile();
  return (
    <section id="projects" style={{ padding: "120px 24px", maxWidth: 1280, margin: "0 auto" }}>
      <div ref={ref} className="reveal">
        <SectionTitle prefix="// " prefixColor="#7c3aed" title="Featured Projects" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
          {FILTERS.map((x) => (
            <button key={x} onClick={() => setF(x)} className="font-code" style={{
              height: 32, padding: "0 16px", borderRadius: 999, cursor: "pointer",
              fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              border: f === x ? "1px solid #00ff88" : "1px solid rgba(255,255,255,0.12)",
              background: f === x ? "rgba(0,255,136,0.08)" : "transparent",
              color: f === x ? "#00ff88" : "#8892a4",
              boxShadow: f === x ? "0 0 20px rgba(0,255,136,0.2)" : "none",
              transition: "all 0.25s cubic-bezier(0.2,0.8,0.2,1)",
              transform: f === x ? "scale(1.05)" : "scale(1)",
            }}>{x}</button>
          ))}
        </div>
        {isMobile ? (
          <MobileProjectCarousel key={f} projects={filtered} />
        ) : (
          <div key={f} className="filter-swap" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20,
          }}>
            {filtered.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function MobileProjectCarousel({ projects }: { projects: typeof PROJECTS[number][] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const cardStep = () => {
    const el = trackRef.current;
    if (!el) return 1;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = 14;
    return (first?.offsetWidth ?? el.clientWidth * 0.86) + gap;
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    if (showHint) setShowHint(false);
    const idx = Math.round(el.scrollLeft / cardStep());
    setActive(Math.max(0, Math.min(idx, projects.length - 1)));
  };

  const scrollToIndex = (i: number) => {
    trackRef.current?.scrollTo({ left: i * cardStep(), behavior: "smooth" });
  };

  if (projects.length === 0) return null;

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="filter-swap"
        style={{
          display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch", paddingBottom: 4, marginBottom: 4,
        }}
      >
        {projects.map((p, i) => (
          <div key={p.name} style={{ flex: "0 0 86%", scrollSnapAlign: "center" }}>
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18 }}>
        {projects.map((_, i) => (
          <button key={i} onClick={() => scrollToIndex(i)} aria-label={`Go to project ${i + 1}`} style={{
            width: i === active ? 22 : 7, height: 7, borderRadius: 999, border: "none", padding: 0,
            cursor: "pointer", background: i === active ? "#00ff88" : "rgba(255,255,255,0.18)",
            boxShadow: i === active ? "0 0 12px rgba(0,255,136,0.6)" : "none",
            transition: "all 0.35s cubic-bezier(0.2,0.8,0.2,1)",
          }} />
        ))}
      </div>

      {showHint && projects.length > 1 && (
        <div className="font-code swipe-hint" style={{
          position: "absolute", top: -30, right: 4, fontSize: 10, letterSpacing: "0.08em",
          color: "#00f5ff", display: "inline-flex", alignItems: "center", gap: 5,
          textTransform: "uppercase", pointerEvents: "none",
        }}>
          swipe <span style={{ fontSize: 13 }}>→</span>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, index = 0 }: { project: typeof PROJECTS[number]; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const revealRef = useReveal<HTMLDivElement>(0.1);
  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  const catColor = project.category === "Security" ? "#ff2d55" : project.category === "Game" ? "#7c3aed" : "#00f5ff";
  const catIcon = project.category === "Security" ? "🔐" : project.category === "Game" ? "🎮" : "🌐";
  const setRefs = (el: HTMLDivElement | null) => {
    ref.current = el;
    revealRef.current = el;
  };
  return (
    <div ref={setRefs} className="glass project-card-reveal" onMouseMove={tilt} onMouseLeave={leave}
      style={{
        padding: 20, gridColumn: project.featured ? "span 2" : undefined,
        display: "flex", flexDirection: "column", gap: 12, position: "relative",
        transition: "transform 0.5s cubic-bezier(0.2,0.8,0.2,1), border-color 0.3s, box-shadow 0.3s",
        transformStyle: "preserve-3d", animationDelay: `${Math.min(index, 6) * 90}ms`,
      }}>
      {project.featured && (
        <span className="font-code badge-shimmer" style={{
          position: "absolute", top: 0, right: 0, padding: "3px 8px",
          background: "linear-gradient(135deg,#ffd60a,#ff9500)", color: "black",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
          borderRadius: "0 16px 0 8px", backgroundBlendMode: "overlay",
        }}>FEATURED</span>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          width: 24, height: 24, borderRadius: 6, display: "inline-flex",
          alignItems: "center", justifyContent: "center", fontSize: 14,
          background: `${catColor}15`, border: `1px solid ${catColor}40`,
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>{catIcon}</span>
        {project.live && (
          <span className="font-code" style={{ color: "#00ff88", fontSize: 10, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", animation: "pulse-dot 1.5s infinite" }} />
            LIVE
          </span>
        )}
      </div>
      <div>
        <div className="font-mono" style={{ fontSize: 18, color: "white", fontWeight: 700 }}>{project.name}</div>
        <div className="font-code" style={{ fontSize: 11, color: "#00ff88", marginTop: 2 }}>{project.tagline}</div>
      </div>
      <p className="font-sans" style={{ fontSize: 13, color: "#8892a4", lineHeight: 1.6, margin: 0 }}>
        {project.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {project.tech.map((t, ti) => (
          <span key={t} className="font-code tech-tag" style={{
            padding: "3px 8px", fontSize: 10, borderRadius: 6,
            border: "1px solid rgba(0,245,255,0.25)", color: "#9beaff",
            "--i": ti,
          } as CSSProperties & { "--i": number }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <a href={project.github} target="_blank" rel="noreferrer" className="font-code" style={{
          height: 34, padding: "0 14px", borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0",
          display: "inline-flex", alignItems: "center", fontSize: 12,
          textDecoration: "none", transition: "border-color 0.25s, color 0.25s, transform 0.25s",
        }}>{"< Code />"}</a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className="font-code" style={{
            height: 34, padding: "0 14px", borderRadius: 8,
            border: "1px solid rgba(0,245,255,0.4)", color: "#00f5ff",
            display: "inline-flex", alignItems: "center", fontSize: 12,
            textDecoration: "none", transition: "border-color 0.25s, color 0.25s, transform 0.25s",
          }}>[ Live ↗ ]</a>
        )}
      </div>
    </div>
  );
}

/* ====================================================================== */
/* RESUME                                                                  */
/* ====================================================================== */
const RESUME_URL = "https://drive.google.com/file/d/1w69oTYtaqaZGofMS8VmmQpt6Ou6CBORS/view?usp=sharing";
function Resume() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="resume" style={{ padding: "120px 24px" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionTitle prefix="// " prefixColor="#7c3aed" title="My Resume" center />
        <div className="glass" style={{
          padding: 56, position: "relative", overflow: "hidden",
          backgroundImage: "repeating-linear-gradient(transparent 0, transparent 28px, rgba(0,245,255,0.03) 28px, rgba(0,245,255,0.03) 29px)",
        }}>
          <div style={{
            position: "absolute", left: 40, top: 0, bottom: 0, width: 1,
            background: "rgba(255,45,85,0.15)",
          }} />
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            transform: "rotate(-15deg)", pointerEvents: "none",
          }} className="font-sans">
            <span style={{
              fontSize: 64, letterSpacing: "0.3em", color: "rgba(124,58,237,0.06)", fontWeight: 700,
            }}>CONFIDENTIAL</span>
          </div>
          <div style={{ position: "relative", textAlign: "center" }}>
            <h3 className="font-mono" style={{ fontSize: 22, color: "white", margin: 0 }}>
              Kaviya A — CSE Undergraduate
            </h3>
            <p className="font-code" style={{ fontSize: 14, color: "#8892a4", marginTop: 8 }}>
              Cybersecurity · Game Dev · Web Dev
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
              <MagButton href={RESUME_URL} target="_blank" style={{
                border: "1px solid #00f5ff", background: "transparent", color: "#00f5ff",
              }}>[ View Resume ↗ ]</MagButton>
              <MagButton href={RESUME_URL} target="_blank" style={{
                border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0",
              }}>[ Download PDF ↓ ]</MagButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================================== */
/* PLATFORMS                                                               */
/* ====================================================================== */
function Platforms() {
  const ref = useReveal<HTMLDivElement>();
  const cards = [
    {
      name: "LinkedIn", handle: "linkedin.com/in/kaviya2006",
      url: "https://linkedin.com/in/kaviya2006", color: "#0077B5",
      glow: "rgba(0,119,181,0.5)",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>,
    },
    {
      name: "GitHub", handle: "github.com/Kaviya-1508",
      url: "https://github.com/Kaviya-1508", color: "#c4b5fd",
      glow: "rgba(196,181,253,0.4)",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" /></svg>,
    },
    {
      name: "PicoCTF", handle: "play.picoctf.org/users/kaviya1508",
      url: "https://play.picoctf.org/users/kaviya1508", color: "#ff2d55",
      glow: "rgba(255,45,85,0.4)", badge: true,
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22V4c0-1 1-2 2-2h11l-2 4 2 4H6" /><line x1="4" y1="22" x2="4" y2="15" /></svg>,
    },
  ];
  return (
    <section id="platforms" style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div ref={ref} className="reveal">
        <SectionTitle
          prefix="$ " prefixColor="#00ff88"
          title={<><span style={{ color: "#00ff88" }}>SHOW</span> <span style={{ color: "white" }}>PROFILES</span><span style={{ color: "#7c3aed" }}>;</span></>}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {cards.map((c) => (
            <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="glass"
              style={{
                padding: 28, textDecoration: "none", display: "flex", flexDirection: "column", gap: 12,
                position: "relative", color: "inherit",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 40px ${c.glow}`; e.currentTarget.style.transform = "translateY(-8px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}>
              {c.badge && (
                <span className="font-code" style={{
                  position: "absolute", top: 12, right: 12, padding: "3px 8px",
                  border: "1px solid rgba(255,45,85,0.4)", color: "#ff8da3",
                  fontSize: 10, borderRadius: 6,
                }}>🚩 CTF</span>
              )}
              <div style={{ color: c.color }}>{c.icon}</div>
              <div className="font-mono" style={{ fontSize: 18, color: "white" }}>{c.name}</div>
              <div className="font-code" style={{ fontSize: 12, color: "#8892a4" }}>{c.handle}</div>
              <div className="font-code" style={{ fontSize: 12, color: c.color, marginTop: 8 }}>Visit Profile →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====================================================================== */
/* EDUCATION                                                               */
/* ====================================================================== */
function Education() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="education" style={{ padding: "120px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div ref={ref} className="reveal">
        <SectionTitle prefix="> " prefixColor="#00f5ff" title="Education" center
          subtitle="The journey so far." />
        <div style={{ position: "relative", paddingLeft: 40, marginTop: 32 }}>
          <div style={{
            position: "absolute", left: 16, top: 0, bottom: 0, width: 1,
            background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            position: "absolute", left: 16, top: 0, width: 1, height: "100%",
            background: "linear-gradient(180deg,#00f5ff,#00ff88)",
            boxShadow: "0 0 12px #00f5ff",
          }} />
          <div style={{
            position: "absolute", left: 9, top: 8, width: 16, height: 16, borderRadius: "50%",
            background: "#00f5ff", border: "2px solid #05060a",
            boxShadow: "0 0 0 4px rgba(0,245,255,0.3), 0 0 20px rgba(0,245,255,0.6)",
          }}>
            <span style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              border: "1px solid rgba(0,245,255,0.4)", animation: "pulse-ring 2s ease-out infinite",
            }} />
          </div>
          <div className="glass" style={{ padding: 24, maxWidth: 540 }}>
            <div className="font-code" style={{
              fontSize: 11, color: "#00f5ff", letterSpacing: "0.15em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 8,
            }}>🎓 2024 — 2028</div>
            <h3 className="font-mono" style={{ fontSize: 20, color: "white", marginTop: 8, marginBottom: 4 }}>
              B.E. Computer Science & Engineering
            </h3>
            <p className="font-sans" style={{ fontSize: 15, color: "#8892a4", margin: 0 }}>
              Sri Sivasubramaniya Nadar College of Engineering, Chennai
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              <span className="font-code" style={{
                padding: "4px 10px", fontSize: 11, borderRadius: 999,
                border: "1px solid rgba(255,214,10,0.35)", color: "#ffe27a",
                background: "rgba(255,214,10,0.06)",
              }}>⭐ CGPA: 8.25 / 10</span>
              <span className="font-code" style={{
                padding: "4px 10px", fontSize: 11, borderRadius: 999,
                border: "1px solid rgba(0,245,255,0.3)", color: "#9beaff",
                background: "rgba(0,245,255,0.06)",
              }}>3rd Year</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
              {["Cybersecurity", "Game Dev", "Web Dev", "DSA"].map((t) => (
                <span key={t} className="font-code" style={{
                  padding: "4px 10px", fontSize: 10, borderRadius: 999,
                  border: "1px solid rgba(0,255,136,0.3)", color: "#9bffd0",
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================================================================== */
/* ACHIEVEMENTS                                                            */
/* ====================================================================== */
function Achievements() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="achievements" style={{ padding: "120px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div ref={ref} className="reveal">
        <SectionTitle
          prefix="* " prefixColor="#ffd60a"
          title="Achievements " gradient="& Certifications"
          subtitle="-- Milestones unlocked along the way"
        />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20,
        }}>
          {ACHIEVEMENTS.map((a, i) => (
            <AchievementCard key={a.title} achievement={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AchievementCard({ achievement: a, index }: { achievement: typeof ACHIEVEMENTS[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setInView(true), index * 120); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{
        height: 190, perspective: 1200,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      <div style={{
        position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d",
        transition: "transform 0.6s cubic-bezier(0.2,0.8,0.2,1)",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* front */}
        <div className="glass" style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          padding: 24, display: "flex", flexDirection: "column", gap: 10, justifyContent: "center",
          borderColor: `${a.color}40`,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, background: `${a.color}18`, border: `1px solid ${a.color}55`,
            boxShadow: `0 0 20px ${a.color}33`,
          }}>{a.icon}</div>
          <div className="font-mono" style={{ fontSize: 16, color: "white", lineHeight: 1.35 }}>{a.title}</div>
          <span className="font-code" style={{ fontSize: 10, color: a.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {a.tag} · hover for details
          </span>
        </div>
        {/* back */}
        <div className="glass" style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)", padding: 24,
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 10,
          borderColor: `${a.color}55`, background: `linear-gradient(160deg, ${a.color}12, transparent 70%)`,
        }}>
          <span className="font-code" style={{
            alignSelf: "flex-start", padding: "3px 10px", borderRadius: 999, fontSize: 10,
            border: `1px solid ${a.color}55`, color: a.color,
          }}>{a.tag}</span>
          <div className="font-sans" style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.5 }}>{a.org}</div>
          <div className="font-code" style={{ fontSize: 12, color: "#8892a4" }}>{a.meta}</div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
/* CONTACT                                                                 */
/* ====================================================================== */
function Contact() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="contact" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500,
        background: "radial-gradient(circle,#00f5ff,transparent 70%)", opacity: 0.08,
        animation: "breathe 6s ease-in-out infinite", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%", width: 500, height: 500,
        background: "radial-gradient(circle,#7c3aed,transparent 70%)", opacity: 0.08,
        pointerEvents: "none",
      }} />
      <div ref={ref} className="reveal glass" style={{ maxWidth: 600, margin: "0 auto", padding: 56, textAlign: "center" }}>
        <SectionTitle prefix="> " prefixColor="#00f5ff" title="Let's Connect" center />
        <div style={{
          height: 2, width: 120, margin: "0 auto 24px",
          background: "linear-gradient(90deg,transparent,#00f5ff,transparent)",
        }} />
        <p className="font-sans" style={{ color: "#8892a4", fontSize: 16, marginBottom: 32 }}>
          Open to collaborations, CTF teams, and cool projects! 🚀
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <MagButton href="mailto:kaviya150806@gmail.com" style={{
            border: "1px solid #00f5ff", background: "transparent", color: "#00f5ff",
          }}>[ Send me an Email ]</MagButton>
          <MagButton href="https://wa.me/916382362987" target="_blank" style={{
            border: "1px solid #25D366", background: "transparent", color: "#25D366",
          }}>[ Chat on WhatsApp ]</MagButton>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[
            {
              url: "https://github.com/Kaviya-1508", color: "white",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" /></svg>
            },
            {
              url: "https://linkedin.com/in/kaviya2006", color: "#0077B5",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
            },
            {
              url: "https://play.picoctf.org/users/kaviya1508", color: "#ff2d55",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22V4c0-1 1-2 2-2h11l-2 4 2 4H6" /></svg>
            },
          ].map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.5)", transition: "all 0.3s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = s.color;
                e.currentTarget.style.borderColor = s.color;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 0 20px ${s.color}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}>{s.icon}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====================================================================== */
/* FOOTER                                                                  */
/* ====================================================================== */
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px",
      display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between",
    }}>
      <span className="font-code" style={{ fontSize: 13, color: "#8892a4" }}>
        Designed & coded by Kaviya A
      </span>
      <span className="font-code" style={{ fontSize: 11, color: "#3d4555" }}>© 2026 Kaviya A</span>
      <button onClick={(e) => { addRipple(e); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        style={{
          width: 44, height: 44, borderRadius: "50%", position: "relative", overflow: "hidden",
          border: "1px solid rgba(0,245,255,0.4)", color: "#00f5ff",
          background: "transparent", cursor: "pointer", fontSize: 18,
          boxShadow: "0 0 24px rgba(0,245,255,0.3)", transition: "all 0.3s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#00f5ff"; e.currentTarget.style.color = "black"; e.currentTarget.style.transform = "translateY(-3px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00f5ff"; e.currentTarget.style.transform = ""; }}>
        🚀
      </button>
      
    </footer>
  );
}

/* ====================================================================== */
/* APP                                                                     */
/* ====================================================================== */
export default function Portfolio() {
  return (
    <div style={{ position: "relative", zIndex: 2 }}>
      <Loader />
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <div className="grain" />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Resume />
        <Platforms />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

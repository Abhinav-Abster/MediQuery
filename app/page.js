"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./components/ThemeProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DecryptedText from "./components/DecryptedText";
import ShinyText from "./components/ShinyText";
import TiltCard from "./components/TiltCard";
import AnimatedCounter from "./components/AnimatedCounter";
import MagnetLines from "./components/MagnetLines";
import {
  Search,
  ArrowRight,
  Shield,
  Zap,
  Activity,
  Sun,
  Moon,
  HeartPulse,
  Microscope,
  FlaskConical,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const exampleMedicines = [
  { name: "Paracetamol", icon: "💊" },
  { name: "Aspirin", icon: "🩹" },
  { name: "Metformin", icon: "🧬" },
  { name: "Ibuprofen", icon: "💉" },
  { name: "Amoxicillin", icon: "🦠" },
  { name: "Omeprazole", icon: "🔬" },
];

const features = [
  {
    icon: Zap,
    title: "AI-Powered Analysis",
    desc: "Gemini AI processes your query and returns comprehensive drug intelligence in seconds",
  },
  {
    icon: Shield,
    title: "Drug Interactions",
    desc: "Identify potential conflicts with other medications and contraindications",
  },
  {
    icon: Activity,
    title: "Side Effect Mapping",
    desc: "Visualize severity and frequency of side effects with interactive charts",
  },
  {
    icon: FlaskConical,
    title: "Manufacturing Process",
    desc: "Step-by-step breakdown of pharmaceutical synthesis and production",
  },
];

const stats = [
  { value: "10K+", label: "Drugs Indexed", suffix: "+", displayNum: "10K" },
  { value: "99.2%", label: "Accuracy Rate", suffix: "%", displayNum: "99.2" },
  { value: "<30s", label: "Response Time", prefix: "<", suffix: "s", displayNum: "30" },
];

/* ─── Floating Particles ─── */
function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${2 + Math.random() * 3}px`,
      duration: `${8 + Math.random() * 10}s`,
      delay: `${Math.random() * 6}s`,
      driftX: `${-40 + Math.random() * 80}px`,
      driftY: `${-100 - Math.random() * 150}px`,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="particles-bg">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            "--size": p.size,
            "--duration": p.duration,
            "--delay": p.delay,
            "--drift-x": p.driftX,
            "--drift-y": p.driftY,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Heartbeat SVG ─── */
function HeartbeatSVG() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-20 opacity-[0.06]"
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
    >
      <path
        className="heartbeat-path"
        d="M0,50 L200,50 L220,50 L240,20 L260,80 L280,10 L300,90 L320,30 L340,50 L500,50 L520,50 L540,15 L560,85 L580,20 L600,50 L800,50 L820,50 L840,25 L860,75 L880,15 L900,85 L920,50 L1200,50"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
      />
    </svg>
  );
}

/* ─── Neumorphic Concentric Circle Decoration ─── */
function NeuCircleDecoration({ className, outerSize = 120, innerSize = 70, coreSize = 30 }) {
  return (
    <div className={`neu-circle-decoration ${className}`}>
      <div className="neu-circle-outer animate-float" style={{ width: outerSize, height: outerSize }}>
        <div className="neu-circle-inner" style={{ width: innerSize, height: innerSize }}>
          <div className="neu-circle-core" style={{ width: coreSize, height: coreSize }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Ripple Button ─── */
function RippleButton({ children, onClick, disabled, className, id }) {
  const btnRef = useRef(null);
  const handleClick = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onClick?.(e);
  };

  return (
    <button ref={btnRef} id={id} onClick={handleClick} disabled={disabled} className={`btn-ripple ${className}`}>
      {children}
    </button>
  );
}

/* ─── Magnetic Pill ─── */
function MagneticPill({ children, onClick, className, id, style }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) translateY(-2px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }, []);

  return (
    <button
      ref={ref} id={id} onClick={onClick}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className={`magnetic-hover ${className}`} style={style}
    >
      {children}
    </button>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const containerRef = useRef(null);

  // Mouse spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--mouse-x", e.clientX + "px");
      document.documentElement.style.setProperty("--mouse-y", e.clientY + "px");
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ─── GSAP Master Timeline ───
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

      tl.fromTo(".gsap-hero-icon",
        { scale: 0, rotation: -20, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)" }
      );
      tl.fromTo(".gsap-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.3"
      );
      tl.fromTo(".gsap-subtitle",
        { y: 30, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7 },
        "-=0.4"
      );
      tl.fromTo(".gsap-stats", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");
      tl.fromTo(".gsap-stat-item",
        { y: 20, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.4)" },
        "-=0.3"
      );
      tl.fromTo(".gsap-search",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
        "-=0.2"
      );
      tl.fromTo(".gsap-pills", { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.3");
      tl.fromTo(".gsap-pill-item",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: { each: 0.06, from: "center" }, duration: 0.4, ease: "back.out(2)" },
        "-=0.1"
      );
      tl.fromTo(".gsap-features", { opacity: 0 }, { opacity: 1, duration: 0.2 }, "-=0.1");
      tl.fromTo(".gsap-feature-card",
        { y: 60, opacity: 0, rotateX: -10 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, duration: 0.6, ease: "power2.out" },
        "-=0.1"
      );
    },
    { scope: containerRef }
  );

  const handleSearch = (medicineName) => {
    const name = medicineName || query;
    if (!name.trim()) return;
    setIsNavigating(true);
    router.push(`/medicine/${encodeURIComponent(name.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <main ref={containerRef} className="flex-1 flex flex-col relative bg-bg-primary">
      <FloatingParticles />

      {/* ─── Neumorphic Concentric Decorations ─── */}
      <NeuCircleDecoration className="top-16 left-[5%] hidden lg:block" outerSize={140} innerSize={85} coreSize={35} />
      <NeuCircleDecoration className="top-40 right-[6%] hidden lg:block" outerSize={100} innerSize={60} coreSize={24} />

      {/* ─── Navbar ─── */}
      <nav className="neu-nav relative z-50 w-full px-6 py-3.5 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 neu-inset-deep rounded-xl flex items-center justify-center pulse-ring">
            <HeartPulse className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
              <DecryptedText
                text="MediQuery"
                animateOn="hover"
                speed={30}
                maxIterations={8}
                sequential={true}
                revealDirection="start"
                className="text-text-primary"
                encryptedClassName="text-accent"
              />
            </span>
            <ShinyText
              text=" AI"
              speed={1.5}
              className="ml-1.5 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full align-top neu-inset-sm"
              color="var(--accent)"
              shineColor="#ffffff"
            />
          </div>
        </div>

        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="neu-toggle"
          aria-label="Toggle theme"
        >
          <div className={`neu-toggle-knob ${theme === "dark" ? "left-[28px]" : "left-[3px]"}`}>
            {theme === "dark" ? (
              <Moon className="w-3.5 h-3.5 text-white" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-white" />
            )}
          </div>
        </button>
      </nav>

      {/* ─── Hero Section ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-8">

        {/* Hero icon — neumorphic inset well */}
        <div className="relative mb-8 gsap-hero-icon">
          <div className="w-24 h-24 neu-inset-deep rounded-[24px] flex items-center justify-center animate-float">
            <div className="w-16 h-16 neu-card-sm rounded-[16px] flex items-center justify-center">
              <Microscope className="w-8 h-8 text-accent" />
            </div>
          </div>
          {/* Floating orbit dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent/30 animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-accent/20 animate-float" style={{ animationDelay: "2s" }} />
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-center tracking-tight mb-5 gsap-title"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-text-primary">Pharma</span>
          <span className="bg-gradient-to-r from-[#6C63FF] to-[#8B84FF] bg-clip-text text-transparent">
            ceutical
          </span>
          <br className="md:hidden" />
          <span className="text-text-primary"> Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="text-text-secondary text-center text-base md:text-lg mb-6 max-w-lg gsap-subtitle font-medium">
          Comprehensive drug analysis powered by AI. Dosage, side effects,
          interactions, and manufacturing — all in one query.
        </p>

        {/* Stats — each in its own neumorphic chip */}
        <div className="flex gap-5 md:gap-8 mb-12 gsap-stats">
          {stats.map((s) => (
            <div key={s.label} className="text-center gsap-stat-item neu-card-sm px-5 py-3 rounded-2xl">
              <div className="text-lg font-bold text-accent">
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix || ""}
                  prefix={s.prefix || ""}
                  duration={2}
                  className="text-lg font-bold text-accent"
                />
              </div>
              <div className="text-[11px] text-text-muted font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search bar — neumorphic inset */}
        <div className="w-full max-w-2xl mb-8 gsap-search">
          <div className={`neu-search rounded-2xl p-1 ${isFocused ? "outline-2 outline-accent outline-offset-2" : ""}`}>
            <div className="flex items-center rounded-xl overflow-hidden">
              <div className="pl-5 pr-2">
                <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? "text-accent" : "text-text-muted"}`} />
              </div>
              <input
                id="medicine-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search any medicine — e.g. Aspirin, Metformin..."
                className="flex-1 px-3 py-4 bg-transparent outline-none text-text-primary placeholder:text-[#A0AEC0] text-base font-medium"
                autoComplete="off"
              />
              <RippleButton
                id="search-button"
                onClick={() => handleSearch()}
                disabled={!query.trim() || isNavigating}
                className="neu-btn mr-1 px-6 py-2.5 text-white rounded-2xl font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isNavigating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Analyze
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </RippleButton>
            </div>
          </div>
        </div>

        {/* Quick search pills — neumorphic extruded */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 gsap-pills">
          <span className="text-xs text-text-muted mr-1 self-center font-medium">Quick search:</span>
          {exampleMedicines.map((med, i) => (
            <MagneticPill
              key={med.name}
              id={`example-${med.name.toLowerCase()}`}
              onClick={() => handleSearch(med.name)}
              className="gsap-pill-item neu-pill px-4 py-2.5 text-sm font-medium text-text-primary cursor-pointer flex items-center gap-1.5"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="text-sm">{med.icon}</span>
              {med.name}
            </MagneticPill>
          ))}
        </div>

        {/* Feature cards — neumorphic extruded with tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full gsap-features">
          {features.map((f) => (
            <TiltCard
              key={f.title}
              className="gsap-feature-card neu-card p-6 md:p-8 group cursor-default"
              tiltAmount={8}
              glareMaxOpacity={0.08}
              scale={1.01}
            >
              {/* Icon in deep inset well */}
              <div className="relative z-10 w-12 h-12 neu-inset-deep rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3
                className="relative z-10 font-bold text-sm mb-2 text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.title}
              </h3>
              <p className="relative z-10 text-xs text-text-secondary leading-relaxed">{f.desc}</p>
            </TiltCard>
          ))}
        </div>

        <HeartbeatSVG />
      </div>

      {/* MagnetLines — subtle decorative */}
      <div className="relative z-10 flex justify-center py-8 overflow-hidden opacity-20">
        <MagnetLines
          rows={5}
          columns={20}
          containerSize="100%"
          lineColor="var(--text-muted)"
          lineWidth="1px"
          lineHeight="20px"
          className="max-w-4xl"
          style={{ height: "80px", width: "100%", maxWidth: "56rem" }}
        />
      </div>

      {/* Footer — neumorphic extruded strip */}
      <footer className="relative z-10 text-center py-5 text-xs text-text-muted neu-nav">
        <p className="flex items-center justify-center gap-1.5">
          <HeartPulse className="w-3 h-3 text-accent" />
          MediQuery AI provides AI-generated information for educational purposes only.
          <span className="text-danger font-medium ml-1">Always consult a healthcare professional.</span>
        </p>
      </footer>
    </main>
  );
}

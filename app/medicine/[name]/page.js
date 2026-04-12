"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "../../components/ThemeProvider";
import DecryptedText from "../../components/DecryptedText";
import ShinyText from "../../components/ShinyText";
import GlitchText from "../../components/GlitchText";
import TiltCard from "../../components/TiltCard";
import {
  Pill,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  FlaskConical,
  Stethoscope,
  Clock,
  Baby,
  User,
  Beaker,
  ChevronRight,
  XCircle,
  Search,
  HeartPulse,
  Activity,
  Sun,
  Moon,
  RefreshCw,
} from "lucide-react";
import SideEffectsChart from "./SideEffectsChart";

gsap.registerPlugin(ScrollTrigger);

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-center mb-12 mt-4">
        <div className="relative flex items-center gap-3">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-8 rounded-full bg-accent/30"
                style={{
                  animation: `dnaBar 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p className="ml-4 text-sm font-medium text-text-secondary">
            <DecryptedText
              text="Analyzing pharmaceutical data..."
              animateOn="view"
              speed={30}
              maxIterations={15}
              sequential={true}
              revealDirection="start"
              className="text-text-secondary"
              encryptedClassName="text-accent"
            />
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="skeleton h-10 w-72 mb-3" />
        <div className="flex gap-3">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-6 w-28 rounded-full" />
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-10 w-28 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="neu-card p-6">
            <div className="skeleton h-5 w-32 mb-4" />
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        ))}
      </div>

      <div className="neu-card p-6">
        <div className="skeleton h-5 w-48 mb-6" />
        <div className="skeleton h-64 w-full" />
      </div>
    </div>
  );
}

/* ─── Error State ─── */
function ErrorState({ error, medicineName }) {
  const router = useRouter();
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-scale-in">
        <div className="relative w-20 h-20 neu-inset-deep rounded-2xl flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-danger" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Analysis Failed
        </h2>
        <p className="text-text-secondary mb-8 text-sm leading-relaxed">
          {error || `Could not retrieve data for "${medicineName}". The pharmaceutical database may be temporarily unavailable.`}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.refresh()}
            className="neu-btn px-6 py-3 text-white rounded-2xl font-semibold text-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Analysis
          </button>
          <Link
            href="/"
            className="neu-btn-secondary px-6 py-3 rounded-2xl font-semibold text-sm"
          >
            New Search
          </Link>
        </div>
      </div>
    </div>
  );
}

const tabs = [
  { id: "overview", label: "Overview", icon: Stethoscope },
  { id: "sideEffects", label: "Side Effects", icon: Activity },
  { id: "manufacturing", label: "Manufacturing", icon: FlaskConical },
  { id: "interactions", label: "Interactions", icon: ShieldAlert },
];

export default function MedicinePage({ params }) {
  const { name } = use(params);
  const medicineName = decodeURIComponent(name);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function fetchMedicine() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/medicine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medicine: medicineName }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to fetch medicine data");
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMedicine();
  }, [medicineName]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--mouse-x", e.clientX + "px");
      document.documentElement.style.setProperty("--mouse-y", e.clientY + "px");
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="flex-1 flex flex-col min-h-screen relative bg-bg-primary">
      {/* Navbar — neumorphic */}
      <nav className="neu-nav relative z-50 w-full px-6 py-3 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="neu-btn-secondary flex items-center gap-1.5 px-3 py-2 text-text-muted hover:text-accent text-sm font-medium group rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 neu-inset-deep rounded-xl flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-bold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
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
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 neu-card-sm rounded-xl flex items-center justify-center text-text-muted hover:text-accent transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>
          <button
            id="theme-toggle-results"
            onClick={toggleTheme}
            className="neu-toggle"
            aria-label="Toggle theme"
          >
            <div className={`neu-toggle-knob ${theme === "dark" ? "left-[28px]" : "left-[3px]"}`}>
              {theme === "dark" ? <Moon className="w-3.5 h-3.5 text-white" /> : <Sun className="w-3.5 h-3.5 text-white" />}
            </div>
          </button>
        </div>
      </nav>

      <div className="relative z-10">
        {loading && <LoadingSkeleton />}
        {error && !loading && <ErrorState error={error} medicineName={medicineName} />}
        {data && !loading && !error && (
          <MedicineContent data={data} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto text-center py-4 text-xs text-text-muted neu-nav">
        <p className="flex items-center justify-center gap-1.5">
          <HeartPulse className="w-3 h-3 text-accent" />
          AI-generated content for educational purposes only.
          <span className="text-danger font-medium">Consult a healthcare professional.</span>
        </p>
      </footer>
    </main>
  );
}

/* ─── Medicine Content ─── */
function MedicineContent({ data, activeTab, setActiveTab }) {
  const contentRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".gsap-med-header", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 });
    tl.fromTo(".gsap-med-badge", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.3");
    tl.fromTo(".gsap-med-overview", { y: 20, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6 }, "-=0.2");
    tl.fromTo(".gsap-tab-item", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4 }, "-=0.3");
  }, { scope: contentRef });

  return (
    <div ref={contentRef} className="max-w-5xl mx-auto px-4 py-8 w-full">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-3 gsap-med-header">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 neu-inset-deep rounded-2xl flex items-center justify-center animate-bounce-in">
              <Pill className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
                <GlitchText speed={0.8} enableOnHover={true} enableShadows={true}>
                  {data.name}
                </GlitchText>
              </h1>
              {data.genericName && (
                <p className="text-sm text-text-secondary font-medium">{data.genericName}</p>
              )}
            </div>
          </div>
          <div className="gsap-med-badge neu-card-sm px-4 py-2 rounded-full mt-1">
            <ShinyText
              text={data.drugClass}
              speed={2}
              color="var(--accent)"
              shineColor="#ffffff"
              className="text-xs font-bold"
            />
          </div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl pl-[68px] gsap-med-overview">
          {data.overview}
        </p>
      </header>

      {/* Tabs — neumorphic */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`gsap-tab-item neu-tab flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap ${
              activeTab === tab.id ? "neu-tab-active" : ""
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content-enter" key={activeTab}>
        {activeTab === "overview" && <OverviewTab data={data} />}
        {activeTab === "sideEffects" && <SideEffectsTab data={data} />}
        {activeTab === "manufacturing" && <ManufacturingTab data={data} />}
        {activeTab === "interactions" && <InteractionsTab data={data} />}
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */
function OverviewTab({ data }) {
  const tabRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-info-card",
      { y: 40, opacity: 0, rotateX: -5 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.1, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: tabRef.current, start: "top 85%", once: true } }
    );
  }, { scope: tabRef });

  return (
    <div ref={tabRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TiltCard className="gsap-info-card" tiltAmount={6} glareMaxOpacity={0.06} scale={1.01}>
          <InfoCard icon={<FlaskConical className="w-4.5 h-4.5 text-accent" />} title="Mechanism of Action">
            <p className="text-sm text-text-secondary leading-relaxed">{data.mechanism}</p>
          </InfoCard>
        </TiltCard>

        <TiltCard className="gsap-info-card" tiltAmount={6} glareMaxOpacity={0.06} scale={1.01}>
          <InfoCard icon={<Pill className="w-4.5 h-4.5 text-accent" />} title="Drug Class">
            <p className="text-sm text-text-secondary leading-relaxed">
              Classified under <span className="text-text-primary font-semibold">{data.drugClass}</span> in modern pharmacology.
            </p>
          </InfoCard>
        </TiltCard>

        <TiltCard className="gsap-info-card" tiltAmount={6} glareMaxOpacity={0.06} scale={1.01}>
          <InfoCard icon={<Clock className="w-4.5 h-4.5 text-accent" />} title="Dosage Information">
            <div className="space-y-3">
              <DosageRow icon={<User className="w-3.5 h-3.5" />} label="Adult" value={data.dosage?.adult} />
              <DosageRow icon={<Baby className="w-3.5 h-3.5" />} label="Children" value={data.dosage?.child} />
              <DosageRow icon={<Clock className="w-3.5 h-3.5" />} label="Frequency" value={data.dosage?.frequency} />
            </div>
          </InfoCard>
        </TiltCard>

        <TiltCard className="gsap-info-card" tiltAmount={6} glareMaxOpacity={0.06} scale={1.01}>
          <InfoCard icon={<AlertTriangle className="w-4.5 h-4.5 text-accent" />} title="Key Warnings">
            <p className="text-sm text-text-secondary leading-relaxed">{data.warnings}</p>
          </InfoCard>
        </TiltCard>
      </div>
    </div>
  );
}

function DosageRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 neu-inset-sm rounded-xl">
      <div className="w-6 h-6 rounded-lg neu-card-sm flex items-center justify-center text-text-muted shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</p>
        <p className="text-sm text-text-primary font-medium">{value}</p>
      </div>
    </div>
  );
}

/* ─── Side Effects Tab ─── */
function SideEffectsTab({ data }) {
  const tabRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-side-effect-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: "power2.out" }
    );
  }, { scope: tabRef });

  return (
    <div ref={tabRef} className="space-y-6">
      <div className="gsap-side-effect-card neu-card p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-4 h-4 rounded-sm bg-accent" />
          <h3 className="font-bold text-sm text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Common Side Effects</h3>
        </div>
        <p className="text-xs text-text-muted mb-5 ml-7">Frequency of reported occurrence (%)</p>
        <SideEffectsChart data={data.sideEffects?.common || []} color="#6C63FF" />
      </div>

      <div className="gsap-side-effect-card neu-card p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-4 h-4 rounded-sm bg-danger" />
          <h3 className="font-bold text-sm text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Rare / Serious Side Effects</h3>
        </div>
        <p className="text-xs text-text-muted mb-5 ml-7">Less common — may require immediate medical attention</p>
        <SideEffectsChart data={data.sideEffects?.rare || []} color="#E53E3E" />
      </div>
    </div>
  );
}

/* ─── Manufacturing Tab ─── */
function ManufacturingTab({ data }) {
  const steps = parseManufacturingSteps(data.howItsMade);
  const tabRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-mfg-step",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: tabRef.current, start: "top 80%", once: true } }
    );
  }, { scope: tabRef });

  return (
    <div ref={tabRef}>
      <div className="neu-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 neu-inset-deep rounded-xl flex items-center justify-center">
            <Beaker className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Synthesis & Manufacturing</h3>
            <p className="text-xs text-text-muted">Step-by-step pharmaceutical production process</p>
          </div>
        </div>

        <div className="space-y-0 ml-1">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 group gsap-mfg-step">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 neu-inset-deep rounded-xl flex items-center justify-center text-sm font-bold text-accent shrink-0 group-hover:shadow-[var(--neu-extruded-sm)] group-hover:text-white group-hover:bg-accent transition-all duration-300">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-[2px] flex-1 bg-text-muted/20 my-1 group-hover:bg-accent/30 transition-colors rounded-full" />
                )}
              </div>
              <div className="pb-7 pt-2">
                <p className="text-sm text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Interactions Tab ─── */
function InteractionsTab({ data }) {
  const tabRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".gsap-interaction-item",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out" }
    );
    gsap.fromTo(".gsap-contra-section",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" }
    );
  }, { scope: tabRef });

  return (
    <div ref={tabRef} className="space-y-6">
      <div className="neu-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 neu-inset-deep rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Drug Interactions</h3>
            <p className="text-xs text-text-muted">Known interactions with other substances</p>
          </div>
        </div>
        <div className="space-y-2">
          {(data.interactions || []).map((item, i) => (
            <div
              key={i}
              className="gsap-interaction-item flex items-start gap-3 p-3 rounded-xl hover:shadow-[var(--neu-inset-sm)] transition-all cursor-default group"
            >
              <div className="w-7 h-7 rounded-lg neu-inset-sm flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-danger" />
              </div>
              <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contraindications */}
      <div className="gsap-contra-section neu-card p-6" style={{ boxShadow: "var(--neu-extruded), inset 0 0 0 2px var(--warning)" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 neu-inset-deep rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Contraindications</h3>
            <p className="text-xs text-text-secondary">Conditions where this drug should NOT be used</p>
          </div>
        </div>
        <div className="space-y-2">
          {(data.contraindications || []).map((item, i) => (
            <div key={i} className="gsap-interaction-item flex items-start gap-3 p-2.5 rounded-lg hover:shadow-[var(--neu-inset-sm)] transition-all">
              <ChevronRight className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <p className="text-sm text-text-primary">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Info Card ─── */
function InfoCard({ icon, title, children }) {
  return (
    <div className="neu-card p-6">
      <div className="relative z-10 flex items-center gap-2.5 mb-4">
        <div className="w-10 h-10 neu-inset-deep rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="font-bold text-sm text-text-primary" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── Helpers ─── */
function parseManufacturingSteps(text) {
  if (!text) return [];
  const steps = text
    .split(/\d+\.\s+/)
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim().replace(/\n/g, " "));
  return steps.length > 0 ? steps : [text];
}

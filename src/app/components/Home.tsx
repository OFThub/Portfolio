import { motion } from "motion/react";
import { ArrowRight, Code2, Database, Globe, Server } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { lazy, Suspense } from "react";
import { KineticLetters } from "./Kinetic";
import { FloatingPaths } from "./effects/FloatingPaths";
import { useI18n } from "../../i18n";
const Hero3D = lazy(() => import("./Hero3D"));

/* ─── Corner Decoration ──────────────────────────────────────────────── */
function CornerDeco({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const cls = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[position];
  return (
    <motion.div
      className={`absolute w-4 h-4 border-primary/60 ${cls}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 1 }}
    />
  );
}

/* ─── Floating Particle ──────────────────────────────────────────────── */
function Particle({ x, y, delay, size = 1 }: { x: number; y: number; delay: number; size?: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/25 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -32, 0], opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Glitch Text ────────────────────────────────────────────────────── */
function GlitchText({ children, text, className = "" }: { children: React.ReactNode; text?: string; className?: string }) {
  const [glitching, setGlitching] = useState(false);
  const str = text ?? (typeof children === "string" ? children : "");
  useEffect(() => {
    const run = () => { setGlitching(true); setTimeout(() => setGlitching(false), 200); };
    const id = setInterval(run, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      {glitching && str && (
        <>
          <span className="absolute inset-0 text-red-400 opacity-70" aria-hidden="true" style={{ clipPath: "inset(0 0 55% 0)", transform: "translateX(-4px)" }}>{str}</span>
          <span className="absolute inset-0 text-cyan-400 opacity-70" aria-hidden="true" style={{ clipPath: "inset(55% 0 0 0)", transform: "translateX(4px)" }}>{str}</span>
        </>
      )}
    </span>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────────────── */
function Typewriter({ lines, delay = 0 }: { lines: string[]; delay?: number }) {
  const fullText = lines.join("\n");
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setStarted(true), delay * 1000); return () => clearTimeout(t); }, [delay]);
  // Restart typing when the text changes (language switch), otherwise the old
  // sentence stays on screen because `displayed` is already "complete".
  useEffect(() => { setDisplayed(""); }, [fullText]);
  useEffect(() => {
    if (!started || displayed.length >= fullText.length) return;
    const t = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length + 1)), 28);
    return () => clearTimeout(t);
  }, [started, displayed, fullText]);

  return (
    <span className="whitespace-pre-line">
      {displayed}
      {displayed.length < fullText.length && started && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle" />
      )}
    </span>
  );
}

/* ─── Magnetic Button ────────────────────────────────────────────────── */
function MagneticBtn({ children, onClick, className }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`spotlight ${className}`}
    >
      {children}
    </motion.button>
  );
}

/* ─── GlowCard ───────────────────────────────────────────────────────── */
function GlowCard({ children, className = "", delay = 0, once = true }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`spotlight relative overflow-hidden ${className}`}
      style={{ boxShadow: hovered ? "0 0 50px rgba(239,68,68,0.09)" : "none", transition: "box-shadow 0.3s" }}
    >
      <CornerDeco position="tl" />
      <CornerDeco position="tr" />
      <CornerDeco position="bl" />
      <CornerDeco position="br" />
      {children}
    </motion.div>
  );
}

/* ─── Scan Line ──────────────────────────────────────────────────────── */
function ScanLine({ duration = 6 }: { duration?: number }) {
  // 1px'lik çizgi piksel bazlı translateY ile taşınır: kompozitör katmanı
  // kart boyutunda değil genişlik×1px olur (entegre GPU'larda kritik)
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => setH(parent.clientHeight));
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);
  return (
    <motion.div
      ref={ref}
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-10"
      animate={h > 0 ? { y: [0, h] } : {}}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN HOME COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function Home() {
  const { t } = useI18n();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 64;
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - offset, behavior: "smooth" });
    }
  };

  const particles = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 5, size: Math.random() > 0.5 ? 2 : 1,
    })),
    []
  );

  /* Icons stay in the component and are zipped with the translated copy —
     an icon is not content, and duplicating it per language invites drift. */
  const TECH_ICONS = [Code2, Server, Database, Globe];
  const techItems = t.home.tech.map((item, i) => ({ ...item, icon: TECH_ICONS[i] }));
  const pillars = t.home.pillars;

  return (
    <section id="home" className="min-h-screen pt-16">

      {/* ═══ HERO ═══ */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-950/20" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(220,38,38,1) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
          }}
        />

        {/* Akan kırmızı SVG çizgiler (BackgroundPaths) */}
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        {/* Akan kırmızı SVG çizgiler (BackgroundPaths) */}
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        {/* 3D Digital Core (three.js — lazy chunk) */}
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>

        {/* Merkezde metin okunurluğu için hafif vinyet */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 46% 38% at 50% 46%, rgba(0,0,0,0.5), transparent 72%)" }}
        />

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} size={p.size} />)}
        </div>

        {/* Scan line across hero */}
        <ScanLine duration={8} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Overline */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div className="h-px bg-gradient-to-r from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.5, duration: 0.8 }} />
            <span className="text-primary/70 text-xs tracking-[0.4em] uppercase font-mono">{t.home.overline}</span>
            <motion.div className="h-px bg-gradient-to-l from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.5, duration: 0.8 }} />
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <KineticLetters text={t.home.titleLead} gradient startDelay={350} />
            <br />
            <span className="text-primary inline-block">
              <GlitchText text={t.home.titleAccent}>
                <KineticLetters text={t.home.titleAccent} startDelay={750} />
              </GlitchText>
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            className="text-lg sm:text-xl text-white max-w-2xl mx-auto mb-12 font-mono min-h-[56px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Typewriter
              lines={t.home.typewriter}
              delay={0.8}
            />
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {/* Primary */}
            <MagneticBtn
              onClick={() => scrollToSection("projects")}
              className="group relative px-8 py-4 glass-red text-white rounded-lg flex items-center gap-2 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative z-10">{t.home.ctaWork}</span>
              <motion.div className="relative z-10" whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </MagneticBtn>

            {/* Outline */}
            <MagneticBtn
              onClick={() => scrollToSection("contact")}
              className="group relative px-8 py-4 glass-dark text-card-foreground hover:text-white rounded-lg overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
              />
              <span className="relative z-10">{t.home.ctaContact}</span>
            </MagneticBtn>
          </motion.div>

          {/* Tech Stack Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {techItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="spotlight relative group p-5 bg-card border border-primary/20 rounded-lg overflow-hidden cursor-default"
                style={{ transition: "border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <CornerDeco position="tl" />
                <CornerDeco position="br" />
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <item.icon className="w-7 h-7 text-primary mx-auto mb-2 relative z-10" />
                <p className="text-white text-sm font-semibold relative z-10">{item.label}</p>
                <p className="text-gray-600 text-xs font-mono mt-1 relative z-10">{item.desc}</p>
                {/* Pulse dot */}
                <motion.div
                  className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary/50"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => scrollToSection("about")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="spotlight absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-primary/50 group-hover:border-primary rounded-full flex justify-center p-1.5 transition-colors"
          >
            <motion.div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
          <p className="text-gray-600 text-xs font-mono mt-2 tracking-widest">{t.home.scroll}</p>
        </motion.button>
      </div>

      {/* ═══ QUICK ABOUT ═══ */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-red-950/10 overflow-hidden">

        {/* Background particles (fewer) */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.slice(0, 8).map((p) => <Particle key={p.id} x={p.x} y={p.y} delay={p.delay + 1} />)}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(239,68,68,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div className="flex items-center justify-center gap-4 mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
              <motion.div className="h-px bg-gradient-to-r from-transparent to-primary/60" initial={{ width: 0 }} whileInView={{ width: 60 }} transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }} />
              <span className="text-primary/70 text-xs tracking-[0.4em] uppercase font-mono">{t.home.approachOverline}</span>
              <motion.div className="h-px bg-gradient-to-l from-transparent to-primary/60" initial={{ width: 0 }} whileInView={{ width: 60 }} transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }} />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <motion.span className="text-white inline-block" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
                {t.home.approachTitleLead}
              </motion.span>
              <br />
              <motion.span className="text-primary inline-block" initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
                <GlitchText>{t.home.approachTitleAccent}</GlitchText>
              </motion.span>
            </h2>

            <motion.p className="text-xl text-gray-400 max-w-3xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }}>
              {t.home.approachSubtitle}
            </motion.p>

            <motion.div
              className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              initial={{ width: 0 }} whileInView={{ width: "35%" }} transition={{ delay: 0.6, duration: 1 }} viewport={{ once: true }}
            />
          </motion.div>

          {/* Pillar Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((item, index) => (
              <GlowCard
                key={item.title}
                delay={index * 0.15}
                className="p-8 bg-card border border-primary/20 rounded-lg"
              >
                <ScanLine duration={7 + index} />

                {/* Number */}
                <motion.div
                  className="text-5xl font-bold text-primary/10 font-mono mb-4 select-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                >
                  0{index + 1}
                </motion.div>

                <motion.h3
                  className="text-2xl font-bold text-white mb-3"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 + index * 0.1 }} viewport={{ once: true }}
                >
                  {item.title}
                </motion.h3>

                <motion.div
                  className="h-px bg-gradient-to-r from-primary/40 to-transparent mb-4"
                  initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }} transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }} viewport={{ once: true }}
                />

                <motion.p
                  className="text-gray-400 text-sm leading-relaxed"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.55 + index * 0.1 }} viewport={{ once: true }}
                >
                  {item.description}
                </motion.p>

                {/* Bottom pulse dot */}
                <motion.div
                  className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/40"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.5 }}
                />
              </GlowCard>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={() => scrollToSection("about")}
              className="spotlight relative inline-flex items-center gap-2 text-primary hover:text-red-400 transition-colors font-mono text-sm group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {t.home.learnMore}
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
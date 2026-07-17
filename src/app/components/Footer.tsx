import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Corner Decoration (Contact ile aynı) ──────────────────────────── */
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
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    />
  );
}

/* ─── Floating Particle (Contact ile aynı) ──────────────────────────── */
function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/30 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0], scale: [0, 1.2, 0] }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Magnetic Button ───────────────────────────────────────────────── */
function MagneticBtn({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ─── Glitch Text ───────────────────────────────────────────────────── */
function GlitchText({ children }: { children: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const run = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 180);
    };
    const id = setInterval(run, 5000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block">
      {children}
      {glitching && (
        <>
          <span className="absolute inset-0 text-red-400 opacity-70" style={{ clipPath: "inset(0 0 55% 0)", transform: "translateX(-3px)" }}>{children}</span>
          <span className="absolute inset-0 text-cyan-400 opacity-70" style={{ clipPath: "inset(55% 0 0 0)", transform: "translateX(3px)" }}>{children}</span>
        </>
      )}
    </span>
  );
}

/* ─── Animated Link ─────────────────────────────────────────────────── */
function AnimLink({ label, onClick, delay }: { label: string; onClick: () => void; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      viewport={{ once: true }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative text-gray-400 hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2 group"
      >
        {/* Animated dash */}
        <motion.span
          className="block h-px bg-primary"
          animate={{ width: hovered ? 16 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <span className="relative">
          {label}
          <motion.span
            className="absolute bottom-0 left-0 h-px bg-primary"
            animate={{ width: hovered ? "100%" : "0%" }}
            transition={{ duration: 0.25 }}
          />
        </span>
      </button>
    </motion.li>
  );
}

/* ─── Scan Line ─────────────────────────────────────────────────────── */
function ScanLine() {
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
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none"
      animate={h > 0 ? { y: [0, h] } : {}}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN FOOTER
═══════════════════════════════════════════════════════════════════════ */
export function Footer() {
  const [scrollY, setScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 64;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: "smooth" });
    }
  };

  const quickLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
  ];

  const moreLinks = [
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ];

  /* Particles */
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 5,
  }));

  return (
    <>
      <footer className="relative bg-black border-t border-primary/20 overflow-hidden">
        <ScanLine />

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />)}

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(rgba(239,68,68,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Glow center-bottom */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.07) 0%, transparent 70%)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">

            {/* ── Brand ── */}
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <motion.div
                className="flex items-center space-x-3 mb-5"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-11 h-10 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-white font-bold text-xl tracking-tight">OFT</span>
                  </motion.div>
                  {/* Corner decos on logo */}
                  <motion.div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary/80"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} />
                  <motion.div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary/80"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} viewport={{ once: true }} />
                </div>
                <span className="text-white text-xl font-bold">
                  <GlitchText>Ömer Faruk TÜRKDOĞDU</GlitchText>
                </span>
              </motion.div>

              {/* Quote */}
              <motion.div
                className="relative pl-4 border-l-2 border-primary/40"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-sm leading-relaxed font-mono">
                  There's always a bigger fish in the sea,<br />
                  That fish is going to be us tomorrow.
                </p>
                <motion.div
                  className="absolute left-0 top-0 w-0.5 bg-primary"
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </motion.div>

              {/* Status dot */}
              <motion.div
                className="flex items-center gap-2 mt-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <motion.div
                    className="absolute inset-0 w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
                <span className="text-gray-500 text-xs font-mono tracking-widest uppercase">Available for work</span>
              </motion.div>
            </motion.div>

            {/* ── Quick Links ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1 h-5 bg-primary rounded-full block" />
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h3>
              </div>
              <ul className="space-y-3">
                {quickLinks.map((link, i) => (
                  <AnimLink key={link.id} label={link.label} onClick={() => scrollToSection(link.id)} delay={0.3 + i * 0.07} />
                ))}
              </ul>
            </motion.div>

            {/* ── More Links ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1 h-5 bg-primary rounded-full block" />
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">More</h3>
              </div>
              <ul className="space-y-3">
                {moreLinks.map((link, i) => (
                  <AnimLink key={link.id} label={link.label} onClick={() => scrollToSection(link.id)} delay={0.4 + i * 0.07} />
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ── Bottom Bar ── */}
          <motion.div
            className="relative pt-8 border-t border-primary/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Animated border fill */}
            <motion.div
              className="absolute top-0 left-0 h-px bg-gradient-to-r from-primary/60 to-transparent"
              initial={{ width: "0%" }}
              whileInView={{ width: "40%" }}
              transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs font-mono text-center md:text-left">
                © {new Date().getFullYear()}{" "}
                <span className="text-primary/70">Developer Portfolio</span>
                {" "}— All rights reserved.
              </p>

              {/* Scroll progress indicator */}
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-xs font-mono">scroll</span>
                <div className="relative w-24 h-px bg-primary/20 overflow-hidden rounded-full">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-primary rounded-full"
                    style={{
                      width: `${Math.min(100, (scrollY / (document.body.scrollHeight - window.innerHeight || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-gray-600 text-xs font-mono w-8">
                  {Math.min(100, Math.round((scrollY / (document.body.scrollHeight - window.innerHeight || 1)) * 100))}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* ── Back to Top (Magnetic) ── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            className="fixed bottom-8 right-8 z-40"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <MagneticBtn
              onClick={() => scrollToSection("home")}
              className="relative p-3.5 bg-primary hover:bg-red-700 text-white rounded-full shadow-lg shadow-primary/20 transition-colors duration-300 overflow-hidden group"
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ x: ["−100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
              {/* Corner decos */}
              <motion.div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />

              <motion.svg
                className="w-5 h-5 relative z-10"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </motion.svg>
            </MagneticBtn>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
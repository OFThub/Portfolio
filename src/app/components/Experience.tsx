import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "../../i18n";

/* ─── Corner Decoration (tüm bileşenlerle aynı) ─────────────────────── */
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

/* ─── Floating Particle ──────────────────────────────────────────────── */
function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/30 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -28, 0], opacity: [0, 0.7, 0], scale: [0, 1.4, 0] }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Glitch Text ────────────────────────────────────────────────────── */
function GlitchText({ children }: { children: string }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const run = () => { setGlitching(true); setTimeout(() => setGlitching(false), 180); };
    const id = setInterval(run, 4500 + Math.random() * 3000);
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

/* ─── Scan Line ──────────────────────────────────────────────────────── */
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
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-10"
      animate={h > 0 ? { y: [0, h] } : {}}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── GlowCard (mouse spotlight – Contact ile aynı) ─────────────────── */
function GlowCard({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`spotlight relative overflow-hidden ${className}`}
      style={{
        boxShadow: hovered ? "0 0 50px rgba(239,68,68,0.08)" : "none",
        transition: "box-shadow 0.3s",
      }}
    >
      <CornerDeco position="tl" />
      <CornerDeco position="tr" />
      <CornerDeco position="bl" />
      <CornerDeco position="br" />
      {children}
    </motion.div>
  );
}

/* ─── Animated Tech Badge ────────────────────────────────────────────── */
function TechBadge({ label, delay }: { label: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35, type: "spring", stiffness: 300 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-3 py-1 bg-secondary border border-primary/20 text-gray-300 text-xs rounded-full cursor-default overflow-hidden"
      style={{
        borderColor: hovered ? "rgba(239,68,68,0.5)" : undefined,
        color: hovered ? "rgba(239,68,68,0.9)" : undefined,
        transition: "border-color 0.2s, color 0.2s",
      }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="glow"
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(239,68,68,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
    </motion.span>
  );
}

/* ─── Achievement Item ───────────────────────────────────────────────── */
function AchievementItem({ text, delay }: { text: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-sm text-gray-400 flex items-start gap-2 group"
    >
      <motion.span
        className="text-primary mt-0.5 flex-shrink-0"
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        ▸
      </motion.span>
      <motion.span
        animate={{ color: hovered ? "rgb(209,213,219)" : "rgb(156,163,175)" }}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.span>
    </motion.li>
  );
}

/* ─── Animated Timeline Dot ─────────────────────────────────────────── */
function TimelineDot() {
  return (
    <div className="absolute left-0 md:left-1/2 z-10 md:-translate-x-1/2">
      <motion.div
        className="w-4 h-4 bg-primary rounded-full border-4 border-black relative"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Pulse rings */}
        {[0, 0.5, 1].map((d) => (
          <motion.div
            key={d}
            className="absolute inset-0 rounded-full border border-primary/40"
            animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
            transition={{ duration: 2, delay: d, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Animated Timeline Line ─────────────────────────────────────────── */
function TimelineLine() {
  return (
    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 overflow-hidden">
      {/* Static base */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
      {/* Animated energy pulse */}
      <motion.div
        className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary to-transparent opacity-70"
        animate={{ top: ["-100%", "120%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN EXPERIENCE COMPONENT
═══════════════════════════════════════════════════════════════════════ */
/* Technology names are not translated, so they stay out of the dictionary and
   are zipped onto the translated entries by position. */
const EXPERIENCE_TECHNOLOGIES = [
  ["React", "Node.js", "AWS", "MongoDB", "TypeScript", "Docker"],
];

export function Experience() {
  const { t } = useI18n();
  const experiences = t.experience.items.map((item, i) => ({
    ...item,
    technologies: EXPERIENCE_TECHNOLOGIES[i] ?? [],
  }));

  /* Particles */
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 5,
  }));

  return (
    <section id="experience" className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />)}

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(239,68,68,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glows */}
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          {/* Overline */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-px bg-gradient-to-r from-transparent to-primary/60"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
            <span className="text-primary/70 text-sm tracking-[0.3em] uppercase font-mono">{t.experience.overline}</span>
            <motion.div
              className="h-px bg-gradient-to-l from-transparent to-primary/60"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <motion.span
              className="text-white inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t.experience.titleLead}{" "}
            </motion.span>
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <GlitchText>{t.experience.titleAccent}</GlitchText>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-mono"
          >
            {t.experience.subtitle}
          </motion.p>

          {/* Animated underline */}
          <motion.div
            className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "40%" }}
            transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
          />
        </motion.div>

        {/* ── Timeline ── */}
        <div className="relative">
          <TimelineLine />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative flex items-start ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <TimelineDot />

                {/* ── Card ── */}
                <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <GlowCard
                    delay={index * 0.15}
                    className="p-6 bg-card border border-primary/20 rounded-lg"
                  >
                    <ScanLine />

                    {/* Card Header */}
                    <div className="mb-5">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <motion.h3
                          className="text-xl font-bold text-white"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          {exp.title}
                        </motion.h3>

                        <motion.span
                          className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full flex-shrink-0 border border-primary/30 font-mono"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                          viewport={{ once: true }}
                        >
                          {exp.type}
                        </motion.span>
                      </div>

                      {/* Company */}
                      <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <span className="w-1 h-5 bg-primary/60 rounded-full" />
                        <p className="text-lg text-primary font-semibold">{exp.company}</p>
                      </motion.div>

                      {/* Meta */}
                      <motion.div
                        className="flex flex-wrap gap-4 text-sm text-gray-500 font-mono"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary/60" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary/60" />
                          {exp.location}
                        </span>
                      </motion.div>
                    </div>

                    {/* Divider */}
                    <motion.div
                      className="h-px bg-gradient-to-r from-primary/30 to-transparent mb-4"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      viewport={{ once: true }}
                    />

                    {/* Description */}
                    <motion.p
                      className="text-gray-400 text-sm mb-5 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      viewport={{ once: true }}
                    >
                      {exp.description}
                    </motion.p>

                    {/* Achievements */}
                    <div className="mb-5">
                      <motion.h4
                        className="text-xs font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-widest"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        {t.experience.achievementsTitle}
                      </motion.h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <AchievementItem key={i} text={achievement} delay={0.55 + i * 0.07} />
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-2">{t.experience.stackTitle}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <TechBadge key={i} label={tech} delay={0.65 + i * 0.06} />
                        ))}
                      </div>
                    </motion.div>

                  </GlowCard>
                </div>

                {/* ── Opposing date label (desktop) ── */}
                <div className={`hidden md:flex md:w-1/2 items-center ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 md:justify-end"}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="spotlight relative px-4 py-2 border border-primary/30 rounded-lg bg-primary/5 font-mono text-sm text-primary/80"
                  >
                    <CornerDeco position="tl" />
                    <CornerDeco position="br" />
                    {/* Dot indicator */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <motion.div
                          className="absolute inset-0 w-2 h-2 rounded-full bg-green-500"
                          animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      </div>
                      {exp.period}
                    </div>
                  </motion.div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { GraduationCap, Award, BookOpen, Code2, Terminal, Cpu } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

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

/* ─── GlowCard ───────────────────────────────────────────────────────── */
function GlowCard({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`spotlight relative overflow-hidden ${className}`}
      style={{ boxShadow: hovered ? "0 0 50px rgba(239,68,68,0.08)" : "none", transition: "box-shadow 0.3s" }}
    >
      <CornerDeco position="tl" />
      <CornerDeco position="tr" />
      <CornerDeco position="bl" />
      <CornerDeco position="br" />
      {children}
    </motion.div>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────────────── */
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay * 1000); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 30);
    return () => clearTimeout(t);
  }, [started, displayed, text]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle" />
      )}
    </span>
  );
}

/* ─── Code Terminal (foto yerine) ───────────────────────────────────── */
const CODE_LINES = [
  { indent: 0, text: "const developer = {",           color: "text-gray-300" },
  { indent: 1, text: 'name: "Ömer Faruk",',           color: "text-green-400" },
  { indent: 1, text: 'role: "Full Stack Dev",',        color: "text-green-400" },
  { indent: 1, text: 'university: "Sakarya Uni.",',    color: "text-green-400" },
  { indent: 1, text: "passion: [",                    color: "text-yellow-400" },
  { indent: 2, text: '"Building Products",',          color: "text-blue-300" },
  { indent: 2, text: '"Clean Architecture",',         color: "text-blue-300" },
  { indent: 2, text: '"Open Source",',                color: "text-blue-300" },
  { indent: 1, text: "],",                            color: "text-yellow-400" },
  { indent: 1, text: 'status: "Available 🟢",',       color: "text-green-400" },
  { indent: 0, text: "};",                            color: "text-gray-300" },
];

function CodeTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    const el = document.getElementById("code-terminal");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started || visibleLines >= CODE_LINES.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 80);
    return () => clearTimeout(t);
  }, [started, visibleLines]);

  return (
    <motion.div
      id="code-terminal"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="spotlight relative rounded-xl overflow-hidden border border-primary/20 bg-[#0d0d0d]"
      style={{ boxShadow: "0 0 60px rgba(239,68,68,0.06), inset 0 0 40px rgba(0,0,0,0.4)" }}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161616] border-b border-primary/10">
        <div className="flex gap-1.5">
          <motion.div className="w-3 h-3 rounded-full bg-red-500/80" whileHover={{ scale: 1.2 }} />
          <motion.div className="w-3 h-3 rounded-full bg-yellow-500/80" whileHover={{ scale: 1.2 }} />
          <motion.div className="w-3 h-3 rounded-full bg-green-500/80" whileHover={{ scale: 1.2 }} />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-gray-500 text-xs font-mono">developer.ts</span>
        </div>
        {/* Live dot */}
        <div className="relative flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <motion.div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-green-500" animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-gray-600 text-xs font-mono">live</span>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-5 font-mono text-sm leading-7 min-h-[320px]">
        {/* Line numbers + code */}
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-4"
          >
            <span className="text-gray-700 text-xs select-none w-4 text-right flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span className={`${line.color}`} style={{ paddingLeft: `${line.indent * 16}px` }}>
              {line.text}
            </span>
          </motion.div>
        ))}

        {/* Cursor */}
        {visibleLines < CODE_LINES.length && (
          <div className="flex items-start gap-4">
            <span className="text-gray-700 text-xs select-none w-4 text-right flex-shrink-0 mt-0.5">{visibleLines + 1}</span>
            <motion.div className="w-2 h-5 bg-primary/80 rounded-sm" animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
          </div>
        )}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Scan line */}
      <ScanLine />

      {/* Corner decos */}
      <CornerDeco position="tl" />
      <CornerDeco position="tr" />
      <CornerDeco position="bl" />
      <CornerDeco position="br" />
    </motion.div>
  );
}

/* ─── Section Title ──────────────────────────────────────────────────── */
function SectionTitle({ icon: Icon, title, delay = 0 }: { icon: React.ElementType; title: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-8"
    >
      <motion.div
        className="p-2 bg-primary/10 border border-primary/30 rounded-lg"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.2)" }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon className="w-6 h-6 text-primary" />
      </motion.div>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <motion.div
        className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN ABOUT COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function About() {
  const education = [
    {
      degree: "Bachelor of Science in Computer Engineering",
      institution: "Sakarya University",
      year: "2023 - 2027",
      description:
        "Focused on software development, algorithms, and system design. Graduating with a strong foundation in both hardware and software principles, ready to tackle real-world challenges in the tech industry.",
    },
  ];

  const certifications = ["Software Persona - Software Development Intern", "KOSGEB - KOSGEB Entrepreneurship Training Certificate of Participation","Borusan Technology School Certificate","Borusan School of Equality","Borusan School of Sustainability"];

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 5,
  }));

  const traits = [
    { icon: Code2, label: "Clean Code", desc: "Maintainable & readable" },
    { icon: Cpu,   label: "Systems Thinking", desc: "End-to-end mindset" },
    { icon: Terminal, label: "Always Learning", desc: "Curiosity-driven" },
  ];

  return (
    <section id="about" className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />)}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(239,68,68,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)" }}
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div className="flex items-center justify-center gap-4 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <motion.div className="h-px bg-gradient-to-r from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4, duration: 0.8 }} />
            <span className="text-primary/70 text-sm tracking-[0.3em] uppercase font-mono">Who I Am</span>
            <motion.div className="h-px bg-gradient-to-l from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4, duration: 0.8 }} />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <motion.span className="text-white inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>About{" "}</motion.span>
            <motion.span className="text-primary inline-block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <GlitchText>Me</GlitchText>
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-xl text-gray-400 max-w-3xl mx-auto font-mono">
            <Typewriter text="Passionate developer dedicated to creating exceptional digital experiences" delay={0.8} />
          </motion.p>

          <motion.div className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ delay: 0.9, duration: 1, ease: "easeOut" }} />
        </motion.div>

        {/* ── Profile Section ── */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">

          {/* Code Terminal */}
          <CodeTerminal />

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-1 h-8 bg-primary rounded-full" />
              <h2 className="text-3xl font-bold text-white">Full Stack Developer</h2>
            </motion.div>

            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              {[
                "I'm a passionate full-stack developer with a love for creating beautiful, functional, and user-friendly applications. My journey in Computer Engineering began with a curiosity for how things work and evolved into a career focused on building solutions that make a difference.",
                "With a strong curiosity across all areas of technology, I continuously strive to expand my knowledge and push my boundaries. I enjoy exploring diverse domains, understanding how systems work end-to-end, and turning ideas into structured, practical solutions.",
                "Passionate about transforming theoretical knowledge into practical applications, consistently exceeding expectations and contributing to team success.",
              ].map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Traits */}
            <div className="mt-8 space-y-3">
              {traits.map((t, i) => (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 4 }}
                  className="spotlight relative flex items-center gap-3 p-3 bg-secondary/50 border border-primary/10 rounded-lg group cursor-default"
                  style={{ transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.1)")}
                >
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <t.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.label}</p>
                    <p className="text-gray-500 text-xs font-mono">{t.desc}</p>
                  </div>
                  <motion.div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary/40" animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Education ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <SectionTitle icon={GraduationCap} title="Education" />

          <div className="space-y-6">
            {education.map((edu, index) => (
              <GlowCard
                key={index}
                delay={index * 0.15}
                className="p-6 bg-card border border-primary/20 rounded-lg"
              >
                <ScanLine />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                  <motion.h3
                    className="text-xl font-bold text-white"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}
                  >
                    {edu.degree}
                  </motion.h3>
                  <motion.span
                    className="text-primary text-xs font-mono border border-primary/30 bg-primary/5 px-3 py-1 rounded-full flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 300 }} viewport={{ once: true }}
                  >
                    {edu.year}
                  </motion.span>
                </div>

                <motion.div
                  className="flex items-center gap-2 mb-3"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} viewport={{ once: true }}
                >
                  <span className="w-1 h-4 bg-primary/60 rounded-full" />
                  <p className="text-primary font-semibold">{edu.institution}</p>
                </motion.div>

                <motion.div
                  className="h-px bg-gradient-to-r from-primary/30 to-transparent mb-4"
                  initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.8 }} viewport={{ once: true }}
                />

                <motion.p
                  className="text-gray-400 text-sm leading-relaxed"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.45 }} viewport={{ once: true }}
                >
                  {edu.description}
                </motion.p>
              </GlowCard>
            ))}
          </div>
        </motion.div>

        {/* ── Certifications ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <SectionTitle icon={Award} title="Certifications" delay={0.1} />

          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4, type: "spring", stiffness: 300 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="spotlight relative p-4 bg-card border border-primary/20 rounded-lg flex items-center gap-3 overflow-hidden group cursor-default"
                style={{ transition: "border-color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)")}
              >
                <CornerDeco position="tl" />
                <CornerDeco position="br" />
                <motion.div
                  className="p-2 bg-primary/10 rounded-lg"
                  whileHover={{ backgroundColor: "rgba(239,68,68,0.2)", rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Award className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-gray-300 text-sm">{cert}</span>
                <motion.span className="ml-auto text-xs text-primary/0 group-hover:text-primary/60 transition-colors">↗</motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Philosophy ── */}
        <GlowCard className="p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg">
          <ScanLine />

          <SectionTitle icon={BookOpen} title="My Philosophy" delay={0.1} />

          <div className="space-y-5 text-gray-400">
            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="relative pl-5 border-l-2 border-primary/50"
            >
              <motion.div
                className="absolute left-0 top-0 w-0.5 bg-primary"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                viewport={{ once: true }}
              />
              <p className="text-lg text-gray-200 italic font-light leading-relaxed">
                "Coding, like invention, starts with careful observation of the world and turns insight into technology that improves human life."
              </p>
            </motion.div>

            <motion.p
              className="text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              As an engineer, I am driven by the desire to solve real-world problems and make a meaningful impact. I focus on building solutions that reduce repetitive and demanding work, enabling people to dedicate more time to their passions and lead more fulfilling lives.
            </motion.p>

            <motion.p
              className="text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              I believe technology should empower people — not replace them — helping them work more efficiently, create greater value, and ultimately gain more time and financial freedom rather than eliminating opportunities.
            </motion.p>
          </div>
        </GlowCard>

      </div>
    </section>
  );
}
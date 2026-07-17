import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
    />
  );
}

/* ─── Floating Particle ──────────────────────────────────────────────── */
function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/25 pointer-events-none"
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
function ScanLine({ duration = 6 }: { duration?: number }) {
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
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none z-20"
      animate={h > 0 ? { y: [0, h] } : {}}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Tech Badge ─────────────────────────────────────────────────────── */
function TechBadge({ label, delay }: { label: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, type: "spring", stiffness: 300 }}
      viewport={{ once: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-xs px-2 py-1 bg-secondary border rounded overflow-hidden cursor-default"
      style={{
        borderColor: hovered ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.1)",
        color: hovered ? "rgba(239,68,68,0.9)" : "rgb(209,213,219)",
        transition: "border-color 0.2s, color 0.2s",
      }}
    >
      {hovered && (
        <motion.span className="absolute inset-0" style={{ background: "rgba(239,68,68,0.07)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      )}
      <span className="relative z-10">{label}</span>
    </motion.span>
  );
}

/* ─── Section Title ──────────────────────────────────────────────────── */
function SectionTitle({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-8"
    >
      <span className="w-1 h-7 bg-primary rounded-full" />
      <h2 className="text-3xl font-bold text-white">{children}</h2>
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

/* ─── Featured Article Card ──────────────────────────────────────────── */
function FeaturedCard({ post, index }: { post: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group bg-card border border-primary/20 rounded-lg overflow-hidden cursor-pointer"
      style={{
        borderColor: hovered ? "rgba(239,68,68,0.45)" : "rgba(239,68,68,0.2)",
        boxShadow: hovered ? "0 0 40px rgba(239,68,68,0.09)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: `radial-gradient(220px circle at ${spotX.get()}px ${spotY.get()}px, rgba(239,68,68,0.07) 0%, transparent 70%)` }}
        />
      )}
      <ScanLine duration={7 + index} />
      <CornerDeco position="tl" />
      <CornerDeco position="tr" />
      <CornerDeco position="bl" />
      <CornerDeco position="br" />

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <motion.div
          className="w-full h-full"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Featured badge */}
        <motion.div
          className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs rounded-full font-mono border border-red-400/30 z-20"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.12, type: "spring", stiffness: 300 }}
          viewport={{ once: true }}
        >
          Featured
        </motion.div>

        {/* Pulse dot top right */}
        <motion.div
          className="absolute top-4 right-4 z-20"
        >
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <motion.div
              className="absolute inset-0 w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <motion.div
          className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.12 }}
          viewport={{ once: true }}
        >
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary/60" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary/60" />
            {post.readTime}
          </span>
        </motion.div>

        <motion.div
          className="h-px bg-gradient-to-r from-primary/40 to-transparent mb-4"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.45 + index * 0.12, duration: 0.8 }}
          viewport={{ once: true }}
        />

        <motion.h3
          className="text-2xl font-bold text-white mb-3"
          style={{ color: hovered ? "rgb(239,68,68)" : "white", transition: "color 0.2s" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.12 }}
          viewport={{ once: true }}
        >
          {post.title}
        </motion.h3>

        <motion.p
          className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.45 + index * 0.12 }}
          viewport={{ once: true }}
        >
          {post.excerpt}
        </motion.p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {post.tags?.slice(0, 2).map((tag: string, i: number) => (
              <TechBadge key={tag} label={tag} delay={0.5 + index * 0.12 + i * 0.06} />
            ))}
          </div>
          <motion.span
            className="text-primary flex items-center gap-1 text-sm font-mono"
            animate={{ x: hovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Read more
            <motion.span animate={{ x: hovered ? [0, 4, 0] : 0 }} transition={{ duration: 0.8, repeat: hovered ? Infinity : 0 }}>
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.span>
        </div>
      </div>

      {/* Pulse dot bottom right */}
      <motion.div
        className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/40 z-10"
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.5 }}
      />
    </motion.article>
  );
}

/* ─── Regular Article Card ───────────────────────────────────────────── */
function ArticleCard({ post, index }: { post: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      className="relative group bg-card border border-primary/20 rounded-lg overflow-hidden cursor-pointer flex flex-col h-full"
      style={{
        borderColor: hovered ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.2)",
        boxShadow: hovered ? "0 0 30px rgba(239,68,68,0.07)" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: `radial-gradient(180px circle at ${spotX.get()}px ${spotY.get()}px, rgba(239,68,68,0.06) 0%, transparent 70%)` }}
        />
      )}
      <CornerDeco position="tl" />
      <CornerDeco position="br" />
      <ScanLine duration={8 + index} />

      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <motion.div
          className="w-full h-full"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary/60" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary/60" />
            {post.readTime}
          </span>
        </div>

        <motion.div
          className="h-px bg-gradient-to-r from-primary/30 to-transparent mb-3"
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: index * 0.12 + 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        />

        <h3
          className="text-lg font-bold mb-2 line-clamp-2 transition-colors duration-200"
          style={{ color: hovered ? "rgb(239,68,68)" : "white" }}
        >
          {post.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {post.tags?.map((tag: string, i: number) => (
            <TechBadge key={tag} label={tag} delay={index * 0.12 + 0.4 + i * 0.05} />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-primary/40 z-10"
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
      />
    </motion.article>
  );
}

/* ─── Coming Soon Screen ─────────────────────────────────────────────── */
function ComingSoon() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 80);
    return () => clearInterval(id);
  }, []);

  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const scramble = (word: string) =>
    word
      .split("")
      .map((c, i) => (i < Math.floor(tick / 3) % (word.length + 1) ? c : CHARS[Math.floor(Math.random() * CHARS.length)])    )
      .join("");

  return (
    <section id="blog" className="relative min-h-screen pt-24 pb-16 flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <Particle key={i} x={Math.random() * 100} y={Math.random() * 100} delay={Math.random() * 5} />
        ))}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(239,68,68,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Central card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center max-w-lg px-8 py-12 bg-card border border-primary/20 rounded-lg overflow-hidden"
        style={{ boxShadow: "0 0 80px rgba(239,68,68,0.07)" }}
      >
        <ScanLine duration={5} />
        <CornerDeco position="tl" />
        <CornerDeco position="tr" />
        <CornerDeco position="bl" />
        <CornerDeco position="br" />

        {/* Icon */}
        <motion.div
          className="mx-auto mb-6 w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Tag className="w-8 h-8 text-primary" />
          {/* Corner decos on icon */}
          <motion.div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
          <motion.div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
        </motion.div>

        {/* Overline */}
        <motion.div className="flex items-center justify-center gap-3 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <motion.div className="h-px bg-gradient-to-r from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.5, duration: 0.8 }} />
          <span className="text-primary/70 text-xs tracking-[0.3em] uppercase font-mono">Status</span>
          <motion.div className="h-px bg-gradient-to-l from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.5, duration: 0.8 }} />
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-3">
          Blog <span className="text-primary"><GlitchText>Coming Soon</GlitchText></span>
        </h1>

        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-4"
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ delay: 0.6, duration: 1 }}
        />

        <p className="text-gray-400 text-sm font-mono leading-relaxed mb-6">
          I'll be sharing insights and technical articles here soon.
        </p>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2"
        >
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <motion.div className="absolute inset-0 w-2 h-2 rounded-full bg-yellow-500" animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
          <span className="text-yellow-500/70 text-xs font-mono tracking-widest uppercase">In Progress</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN BLOG COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function Blog() {
  const blogPosts = [
    {
      id: "",
      title: "",
      excerpt: "",
      image: "",
      date: "",
      readTime: "",
      tags: ["React", "JavaScript", "Web Development"],
      featured: true,
    },
  ];

  /* If no real posts, show coming soon */
  const hasRealPosts = blogPosts.some((p) => p.id !== "" && p.title !== "");
  if (!hasRealPosts) return <ComingSoon />;

  const featuredPosts = blogPosts.filter((p) => p.featured);
  const recentPosts   = blogPosts.filter((p) => !p.featured);

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 5,
  }));

  return (
    <section id="blog" className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

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
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)" }}
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.div className="flex items-center justify-center gap-4 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <motion.div className="h-px bg-gradient-to-r from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4, duration: 0.8 }} />
            <span className="text-primary/70 text-sm tracking-[0.3em] uppercase font-mono">Articles</span>
            <motion.div className="h-px bg-gradient-to-l from-transparent to-primary/60" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ delay: 0.4, duration: 0.8 }} />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <motion.span className="text-white inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>Tech{" "}</motion.span>
            <motion.span className="text-primary inline-block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <GlitchText>Blog</GlitchText>
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-xl text-gray-400 max-w-3xl mx-auto font-mono">
            Insights, tutorials, and thoughts on web development and technology
          </motion.p>

          <motion.div className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ delay: 0.9, duration: 1 }} />
        </motion.div>

        {/* ── Featured Posts ── */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <SectionTitle delay={0.1}>Featured Articles</SectionTitle>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, i) => (
                <FeaturedCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Posts ── */}
        {recentPosts.length > 0 && (
          <div>
            <SectionTitle delay={0.1}>Recent Articles</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, i) => (
                <ArticleCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
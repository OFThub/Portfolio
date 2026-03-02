"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram, Youtube } from "lucide-react";
import emailjs from "@emailjs/browser";

type Status = "idle" | "loading" | "success" | "error";

/* ─── Floating Particle ─────────────────────────────────────────────── */
function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-primary/40 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─── Magnetic Button ───────────────────────────────────────────────── */
function MagneticButton({
  children,
  className,
  disabled,
  type,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

/* ─── Animated Input ────────────────────────────────────────────────── */
function AnimatedInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
  maxLength,
  error,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        className="absolute left-4 pointer-events-none text-gray-400 origin-left z-10"
        animate={{
          top: active ? "6px" : "50%",
          y: active ? "0%" : "-50%",
          scale: active ? 0.75 : 1,
          color: focused ? "rgb(239,68,68)" : "rgb(156,163,175)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {label}
      </motion.label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={active ? placeholder : undefined}
        className="w-full pt-6 pb-2 px-4 bg-secondary border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
        style={{
          borderColor: focused ? "rgba(239,68,68,0.7)" : error ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.2)",
          boxShadow: focused ? "0 0 0 2px rgba(239,68,68,0.15)" : "none",
        }}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-400 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Typewriter ────────────────────────────────────────────────────── */
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 35);
    return () => clearTimeout(t);
  }, [started, displayed, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

/* ─── Glitch Text ───────────────────────────────────────────────────── */
function GlitchText({ children }: { children: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const run = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    };
    const id = setInterval(run, 4000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block">
      {children}
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-red-400 opacity-70"
            style={{ clipPath: "inset(0 0 60% 0)", transform: "translateX(-3px)" }}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-cyan-400 opacity-70"
            style={{ clipPath: "inset(60% 0 0 0)", transform: "translateX(3px)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}

/* ─── Scan Line ─────────────────────────────────────────────────────── */
function ScanLine() {
  return (
    <motion.div
      className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none z-10"
      animate={{ top: ["0%", "100%", "0%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Corner Decoration ─────────────────────────────────────────────── */
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
      transition={{ delay: 0.8, duration: 0.4 }}
    />
  );
}

/* ─── Card with glow ────────────────────────────────────────────────── */
function GlowCard({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden p-8 bg-card border border-primary/20 rounded-lg ${className}`}
      style={{
        boxShadow: hovered ? "0 0 40px rgba(239,68,68,0.08)" : "none",
        transition: "box-shadow 0.3s",
      }}
    >
      <CornerDeco position="tl" />
      <CornerDeco position="tr" />
      <CornerDeco position="bl" />
      <CornerDeco position="br" />
      {hovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(200px circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(239,68,68,0.06) 0%, transparent 70%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN CONTACT COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [hp, setHp] = useState("");
  const [formStartTs] = useState(() => Date.now());

  const MIN_MSG = 30, MAX_MSG = 1500, MIN_SUBJECT = 3, MAX_SUBJECT = 120;

  /* Particles */
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
      })),
    []
  );

  const contactInfo = useMemo(
    () => [
      { icon: Mail,   label: "Email",    value: "oturkdogdu1@gmail.com",  link: "mailto:oturkdogdu1@gmail.com" },
      { icon: Phone,  label: "Phone",    value: "+90 551 682 34 80",       link: "tel:+905516823480" },
      { icon: MapPin, label: "Location", value: "Istanbul, Turkey",        link: null as string | null },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      { icon: Github,    label: "GitHub",    link: "https://github.com/OFThub/",                        color: "hover:text-white",      glow: "rgba(255,255,255,0.15)" },
      { icon: Linkedin,  label: "LinkedIn",  link: "https://www.linkedin.com/in/omerfarukoft/",          color: "hover:text-blue-400",   glow: "rgba(59,130,246,0.15)" },
      { icon: Instagram, label: "Instagram", link: "https://www.instagram.com/omerfaruk.oft/",           color: "hover:text-pink-400",   glow: "rgba(236,72,153,0.15)" },
      { icon: Youtube,   label: "YouTube",   link: "https://www.youtube.com/@oft.omerfaruk",             color: "hover:text-red-400",    glow: "rgba(239,68,68,0.15)" },
    ],
    []
  );

  const countLinks = (s: string) => (s.match(/https?:\/\//gi) || []).length;
  const looksSpammy = (s: string) => /(.)\1{8,}/.test(s) || countLinks(s) > 2;

  const validate = () => {
    const e: Record<string, string> = {};
    const subj = formData.subject.trim();
    const msg  = formData.message.trim();
    if (hp.trim().length > 0) e._ = "Spam tespit edildi.";
    if (Date.now() - formStartTs < 2500) e._ = "Çok hızlı gönderim.";
    if (subj.length < MIN_SUBJECT) e.subject = `En az ${MIN_SUBJECT} karakter.`;
    if (subj.length > MAX_SUBJECT) e.subject = `En fazla ${MAX_SUBJECT} karakter.`;
    if (msg.length < MIN_MSG) e.message = `En az ${MIN_MSG} karakter.`;
    if (msg.length > MAX_MSG) e.message = `En fazla ${MAX_MSG} karakter.`;
    if (looksSpammy(`${subj} ${msg}`)) e.message = "Mesaj spam gibi görünüyor.";
    return e;
  };

  const canSendNow = () => {
    const key = "contact_last_sent_ts";
    const last = Number(localStorage.getItem(key) || "0");
    const now  = Date.now();
    const ms   = 60_000;
    if (now - last < ms) return { ok: false, waitSec: Math.ceil((ms - (now - last)) / 1000) };
    localStorage.setItem(key, String(now));
    return { ok: true, waitSec: 0 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage({ type: "", text: "" });

    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      setStatus("error");
      if (v._) setMessage({ type: "error", text: v._ });
      return;
    }

    const rl = canSendNow();
    if (!rl.ok) {
      setStatus("error");
      setMessage({ type: "error", text: `${rl.waitSec} sn sonra tekrar deneyin.` });
      return;
    }

    setSending(true);
    setStatus("loading");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: formData.name, reply_to: formData.email, subject: formData.subject, message: formData.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setMessage({ type: "success", text: "Mesajınız başarıyla gönderildi!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setHp("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setMessage({ type: "error", text: `Gönderim başarısız: ${err?.text || err?.message || "Bilinmeyen hata"}` });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* ── Textarea focus state ── */
  const [textareaFocused, setTextareaFocused] = useState(false);

  return (
    <section id="contact" className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* ── Background particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} x={p.x} y={p.y} delay={p.delay} />
        ))}

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(239,68,68,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow top-left */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Radial glow bottom-right */}
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          {/* Overline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <motion.div
              className="h-px bg-gradient-to-r from-transparent to-primary/60"
              style={{ width: 80 }}
            />
            <span className="text-primary/70 text-sm tracking-[0.3em] uppercase font-mono">Get in touch</span>
            <motion.div
              className="h-px bg-gradient-to-l from-transparent to-primary/60"
              style={{ width: 80 }}
            />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            <motion.span
              className="text-white inline-block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Contact{" "}
            </motion.span>
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <GlitchText>Me</GlitchText>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-mono"
          >
            <Typewriter text="Have a project in mind or just want to say hello? Don't hesitate to get in touch." delay={0.8} />
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Contact Form ── */}
          <GlowCard delay={0.2}>
            <ScanLine />
            <motion.h2
              className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="w-1 h-6 bg-primary rounded-full block" />
              Send Me a Message
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Company
                  <input type="text" name="company" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {/* Staggered fields */}
              {[
                { component: (
                  <AnimatedInput label="Name" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                )},
                { component: (
                  <AnimatedInput label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required />
                )},
                { component: (
                  <AnimatedInput label="Subject" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What's this about?" required minLength={MIN_SUBJECT} maxLength={MAX_SUBJECT} error={errors.subject} />
                )},
              ].map((field, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                >
                  {field.component}
                </motion.div>
              ))}

              {/* Textarea */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="relative">
                  <motion.label
                    htmlFor="message"
                    className="absolute left-4 pointer-events-none text-gray-400 origin-left z-10"
                    animate={{
                      top: textareaFocused || formData.message.length > 0 ? "8px" : "16px",
                      scale: textareaFocused || formData.message.length > 0 ? 0.75 : 1,
                      color: textareaFocused ? "rgb(239,68,68)" : "rgb(156,163,175)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    Message
                  </motion.label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setTextareaFocused(true)}
                    onBlur={() => setTextareaFocused(false)}
                    required
                    rows={6}
                    minLength={MIN_MSG}
                    maxLength={MAX_MSG}
                    className="w-full pt-8 pb-3 px-4 bg-secondary border rounded-lg text-white placeholder-gray-600 focus:outline-none transition-all duration-300 resize-none"
                    style={{
                      borderColor: textareaFocused ? "rgba(239,68,68,0.7)" : errors.message ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.2)",
                      boxShadow: textareaFocused ? "0 0 0 2px rgba(239,68,68,0.15)" : "none",
                    }}
                    placeholder={textareaFocused || formData.message.length > 0 ? "Tell me about your project..." : ""}
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                    <AnimatePresence mode="wait">
                      {errors.message ? (
                        <motion.span key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400">
                          {errors.message}
                        </motion.span>
                      ) : (
                        <motion.span key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          min {MIN_MSG} chars
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.span
                      animate={{ color: formData.message.length > MAX_MSG * 0.9 ? "rgb(239,68,68)" : "rgb(107,114,128)" }}
                    >
                      {formData.message.length}/{MAX_MSG}
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <MagneticButton
                  type="submit"
                  disabled={sending || status === "loading"}
                  className="relative w-full px-6 py-4 bg-primary hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden"
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                    animate={status !== "loading" ? { x: ["−100%", "200%"] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <span className="relative z-10">{sending ? "Sending..." : "Send Message"}</span>
                  <motion.div
                    className="relative z-10"
                    animate={sending ? { x: [0, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.6, repeat: sending ? Infinity : 0 }}
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </MagneticButton>
              </motion.div>

              {/* Status message */}
              <AnimatePresence>
                {message.text && (
                  <motion.div
                    key="msg"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    className={`p-4 rounded-lg text-center border text-sm font-mono ${
                      message.type === "success"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    {message.type === "success" && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block mr-2"
                      >
                        ✓
                      </motion.span>
                    )}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </GlowCard>

          {/* ── Right Column ── */}
          <div className="space-y-6">

            {/* Contact Details */}
            <GlowCard delay={0.35}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-primary rounded-full block" />
                Contact Information
              </h2>
              <div className="space-y-5">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-4 group"
                  >
                    <motion.div
                      className="p-3 bg-primary/10 rounded-lg border border-primary/20"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.2)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <info.icon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-0.5">{info.label}</p>
                      {info.link ? (
                        <a href={info.link} className="text-white hover:text-primary transition-colors text-sm">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-white text-sm">{info.value}</p>
                      )}
                    </div>
                    {/* Animated dot */}
                    <motion.div
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary/40"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    />
                  </motion.div>
                ))}
              </div>
            </GlowCard>

            {/* Social Links */}
            <GlowCard delay={0.5}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-6 bg-primary rounded-full block" />
                Connect With Me
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65 + i * 0.08, duration: 0.4, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative p-4 bg-secondary border border-primary/20 rounded-lg transition-all duration-300 flex items-center gap-3 group overflow-hidden ${social.color}`}
                    style={{ "--glow": social.glow } as React.CSSProperties}
                  >
                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                      style={{ background: `radial-gradient(circle at 30% 50%, ${social.glow} 0%, transparent 70%)` }}
                    />
                    <social.icon className="w-5 h-5 relative z-10 flex-shrink-0" />
                    <span className="text-gray-300 group-hover:text-inherit transition-colors text-sm relative z-10">
                      {social.label}
                    </span>
                    {/* Arrow on hover */}
                    <motion.span
                      className="ml-auto text-xs opacity-0 group-hover:opacity-60 transition-opacity relative z-10"
                    >
                      ↗
                    </motion.span>
                  </motion.a>
                ))}
              </div>
            </GlowCard>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg overflow-hidden"
            >
              <CornerDeco position="tl" />
              <CornerDeco position="tr" />
              <CornerDeco position="bl" />
              <CornerDeco position="br" />

              {/* Animated background pulse */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <motion.div
                      className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full"
                      animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-white font-bold">Available for Work</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  I'm currently available for freelance projects and full-time opportunities. Let's discuss how I can help bring your ideas to life!
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Footer Note ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="relative mt-12 p-8 bg-card border border-primary/20 rounded-lg text-center overflow-hidden"
        >
          <CornerDeco position="tl" />
          <CornerDeco position="tr" />
          <CornerDeco position="bl" />
          <CornerDeco position="br" />

          {/* Subtle scan */}
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <motion.h2
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Let's Work Together
          </motion.h2>

          <motion.p
            className="text-gray-400 max-w-3xl mx-auto leading-relaxed font-mono text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Learning is an endless ocean;<br />
            we are engineers navigating with devotion.<br />
            Every commit a direction, every bug a notion—<br />
            building logic from chaos with structured motion.<br />
            <br />
            Want to join the crew on this journey?<br />
            You won't be turned away.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
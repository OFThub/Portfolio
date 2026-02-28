"use client";

import { useEffect, useRef, useState } from "react";
import "./loading.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tech {
  label: string;
  color: string;
}

interface ParticleData {
  index: number;
  total: number;
  tech: Tech;
  startX: number;
  startY: number;
  x: number;
  y: number;
  ringAngle: number;
}

interface ExplosionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  decay: number;
  shape: "circle" | "rect";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECHS: Tech[] = [
  { label: "Re", color: "#61dafb" },  // React
  { label: "TS", color: "#3178c6" },  // TypeScript
  { label: "Nx", color: "#ffffff" },  // Next.js
  { label: "Tw", color: "#38bdf8" },  // Tailwind
  { label: "Vu", color: "#42b883" },  // Vue.js
  { label: "Nd", color: "#68a063" },  // Node.js
  { label: "Ex", color: "#ffffff" },  // Express
  { label: "Py", color: "#ffd43b" },  // Python
  { label: "Dj", color: "#44b78b" },  // Django
  { label: "Mg", color: "#13aa52" },  // MongoDB
  { label: "Pg", color: "#336791" },  // PostgreSQL
  { label: "Rd", color: "#dc382d" },  // Redis
  { label: "Fb", color: "#ffca28" },  // Firebase
  { label: "Aw", color: "#ff9900" },  // AWS
  { label: "Dk", color: "#2496ed" },  // Docker
  { label: "Ku", color: "#326ce5" },  // Kubernetes
  { label: "Vc", color: "#ffffff" },  // Vercel
  { label: "Rn", color: "#61dafb" },  // React Native
  { label: "Fl", color: "#54c5f8" },  // Flutter
  { label: "Gi", color: "#f05032" },  // Git
  { label: "Fg", color: "#a259ff" },  // Figma
  { label: "Pm", color: "#ff6c37" },  // Postman
  { label: "Gq", color: "#e10098" },  // GraphQL
  { label: "My", color: "#4479a1" },  // MySQL
];

// Animation phase timings (seconds)
const PHASE = {
  CONVERGE: { start: 0, end: 2.5 },
  SPIN:     { start: 2.5, end: 5.0 },
  WRITE:    { start: 3.5, end: 5.5 },
  EXPLODE:  { start: 5.6, end: 7.0 },
  DONE:     7.0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function phaseT(t: number, start: number, end: number): number {
  return clamp01((t - start) / (end - start));
}

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LoadingProps {
  onComplete?: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expCanvasRef = useRef<HTMLCanvasElement>(null);
  const sigContainerRef = useRef<HTMLDivElement>(null);
  const sigSubtitleRef = useRef<HTMLDivElement>(null);
  const expCanvasWrapRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const expCanvas = expCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const expCtx = expCanvas.getContext("2d")!;

    let W = 0, H = 0;

    function resize() {
      W = canvas.width = expCanvas.width = window.innerWidth;
      H = canvas.height = expCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Build particles
    const particles: ParticleData[] = TECHS.map((tech, i) => {
      const angle = (i / TECHS.length) * Math.PI * 2;
      return {
        index: i,
        total: TECHS.length,
        tech,
        startX: Math.random() * window.innerWidth,
        startY: Math.random() * window.innerHeight,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        ringAngle: angle,
      };
    });

    let expParticles: ExplosionParticle[] = [];
    let startTime: number | null = null;
    let explosionTriggered = false;
    let signatureShown = false;

    function triggerExplosion() {
      expParticles = Array.from({ length: 200 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 15;
        return {
          x: W / 2, y: H / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 8,
          color:
            Math.random() > 0.5
              ? "#e53e3e"
              : Math.random() > 0.5
              ? "#ffffff"
              : "#9b1c1c",
          life: 1,
          decay: 0.02 + Math.random() * 0.04,
          shape: Math.random() > 0.5 ? "circle" : "rect",
        };
      });
    }

    function showSignature() {
      const container = sigContainerRef.current;
      if (!container) return;
      container.classList.add("visible");

      const paths = container.querySelectorAll<SVGPathElement>(".sig-path");
      let delay = 0;
      paths.forEach((path) => {
        const len = path.getTotalLength?.() ?? 200;
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        path.style.transition = `stroke-dashoffset ${0.15 + Math.random() * 0.1}s ease ${delay}s`;
        const d = delay;
        setTimeout(() => { path.style.strokeDashoffset = "0"; }, d * 1000 + 100);
        delay += 0.08;
      });

      setTimeout(() => {
        const sub = sigSubtitleRef.current;
        if (sub) sub.classList.add("visible");
      }, delay * 1000);
    }

    function hideSignature() {
      const container = sigContainerRef.current;
      if (container) container.classList.remove("visible");
    }

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const t = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = "rgba(229,62,62,0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const convergeT = easeInOut(phaseT(t, PHASE.CONVERGE.start, PHASE.CONVERGE.end));
      const spinT = phaseT(t, PHASE.SPIN.start, PHASE.SPIN.end);
      const spinAngleOffset = spinT * Math.PI;
      const radius = Math.min(W, H) * 0.28;

      // Draw particles
      particles.forEach((p) => {
        const currentAngle = p.ringAngle + spinAngleOffset;
        const targetX = W / 2 + Math.cos(currentAngle) * radius;
        const targetY = H / 2 + Math.sin(currentAngle) * radius;

        if (convergeT < 1) {
          p.x = lerp(p.startX, W / 2 + Math.cos(p.ringAngle) * radius, convergeT);
          p.y = lerp(p.startY, H / 2 + Math.sin(p.ringAngle) * radius, convergeT);
        } else {
          p.x = targetX;
          p.y = targetY;
        }

        if (t >= PHASE.EXPLODE.start) {
          const ex = phaseT(t, PHASE.EXPLODE.start, PHASE.EXPLODE.start + 0.5);
          const flyDist = easeInOut(ex) * 600;
          p.x = targetX + Math.cos(currentAngle) * flyDist;
          p.y = targetY + Math.sin(currentAngle) * flyDist;
        }

        const opacity =
          t >= PHASE.EXPLODE.start
            ? Math.max(0, 1 - phaseT(t, PHASE.EXPLODE.start, PHASE.EXPLODE.start + 0.6))
            : Math.min(1, convergeT * 2);

        if (opacity <= 0) return;

        const circleT = easeInOut(clamp01((spinT - 0.1) * 3));
        const size = 28;
        const cornerRadius = (size / 2) * circleT;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);

        if (circleT > 0.3) {
          const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          glowGrad.addColorStop(0, hexToRgba(p.tech.color, 0.25));
          glowGrad.addColorStop(1, "transparent");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = "#1a1a1a";
        ctx.strokeStyle = p.tech.color;
        ctx.lineWidth = 1.5;

        if (circleT > 0.99) {
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        } else {
          drawRoundedRect(ctx, -size / 2, -size / 2, size, size, cornerRadius);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = p.tech.color;
        ctx.font = `bold ${Math.round(9 + circleT * 2)}px 'Space Grotesk', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.tech.label, 0, 0);

        ctx.restore();
      });

      // Center glow during spin
      if (t >= PHASE.SPIN.start && t < PHASE.EXPLODE.start) {
        const gIntensity = Math.sin(spinT * Math.PI) * 0.3;
        const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, radius * 0.6);
        grad.addColorStop(0, `rgba(229,62,62,${gIntensity})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Signature write trigger
      if (t >= PHASE.WRITE.start && !signatureShown) {
        signatureShown = true;
        showSignature();
      }

      // Explosion trigger
      if (t >= PHASE.EXPLODE.start && !explosionTriggered) {
        explosionTriggered = true;
        triggerExplosion();
        hideSignature();
      }

      // Draw explosion particles
      if (expParticles.length > 0) {
        expCtx.clearRect(0, 0, W, H);
        if (expCanvasWrapRef.current) expCanvasWrapRef.current.classList.add("active");

        expParticles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.life -= p.decay;
          p.life = Math.max(0, p.life);

          if (p.life <= 0) return;

          expCtx.save();
          expCtx.globalAlpha = p.life;
          expCtx.fillStyle = p.color;

          if (p.shape === "circle") {
            expCtx.beginPath();
            expCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            expCtx.fill();
          } else {
            const s = p.size * p.life;
            expCtx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
          }
          expCtx.restore();
        });

        expParticles = expParticles.filter((p) => p.life > 0);
      }

      // White flash
      if (t >= PHASE.EXPLODE.start && t < PHASE.EXPLODE.start + 0.3) {
        const flashT = phaseT(t, PHASE.EXPLODE.start, PHASE.EXPLODE.start + 0.3);
        const flashOpacity = Math.sin(flashT * Math.PI) * 0.9;
        ctx.fillStyle = `rgba(255,255,255,${flashOpacity})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Fade out & call onComplete
      if (t >= PHASE.DONE - 0.8) {
        setFadeOut(true);
      }

      if (t >= PHASE.DONE) {
        setHidden(true);
        onComplete?.();
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className={`loader-wrapper${fadeOut ? " fade-out" : ""}`}>
      {/* Main animation canvas */}
      <canvas ref={canvasRef} className="loader-canvas" />

      {/* Signature */}
      <div ref={sigContainerRef} className="signature-container">
        <svg
          className="signature-svg"
          viewBox="0 0 420 90"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ö */}
          <path className="sig-path" d="M18,20 C12,20 8,26 8,36 C8,46 12,52 18,52 C24,52 28,46 28,36 C28,26 24,20 18,20 Z M14,16 L22,10" />
          {/* m */}
          <path className="sig-path" d="M32,35 C32,28 35,25 39,25 C43,25 45,28 45,33 L45,52 M45,33 C45,28 48,25 52,25 C56,25 58,28 58,33 L58,52" />
          {/* e */}
          <path className="sig-path" d="M64,38 C64,32 67,25 74,25 C80,25 83,30 83,36 C83,36 83,38 80,38 L64,38 C64,42 66,52 74,52 C78,52 81,50 83,47" />
          {/* r */}
          <path className="sig-path" d="M88,52 L88,25 M88,33 C90,27 94,25 98,26" />
          {/* F */}
          <path className="sig-path" d="M112,20 L112,52 M112,20 L130,20 M112,36 L126,36" />
          {/* a */}
          <path className="sig-path" d="M148,28 C144,25 135,25 135,36 C135,47 144,52 150,50 C154,48 155,44 155,40 L155,25 L155,52" />
          {/* r */}
          <path className="sig-path" d="M162,52 L162,25 M162,33 C164,27 168,25 172,26" />
          {/* u */}
          <path className="sig-path" d="M176,25 L176,43 C176,49 179,52 184,52 C189,52 192,49 192,43 L192,25" />
          {/* k */}
          <path className="sig-path" d="M198,20 L198,52 M208,25 L198,38 M200,36 L210,52" />
          {/* T */}
          <path className="sig-path" d="M224,20 L244,20 M234,20 L234,52" />
          {/* ü */}
          <path className="sig-path" d="M249,25 L249,43 C249,49 252,52 257,52 C262,52 265,49 265,43 L265,25 M253,18 L253,14 M261,18 L261,14" />
          {/* r */}
          <path className="sig-path" d="M271,52 L271,25 M271,33 C273,27 277,25 281,26" />
          {/* k */}
          <path className="sig-path" d="M286,20 L286,52 M296,25 L286,38 M288,36 L298,52" />
          {/* d */}
          <path className="sig-path" d="M316,20 L316,52 M316,42 C314,48 310,52 305,52 C299,52 303,46 303,36 C303,26 308,24 312,25 C315,26 316,30 316,34" />
          {/* o */}
          <path className="sig-path" d="M322,36 C322,28 326,25 332,25 C338,25 342,28 342,36 C342,44 338,52 332,52 C326,52 322,44 322,36 Z" />
          {/* ğ */}
          <path className="sig-path" d="M348,36 C348,28 352,25 358,25 C364,25 368,28 368,36 C368,44 364,54 358,58 C354,60 350,58 348,56 M356,18 C356,15 360,13 364,15 C364,15 366,17 364,19 C362,21 358,21 356,18" />
          {/* d */}
          <path className="sig-path" d="M386,20 L386,52 M386,42 C384,48 380,52 375,52 C369,52 373,46 373,36 C373,26 378,24 382,25 C385,26 386,30 386,34" />
          {/* u */}
          <path className="sig-path" d="M392,25 L392,43 C392,49 395,52 400,52 C405,52 408,49 408,43 L408,25" />
        </svg>
        <div ref={sigSubtitleRef} className="sig-subtitle">
          Full Stack Developer
        </div>
      </div>

      {/* Explosion canvas */}
      <canvas ref={expCanvasRef} className="explosion-canvas" />
    </div>
  );
}
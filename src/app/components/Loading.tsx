"use client";

import { useEffect, useRef, useState } from "react";
import "../../styles/Loading.css";

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
  wobbleSeed: number;
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
  spin: number;
  rot: number;
  shape: "circle" | "rect";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TECHS: Tech[] = [
  { label: "Re", color: "#61dafb" }, // React
  { label: "TS", color: "#3178c6" }, // TypeScript
  { label: "Nx", color: "#ffffff" }, // Next.js
  { label: "Tw", color: "#38bdf8" }, // Tailwind
  { label: "Vu", color: "#42b883" }, // Vue.js
  { label: "Nd", color: "#68a063" }, // Node.js
  { label: "Ex", color: "#ffffff" }, // Express
  { label: "Py", color: "#ffd43b" }, // Python
  { label: "Dj", color: "#44b78b" }, // Django
  { label: "Mg", color: "#13aa52" }, // MongoDB
  { label: "Pg", color: "#336791" }, // PostgreSQL
  { label: "Rd", color: "#dc382d" }, // Redis
  { label: "Fb", color: "#ffca28" }, // Firebase
  { label: "Aw", color: "#ff9900" }, // AWS
  { label: "Dk", color: "#2496ed" }, // Docker
  { label: "Ku", color: "#326ce5" }, // Kubernetes
  { label: "Vc", color: "#ffffff" }, // Vercel
  { label: "Rn", color: "#61dafb" }, // React Native
  { label: "Fl", color: "#54c5f8" }, // Flutter
  { label: "Gi", color: "#f05032" }, // Git
  { label: "Fg", color: "#a259ff" }, // Figma
  { label: "Pm", color: "#ff6c37" }, // Postman
  { label: "Gq", color: "#e10098" }, // GraphQL
  { label: "My", color: "#4479a1" }, // MySQL
];

// Animation phase timings (seconds)
const PHASE = {
  CONVERGE: { start: 0.0, end: 2.2 },
  SPIN: { start: 2.0, end: 5.1 },
  WRITE: { start: 2.7, end: 5.2 },
  EXPLODE: { start: 5.35, end: 6.0 },
  DONE: 6.0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function phaseT(t: number, start: number, end: number): number {
  return clamp01((t - start) / (end - start));
}

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
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
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
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
  const rafRef = useRef<number>(0);

  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  // prevent setState spam in rAF
  const fadeTriggeredRef = useRef(false);
  const doneTriggeredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const expCanvas = expCanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const expCtx = expCanvas.getContext("2d")!;

    let W = 0,
      H = 0,
      DPR = 1;

    function resize() {
      DPR = Math.min(2, window.devicePixelRatio || 1);

      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      expCanvas.width = Math.floor(W * DPR);
      expCanvas.height = Math.floor(H * DPR);
      expCanvas.style.width = `${W}px`;
      expCanvas.style.height = `${H}px`;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      expCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
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
        startX: Math.random() * W,
        startY: Math.random() * H,
        x: Math.random() * W,
        y: Math.random() * H,
        ringAngle: angle,
        wobbleSeed: Math.random() * 1000,
      };
    });

    let expParticles: ExplosionParticle[] = [];
    let signatureShown = false;
    let explosionTriggered = false;

    function triggerExplosion() {
      expParticles = Array.from({ length: 240 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 12;
        return {
          x: W / 2,
          y: H / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 9,
          color:
            Math.random() > 0.6
              ? "#e53e3e"
              : Math.random() > 0.5
              ? "#ffffff"
              : "#9b1c1c",
          life: 1,
          decay: 0.018 + Math.random() * 0.03,
          spin: (Math.random() - 0.5) * 0.35,
          rot: Math.random() * Math.PI * 2,
          shape: Math.random() > 0.55 ? "circle" : "rect",
        };
      });

      expCanvas.classList.add("active");
    }

    // ✅ NEW: Professional signature animation (fade + blur -> crisp)
    function showSignature() {
      const container = sigContainerRef.current;
      if (!container) return;

      container.classList.add("visible");

      setTimeout(() => {
        const sub = sigSubtitleRef.current;
        if (sub) sub.classList.add("visible");
      }, 240);
    }

    function hideSignature() {
      const container = sigContainerRef.current;
      if (container) container.classList.remove("visible");
      const sub = sigSubtitleRef.current;
      if (sub) sub.classList.remove("visible");
    }

    // Time
    let t = 0;
    let last = performance.now();

    function animate(now: number) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      t += dt;

      // ----- Background with trail -----
      ctx.fillStyle = "rgba(10,10,10,0.22)";
      ctx.fillRect(0, 0, W, H);

      // subtle grid
      ctx.strokeStyle = "rgba(229,62,62,0.018)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 70) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 70) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // phases
      const convergeRaw = phaseT(t, PHASE.CONVERGE.start, PHASE.CONVERGE.end);
      const convergeT = easeOutBack(convergeRaw);

      const spinRaw = phaseT(t, PHASE.SPIN.start, PHASE.SPIN.end);
      const spinEase = easeInOut(spinRaw);

      const spinAngleOffset = spinEase * Math.PI * 1.6;
      const radius = Math.min(W, H) * 0.28;

      const circleT = clamp01((spinRaw - 0.08) * 3);
      const circleEase = easeInOut(circleT);

      particles.forEach((p) => {
        const currentAngle = p.ringAngle + spinAngleOffset;

        const wobble =
          Math.sin(t * 2.2 + p.wobbleSeed) * 2.2 +
          Math.cos(t * 1.6 + p.wobbleSeed * 0.7) * 1.6;

        const ringX = W / 2 + Math.cos(currentAngle) * radius;
        const ringY = H / 2 + Math.sin(currentAngle) * radius;

        if (convergeRaw < 1) {
          p.x = lerp(p.startX, W / 2 + Math.cos(p.ringAngle) * radius, convergeT);
          p.y = lerp(p.startY, H / 2 + Math.sin(p.ringAngle) * radius, convergeT);
        } else {
          p.x = ringX;
          p.y = ringY;
        }

        if (t >= PHASE.EXPLODE.start) {
          const ex = phaseT(t, PHASE.EXPLODE.start, PHASE.EXPLODE.start + 0.75);
          const flyDist = easeInOut(ex) * (560 + wobble * 2);
          p.x = ringX + Math.cos(currentAngle) * flyDist;
          p.y = ringY + Math.sin(currentAngle) * flyDist;
        }

        const opacity =
          t >= PHASE.EXPLODE.start
            ? Math.max(0, 1 - phaseT(t, PHASE.EXPLODE.start, PHASE.EXPLODE.start + 0.65))
            : Math.min(1, convergeRaw * 2);

        if (opacity <= 0) return;

        const size = 28;
        const cornerRadius = (size / 2) * circleEase;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x + wobble, p.y);

        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.2);
        glowGrad.addColorStop(0, hexToRgba(p.tech.color, 0.22 * (0.35 + circleEase)));
        glowGrad.addColorStop(0.55, hexToRgba(p.tech.color, 0.08));
        glowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, size * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(18,18,18,0.95)";
        ctx.strokeStyle = hexToRgba(p.tech.color, 0.9);
        ctx.lineWidth = 1.6;

        if (circleEase > 0.985) {
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        } else {
          drawRoundedRect(ctx, -size / 2, -size / 2, size, size, cornerRadius);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = hexToRgba(p.tech.color, 1);
        ctx.font = `700 ${Math.round(9 + circleEase * 2)}px 'Space Grotesk', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.tech.label, 0, 0);

        ctx.restore();
      });

      // Center glow during spin
      if (t >= PHASE.SPIN.start && t < PHASE.EXPLODE.start) {
        const gIntensity = Math.sin(spinEase * Math.PI) * 0.22;
        const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, radius * 0.9);
        grad.addColorStop(0, `rgba(229,62,62,${gIntensity})`);
        grad.addColorStop(0.7, `rgba(229,62,62,${gIntensity * 0.35})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Signature trigger
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

      // Explosion particles
      if (expParticles.length > 0) {
        expCtx.fillStyle = "rgba(0,0,0,0.18)";
        expCtx.fillRect(0, 0, W, H);

        expParticles.forEach((p) => {
          p.x += p.vx * (dt * 60);
          p.y += p.vy * (dt * 60);

          const drag = Math.pow(0.92, dt * 60);
          p.vx *= drag;
          p.vy *= drag;

          p.rot += p.spin * (dt * 60);
          p.life -= p.decay * (dt * 60);
          p.life = Math.max(0, p.life);

          if (p.life <= 0) return;

          expCtx.save();
          expCtx.globalAlpha = p.life;
          expCtx.fillStyle = p.color;

          if (p.shape === "circle") {
            expCtx.beginPath();
            expCtx.arc(p.x, p.y, p.size * (0.3 + p.life), 0, Math.PI * 2);
            expCtx.fill();
          } else {
            const s = p.size * (0.35 + p.life);
            expCtx.translate(p.x, p.y);
            expCtx.rotate(p.rot);
            expCtx.fillRect(-s / 2, -s / 2, s, s);
          }
          expCtx.restore();
        });

        expParticles = expParticles.filter((p) => p.life > 0);

        if (expParticles.length === 0) {
          expCanvas.classList.remove("active");
          expCtx.clearRect(0, 0, W, H);
        }
      }

      // White flash
      if (t >= PHASE.EXPLODE.start && t < PHASE.EXPLODE.start + 0.22) {
        const flashT = phaseT(t, PHASE.EXPLODE.start, PHASE.EXPLODE.start + 0.22);
        const flashOpacity = Math.sin(flashT * Math.PI) * 0.75;
        ctx.fillStyle = `rgba(255,255,255,${flashOpacity})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Fade out (trigger once)
      if (t >= PHASE.DONE - 0.85 && !fadeTriggeredRef.current) {
        fadeTriggeredRef.current = true;
        setFadeOut(true);
      }

      // Done (trigger once)
      if (t >= PHASE.DONE && !doneTriggeredRef.current) {
        doneTriggeredRef.current = true;
        setHidden(true);
        onComplete?.();
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className={`loader-wrapper${fadeOut ? " fade-out" : ""}`}>
      <canvas ref={canvasRef} className="loader-canvas" />

      {/* ✅ NEW: Professional name block (no SVG handwriting) */}
      <div ref={sigContainerRef} className="signature-container signature-pro">
        <div className="sig-name" aria-label="Name">
          Ömer Faruk <span className="sig-surname">Türkdoğdu</span>
        </div>

        <div ref={sigSubtitleRef} className="sig-subtitle">
          Full Stack Developer
        </div>
      </div>

      <canvas ref={expCanvasRef} className="explosion-canvas" />
    </div>
  );
}
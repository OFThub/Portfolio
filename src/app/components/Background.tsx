"use client";

import { useEffect, useRef } from "react";
import "./background.css";

// ─── Ember Particle ───────────────────────────────────────────────────────────

interface Ember {
  x: number;         // current x
  y: number;         // current y
  vx: number;        // horizontal drift velocity
  vy: number;        // upward velocity
  size: number;      // radius
  life: number;      // 0–1, fades as it rises
  decay: number;     // how fast it dies
  sway: number;      // sway amplitude
  swaySpeed: number; // sway frequency
  swayOffset: number;// phase offset
  hue: number;       // color hue (red spectrum)
}

function createEmber(W: number, H: number): Ember {
  return {
    x: Math.random() * W,
    y: H + 5,                                   // start just below screen
    vx: 0,
    vy: -(0.4 + Math.random() * 1.2),           // upward speed
    size: 0.8 + Math.random() * 2.2,
    life: 0.6 + Math.random() * 0.4,            // start bright
    decay: 0.0015 + Math.random() * 0.003,      // slow decay → long trail
    sway: 0.4 + Math.random() * 1.2,            // how wide it sways
    swaySpeed: 0.008 + Math.random() * 0.012,   // sway speed
    swayOffset: Math.random() * Math.PI * 2,    // random phase
    hue: Math.random() < 0.7 ? 0 : (Math.random() < 0.5 ? 15 : 30), // red / orange / amber
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    let embers: Ember[] = [];
    let rafId = 0;
    let frame = 0;

    // How many embers we aim to keep alive at once
    const TARGET_COUNT = 120;
    // Max new embers spawned per frame
    const SPAWN_RATE = 3;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Pre-populate so the screen isn't empty at start
    for (let i = 0; i < TARGET_COUNT; i++) {
      const e = createEmber(W, H);
      e.y = Math.random() * H;          // scatter vertically on init
      e.life = Math.random() * 0.8;
      embers.push(e);
    }

    function animate() {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Spawn new embers
      const missing = TARGET_COUNT - embers.length;
      const toSpawn = Math.min(SPAWN_RATE, missing);
      for (let i = 0; i < toSpawn; i++) {
        embers.push(createEmber(W, H));
      }

      embers.forEach((e) => {
        // Sway motion — sinusoidal horizontal drift
        e.x += e.sway * Math.sin(frame * e.swaySpeed + e.swayOffset);
        e.y += e.vy;
        e.life -= e.decay;

        if (e.life <= 0 || e.y < -20) return; // skip dead / offscreen

        const alpha = Math.pow(e.life, 1.5); // ease out opacity

        // Outer glow
        const glow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 5);
        glow.addColorStop(0,   `hsla(${e.hue}, 100%, 65%, ${alpha * 0.25})`);
        glow.addColorStop(0.4, `hsla(${e.hue}, 100%, 50%, ${alpha * 0.12})`);
        glow.addColorStop(1,   `hsla(${e.hue}, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        const core = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size);
        core.addColorStop(0,   `hsla(${e.hue + 30}, 100%, 90%, ${alpha})`);   // hot white-yellow center
        core.addColorStop(0.5, `hsla(${e.hue + 10}, 100%, 65%, ${alpha})`);   // orange mid
        core.addColorStop(1,   `hsla(${e.hue},      100%, 45%, ${alpha * 0.6})`); // red edge
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      });

      // Cull dead / offscreen
      embers = embers.filter((e) => e.life > 0 && e.y > -20);

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="ember-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="ember-canvas" />
    </div>
  );
}
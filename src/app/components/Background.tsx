"use client";

import { useEffect, useRef } from "react";
import "../../styles/Background.css";

// ─── Ember Particle ───────────────────────────────────────────────────────────

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  sway: number;
  swaySpeed: number;
  swayOffset: number;
  hue: number;
  isCursor?: boolean; // cursor'dan doğan partiküller
}

function createEmber(W: number, H: number): Ember {
  return {
    x: Math.random() * W,
    y: H + 5,
    vx: 0,
    vy: -(0.4 + Math.random() * 1.2),
    size: 0.8 + Math.random() * 2.2,
    life: 0.6 + Math.random() * 0.4,
    decay: 0.0015 + Math.random() * 0.003,
    sway: 0.4 + Math.random() * 1.2,
    swaySpeed: 0.008 + Math.random() * 0.012,
    swayOffset: Math.random() * Math.PI * 2,
    hue: Math.random() < 0.7 ? 0 : (Math.random() < 0.5 ? 15 : 30),
  };
}

// İmleç etrafında alev partikülü oluştur
function createCursorEmber(x: number, y: number, vx: number, vy: number): Ember {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.3 + Math.random() * 1.5;
  const moveMag = Math.sqrt(vx * vx + vy * vy);

  return {
    x: x + (Math.random() - 0.5) * 8,
    y: y + (Math.random() - 0.5) * 8,
    // İmleç hız yönüne doğru saçıl + rastgele yayılma
    vx: -vx * 0.15 + Math.cos(angle) * speed * 0.5,
    vy: -vy * 0.15 + Math.sin(angle) * speed * 0.5 - (1.2 + Math.random() * 1.5), // yukarı
    size: 1.2 + Math.random() * 2.8 + Math.min(moveMag * 0.08, 2),
    life: 0.7 + Math.random() * 0.3,
    decay: 0.018 + Math.random() * 0.022, // cursor emberleri daha hızlı solar
    sway: 0.3 + Math.random() * 0.8,
    swaySpeed: 0.015 + Math.random() * 0.02,
    swayOffset: Math.random() * Math.PI * 2,
    hue: Math.random() < 0.5 ? 0 : (Math.random() < 0.6 ? 20 : 40),
    isCursor: true,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EmberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let W = 0, H = 0;
    let embers: Ember[] = [];
    let rafId = 0;
    let frame = 0;

    const TARGET_COUNT = 120;
    const SPAWN_RATE = 3;

    // İmleç takibi
    const cursor = { x: -200, y: -200, vx: 0, vy: 0, prevX: -200, prevY: -200 };
    let isMouseOnCanvas = false;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Mouse event handlers
    function onMouseMove(e: MouseEvent) {
      cursor.vx = e.clientX - cursor.prevX;
      cursor.vy = e.clientY - cursor.prevY;
      cursor.prevX = cursor.x;
      cursor.prevY = cursor.y;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    }

    function onMouseEnter() { isMouseOnCanvas = true; }
    function onMouseLeave() {
      isMouseOnCanvas = false;
      cursor.vx = 0;
      cursor.vy = 0;
    }

    // Touch desteği
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      cursor.vx = t.clientX - cursor.prevX;
      cursor.vy = t.clientY - cursor.prevY;
      cursor.prevX = cursor.x;
      cursor.prevY = cursor.y;
      cursor.x = t.clientX;
      cursor.y = t.clientY;
      isMouseOnCanvas = true;
    }

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // İlk doldurma
    for (let i = 0; i < TARGET_COUNT; i++) {
      const e = createEmber(W, H);
      e.y = Math.random() * H;
      e.life = Math.random() * 0.8;
      embers.push(e);
    }

    let flickerT = 0;
    function flicker(amp: number) {
      flickerT += 0.04;
      return amp * (
        Math.sin(flickerT * 2.3) * 0.5 +
        Math.sin(flickerT * 5.1) * 0.3 +
        Math.sin(flickerT * 0.7) * 0.2
      );
    }

    function drawCursorFlame() {
      const cx = cursor.x;
      const cy = cursor.y;
      const speed     = Math.sqrt(cursor.vx ** 2 + cursor.vy ** 2);
      const intensity = Math.min(speed / 20, 1);

      const fx = flicker(2.5);
      const fy = flicker(2.0);

      // Dış ısı hâlesi — çok hafif
      const heatR = 30 + intensity * 18;
      const heat  = ctx.createRadialGradient(cx, cy, 0, cx + fx, cy + fy, heatR);
      heat.addColorStop(0,   `hsla(18, 90%, 45%, ${0.03 + intensity * 0.01})`);
      heat.addColorStop(0.6, `hsla(8,  85%, 35%, 0.01)`);
      heat.addColorStop(1,   `hsla(0,  80%, 25%, 0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, heatR, 0, Math.PI * 2);
      ctx.fillStyle = heat;
      ctx.fill();

      // Alev gövdesi — sivri, titreyen
      const fH = 22 + intensity * 18 + flicker(4);
      const fW = 9  + intensity * 6  + flicker(1.5);

      ctx.save();
      ctx.translate(cx, cy);

      const flameFill = ctx.createLinearGradient(0, 0, 0, -fH);
      flameFill.addColorStop(0,    `hsla(22, 95%, 55%, ${0.28 + intensity * 0.12})`);
      flameFill.addColorStop(0.45, `hsla(12, 90%, 42%, 0.18)`);
      flameFill.addColorStop(0.8,  `hsla(4,  85%, 30%, 0.08)`);
      flameFill.addColorStop(1,    `hsla(0,  80%, 22%, 0)`);

      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.bezierCurveTo(-(fW), -fH * 0.25, -(fW * 0.5), -fH * 0.72, fx * 0.4, -fH);
      ctx.bezierCurveTo(fW * 0.5, -fH * 0.72, fW, -fH * 0.25, 0, 2);
      ctx.fillStyle = flameFill;
      ctx.fill();
      ctx.restore();

      // Kor noktası
      const cR = 2.8 + intensity * 2;
      const kor = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR);
      kor.addColorStop(0,   `hsla(48, 100%, 88%, ${0.75 + intensity * 0.2})`);
      kor.addColorStop(0.4, `hsla(28, 100%, 65%, 0.5)`);
      kor.addColorStop(1,   `hsla(8,  100%, 42%, 0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, cR, 0, Math.PI * 2);
      ctx.fillStyle = kor;
      ctx.fill();
    }

    function spawnCursorEmbers() {
      const speed = Math.sqrt(cursor.vx ** 2 + cursor.vy ** 2);

      if (speed < 2) {
        if (frame % 4 === 0) {
          embers.push(createCursorEmber(cursor.x, cursor.y, 0, 0));
        }
        return;
      }

      const count = Math.min(Math.floor(speed * 0.05), 1);
      for (let i = 0; i < count; i++) {
        embers.push(createCursorEmber(cursor.x, cursor.y, cursor.vx, cursor.vy));
      }
    }

    function animate() {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Arka plan emberleri spawn
      const missing = TARGET_COUNT - embers.filter(e => !e.isCursor).length;
      const toSpawn = Math.min(SPAWN_RATE, missing);
      for (let i = 0; i < toSpawn; i++) {
        embers.push(createEmber(W, H));
      }

      // Cursor alemleri spawn
      spawnCursorEmbers();

      // Önce arka plan partikülleri çiz
      embers.forEach((e) => {
        e.x += e.vx + e.sway * Math.sin(frame * e.swaySpeed + e.swayOffset);
        e.y += e.vy;
        e.life -= e.decay;

        if (e.life <= 0 || e.y < -20) return;

        const alpha = Math.pow(e.life, e.isCursor ? 1.2 : 1.5);

        // Cursor embers biraz daha parlak ve büyük
        const glowMult = e.isCursor ? 6 : 5;

        const glow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * glowMult);
        glow.addColorStop(0,   `hsla(${e.hue}, 100%, 65%, ${alpha * (e.isCursor ? 0.35 : 0.25)})`);
        glow.addColorStop(0.4, `hsla(${e.hue}, 100%, 50%, ${alpha * 0.12})`);
        glow.addColorStop(1,   `hsla(${e.hue}, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * glowMult, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        const core = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size);
        core.addColorStop(0,   `hsla(${e.hue + 30}, 100%, 90%, ${alpha})`);
        core.addColorStop(0.5, `hsla(${e.hue + 10}, 100%, 65%, ${alpha})`);
        core.addColorStop(1,   `hsla(${e.hue},      100%, 45%, ${alpha * 0.6})`);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      });

      // İmleç alevini en üste çiz
      drawCursorFlame();

      embers = embers.filter((e) => e.life > 0 && e.y > -20);

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div className="ember-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="ember-canvas" style={{ cursor: "none" }} />
    </div>
  );
}
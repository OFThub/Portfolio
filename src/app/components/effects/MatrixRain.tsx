"use client";

import { useEffect, useRef } from "react";

/*
 * MatrixRain — hacker filmlerindeki gibi yukarıdan düşen rastgele
 * karakterler (kırmızı dijital yağmur), canvas tabanlı.
 *   - Kapsayıcısını (section) tamamen doldurur; iz efekti destination-out
 *     ile silindiği için canvas şeffaf kalır, arkadaki grid deseni görünür
 *   - prefers-reduced-motion: tek statik kare, döngü yok
 *   - Bölüm ekran dışındayken rAF durur (IntersectionObserver)
 *   - Entegre GPU'lar için backing store yarı çözünürlükte tutulur
 */

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}[]$#@%&*+=-";

const FONT_SIZE = 15;
const FADE = 0.07;

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export function MatrixRain() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
    const frameInterval = 1000 / (lowPower ? 24 : 30);

    let W = 0;
    let H = 0;
    let columns = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let rafId = 0;
    let lastTime = 0;

    function resize() {
      W = wrapper!.clientWidth;
      H = wrapper!.clientHeight;
      if (W === 0 || H === 0) return;

      // Bölüm çok uzun olabildiği için backing store'u sınırla (bellek + fill maliyeti)
      const scale = Math.min(0.5, Math.sqrt(2_500_000 / (W * H)));
      canvas!.width = Math.ceil(W * scale);
      canvas!.height = Math.ceil(H * scale);
      ctx!.setTransform(scale, 0, 0, scale, 0, 0);

      columns = Math.ceil(W / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.random() * H);
      speeds = Array.from({ length: columns }, () => 0.75 + Math.random() * 0.5);
      ctx!.font = `${FONT_SIZE}px "Courier New", monospace`;

      if (reduced) drawStatic();
    }

    // Reduced-motion: dağınık soluk karakterlerden tek kare
    function drawStatic() {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = "rgba(220,38,38,0.35)";
      for (let i = 0; i < columns; i++) {
        const count = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < count; j++) {
          ctx!.fillText(randomChar(), i * FONT_SIZE, Math.random() * H);
        }
      }
    }

    function tick() {
      // İz efekti: alfa silerek şeffaflığı koru
      ctx!.globalCompositeOperation = "destination-out";
      ctx!.fillStyle = `rgba(0,0,0,${FADE})`;
      ctx!.fillRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "source-over";

      for (let i = 0; i < columns; i++) {
        ctx!.fillStyle = Math.random() < 0.08 ? "#f87171" : "#dc2626";
        ctx!.fillText(randomChar(), i * FONT_SIZE, drops[i]);
        drops[i] += FONT_SIZE * speeds[i];
        if (drops[i] > H && Math.random() > 0.975) drops[i] = 0;
      }
    }

    function loop(time: number) {
      rafId = requestAnimationFrame(loop);
      if (time - lastTime < frameInterval) return;
      lastTime = time;
      tick();
    }

    function start() {
      if (rafId || reduced) return;
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    // Bölüm görünmüyorken animasyonu tamamen durdur
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(wrapper);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/*
 * Kinetic — anime.js tabanlı mikro-animasyon yardımcıları
 *   KineticLetters : harf harf 3D flip-stagger başlık girişi
 *   CountUp        : görünür olunca hedefe sayan sayaç (gerçek veriyle kullanılır)
 * Her ikisi de prefers-reduced-motion'a saygı duyar.
 */

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── KineticLetters ─────────────────────────────────────────────────── */
export function KineticLetters({
  text,
  className = "",
  letterClassName = "",
  startDelay = 0,
  gradient = false,
}: {
  text: string;
  className?: string;
  letterClassName?: string;
  /** ms cinsinden ilk harfin gecikmesi */
  startDelay?: number;
  /** true ise harfler arasında kesintisiz beyaz→kırmızı degrade uygulanır */
  gradient?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const letters = text.split("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-ltr]");

    if (prefersReducedMotion()) {
      targets.forEach((t) => {
        t.style.opacity = "1";
        t.style.transform = "none";
      });
      return;
    }

    const anim = animate(targets, {
      opacity: { from: 0, to: 1 },
      y: { from: "0.55em", to: "0em" },
      rotateX: { from: -95, to: 0 },
      duration: 850,
      delay: stagger(42, { start: startDelay }),
      ease: "outExpo",
    });
    return () => {
      anim.pause();
    };
  }, [startDelay, text]);

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ perspective: "800px" }}
      aria-label={text}
    >
      {letters.map((ch, i) => (
        <span
          key={i}
          data-ltr
          aria-hidden="true"
          className={`inline-block will-change-transform ${letterClassName}`}
          style={{
            opacity: 0,
            transformOrigin: "50% 100%",
            ...(gradient
              ? {
                  background: "linear-gradient(90deg, #ffffff, #e5e7eb 55%, #dc2626)",
                  backgroundSize: `${letters.length * 100}% 100%`,
                  backgroundPosition: `${letters.length > 1 ? (i / (letters.length - 1)) * 100 : 0}% 0`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }
              : {}),
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/* ─── CountUp ────────────────────────────────────────────────────────── */
export function CountUp({
  value,
  className = "",
  duration = 1200,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || value === 0) {
      el.textContent = String(value);
      return;
    }

    let anim: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const counter = { n: 0 };
        anim = animate(counter, {
          n: value,
          duration,
          ease: "outCubic",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.n));
          },
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      anim?.pause();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}

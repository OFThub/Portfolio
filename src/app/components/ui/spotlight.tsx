"use client";

import { useEffect } from "react";

/*
 * SpotlightEffect — .spotlight sınıflı tüm buton/kartlar için tek global
 * imleç dinleyicisi. İmlecin altındaki .spotlight elemanlarının (iç içe
 * olanlar dahil) --spot-x/--spot-y değişkenlerini günceller; kırmızı
 * radyal ışık CSS'te çizilir (.spotlight::after, styles/index.css).
 * Hover'ı olmayan (dokunmatik) cihazlarda hiç kurulmaz.
 */
export function SpotlightEffect() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: PointerEvent) => {
      let el = (e.target as Element | null)?.closest?.(
        ".spotlight",
      ) as HTMLElement | null;
      while (el) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
        el = (el.parentElement?.closest(".spotlight") ??
          null) as HTMLElement | null;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}

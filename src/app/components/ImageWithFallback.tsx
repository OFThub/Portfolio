import { useState } from "react";
import type { ImgHTMLAttributes } from "react";

/* Inline so a failed image never triggers a second network request. */
const ERROR_ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjZGMyNjI2IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuNCIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=";

/**
 * <img> that degrades to a themed placeholder instead of a broken-image icon.
 *
 * The placeholder keeps the alt text on the wrapper so screen readers still
 * hear what the image was meant to show, and stays on the dark palette — the
 * previous light-grey box flashed white on every miss.
 */
export function ImageWithFallback({
  src,
  alt,
  style,
  className,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        title={alt}
        data-original-src={src}
        style={style}
        className={`flex items-center justify-center bg-[#111111] border border-primary/10 ${className ?? ""}`}
      >
        <img src={ERROR_ICON} alt="" aria-hidden="true" className="w-12 h-12 opacity-60" />
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";

export function FitTitle({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const heading = ref.current;
    const word = heading?.firstElementChild;
    if (!heading || !(word instanceof HTMLElement)) return;

    const fit = () => {
      const target = heading.clientWidth;
      const current = Number.parseFloat(getComputedStyle(word).fontSize);
      const width = word.getBoundingClientRect().width;
      if (target <= 0 || width <= 0 || current <= 0) return;
      const next = (target / width) * current;
      if (Math.abs(next - current) < 0.6) return;
      word.style.fontSize = `${next}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(heading);
    document.fonts.ready.then(fit);
    return () => observer.disconnect();
  }, [children]);

  return (
    <h1 ref={ref} className="font-poster relative z-10 w-full pb-1 text-center leading-none">
      <span
        className="hero-word inline-block text-[25vw] leading-[0.86] tracking-[-0.04em] whitespace-nowrap"
        style={{
          backgroundImage: "linear-gradient(90deg, #25f4ee 0%, #14d5e2 34%, #0a4c54 70%, #061214 100%)",
        }}
      >
        {children}
      </span>
    </h1>
  );
}

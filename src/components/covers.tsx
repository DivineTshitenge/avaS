"use client";

import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useSite } from "@/lib/site-context";

function useViewportSize(read: () => number, fallback: number) {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("resize", onChange);
      return () => window.removeEventListener("resize", onChange);
    },
    read,
    () => fallback,
  );
}

export function Covers() {
  const { magazines, covers } = useSite();
  const reduce = useReducedMotion();
  const width = useViewportSize(() => window.innerWidth, 1280);
  const height = useViewportSize(() => window.innerHeight, 800);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduce || open) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % magazines.length);
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [index, magazines.length, open, reduce]);

  function openCover(coverIndex: number) {
    setIndex(coverIndex);
    setOpen(true);
  }

  if (reduce) {
    return (
      <section id="couvertures" className="bg-[#111] px-4 py-16 sm:px-8">
        <h2 className="sr-only">{covers.title}</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
          {magazines.map((cover) => (
            <Link key={cover.slug} href={`/magazines/${cover.slug}`} className="relative aspect-[3/4] overflow-hidden">
              <Image src={cover.cover} alt={cover.alt} fill sizes="30vw" className="object-cover" />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111]">
                Lire l'article
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const narrow = width < 768;
  const activeWidth = narrow ? Math.round(width * 0.72) : Math.min(Math.round(width * 0.3), 380);
  const activeHeight = narrow
    ? Math.min(Math.round(activeWidth * 1.38), Math.round(height * 0.7))
    : Math.min(Math.round(height * 0.68), 560);
  const sideWidth = Math.round(activeWidth * (narrow ? 0.78 : 0.72));
  const sideHeight = Math.round(activeHeight * (narrow ? 0.78 : 0.72));
  const offset = narrow
    ? Math.round(activeWidth / 2 + sideWidth / 2 + 14)
    : Math.round(width * 0.34);

  return (
    <section
      id="couvertures"
      data-phase={open ? "open" : "slide"}
      className="relative h-dvh overflow-hidden bg-[#111]"
      aria-roledescription="carrousel"
      aria-label={covers.title}
    >
      <h2 className="sr-only">{covers.title}</h2>
      {magazines.map((cover, coverIndex) => {
        const raw = (coverIndex - index + magazines.length) % magazines.length;
        const delta = raw === 0 ? 0 : raw === 1 ? -1 : 1;
        const isActive = delta === 0;
        const full = open && isActive;

        return (
          <div key={cover.slug} className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative overflow-hidden bg-black shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              initial={coverIndex === 0 ? { x: -offset, width: activeWidth, height: activeHeight, opacity: 1 } : false}
              animate={{
                width: full ? width : isActive ? activeWidth : sideWidth,
                height: full ? height : isActive ? activeHeight : sideHeight,
                x: full ? 0 : delta * offset,
                borderRadius: full ? 0 : 18,
                opacity: open && !isActive ? 0 : 1,
                zIndex: isActive ? 2 : 1,
              }}
              transition={{
                width: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                height: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                x: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                borderRadius: { duration: 0.5 },
                opacity: { duration: 0.35 },
              }}
            >
              <Image
                src={cover.cover}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority={coverIndex === 0}
              />
              {full ? (
                <>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="pointer-events-auto absolute top-20 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold text-[#111] shadow-lg sm:top-24 sm:left-6"
                  >
                    <ArrowLeft className="size-4" />
                    Retour
                  </button>
                  <Link
                    href={`/magazines/${cover.slug}`}
                    className="pointer-events-auto absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111] shadow-lg sm:bottom-8"
                  >
                    Lire l&apos;article
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  aria-label={cover.alt}
                  onClick={() => openCover(coverIndex)}
                  className="pointer-events-auto absolute inset-0 z-10 cursor-pointer"
                />
              )}
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { devices } from "@/lib/content";

export function UseCases() {
  const [active, setActive] = useState<(typeof devices)[number]["id"]>(devices[0].id);
  const current = devices.find((item) => item.id === active) ?? devices[0];
  const reduce = useReducedMotion();

  return (
    <section className="bg-cream px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl border-t border-black/15 pt-8">
        <p className="kicker text-center text-muted">Où regarder</p>
        <h2 className="font-display mx-auto mt-3 max-w-3xl text-center text-4xl leading-tight font-normal sm:text-6xl">
          La plateforme, sur vos appareils
        </h2>
        <div role="tablist" aria-label="Appareils" className="mt-8 flex flex-wrap justify-center gap-6">
          {devices.map((item) => {
            const selected = item.id === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(item.id)}
                className={`kicker pb-1 ${
                  selected ? "border-b border-ink text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-2xl text-center"
          >
            <h3 className="font-display text-4xl font-normal">{current.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-muted">{current.text}</p>
            <p className="font-display mt-6 text-5xl font-normal">{current.stat}</p>
            <p className="text-sm text-muted">{current.statLabel}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

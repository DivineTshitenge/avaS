"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { useSite } from "@/lib/site-context";

export function Faq() {
  const { faqs, faqIntro } = useSite();
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-24 bg-cream px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 border-t border-black/15 pt-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="kicker text-muted">{faqIntro.kicker}</p>
          <h2 className="font-display mt-3 text-4xl leading-tight font-normal sm:text-6xl">
            {faqIntro.title}
          </h2>
          <div className="mt-8 border-t border-black/15 pt-5">
            <h3 className="font-display text-2xl font-normal">{faqIntro.helpTitle}</h3>
            <p className="mt-2 text-sm text-muted">{faqIntro.helpText}</p>
            <a href="#contact" className="mt-5 inline-block border-b border-ink pb-0.5 text-sm">
              {faqIntro.helpLabel}
            </a>
          </div>
        </Reveal>

        <div className="divide-y divide-black/8">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q} className="py-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className="font-display text-xl leading-tight">{item.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.p
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden text-sm leading-relaxed text-muted"
                    >
                      <span className="block pb-4">{item.a}</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

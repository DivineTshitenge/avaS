"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { useSite } from "@/lib/site-context";

export function AboutAva() {
  const { about } = useSite();
  const words = about.text.split(" ");
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  return (
    <section className="bg-[#f3efe8] px-4 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-start gap-10 text-center lg:grid-cols-[11rem_1fr] lg:gap-16 lg:text-left">
        <ul className="space-y-3 text-[11px] font-medium tracking-[0.16em] text-[#9a948c] uppercase">
          {about.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p
          ref={ref}
          className="mx-auto max-w-3xl text-3xl leading-[1.15] font-semibold tracking-[-0.035em] sm:text-4xl lg:mx-0 lg:text-[2.65rem]"
        >
          {reduce
            ? about.text
            : words.map((word, index) => (
                <Word
                  key={`${word}-${index}`}
                  word={word}
                  progress={scrollYProgress}
                  index={index}
                  total={words.length}
                />
              ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  word,
  progress,
  index,
  total,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const start = index / total;
  const end = Math.min(1, start + 1 / total);
  const color = useTransform(progress, [start, end], ["#b7b2ab", "#111111"]);

  return (
    <motion.span style={{ color }}>
      {word}
      {index < total - 1 ? " " : ""}
    </motion.span>
  );
}

"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { useSite } from "@/lib/site-context";
import type { TitleItem } from "@/lib/site-defaults";

function useLargeScreen() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(min-width: 1024px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

export function TopWorks() {
  const { titles, top } = useSite();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const large = useLargeScreen();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="top"
      ref={ref}
      className="relative bg-black"
      style={{ height: reduce ? "auto" : `${titles.length * 100}vh` }}
    >
      <div
        className={
          reduce
            ? "flex flex-col items-center gap-8 px-4 py-16 sm:px-8"
            : "sticky top-0 flex h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-4 pt-24 pb-8 sm:px-8"
        }
      >
        <div className="flex w-full max-w-6xl items-center justify-between gap-4">
          <h2 className="font-display text-3xl leading-none font-normal text-white sm:text-5xl">
            {top.title}
          </h2>
          <Link
            href="/catalogue"
            className="relative z-20 rounded-full border border-white/50 px-4 py-2 text-xs font-semibold tracking-wide text-white"
          >
            Voir plus
          </Link>
        </div>
        <div
          className={
            reduce
              ? "grid w-full max-w-6xl grid-cols-2 gap-3 lg:grid-cols-5"
              : large
                ? "mx-auto flex h-[min(68vh,640px)] w-full max-w-6xl items-stretch justify-center gap-3"
                : "relative mx-auto h-[min(68vh,640px)] w-full max-w-sm"
          }
        >
          {titles.map((title, index) => (
            <TopCard
              key={title.slug}
              title={title}
              index={index}
              total={titles.length}
              progress={scrollYProgress}
              reduce={Boolean(reduce)}
              large={large}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TopCard({
  title,
  index,
  total,
  progress,
  reduce,
  large,
}: {
  title: TitleItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
  large: boolean;
}) {
  const steps = Math.max(total - 1, 1);
  const start = (index - 1) / steps;
  const end = index / steps;
  const growEnd = start + (end - start) * 0.28;
  const y = useTransform(progress, [start, growEnd, end], ["120vh", "120vh", "0vh"]);
  const grow = useTransform(progress, [start, growEnd, end], [0, 1, 1]);
  const number = String(index + 1).padStart(2, "0");
  const hidden = index > 0 && !reduce;

  return (
    <motion.article
      style={
        !hidden
          ? { zIndex: index + 1, flex: large && !reduce ? "1 1 0%" : undefined }
          : large
            ? { y, zIndex: index + 1, flexGrow: grow, flexBasis: 0, flexShrink: 1, minWidth: 0 }
            : { y, zIndex: index + 1 }
      }
      className={
        reduce
          ? "relative h-[420px] overflow-hidden"
          : large
            ? "relative h-full min-w-0 overflow-hidden"
            : "absolute inset-0 overflow-hidden"
      }
    >
      <Link
        href={`/catalogue/${title.slug}`}
        className="relative flex h-full flex-col justify-end overflow-hidden rounded-[28px] bg-[#111] p-5 text-white"
      >
        <Image
          src={title.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 18vw, 90vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        <p className="font-poster absolute top-[18%] right-4 text-7xl leading-none">{number}</p>
        <div className="relative">
          <h3 className="text-lg leading-tight font-semibold">{title.title}</h3>
          <p className="mt-2 text-sm leading-snug text-white/90">{title.tagline}</p>
        </div>
      </Link>
    </motion.article>
  );
}

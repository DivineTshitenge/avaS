"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { titlesForProducer, type ProducerItem } from "@/lib/site-defaults";
import { useSite } from "@/lib/site-context";

const featuredLimit = 4;

function useNarrowScreen() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(max-width: 767px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => true,
  );
}

export function Houses() {
  const site = useSite();
  const featured = site.producers.slice(0, featuredLimit);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const horizontal = useNarrowScreen();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="maisons"
      ref={ref}
      className="bg-[#f3efe8] [--house-bar:64px] md:[--house-bar:80px] lg:[--house-bar:56px]"
      style={{ height: reduce ? "auto" : `${featured.length * 100}vh` }}
    >
      <div
        className={
          reduce
            ? "px-4 py-16 sm:px-8"
            : "sticky top-0 flex h-dvh flex-col overflow-hidden"
        }
      >
        <header className="px-4 pt-20 pb-3 text-center sm:pt-24 sm:pb-4 lg:px-10 lg:pt-[4.6rem] lg:pb-2">
          <h2 className="text-4xl font-semibold tracking-tight text-[#111] sm:text-5xl lg:text-5xl">
            {site.houses.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#111]/55 sm:mt-3 sm:text-base">
            {site.houses.text}
          </p>
          <Link
            href="/producteurs"
            className="mt-4 inline-flex rounded-full border border-black/20 px-4 py-2 text-xs font-semibold tracking-wide text-[#111] lg:mt-3"
          >
            {site.houses.moreLabel}
          </Link>
        </header>

        {reduce ? (
          <div className="flex flex-col gap-6">
            {featured.map((producer, index) => (
              <div key={producer.slug} className="overflow-hidden bg-[#111] text-white">
                <HouseBody producer={producer} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative min-h-0 flex-1">
            {featured.map((producer, index) => (
              <HouseSheet
                key={producer.slug}
                producer={producer}
                index={index}
                total={featured.length}
                progress={scrollYProgress}
                horizontal={horizontal}
              />
            ))}
            {featured.map((producer, index) =>
              index === 0 ? null : (
                <WaitingBar
                  key={`${producer.slug}-bar`}
                  producer={producer}
                  index={index}
                  total={featured.length}
                  progress={scrollYProgress}
                  horizontal={horizontal}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function HouseSheet({
  producer,
  index,
  total,
  progress,
  horizontal,
}: {
  producer: ProducerItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  horizontal: boolean;
}) {
  const steps = Math.max(total - 1, 1);
  const start = index === 0 ? 0 : (index - 1) / steps;
  const end = index === 0 ? 1 : index / steps;
  const y = useTransform(progress, [start, end], ["100vh", "0vh"]);
  const x = useTransform(progress, [start, end], ["-100vw", "0vw"]);
  const remaining = total - 1 - index;
  const cover = titlesForProducer(useSite().titles, producer.slug)[0];
  const span = `calc(100% - ${remaining} * var(--house-bar))`;

  return (
    <motion.article
      style={
        index === 0
          ? horizontal
            ? { zIndex: 1, width: span }
            : { zIndex: 1, height: span }
          : horizontal
            ? { x, zIndex: index + 2, width: span }
            : { y, zIndex: index + 2, height: span }
      }
      className={
        horizontal
          ? "absolute top-0 bottom-0 left-0 overflow-hidden bg-[#111] text-white shadow-[16px_0_40px_rgba(0,0,0,0.28)]"
          : "absolute inset-x-0 top-0 overflow-hidden bg-[#111] text-white shadow-[0_-20px_50px_rgba(0,0,0,0.28)]"
      }
    >
      {cover ? (
        <Image
          src={cover.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/88 to-black/75" />
      <div className="relative h-full">
        <HouseBody producer={producer} index={index} stacked={horizontal} />
      </div>
    </motion.article>
  );
}

function WaitingBar({
  producer,
  index,
  total,
  progress,
  horizontal,
}: {
  producer: ProducerItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  horizontal: boolean;
}) {
  const steps = Math.max(total - 1, 1);
  const start = (index - 1) / steps;
  const opacity = useTransform(progress, [start, start + 0.06], [1, 0]);
  const pointerEvents = useTransform(progress, (value): "auto" | "none" =>
    value >= start ? "none" : "auto",
  );
  const number = String(index + 1).padStart(2, "0");
  const offset = `calc(${total - 1 - index} * var(--house-bar))`;

  if (horizontal) {
    return (
      <motion.div
        style={{ opacity, pointerEvents, right: offset, width: "var(--house-bar)", zIndex: 30 }}
        className="absolute inset-y-0 flex flex-col items-center justify-between gap-3 overflow-hidden border-l border-black/10 bg-[#f3efe8] px-1 py-3 text-[#111]"
      >
        <p className="text-xs text-[#111]/45">{number}</p>
        <p className="min-h-0 text-sm leading-none font-semibold tracking-tight [writing-mode:vertical-lr]">
          {producer.name}
        </p>
        <Link
          href={`/producteurs/${producer.slug}`}
          aria-label={`Voir la maison ${producer.name}`}
          className="grid size-8 shrink-0 place-items-center rounded-full bg-[#25f4ee] text-[#111]"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        opacity,
        pointerEvents,
        bottom: offset,
        height: "var(--house-bar)",
        zIndex: 30,
      }}
      className="absolute inset-x-0 flex items-center overflow-hidden border-t border-black/10 bg-[#f3efe8] px-4 text-[#111] sm:px-8"
    >
      <p className="w-12 shrink-0 text-sm text-[#111]/45">{number}</p>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-[#111]/45">{producer.role}</p>
        <p className="truncate text-2xl leading-none font-semibold tracking-tight sm:text-3xl lg:text-xl">{producer.name}</p>
      </div>
      <Link
        href={`/producteurs/${producer.slug}`}
        className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#25f4ee] px-3 py-2 text-xs font-semibold text-[#111] sm:px-4 sm:text-sm"
      >
        Voir la maison
        <ArrowUpRight className="size-4" />
      </Link>
    </motion.div>
  );
}

function HouseBody({
  producer,
  index,
  stacked = false,
}: {
  producer: ProducerItem;
  index: number;
  stacked?: boolean;
}) {
  const catalog = titlesForProducer(useSite().titles, producer.slug);
  const cover = catalog[0];
  const number = String(index + 1).padStart(2, "0");
  const countLabel =
    catalog.length > 1 ? `${catalog.length} titres au catalogue` : `${catalog.length} titre au catalogue`;

  return (
    <div
      className={
        stacked
          ? "flex h-full flex-col justify-center gap-3 overflow-hidden px-3 py-4"
          : "flex h-full items-center gap-3 px-4 py-4 sm:gap-5 sm:px-8 md:gap-6 lg:gap-8 lg:px-10"
      }
    >
      <p className="hidden shrink-0 text-sm text-white/50 sm:block lg:w-8">{number}</p>
      {cover ? (
        <div
          className={
            stacked
              ? "relative h-36 w-28 shrink-0 overflow-hidden rounded-2xl"
              : "relative h-48 w-36 shrink-0 overflow-hidden rounded-2xl sm:h-56 sm:w-44 md:h-72 md:w-56 lg:h-[26rem] lg:w-72"
          }
        >
          <Image src={cover.image} alt="" fill sizes="240px" className="object-cover" />
        </div>
      ) : null}
      <div className={stacked ? "min-w-0" : "min-w-0 flex-1"}>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs text-white/60 sm:text-sm">
              <span className="mr-2 sm:hidden">{number}</span>
              {producer.role}
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{producer.name}</h3>
          </div>
          <Link
            href={`/producteurs/${producer.slug}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#25f4ee] px-3 py-2 text-xs font-semibold text-[#111] sm:px-4 sm:text-sm"
          >
            Voir la maison
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <p className="mt-3 text-lg font-semibold tracking-tight sm:mt-4 sm:text-2xl">{countLabel}</p>
        <p className="mt-1.5 max-w-xl text-sm leading-snug text-white/70">{producer.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
          {catalog.slice(0, 3).map((title) => (
            <Link
              key={title.slug}
              href={`/catalogue/${title.slug}`}
              className="rounded-2xl bg-[#f3efe8] px-4 py-3 text-sm font-medium text-[#111] sm:px-5 sm:py-4"
            >
              {title.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

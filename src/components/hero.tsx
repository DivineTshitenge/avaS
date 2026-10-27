"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FitTitle } from "@/components/fit-title";
import { useSite } from "@/lib/site-context";

export function Hero() {
  const site = useSite();
  const ticker = [
    "Producteurs",
    "Catalogue",
    ...site.producers.map((producer) => producer.name),
    ...site.titles.map((item) => item.title),
  ];
  const loop = [...ticker, ...ticker];

  return (
    <section id="haut" className="overflow-hidden bg-[#f3efe8] pt-[4.6rem]">
      <div className="flex items-center justify-between px-4 pt-5 sm:px-8 sm:pt-7">
        <p className="text-sm font-semibold tracking-tight sm:text-base">{site.hero.year}</p>
        <p className="text-sm font-semibold tracking-[0.16em] sm:text-base">{site.hero.kicker}</p>
      </div>

      <FitTitle>{site.hero.word}</FitTitle>

      <div className="relative mt-1 min-h-[680px] overflow-hidden bg-[#25f4ee] text-white sm:min-h-[560px]">
        <Image
          src={site.hero.image}
          alt={site.hero.imageAlt}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center sm:object-[center_8%]"
        />

        <div className="relative z-10 flex min-h-[680px] items-end justify-center px-4 py-8 sm:min-h-[560px] sm:justify-start sm:px-8 sm:py-10">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={site.avaUrl}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#1a120f]"
            >
              {site.hero.watchLabel}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/catalogue"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white px-5 text-sm font-semibold text-white"
            >
              {site.hero.catalogLabel}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-[#f3efe8] py-4">
        <div className="marquee-track flex w-max items-center">
          {loop.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center text-[11px] font-semibold tracking-[0.18em] text-ink/70 sm:text-xs"
            >
              <span className="px-4">{item.toUpperCase()}</span>
              <span aria-hidden className="text-ink/35">
                /
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

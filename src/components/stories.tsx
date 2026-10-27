"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { PosterCard } from "@/components/poster";
import { Reveal } from "@/components/reveal";
import { titles } from "@/lib/content";

export function Stories() {
  const scroller = useRef<HTMLDivElement>(null);

  function move(direction: number) {
    scroller.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section id="catalogue" className="scroll-mt-24 bg-cream px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl border-t border-black/15 pt-8">
        <div className="flex items-end justify-between gap-4">
          <Reveal>
            <p className="kicker text-muted">Catalogue</p>
            <h2 className="font-display mt-3 max-w-xl text-4xl leading-tight font-normal sm:text-6xl">
              Les titres, et qui les porte
            </h2>
          </Reveal>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Titres précédents"
              className="grid h-11 w-11 place-items-center border border-black/15"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Titres suivants"
              className="grid h-11 w-11 place-items-center border border-black/15"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div ref={scroller} className="mt-10 flex snap-x gap-6 overflow-x-auto pb-4">
          {titles.map((title) => (
            <div key={title.slug} className="w-[72vw] max-w-[280px] shrink-0 snap-start">
              <PosterCard title={title} />
            </div>
          ))}
        </div>
        <Link href="/catalogue" className="mt-4 inline-block border-b border-ink pb-0.5 text-sm">
          Tout le catalogue
        </Link>
      </div>
    </section>
  );
}

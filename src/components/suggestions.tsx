import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { producers, titlesForProducer } from "@/lib/content";

export function Suggestions() {
  return (
    <section id="producteurs" className="scroll-mt-24 bg-cream px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl border-t border-black/15 pt-8">
        <Reveal>
          <p className="kicker text-muted">Maisons</p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl leading-tight font-normal sm:text-6xl">
            Les producteurs et le catalogue qu&apos;ils portent
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          {producers.map((producer) => {
            const catalog = titlesForProducer(producer.slug);
            return (
              <article key={producer.slug} className="border-t border-black/15 pt-5">
                <p className="kicker text-muted">{producer.role}</p>
                <h3 className="font-display mt-3 text-4xl leading-none font-normal">
                  {producer.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">{producer.summary}</p>
                <ul className="mt-6 space-y-3">
                  {catalog.map((title) => (
                    <li key={title.slug} className="border-b border-black/10 pb-3">
                      <Link href={`/catalogue/${title.slug}`} className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-xl">{title.title}</span>
                        <span className="shrink-0 text-xs text-muted">{title.year}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/producteurs/${producer.slug}`} className="mt-5 inline-block text-sm border-b border-ink pb-0.5">
                  Ouvrir la maison
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

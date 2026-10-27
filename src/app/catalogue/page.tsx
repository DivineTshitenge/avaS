import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PosterCard } from "@/components/poster";
import { Reveal } from "@/components/reveal";
import { titlesForProducer } from "@/lib/site-defaults";
import { readSite } from "@/lib/site-store.server";

export const metadata: Metadata = {
  title: "Catalogue — AvaStudio",
  description: "Les titres publics, avec la maison ou la sélection qui les porte.",
};

export default async function CataloguePage() {
  const { producers, titles } = await readSite();
  return (
    <>
      <Header />
      <main className="bg-cream px-4 pt-28 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="kicker text-muted">Titres</p>
            <h1 className="font-display mt-3 text-5xl leading-none font-normal sm:text-7xl">
              Catalogue
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              Chaque titre mène à sa fiche, puis à la maison ou à la sélection qui le porte.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-y border-black/15 py-4">
            <Link href="/catalogue" className="kicker text-ink">
              Tout
            </Link>
            {producers.map((producer) => (
              <Link key={producer.slug} href={`/producteurs/${producer.slug}`} className="kicker text-muted">
                {producer.name}
                <span className="ml-2">{titlesForProducer(titles, producer.slug).length}</span>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-3">
            {titles.map((title) => (
              <PosterCard key={title.slug} title={title} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

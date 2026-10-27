import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/reveal";
import { titlesForProducer } from "@/lib/site-defaults";
import { readSite } from "@/lib/site-store.server";

export const metadata: Metadata = {
  title: "Producteurs — AvaStudio",
  description: "Les maisons et sélections présentes sur avastream.site, avec leur catalogue.",
};

export default async function ProducersPage() {
  const { producers, titles } = await readSite();
  return (
    <>
      <Header />
      <main className="bg-cream px-4 pt-28 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="kicker text-muted">Maisons et sélections</p>
            <h1 className="font-display mt-3 max-w-3xl text-5xl leading-none font-normal sm:text-7xl">
              Producteurs
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {producers.map((producer) => producer.name).join(" · ")}. Chaque fiche ouvre son catalogue.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {producers.map((producer) => {
              const catalog = titlesForProducer(titles, producer.slug);
              return (
                <article key={producer.slug} className="border-t border-black/15 pt-5">
                  <p className="kicker text-muted">{producer.role}</p>
                  <h2 className="font-display mt-3 text-4xl font-normal">{producer.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{producer.summary}</p>
                  <p className="mt-4 text-sm">
                    {catalog.length} titre{catalog.length > 1 ? "s" : ""}
                  </p>
                  <Link href={`/producteurs/${producer.slug}`} className="mt-5 inline-block border-b border-ink pb-0.5 text-sm">
                    Ouvrir le catalogue
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

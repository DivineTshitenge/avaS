import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/reveal";
import { PosterCard } from "@/components/poster";
import { titlesForProducer } from "@/lib/site-defaults";
import { readSite, readSiteFile } from "@/lib/site-store.server";

export function generateStaticParams() {
  return readSiteFile().producers.map((producer) => ({ slug: producer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await readSite();
  const producer = site.producers.find((item) => item.slug === slug);
  if (!producer) return { title: "Producteur introuvable" };
  return {
    title: `${producer.name} — Catalogue`,
    description: producer.summary,
  };
}

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await readSite();
  const producer = site.producers.find((item) => item.slug === slug);
  if (!producer) notFound();
  const catalog = titlesForProducer(site.titles, producer.slug);

  return (
    <>
      <Header />
      <main className="bg-cream px-4 pt-28 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Link href="/producteurs" className="kicker text-muted">
              Producteurs
            </Link>
            <p className="mt-4 kicker text-muted">{producer.role}</p>
            <h1 className="font-display mt-3 text-5xl leading-none font-normal sm:text-7xl">
              {producer.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{producer.summary}</p>
          </Reveal>
          <h2 className="font-display mt-14 border-t border-black/15 pt-6 text-3xl font-normal">Catalogue</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3">
            {catalog.map((title) => (
              <PosterCard key={title.slug} title={title} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

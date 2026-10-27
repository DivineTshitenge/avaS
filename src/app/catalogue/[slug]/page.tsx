import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Reveal } from "@/components/reveal";
import { producersForTitle, titlesForProducer } from "@/lib/site-defaults";
import { readSite, readSiteFile } from "@/lib/site-store.server";

export function generateStaticParams() {
  return readSiteFile().titles.map((title) => ({ slug: title.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await readSite();
  const title = site.titles.find((item) => item.slug === slug);
  if (!title) return { title: "Titre introuvable" };
  return {
    title: `${title.title} — Catalogue AVA`,
    description: title.description,
  };
}

export default async function TitlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await readSite();
  const title = site.titles.find((item) => item.slug === slug);
  if (!title) notFound();
  const houses = producersForTitle(site.producers, title);

  return (
    <>
      <Header />
      <main className="bg-cream px-4 pt-28 pb-20 sm:px-6">
        <Reveal className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[280px_1fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden bg-[#eceae6]">
            <Image src={title.image} alt="" fill priority sizes="280px" className="object-cover" />
          </div>
          <div>
            <Link href="/catalogue" className="kicker text-muted">
              Catalogue
            </Link>
            <p className="mt-4 kicker text-muted">{title.rating} · {title.year}</p>
            <h1 className="font-display mt-3 text-5xl leading-none font-normal sm:text-7xl">
              {title.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{title.description}</p>
            <dl className="mt-6 grid max-w-lg grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">Format</dt>
                <dd className="font-semibold">{title.type}</dd>
              </div>
              <div>
                <dt className="text-muted">Durée</dt>
                <dd className="font-semibold">{title.duration}</dd>
              </div>
              <div>
                <dt className="text-muted">Genres</dt>
                <dd className="font-semibold">{title.genres.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-muted">Phrase</dt>
                <dd className="font-semibold">{title.tagline}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {houses.map((house) => (
                <Link
                  key={house.slug}
                  href={`/producteurs/${house.slug}`}
                  className="border-b border-black/20 pb-0.5 text-sm"
                >
                  {house.name}
                </Link>
              ))}
            </div>
            <a
              href={site.avaUrl}
              className="mt-8 inline-block border-b border-ink pb-0.5 text-sm"
            >
              Regarder sur avastream.site
            </a>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}

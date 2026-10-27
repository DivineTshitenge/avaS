import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { MagazineReader } from "@/components/magazine-reader";
import { readSite, readSiteFile } from "@/lib/site-store.server";

export function generateStaticParams() {
  return readSiteFile().magazines.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const magazine = (await readSite()).magazines.find((item) => item.slug === slug);
  if (!magazine) return { title: "Magazine introuvable" };
  return { title: `${magazine.title} — AvaStudio` };
}

export default async function MagazinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const magazine = (await readSite()).magazines.find((item) => item.slug === slug);
  if (!magazine) notFound();

  return (
    <>
      <Header />
      <main className="flex h-dvh flex-col bg-[#111] pt-[4.6rem] text-white">
        <MagazineReader title={magazine.title} pdf={magazine.pdf} />
      </main>
    </>
  );
}

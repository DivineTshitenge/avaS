import Link from "next/link";
import { avaUrl } from "@/lib/content";

export function Closing() {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 border-t border-black/15 pt-10 lg:grid-cols-3">
        <div>
          <p className="kicker text-muted">Continuer</p>
          <h2 className="font-display mt-3 text-4xl leading-tight font-normal sm:text-5xl">
            Choisir une porte.
          </h2>
        </div>
        <Link href="/producteurs" className="border-t border-black/15 pt-5">
          <p className="kicker text-muted">01</p>
          <p className="font-display mt-3 text-3xl">Les producteurs</p>
        </Link>
        <div className="grid gap-8">
          <Link href="/catalogue" className="border-t border-black/15 pt-5">
            <p className="kicker text-muted">02</p>
            <p className="font-display mt-3 text-3xl">Le catalogue</p>
          </Link>
          <a href={avaUrl} className="border-t border-black/15 pt-5">
            <p className="kicker text-muted">03</p>
            <p className="font-display mt-3 text-3xl">La plateforme</p>
          </a>
        </div>
      </div>
    </section>
  );
}

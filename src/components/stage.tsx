import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { avaUrl } from "@/lib/content";

const doors = [
  {
    index: "01",
    title: "Producteurs",
    text: "Bel'Art Pro, Bellevue TV et la sélection AVA, chacun avec les titres qui lui sont associés.",
    href: "/producteurs",
    label: "Voir les maisons",
    external: false,
  },
  {
    index: "02",
    title: "Catalogues",
    text: "Cinq titres publics, reliés à la maison ou à la sélection qui les porte.",
    href: "/catalogue",
    label: "Ouvrir le catalogue",
    external: false,
  },
  {
    index: "03",
    title: "Plateforme",
    text: "AVA réunit films, séries, podcasts et originaux. La lecture se fait sur avastream.site.",
    href: avaUrl,
    label: "Aller sur la plateforme",
    external: true,
  },
] as const;

export function Stage() {
  return (
    <section id="plateforme" className="scroll-mt-24 bg-cream px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl border-t border-black/15 pt-8">
        <Reveal>
          <p className="kicker text-muted">Sommaire</p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl leading-tight font-normal sm:text-6xl">
            Trois entrées, le même cinéma.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {doors.map((door) => (
            <article key={door.index} className="border-t border-black/15 pt-5">
              <p className="kicker text-muted">{door.index}</p>
              <h3 className="font-display mt-3 text-4xl font-normal">{door.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{door.text}</p>
              {door.external ? (
                <a href={door.href} className="mt-5 inline-block border-b border-ink pb-0.5 text-sm">
                  {door.label}
                </a>
              ) : (
                <Link href={door.href} className="mt-5 inline-block border-b border-ink pb-0.5 text-sm">
                  {door.label}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

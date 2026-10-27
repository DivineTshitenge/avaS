"use client";

import { Menu, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSite } from "@/lib/site-context";

export function Header() {
  const { avaUrl, brand, nav, producers, titles } = useSite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = nav
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => node !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.15, 0.4] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname, nav]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const titleHits = titles.filter((item) => {
      const haystack = `${item.title} ${item.tagline} ${item.genres.join(" ")}`.toLowerCase();
      return !needle || haystack.includes(needle);
    });
    const producerHits = producers.filter((item) => {
      const haystack = `${item.name} ${item.role} ${item.summary}`.toLowerCase();
      return !needle || haystack.includes(needle);
    });
    return { titleHits, producerHits };
  }, [query, producers, titles]);

  function openSearch() {
    setOpen(false);
    dialogRef.current?.showModal();
  }

  function closeSearch() {
    dialogRef.current?.close();
    setOpen(false);
  }

  function isCurrent(link: (typeof nav)[number]) {
    if (link.href.startsWith("/#")) return pathname === "/" && active === link.id;
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }

  const empty = results.titleHits.length === 0 && results.producerHits.length === 0;

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-cream/95 backdrop-blur-md"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center md:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Menu</span>
        </button>

        <nav aria-label="Sections" className="hidden items-center gap-5 md:flex">
          {nav.map((link) => {
            const current = isCurrent(link);
            return (
              <Link
                key={link.id}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`kicker ${current ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="font-display justify-self-center text-2xl leading-none tracking-tight whitespace-nowrap italic sm:text-3xl">
          {brand}
        </Link>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Rechercher un titre ou un producteur"
            className="grid h-10 w-10 place-items-center"
          >
            <Search className="h-4 w-4" />
          </button>
          <a href={avaUrl} className="kicker hidden text-ink sm:inline">
            Regarder
          </a>
        </div>
      </div>

      {open ? (
        <nav
          id="menu-mobile"
          aria-label="Sections mobiles"
          className="border-t border-black/10 px-4 py-2 md:hidden"
        >
          {nav.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-black/10 py-3 font-display text-2xl"
            >
              {link.label}
            </Link>
          ))}
          <a href={avaUrl} className="block py-3 text-sm">
            Regarder sur la plateforme
          </a>
        </nav>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-labelledby={searchId}
        className="search-dialog"
        onClose={() => setQuery("")}
      >
        <form method="dialog" className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3">
            <h2 id={searchId} className="font-display text-2xl font-normal">
              Titres et producteurs
            </h2>
            <button type="submit" className="grid h-9 w-9 place-items-center" aria-label="Fermer la recherche">
              <X className="h-4 w-4" />
            </button>
          </div>
          <label htmlFor="catalog-query" className="sr-only">
            Titre, genre ou producteur
          </label>
          <input
            id="catalog-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pulsions, Bel'Art, drameâ€¦"
            className="mt-4 w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm outline-none"
          />
          <ul className="mt-3 max-h-[50vh] space-y-1 overflow-auto">
            {empty ? (
              <li className="px-1 py-6 text-center text-sm text-muted">
                Aucun rÃ©sultat pour Â« {query} Â».
              </li>
            ) : (
              <>
                {results.titleHits.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/catalogue/${item.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 py-2"
                    >
                      <span className="relative h-14 w-10 overflow-hidden bg-[#eceae6]">
                        <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display block truncate text-xl">{item.title}</span>
                        <span className="block text-xs text-muted">
                          {item.type} Â· {item.year}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
                {results.producerHits.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/producteurs/${item.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 py-2"
                    >
                      <span className="grid h-14 w-10 place-items-center border border-black/15 font-display text-lg">
                        {item.name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-display block truncate text-xl">{item.name}</span>
                        <span className="block text-xs text-muted">{item.role}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </form>
      </dialog>
    </header>
  );
}


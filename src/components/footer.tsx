"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { useSite } from "@/lib/site-context";

export function Footer() {
  const { avaUrl, brand, footer, producers, titles } = useSite();
  const columns = [
    {
      title: "Maisons",
      links: [
        ...producers.map((producer) => [producer.name, `/producteurs/${producer.slug}`] as const),
        ["Toutes les maisons", "/producteurs"] as const,
      ],
    },
    {
      title: "Catalogue",
      links: [
        ["Tous les titres", "/catalogue"] as const,
        ...titles.slice(0, 3).map((title) => [title.title, `/catalogue/${title.slug}`] as const),
      ],
    },
    {
      title: "Plateforme",
      links: [
        ["Abonnement", "/#abonnement"] as const,
        ["avastream.site", avaUrl] as const,
        ["Questions", "/#faq"] as const,
        ["Admin", "/admin"] as const,
      ],
    },
  ];
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  }

  return (
    <footer id="contact" className="scroll-mt-24 bg-cream px-4 pt-8 pb-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 border-t border-black/15 pt-12 lg:grid-cols-[1.1fr_1.9fr]">
        <div>
          <Link href="/" className="font-display text-4xl italic">
            {brand}
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {footer.blurb}
          </p>
          {done ? (
            <p className="mt-5 border-t border-black/15 pt-3 text-sm" role="status">
              C&apos;est noté. On vous écrit quand une maison ou un titre bouge.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label htmlFor="newsletter" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Ton e-mail"
                className="h-11 flex-1 border-b border-black/25 bg-transparent text-sm outline-none"
              />
              <button type="submit" className="h-11 border-b border-ink text-left text-sm">
                S&apos;inscrire
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="kicker">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link href={href} className="text-sm text-muted hover:text-ink">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="text-sm text-muted hover:text-ink">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-black/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{footer.note}</p>
        <div className="flex gap-2">
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="grid h-10 w-10 place-items-center border border-black/15"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="4" width="16" height="16" rx="5" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            aria-label="YouTube"
            className="grid h-10 w-10 place-items-center border border-black/15"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3-5.2 3.3z" />
            </svg>
          </a>
          <a
            href="#contact"
            aria-label="Écrire à AvaStudio"
            className="grid h-10 w-10 place-items-center border border-black/15"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

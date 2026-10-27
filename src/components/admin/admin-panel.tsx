"use client";

import { FileText, ImagePlus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { saveSiteAction, uploadMediaAction } from "@/app/admin/actions";
import {
  slugify,
  type FaqItem,
  type MagazineItem,
  type NavItem,
  type PlanItem,
  type ProducerItem,
  type SiteContent,
  type TitleItem,
} from "@/lib/site-defaults";

const sections = [
  ["hero", "Hero"],
  ["about", "Présentation"],
  ["nav", "Navigation"],
  ["top", "Top"],
  ["titles", "Catalogue"],
  ["producers", "Producteurs"],
  ["magazines", "Magazines"],
  ["pricing", "Abonnement"],
  ["faq", "Questions"],
  ["footer", "Pied de page"],
] as const;

type SectionId = (typeof sections)[number][0];

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-black/10 bg-[#f7f6f3] px-3.5 py-2.5 text-sm text-[#111] outline-none transition focus:border-[#25f4ee] focus:bg-white";

export function AdminPanel({ initial }: { initial: SiteContent }) {
  const [draft, setDraft] = useState(initial);
  const [section, setSection] = useState<SectionId>("hero");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const current = sections.find(([id]) => id === section)?.[1] ?? "Hero";

  async function save() {
    setPending(true);
    setStatus("");
    try {
      await saveSiteAction(draft);
      router.refresh();
      setStatus("Enregistré. Le site affiche ces contenus.");
    } catch {
      setStatus("L'enregistrement n'a pas abouti.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#f3efe8] text-[#111] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-white/10 bg-[#111] text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
        <div className="px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-white/45">AVASTUDIO</p>
              <p className="text-lg font-semibold">Administration</p>
            </div>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-full bg-[#25f4ee] px-4 py-2 text-sm font-semibold text-[#111] disabled:opacity-50 lg:hidden"
            >
              {pending ? "…" : "Enregistrer"}
            </button>
          </div>
          <Link href="/" className="mt-3 hidden rounded-xl border border-white/15 px-3 py-2 text-center text-sm font-semibold lg:block">
            Voir le site
          </Link>
        </div>
        <nav className="flex gap-2 overflow-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:px-3" aria-label="Sections à gérer">
          {sections.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              aria-current={section === id ? "page" : undefined}
              className={`shrink-0 rounded-full px-3 py-2 text-left text-sm font-semibold lg:rounded-xl ${
                section === id ? "bg-[#25f4ee] text-[#111]" : "bg-white/8 text-white/80 hover:bg-white/12"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-black/10 bg-[#f3efe8]/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#111]/45">SECTION</p>
            <h1 className="text-xl font-semibold">{current}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-black/15 px-3 py-2 text-sm font-semibold lg:hidden">
              Voir le site
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="hidden rounded-full bg-[#111] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 lg:inline-flex"
            >
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
          {status ? (
            <p className={`mb-5 rounded-2xl px-4 py-3 text-sm font-semibold ${status.startsWith("Enregistré") ? "bg-[#25f4ee]/40" : "bg-red-100 text-red-800"}`}>
              {status}
            </p>
          ) : null}
          {section === "hero" ? <HeroFields site={draft} setSite={setDraft} /> : null}
          {section === "about" ? <AboutFields site={draft} setSite={setDraft} /> : null}
          {section === "nav" ? <NavFields site={draft} setSite={setDraft} /> : null}
          {section === "top" ? <TopFields site={draft} setSite={setDraft} /> : null}
          {section === "titles" ? <TitleFields site={draft} setSite={setDraft} /> : null}
          {section === "producers" ? <ProducerFields site={draft} setSite={setDraft} /> : null}
          {section === "magazines" ? <MagazineFields site={draft} setSite={setDraft} /> : null}
          {section === "pricing" ? <PricingFields site={draft} setSite={setDraft} /> : null}
          {section === "faq" ? <FaqFields site={draft} setSite={setDraft} /> : null}
          {section === "footer" ? <FooterFields site={draft} setSite={setDraft} /> : null}
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  area = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.14em] text-[#111]/45 uppercase">{label}</span>
      {area ? (
        <textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      )}
    </label>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <article className="space-y-4 rounded-[1.6rem] border border-black/8 bg-white p-4 shadow-sm sm:p-5">{children}</article>;
}

function MediaField({
  label,
  value,
  onChange,
  kind,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  kind: "image" | "pdf";
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [broken, setBroken] = useState(false);
  const fileName = value.split("/").filter(Boolean).pop() || value;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    body.set("kind", kind);
    const result = await uploadMediaAction(body);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setBroken(false);
    onChange(result.path);
  }

  return (
    <div className="rounded-2xl border border-black/8 bg-[#f7f6f3] p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold tracking-[0.14em] text-[#111]/45 uppercase">{label}</span>
        {value ? (
          <button type="button" onClick={() => onChange("")} className="text-xs font-semibold text-[#111]/50">
            Retirer
          </button>
        ) : null}
      </div>

      {kind === "image" ? (
        <div className="mt-3 flex gap-3">
          <div className="relative grid aspect-[3/4] w-28 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#111] text-white/70 sm:w-36">
            {value && !broken ? (
              <img src={value} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />
            ) : (
              <ImagePlus className="size-6" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="truncate text-sm font-semibold">{value ? fileName : "Aucune image"}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#111]/50">JPG, PNG, WEBP ou GIF. 8 Mo maximum.</p>
            <FileButton id={inputId} busy={busy} replace={Boolean(value)} />
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#111] text-[#25f4ee]">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{value ? fileName : "Aucun PDF"}</p>
              <p className="text-xs text-[#111]/50">PDF, 40 Mo maximum.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <FileButton id={inputId} busy={busy} replace={Boolean(value)} />
            {value ? (
              <a href={value} target="_blank" rel="noreferrer" className="text-sm font-semibold underline">
                Ouvrir
              </a>
            ) : null}
          </div>
        </div>
      )}

      <input
        id={inputId}
        type="file"
        accept={kind === "pdf" ? "application/pdf,.pdf" : "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"}
        className="sr-only"
        onChange={(event) => {
          void onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <label className="mt-3 block">
        <span className="text-[11px] font-semibold tracking-[0.14em] text-[#111]/40 uppercase">Adresse</span>
        <input
          value={value}
          onChange={(event) => {
            setBroken(false);
            onChange(event.target.value);
          }}
          placeholder={kind === "pdf" ? "/magazines/exemple.pdf" : "/images/exemple.jpg ou https://…"}
          className={inputClass}
        />
      </label>
      {error ? <p className="mt-2 text-sm font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}

function FileButton({ id, busy, replace }: { id: string; busy: boolean; replace: boolean }) {
  return (
    <label htmlFor={id} className="mt-3 inline-flex w-fit cursor-pointer rounded-full bg-[#111] px-3.5 py-2 text-xs font-semibold text-white">
      {busy ? "Envoi…" : replace ? "Remplacer le fichier" : "Choisir un fichier"}
    </label>
  );
}

function AddButton({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-2 text-sm font-semibold">
      <Plus className="size-4" />
      {children}
    </button>
  );
}

function HeroFields({ site, setSite }: Editor) {
  const set = (key: keyof SiteContent["hero"], value: string) => setSite({ ...site, hero: { ...site.hero, [key]: value } });
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Marque" value={site.brand} onChange={(brand) => setSite({ ...site, brand })} />
          <Field label="Adresse de la plateforme" value={site.avaUrl} onChange={(avaUrl) => setSite({ ...site, avaUrl })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Année" value={site.hero.year} onChange={(value) => set("year", value)} />
          <Field label="Texte à droite" value={site.hero.kicker} onChange={(value) => set("kicker", value)} />
        </div>
        <Field label="Grand titre" value={site.hero.word} onChange={(value) => set("word", value)} />
      </Card>
      <Card>
        <MediaField label="Photo du hero" kind="image" value={site.hero.image} onChange={(image) => set("image", image)} />
        <Field label="Texte de l'image" value={site.hero.imageAlt} onChange={(value) => set("imageAlt", value)} />
      </Card>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bouton regarder" value={site.hero.watchLabel} onChange={(value) => set("watchLabel", value)} />
          <Field label="Bouton catalogue" value={site.hero.catalogLabel} onChange={(value) => set("catalogLabel", value)} />
        </div>
      </Card>
    </div>
  );
}

function AboutFields({ site, setSite }: Editor) {
  return (
    <Card>
      <StringList label="Repères" values={site.about.points} onChange={(points) => setSite({ ...site, about: { ...site.about, points } })} />
      <Field label="Texte" area value={site.about.text} onChange={(text) => setSite({ ...site, about: { ...site.about, text } })} />
    </Card>
  );
}

function NavFields({ site, setSite }: Editor) {
  function update(index: number, patch: Partial<NavItem>) {
    setSite({ ...site, nav: site.nav.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  }
  return (
    <div className="space-y-4">
      {site.nav.map((item, index) => (
        <Card key={`${item.id}-${index}`}>
          <Field label="Libellé" value={item.label} onChange={(label) => update(index, { label })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lien" value={item.href} onChange={(href) => update(index, { href })} />
            <Field label="Ancre" value={item.id} onChange={(id) => update(index, { id })} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function TopFields({ site, setSite }: Editor) {
  return (
    <Card>
      <Field label="Titre de la section" value={site.top.title} onChange={(title) => setSite({ ...site, top: { title } })} />
      <p className="text-sm leading-relaxed text-[#111]/55">Les œuvres et leurs images se règlent dans Catalogue, dans le même ordre.</p>
      <ol className="space-y-2">
        {site.titles.map((item, index) => (
          <li key={`${item.slug}-${index}`} className="flex items-center gap-3 rounded-xl bg-[#f7f6f3] px-3 py-2 text-sm font-semibold">
            <span className="text-[#111]/40">{String(index + 1).padStart(2, "0")}</span>
            {item.title}
          </li>
        ))}
      </ol>
    </Card>
  );
}

function TitleFields({ site, setSite }: Editor) {
  function update(index: number, patch: Partial<TitleItem>) {
    setSite({ ...site, titles: site.titles.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  }
  function add() {
    setSite({
      ...site,
      titles: [
        ...site.titles,
        {
          slug: `titre-${site.titles.length + 1}`,
          title: "Nouveau titre",
          tagline: "",
          description: "",
          image: "",
          type: "Film",
          year: new Date().getFullYear(),
          rating: "Tout public",
          duration: "",
          genres: [],
          producerSlugs: [],
        },
      ],
    });
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#111]/55">{site.titles.length} titres</p>
        <AddButton onClick={add}>Ajouter un titre</AddButton>
      </div>
      {site.titles.map((item, index) => (
        <Card key={`${item.slug}-${index}`}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-[#111]/40">{String(index + 1).padStart(2, "0")}</p>
            <Remove onClick={() => setSite({ ...site, titles: site.titles.filter((_, itemIndex) => itemIndex !== index) })} />
          </div>
          <MediaField label="Affiche" kind="image" value={item.image} onChange={(image) => update(index, { image })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Titre" value={item.title} onChange={(title) => update(index, { title, slug: item.slug || slugify(title) })} />
            <Field label="Slug" value={item.slug} onChange={(slug) => update(index, { slug })} />
          </div>
          <Field label="Phrase" value={item.tagline} onChange={(tagline) => update(index, { tagline })} />
          <Field label="Description" area value={item.description} onChange={(description) => update(index, { description })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type" value={item.type} onChange={(type) => update(index, { type })} />
            <Field label="Année" value={String(item.year)} onChange={(year) => update(index, { year: Number(year) || item.year })} />
            <Field label="Classification" value={item.rating} onChange={(rating) => update(index, { rating })} />
            <Field label="Durée" value={item.duration} onChange={(duration) => update(index, { duration })} />
          </div>
          <Field label="Genres, séparés par des virgules" value={item.genres.join(", ")} onChange={(value) => update(index, { genres: splitList(value) })} />
          <fieldset>
            <legend className="text-[11px] font-semibold tracking-[0.14em] text-[#111]/45 uppercase">Producteurs</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {site.producers.map((producer) => {
                const checked = item.producerSlugs.includes(producer.slug);
                return (
                  <label key={producer.slug} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${checked ? "border-[#111] bg-[#111] text-white" : "border-black/10"}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        update(index, {
                          producerSlugs: checked ? item.producerSlugs.filter((slug) => slug !== producer.slug) : [...item.producerSlugs, producer.slug],
                        })
                      }
                    />
                    {producer.name}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </Card>
      ))}
    </div>
  );
}

function ProducerFields({ site, setSite }: Editor) {
  function update(index: number, patch: Partial<ProducerItem>) {
    setSite({ ...site, producers: site.producers.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  }
  return (
    <div className="space-y-4">
      <Card>
        <Field label="Titre de la section" value={site.houses.title} onChange={(title) => setSite({ ...site, houses: { ...site.houses, title } })} />
        <Field label="Texte" value={site.houses.text} onChange={(text) => setSite({ ...site, houses: { ...site.houses, text } })} />
        <Field label="Bouton" value={site.houses.moreLabel} onChange={(moreLabel) => setSite({ ...site, houses: { ...site.houses, moreLabel } })} />
      </Card>
      <div className="flex items-center justify-between gap-3">
        <p className="max-w-sm text-sm text-[#111]/55">L&apos;accueil montre les quatre premières. Les suivantes restent sur la page Producteurs.</p>
        <AddButton
          onClick={() =>
            setSite({
              ...site,
              producers: [...site.producers, { slug: `maison-${site.producers.length + 1}`, name: "Nouvelle maison", role: "", summary: "", place: "" }],
            })
          }
        >
          Ajouter
        </AddButton>
      </div>
      {site.producers.map((item, index) => (
        <Card key={`${item.slug}-${index}`}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-[#111]/40">{String(index + 1).padStart(2, "0")}</p>
            <Remove onClick={() => setSite({ ...site, producers: site.producers.filter((_, itemIndex) => itemIndex !== index) })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom" value={item.name} onChange={(name) => update(index, { name })} />
            <Field label="Slug" value={item.slug} onChange={(slug) => update(index, { slug })} />
            <Field label="Rôle" value={item.role} onChange={(role) => update(index, { role })} />
            <Field label="Lieu" value={item.place} onChange={(place) => update(index, { place })} />
          </div>
          <Field label="Résumé" area value={item.summary} onChange={(summary) => update(index, { summary })} />
        </Card>
      ))}
    </div>
  );
}

function MagazineFields({ site, setSite }: Editor) {
  function update(index: number, patch: Partial<MagazineItem>) {
    setSite({ ...site, magazines: site.magazines.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  }
  return (
    <div className="space-y-4">
      <Card>
        <Field label="Titre de la section" value={site.covers.title} onChange={(title) => setSite({ ...site, covers: { title } })} />
      </Card>
      <div className="flex justify-end">
        <AddButton
          onClick={() =>
            setSite({
              ...site,
              magazines: [...site.magazines, { slug: `magazine-${site.magazines.length + 1}`, title: "Nouveau magazine", cover: "", pdf: "", alt: "" }],
            })
          }
        >
          Ajouter un magazine
        </AddButton>
      </div>
      {site.magazines.map((item, index) => (
        <Card key={`${item.slug}-${index}`}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold">{item.title || "Magazine"}</p>
            <Remove onClick={() => setSite({ ...site, magazines: site.magazines.filter((_, itemIndex) => itemIndex !== index) })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Titre" value={item.title} onChange={(title) => update(index, { title })} />
            <Field label="Slug" value={item.slug} onChange={(slug) => update(index, { slug })} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <MediaField label="Couverture" kind="image" value={item.cover} onChange={(cover) => update(index, { cover })} />
            <MediaField label="PDF" kind="pdf" value={item.pdf} onChange={(pdf) => update(index, { pdf })} />
          </div>
          <Field label="Texte alternatif de la couverture" value={item.alt} onChange={(alt) => update(index, { alt })} />
        </Card>
      ))}
    </div>
  );
}

function PricingFields({ site, setSite }: Editor) {
  function update(index: number, patch: Partial<PlanItem>) {
    setSite({ ...site, plans: site.plans.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  }
  return (
    <div className="space-y-4">
      <Card>
        <Field label="Titre" value={site.pricing.title} onChange={(title) => setSite({ ...site, pricing: { ...site.pricing, title } })} />
        <Field label="Texte" area value={site.pricing.text} onChange={(text) => setSite({ ...site, pricing: { ...site.pricing, text } })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bouton" value={site.pricing.subscribeLabel} onChange={(subscribeLabel) => setSite({ ...site, pricing: { ...site.pricing, subscribeLabel } })} />
          <Field label="Titre de la liste" value={site.pricing.includedLabel} onChange={(includedLabel) => setSite({ ...site, pricing: { ...site.pricing, includedLabel } })} />
        </div>
        <Field label="Note" value={site.pricing.note} onChange={(note) => setSite({ ...site, pricing: { ...site.pricing, note } })} />
        <StringList label="Inclus" values={site.pricing.features} onChange={(features) => setSite({ ...site, pricing: { ...site.pricing, features } })} />
      </Card>
      {site.plans.map((plan, index) => (
        <Card key={`${plan.length}-${index}`}>
          <div className="flex justify-end">
            <Remove onClick={() => setSite({ ...site, plans: site.plans.filter((_, itemIndex) => itemIndex !== index) })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Durée" value={plan.length} onChange={(length) => update(index, { length })} />
            <Field label="Prix" value={plan.price} onChange={(price) => update(index, { price })} />
          </div>
          <Field label="Détail" value={plan.detail} onChange={(detail) => update(index, { detail })} />
        </Card>
      ))}
      <AddButton onClick={() => setSite({ ...site, plans: [...site.plans, { length: "Nouvelle durée", price: "0 $US", detail: "" }] })}>
        Ajouter une formule
      </AddButton>
    </div>
  );
}

function FaqFields({ site, setSite }: Editor) {
  function update(index: number, patch: Partial<FaqItem>) {
    setSite({ ...site, faqs: site.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  }
  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Surtitre" value={site.faqIntro.kicker} onChange={(kicker) => setSite({ ...site, faqIntro: { ...site.faqIntro, kicker } })} />
          <Field label="Titre" value={site.faqIntro.title} onChange={(title) => setSite({ ...site, faqIntro: { ...site.faqIntro, title } })} />
        </div>
        <Field label="Aide" value={site.faqIntro.helpTitle} onChange={(helpTitle) => setSite({ ...site, faqIntro: { ...site.faqIntro, helpTitle } })} />
        <Field label="Texte d'aide" area value={site.faqIntro.helpText} onChange={(helpText) => setSite({ ...site, faqIntro: { ...site.faqIntro, helpText } })} />
        <Field label="Lien" value={site.faqIntro.helpLabel} onChange={(helpLabel) => setSite({ ...site, faqIntro: { ...site.faqIntro, helpLabel } })} />
      </Card>
      {site.faqs.map((item, index) => (
        <Card key={`${item.q}-${index}`}>
          <div className="flex justify-end">
            <Remove onClick={() => setSite({ ...site, faqs: site.faqs.filter((_, itemIndex) => itemIndex !== index) })} />
          </div>
          <Field label="Question" value={item.q} onChange={(q) => update(index, { q })} />
          <Field label="Réponse" area value={item.a} onChange={(a) => update(index, { a })} />
        </Card>
      ))}
      <AddButton onClick={() => setSite({ ...site, faqs: [...site.faqs, { q: "Nouvelle question", a: "" }] })}>Ajouter une question</AddButton>
    </div>
  );
}

function FooterFields({ site, setSite }: Editor) {
  return (
    <Card>
      <Field label="Texte" area value={site.footer.blurb} onChange={(blurb) => setSite({ ...site, footer: { ...site.footer, blurb } })} />
      <Field label="Mention" value={site.footer.note} onChange={(note) => setSite({ ...site, footer: { ...site.footer, note } })} />
      <p className="text-sm leading-relaxed text-[#111]/55">Les liens des maisons et du catalogue suivent les fiches enregistrées.</p>
    </Card>
  );
}

function StringList({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-[11px] font-semibold tracking-[0.14em] text-[#111]/45 uppercase">{label}</legend>
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={value}
            onChange={(event) => onChange(values.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
            className={inputClass}
          />
          <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 text-sm font-semibold text-[#111]/50">
            Retirer
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...values, ""])} className="text-sm font-semibold">
        Ajouter une ligne
      </button>
    </fieldset>
  );
}

function Remove({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-sm font-semibold text-[#111]/50">
      <Trash2 className="size-3.5" />
      Retirer
    </button>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

type Editor = {
  site: SiteContent;
  setSite: (site: SiteContent) => void;
};

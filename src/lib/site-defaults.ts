import { avaUrl, faqs, navLinks, plans, producers, titles } from "@/lib/content";
import { magazines } from "@/lib/magazines";

export type NavItem = { href: string; id: string; label: string };

export type TitleItem = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  type: string;
  year: number;
  rating: string;
  duration: string;
  genres: string[];
  producerSlugs: string[];
};

export type ProducerItem = {
  slug: string;
  name: string;
  role: string;
  summary: string;
  place: string;
};

export type MagazineItem = {
  slug: string;
  title: string;
  cover: string;
  pdf: string;
  alt: string;
};

export type PlanItem = { length: string; price: string; detail: string };
export type FaqItem = { q: string; a: string };

export type SiteContent = {
  avaUrl: string;
  brand: string;
  nav: NavItem[];
  hero: {
    year: string;
    kicker: string;
    word: string;
    image: string;
    imageAlt: string;
    watchLabel: string;
    catalogLabel: string;
  };
  about: { points: string[]; text: string };
  top: { title: string };
  houses: { title: string; text: string; moreLabel: string };
  covers: { title: string };
  pricing: {
    title: string;
    text: string;
    features: string[];
    note: string;
    subscribeLabel: string;
    includedLabel: string;
  };
  plans: PlanItem[];
  faqIntro: {
    kicker: string;
    title: string;
    helpTitle: string;
    helpText: string;
    helpLabel: string;
  };
  faqs: FaqItem[];
  footer: { blurb: string; note: string };
  titles: TitleItem[];
  producers: ProducerItem[];
  magazines: MagazineItem[];
};

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createDefaultSite(): SiteContent {
  return {
    avaUrl,
    brand: "AvaStudio",
    nav: navLinks.map((link) => ({ href: link.href, id: link.id, label: link.label })),
    hero: {
      year: "©2026",
      kicker: "STUDIO",
      word: "AVASTREAM",
      image: "/hero/portrait-cyan.jpg",
      imageAlt: "Portrait sur fond rouge, débardeur blanc",
      watchLabel: "Regarder",
      catalogLabel: "Voir le catalogue",
    },
    about: {
      points: ["Avastream", "Films et séries", "Dès 5 $US", "4 écrans"],
      text: "AVA est le streaming des arts visuels congolais, avec films, séries, podcasts et originaux sur avastream.site, à regarder sur la tablette, l'ordinateur ou le téléphone.",
    },
    top: { title: "Top 5 AVA" },
    houses: {
      title: "Les maisons",
      text: "Les producteurs avec lesquels AVA collabore.",
      moreLabel: "Voir plus",
    },
    covers: { title: "Couvertures" },
    pricing: {
      title: "Un prix simple, affiché",
      text: "Trois durées, le même catalogue. Films, séries, podcasts et originaux, sans engagement.",
      features: [
        "Films, séries, podcasts et originaux",
        "Jusqu'à 4 écrans en même temps",
        "Télévision, ordinateur, mobile et tablette",
        "Sans engagement, annulable à tout moment",
      ],
      note: "L'abonnement se prend sur avastream.site.",
      subscribeLabel: "S'abonner",
      includedLabel: "Inclus",
    },
    plans: plans.map((plan) => ({ ...plan })),
    faqIntro: {
      kicker: "Questions",
      title: "Questions fréquentes",
      helpTitle: "Tu ne trouves pas ta réponse ?",
      helpText: "Écris-nous. On lit chaque message, sans ticket perdu dans un fil.",
      helpLabel: "Nous écrire",
    },
    faqs: faqs.map((item) => ({ ...item })),
    footer: {
      blurb: "Maisons, catalogues et plateforme. La lecture et l'abonnement se font sur avastream.site.",
      note: "AvaStudio · maisons, catalogues, plateforme.",
    },
    titles: copy(titles),
    producers: copy(producers),
    magazines: copy(magazines),
  };
}

export function mergeSite(saved: unknown): SiteContent {
  const base = createDefaultSite();
  if (!saved || typeof saved !== "object") return base;
  const data = saved as Partial<SiteContent>;
  return {
    ...base,
    ...data,
    hero: { ...base.hero, ...(data.hero ?? {}) },
    about: {
      points: data.about?.points?.length ? data.about.points : base.about.points,
      text: data.about?.text || base.about.text,
    },
    top: { ...base.top, ...(data.top ?? {}) },
    houses: { ...base.houses, ...(data.houses ?? {}) },
    covers: { ...base.covers, ...(data.covers ?? {}) },
    pricing: {
      ...base.pricing,
      ...(data.pricing ?? {}),
      features: data.pricing?.features?.length ? data.pricing.features : base.pricing.features,
    },
    faqIntro: { ...base.faqIntro, ...(data.faqIntro ?? {}) },
    footer: { ...base.footer, ...(data.footer ?? {}) },
    nav: data.nav?.length ? data.nav : base.nav,
    plans: data.plans?.length ? data.plans : base.plans,
    faqs: data.faqs?.length ? data.faqs : base.faqs,
    titles: data.titles?.length ? data.titles : base.titles,
    producers: data.producers?.length ? data.producers : base.producers,
    magazines: data.magazines?.length ? data.magazines : base.magazines,
  };
}

export function titlesForProducer(list: TitleItem[], slug: string) {
  return list.filter((item) => item.producerSlugs.includes(slug));
}

export function producersForTitle(list: ProducerItem[], title: TitleItem) {
  return list.filter((producer) => title.producerSlugs.includes(producer.slug));
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

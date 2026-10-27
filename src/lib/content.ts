export const avaUrl = "https://www.avastream.site";

export const navLinks = [
  { href: "/#maisons", id: "maisons", label: "Producteurs" },
  { href: "/catalogue", id: "catalogue", label: "Catalogue" },
  { href: "/#faq", id: "faq", label: "Questions" },
  { href: "/#abonnement", id: "abonnement", label: "Abonnement" },
] as const;

export function cover(file: string) {
  return `${avaUrl}/covers/${file}`;
}

export const titles = [
  {
    slug: "pulsions-incontrolables",
    title: "Pulsions Incontrôlables",
    tagline: "Une série de Bellevue Kandy.",
    description:
      "Drames, passions et secrets au cœur de la ville. Une production Bel'Art Pro présentée sur Bellevue TV.",
    image: cover("pulsions-incontrolables.jpg"),
    type: "Série",
    year: 2025,
    rating: "16+",
    duration: "52 min",
    genres: ["Action", "Aventure"],
    producerSlugs: ["belart-pro", "bellevue-tv"],
  },
  {
    slug: "horizon-rouge",
    title: "Horizon Rouge",
    tagline: "Un thriller spatial captivant.",
    description: "Un thriller spatial captivant, à l'affiche sur AVA.",
    image: cover("pesha-jour-j9.png"),
    type: "Film",
    year: 2024,
    rating: "12+",
    duration: "118 min",
    genres: ["Drame", "Suspense"],
    producerSlugs: ["selection-ava"],
  },
  {
    slug: "les-ombres-de-paris",
    title: "Les Ombres de Paris",
    tagline: "Une série policière immersive.",
    description: "Une série policière immersive, proposée dans la sélection AVA.",
    image: cover("pesha-jour-j12.png"),
    type: "Série",
    year: 2023,
    rating: "16+",
    duration: "52 min",
    genres: ["Action", "Aventure"],
    producerSlugs: ["selection-ava"],
  },
  {
    slug: "neon-pulse",
    title: "Neon Pulse",
    tagline: "Cyberpunk et rébellion numérique.",
    description: "Cyberpunk et rébellion numérique, dans le catalogue public d'AVA.",
    image: cover("melanin-photoshoot.png"),
    type: "Série",
    year: 2025,
    rating: "12+",
    duration: "45 min",
    genres: ["Action", "Aventure"],
    producerSlugs: ["selection-ava"],
  },
  {
    slug: "silence-profond",
    title: "Silence Profond",
    tagline: "Drame sous-marin poignant.",
    description: "Drame sous-marin poignant, visible dans la sélection AVA.",
    image: cover("portrait-trone.jpg"),
    type: "Film",
    year: 2022,
    rating: "Tout public",
    duration: "96 min",
    genres: ["Drame"],
    producerSlugs: ["selection-ava"],
  },
] as const;

export const producers = [
  {
    slug: "belart-pro",
    name: "Bel'Art Pro",
    role: "Maison de production",
    summary:
      "Bel'Art Pro produit Pulsions Incontrôlables, la série de Bellevue Kandy présentée sur Bellevue TV.",
    place: "Production",
  },
  {
    slug: "bellevue-tv",
    name: "Bellevue TV",
    role: "Chaîne",
    summary:
      "Bellevue TV diffuse Pulsions Incontrôlables : drames, passions et secrets au cœur de la ville.",
    place: "Diffusion",
  },
  {
    slug: "selection-ava",
    name: "Sélection AVA",
    role: "Catalogue de la plateforme",
    summary:
      "Les films et séries à l'affiche sur avastream.site, en plus des maisons déjà nommées sur la page publique.",
    place: "avastream.site",
  },
] as const;

export type Title = (typeof titles)[number];
export type Producer = (typeof producers)[number];

export function getTitle(slug: string) {
  return titles.find((item) => item.slug === slug);
}

export function getProducer(slug: string) {
  return producers.find((item) => item.slug === slug);
}

export function titlesForProducer(slug: string) {
  return titles.filter((item) =>
    (item.producerSlugs as readonly string[]).includes(slug),
  );
}

export function producersForTitle(title: Title) {
  return producers.filter((producer) =>
    (title.producerSlugs as readonly string[]).includes(producer.slug),
  );
}

export const plans = [
  { length: "1 mois", price: "5 $US", detail: "Films, séries, podcasts et originaux" },
  { length: "2 mois", price: "10 $US", detail: "Films, séries, podcasts et originaux" },
  { length: "3 mois", price: "15 $US", detail: "Films, séries, podcasts et originaux" },
] as const;

export const devices = [
  {
    id: "tv",
    label: "Télévisions",
    title: "Le salon, sans compromis",
    text: "Smart TV, Chromecast et Apple TV. AVA s'ouvre sur le grand écran, jusqu'à 4 appareils en même temps.",
    stat: "4",
    statLabel: "appareils en simultané",
  },
  {
    id: "computers",
    label: "Ordinateurs",
    title: "Windows, Mac et Chrome OS",
    text: "Le même catalogue sur l'ordinateur : films, séries, podcasts et productions originales.",
    stat: "5 $US",
    statLabel: "dès le premier mois",
  },
  {
    id: "mobile",
    label: "Mobiles",
    title: "Android, iPhone et iPad",
    text: "Le divertissement congolais dans la poche, où vous voulez, quand vous voulez.",
    stat: "Sans engagement",
    statLabel: "annulable à tout moment",
  },
] as const;

export const faqs = [
  {
    q: "Qu'est-ce qu'AVA ?",
    a: "AVA est le streaming des arts visuels congolais. Films, séries, podcasts et productions originales sont réunis sur avastream.site.",
  },
  {
    q: "Combien coûte AVA ?",
    a: "L'abonnement affiché commence à 5 $US pour 1 mois. Les autres formules sont 10 $US pour 2 mois et 15 $US pour 3 mois.",
  },
  {
    q: "Où puis-je regarder AVA ?",
    a: "Sur smart TV, Chromecast, Apple TV, ordinateur Windows, Mac ou Chrome OS, et sur Android, iPhone et iPad.",
  },
  {
    q: "Comment annuler mon abonnement ?",
    a: "L'offre publique est sans engagement. L'abonnement s'annule depuis le compte sur avastream.site.",
  },
  {
    q: "Que puis-je regarder sur AVA ?",
    a: "La vitrine reprend le catalogue public : Pulsions Incontrôlables, Horizon Rouge, Les Ombres de Paris, Neon Pulse et Silence Profond.",
  },
] as const;

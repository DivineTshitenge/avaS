export const magazines = [
  {
    slug: "salford",
    title: "The Salford",
    cover: "/magazines/salford.jpg",
    pdf: "/magazines/salford.pdf",
    alt: "Couverture The Salford",
  },
  {
    slug: "checked",
    title: "Checked",
    cover: "/magazines/checked.jpg",
    pdf: "/magazines/checked.pdf",
    alt: "Couverture Checked",
  },
  {
    slug: "beauty",
    title: "Beauty Magazine",
    cover: "/magazines/beauty.jpg",
    pdf: "/magazines/beauty.pdf",
    alt: "Couverture Beauty Magazine",
  },
] as const;

export type Magazine = (typeof magazines)[number];

export function getMagazine(slug: string) {
  return magazines.find((item) => item.slug === slug);
}

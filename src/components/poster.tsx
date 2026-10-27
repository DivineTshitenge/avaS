"use client";

import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/lib/site-context";
import { producersForTitle, type TitleItem } from "@/lib/site-defaults";

export function PosterCard({ title }: { title: TitleItem }) {
  const houses = producersForTitle(useSite().producers, title);

  return (
    <Link href={`/catalogue/${title.slug}`} className="group block w-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#eceae6]">
        <Image
          src={title.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 320px, 70vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <p className="kicker mt-3 text-muted">
        {title.type} · {title.year}
      </p>
      <p className="font-display mt-1 text-2xl leading-tight">{title.title}</p>
      <p className="mt-1 text-sm text-muted">{title.genres.join(", ")}</p>
      <p className="mt-2 text-sm">{houses.map((house) => house.name).join(" · ")}</p>
    </Link>
  );
}

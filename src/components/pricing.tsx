"use client";

import { Reveal } from "@/components/reveal";
import { useSite } from "@/lib/site-context";

export function Pricing() {
  const { avaUrl, plans, pricing } = useSite();
  return (
    <section id="abonnement" className="scroll-mt-24 bg-[#f3efe8] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {pricing.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            {pricing.text}
          </p>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan, index) => {
            const featured = index === 1;
            return (
              <Reveal key={plan.length} delay={index * 0.06} className="h-full">
                <article
                  className={
                    featured
                      ? "flex h-full flex-col rounded-[1.75rem] bg-[#111] p-3 text-white shadow-xl lg:-my-3"
                      : "flex h-full flex-col rounded-[1.75rem] border border-black/10 bg-white p-3 shadow-sm"
                  }
                >
                  <div className="px-4 pt-4 pb-2">
                    <h3 className="text-lg font-semibold">{plan.length}</h3>
                    <p className={featured ? "mt-1 text-sm text-white/70" : "mt-1 text-sm text-muted"}>
                      {plan.detail}
                    </p>
                    <p className="mt-6 flex items-end gap-1.5">
                      <span className="text-5xl font-semibold tracking-tight">
                        {plan.price.replace(" $US", "")}
                      </span>
                      <span className="mb-1.5 text-sm">$US</span>
                      <span className={featured ? "mb-1.5 text-sm text-white/60" : "mb-1.5 text-sm text-muted"}>
                        / {plan.length}
                      </span>
                    </p>
                    <a
                      href={avaUrl}
                      className={
                        featured
                          ? "mt-6 flex w-full items-center justify-center rounded-full bg-[#25f4ee] px-4 py-3 text-sm font-semibold text-[#111]"
                          : "mt-6 flex w-full items-center justify-center rounded-full border border-black/15 px-4 py-3 text-sm font-semibold"
                      }
                    >
                      {pricing.subscribeLabel}
                    </a>
                  </div>
                  <div className="mt-3 rounded-[1.25rem] bg-[#f6f3ee] p-5 text-[#111]">
                    <p className="text-sm font-semibold">{pricing.includedLabel}</p>
                    <ul className="mt-3 space-y-2.5">
                      {pricing.features.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm leading-snug">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#25f4ee]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          {pricing.note}
        </p>
      </div>
    </section>
  );
}

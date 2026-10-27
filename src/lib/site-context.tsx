"use client";

import { createContext, useContext } from "react";
import { createDefaultSite, type SiteContent } from "@/lib/site-defaults";

const fallback = createDefaultSite();
const SiteContext = createContext<SiteContent>(fallback);

export function SiteProvider({ site, children }: { site: SiteContent; children: React.ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}

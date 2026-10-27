import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { cacheTag } from "next/cache";
import { mergeSite, type SiteContent } from "@/lib/site-defaults";

const file = path.join(process.cwd(), "data", "site.json");

export function readSiteFile(): SiteContent {
  try {
    return mergeSite(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return mergeSite(null);
  }
}

export async function readSite() {
  "use cache";
  cacheTag("site");
  return readSiteFile();
}

export function writeSite(site: SiteContent) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(site, null, 2));
}

"use server";

import { randomUUID } from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { revalidatePath, revalidateTag } from "next/cache";
import { mergeSite, type SiteContent } from "@/lib/site-defaults";
import { writeSite } from "@/lib/site-store.server";

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function imageExtension(file: File) {
  if (imageTypes[file.type]) return imageTypes[file.type];
  const match = file.name.toLowerCase().match(/\.(jpe?g|png|webp|gif)$/);
  if (!match) return "";
  return match[1] === "jpeg" ? "jpg" : match[1];
}

function pdfExtension(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "";
}

export async function uploadMediaAction(formData: FormData): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const file = formData.get("file");
  const kind = formData.get("kind");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choisis un fichier." };
  if (kind !== "image" && kind !== "pdf") return { ok: false, error: "Type de fichier inconnu." };

  const extension = kind === "pdf" ? pdfExtension(file) : imageExtension(file);
  if (!extension) {
    return { ok: false, error: kind === "pdf" ? "Le fichier doit être un PDF." : "Le fichier doit être une image JPG, PNG, WEBP ou GIF." };
  }

  const limit = kind === "pdf" ? 40 * 1024 * 1024 : 8 * 1024 * 1024;
  if (file.size > limit) return { ok: false, error: kind === "pdf" ? "Le PDF dépasse 40 Mo." : "L'image dépasse 8 Mo." };

  const folder = path.join(process.cwd(), "public", "uploads", kind === "pdf" ? "pdf" : "images");
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  mkdirSync(folder, { recursive: true });
  writeFileSync(path.join(folder, name), Buffer.from(await file.arrayBuffer()));
  return { ok: true, path: `/uploads/${kind === "pdf" ? "pdf" : "images"}/${name}` };
}

export async function saveSiteAction(site: SiteContent) {
  const next = mergeSite(site);
  writeSite(next);
  revalidateTag("site", "max");
  revalidatePath("/", "layout");
  return { ok: true as const };
}

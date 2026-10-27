import { AdminPanel } from "@/components/admin/admin-panel";
import { readSite } from "@/lib/site-store.server";

export const metadata = {
  title: "Administration — AvaStudio",
};

export default async function AdminPage() {
  const site = await readSite();
  return <AdminPanel initial={site} />;
}

import type { Metadata, Viewport } from "next";
import { Anton, Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import { InstallHint, ServiceWorker } from "@/components/pwa";
import { SiteProvider } from "@/lib/site-context";
import { readSite } from "@/lib/site-store.server";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AvaStudio — Producteurs, catalogues et plateforme",
  description:
    "AvaStudio présente les maisons, leurs catalogues et la plateforme AVA. La lecture se fait sur avastream.site.",
  applicationName: "AvaStudio",
  appleWebApp: {
    capable: true,
    title: "AvaStudio",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await readSite();
  return (
    <html lang="fr" className={`${jakarta.variable} ${bodoni.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream text-ink">
        <SiteProvider site={site}>{children}</SiteProvider>
        <ServiceWorker />
        <InstallHint />
      </body>
    </html>
  );
}

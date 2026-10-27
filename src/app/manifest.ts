import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AvaStudio — producteurs et catalogues",
    short_name: "AvaStudio",
    description:
      "Maisons, catalogues et plateforme AVA. La lecture se fait sur avastream.site.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#111111",
    lang: "fr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

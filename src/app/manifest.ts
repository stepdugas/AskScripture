import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AskScripture",
    short_name: "AskScripture",
    description:
      "Read the Bible with side-by-side translations, original-language context, and an AI study chat.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF7",
    theme_color: "#1B2845",
    orientation: "portrait",
    icons: [
      // SVG monogram — works at any size, currently the editorial "A" placeholder
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      // PNG fallbacks (Stephanie drops these in when the real logo lands)
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

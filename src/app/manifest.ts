import type { MetadataRoute } from "next";

// Web app manifest so "Add to Home Screen" installs Molen with the
// windmill mark as its icon (full-bleed, no white borders).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Molen English Classes",
    short_name: "Molen",
    description:
      "A speaking-first English course for Brazilian learners. You understand English — now let's get you talking.",
    start_url: "/",
    display: "standalone",
    background_color: "#2D3233",
    theme_color: "#4C6A2E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

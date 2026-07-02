import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shuffle — file manager for macOS",
    short_name: "Shuffle",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050914",
    theme_color: "#050914",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LET Reviewer",
    short_name: "LET Reviewer",
    description: "AI-powered LET board exam reviewer",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ecdc",
    theme_color: "#f3ecdc",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}

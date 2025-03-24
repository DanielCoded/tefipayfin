import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TefiPay | Revolutionizing Contactless Payments in Africa",
    short_name: "TefiPay",
    description: "Revolutionary contactless payment solution for Africa",
    start_url: "/",
    display: "standalone",
    background_color: "#030303",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}


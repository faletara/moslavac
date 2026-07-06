import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  // Prazan predložak — samo naslovnica. Dodaj rute ovdje kako ih gradiš.
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}

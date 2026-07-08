import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/novosti`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/momcad`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/raspored-i-rezultati`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}

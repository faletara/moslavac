import type { MetadataRoute } from "next";

/**
 * Sitemap izveden iz opisa ruta pojedinog kluba. Club app deklarira što ima
 * (statične rute + izvore dinamičkog sadržaja), a sve ostalo — apsolutne
 * adrese, otpornost na ispad izvora, oznake promjene, dvostruke adrese i
 * redoslijed — rješava se ovdje, jednom za sve klubove.
 */

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

export type SitemapRoute = {
  /** Putanja unutar kluba, npr. `/novosti`. Bazni URL se dodaje ovdje. */
  path: string;
  changeFrequency?: ChangeFrequency;
  priority?: number;
};

export type SitemapEntry = SitemapRoute & {
  /** Datum, ISO tekst ili milisekunde; neupotrebljiva vrijednost pada na `now`. */
  lastModified?: Date | string | number | null;
};

/**
 * Dinamički dio sitemapa — novosti, utakmice, galerija. Baca li, taj dio
 * izostaje, a ostatak sitemapa se svejedno objavi.
 */
export type SitemapSource = () => Promise<SitemapEntry[]>;

export type SitemapManifest = {
  baseUrl: string;
  routes: SitemapRoute[];
  sources?: SitemapSource[];
  /** Vrijeme generiranja; zadano `new Date()`, u testovima fiksirano. */
  now?: Date;
};

function absoluteUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

function resolveLastModified(
  value: SitemapEntry["lastModified"],
  fallback: Date,
): Date {
  if (value == null) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

export async function buildSitemap({
  baseUrl,
  routes,
  sources = [],
  now = new Date(),
}: SitemapManifest): Promise<MetadataRoute.Sitemap> {
  // Svaki izvor pada zasebno: djelomičan sitemap indeksira ostatak stranice,
  // dok bi bačena iznimka srušila cijeli sitemap zbog jednog ispada.
  const loaded = await Promise.allSettled(sources.map((source) => source()));

  const collected: SitemapEntry[] = [
    ...routes,
    ...loaded.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    ),
  ];

  // Prva pojava adrese pobjeđuje, pa deklarirana ruta zadržava svoj prioritet
  // i kada je izvor ponovno navede.
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const entry of collected) {
    if (!entry.path.trim()) continue;
    const url = absoluteUrl(baseUrl, entry.path);
    if (seen.has(url)) continue;
    seen.add(url);

    entries.push({
      url,
      lastModified: resolveLastModified(entry.lastModified, now),
      ...(entry.changeFrequency
        ? { changeFrequency: entry.changeFrequency }
        : {}),
      ...(entry.priority != null ? { priority: entry.priority } : {}),
    });
  }

  return entries;
}

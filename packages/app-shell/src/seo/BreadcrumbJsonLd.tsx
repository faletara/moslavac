import JsonLdScript from "./JsonLdScript";

/**
 * `BreadcrumbList` za jednu stranicu. Google iz njega crta putanju umjesto
 * golog URL-a u rezultatu, a hub stranice (`/novosti`, `/utakmice`) su mu
 * ujedno signal hijerarhije — što je preduvjet za sitelinkove.
 *
 * Prva stavka je uvijek početna, pa se predaju samo koraci ispod nje.
 */
export default function BreadcrumbJsonLd({
  baseUrl,
  trail,
}: {
  baseUrl: string;
  /** Koraci ispod početne, redom; `path` je putanja unutar kluba. */
  trail: { name: string; path: string }[];
}) {
  const base = baseUrl.replace(/\/+$/, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: `${base}/` },
      ...trail.map((step, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: step.name,
        item: `${base}${step.path.startsWith("/") ? step.path : `/${step.path}`}`,
      })),
    ],
  };

  return <JsonLdScript data={jsonLd} />;
}

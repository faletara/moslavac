import type { Metadata } from "next";

/**
 * Metapodaci jednostavne stranice: naslov, opis i kanonska adresa, a Open
 * Graph i Twitter dobivaju naslov s imenom kluba.
 */
export function pageMetadata({
  title,
  description,
  canonical,
  clubName,
}: {
  title: string;
  description: string;
  canonical: string;
  clubName: string;
}): Metadata {
  const socialTitle = `${title} | ${clubName}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: socialTitle, description },
    twitter: { title: socialTitle, description },
  };
}

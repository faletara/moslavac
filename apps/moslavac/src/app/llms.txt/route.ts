import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

// Regenerate at most hourly — tenant data is effectively static.
export const revalidate = 3600;

/**
 * /llms.txt — a plain-text map of the site for LLM crawlers (ChatGPT, Perplexity,
 * Claude, Google AI). Built from tenant data so it stays tenant-safe and in sync.
 * See https://llmstxt.org for the convention.
 */
export async function GET() {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const founded = tenant.branding?.founded;
  const motto = tenant.branding?.motto;

  const summary = [
    `Službena web stranica nogometnog kluba ${name}`,
    founded ? `osnovanog ${founded}.` : null,
    "Sadrži raspored i rezultate utakmica, tablice natjecanja, statistike igrača, sastav prve momčadi i klupske vijesti.",
  ]
    .filter(Boolean)
    .join(", ");

  const body = `# ${name}

> ${summary}${motto ? `\n\nMoto kluba: „${motto}".` : ""}

## Glavne stranice

- [Naslovnica](${BASE_URL}/): pregled kluba, zadnje vijesti i nadolazeće utakmice
- [Vijesti](${BASE_URL}/novosti): najave i izvještaji s utakmica
- [Utakmice](${BASE_URL}/utakmice): raspored i rezultati svih utakmica
- [Prva momčad](${BASE_URL}/prva-momcad): igrači i stručni stožer
- [O klubu](${BASE_URL}/klub): osnovne informacije, kontakt i lokacija stadiona

## Resursi

- [Sitemap](${BASE_URL}/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

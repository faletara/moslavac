import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

/**
 * `/llms.txt` — a plain-Markdown club summary for LLM retrieval/summarisation
 * pipelines that check for it. Built from the tenant record so it stays correct
 * per club and never drifts from the CMS. Tenant-safe: no hardcoded names.
 */
export async function GET(): Promise<Response> {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const founded = tenant.branding?.founded;
  const motto = tenant.branding?.motto;
  const city = tenant.contact?.city;
  const region = tenant.contact?.region;
  const address = tenant.contact?.address;
  const email = tenant.contact?.email;
  const phone = tenant.contact?.phone;

  const place = [city, region].filter(Boolean).join(", ");
  const summary =
    motto ??
    `Službena stranica nogometnog kluba ${name}${
      founded ? `, osnovanog ${founded}.` : ""
    }${place ? ` iz ${place}.` : "."}`;

  const facts = [
    founded ? `- Godina osnivanja: ${founded}.` : null,
    place ? `- Lokacija: ${place}` : null,
    address ? `- Adresa: ${address}` : null,
    email ? `- E-mail: ${email}` : null,
    phone ? `- Telefon: ${phone}` : null,
  ].filter(Boolean);

  const lines = [
    `# ${name}`,
    "",
    `> ${summary}`,
    "",
    ...(facts.length > 0 ? ["## O klubu", ...facts, ""] : []),
    "## Ključne stranice",
    `- [Novosti](${BASE_URL}/novosti): vijesti, najave i izvještaji s utakmica.`,
    `- [Momčad](${BASE_URL}/momcad): igrači i stručni stožer prve momčadi.`,
    `- [Raspored i rezultati](${BASE_URL}/raspored-i-rezultati): raspored utakmica i rezultati.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

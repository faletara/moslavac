import { ExternalLink, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { InkPageHero } from "@/components/layout/InkPageHero";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

/**
 * Club history and facts. Content is deliberately anchored to stable,
 * sourced facts (founding, stadium, honours) rather than the current league
 * tier, which changes each season and would otherwise go stale here.
 */
const HONOURS = [
  { year: "2019.", title: "Prvak 1. ŽNL Splitsko-dalmatinske" },
  { year: "2018.", title: "Osvajač Kupa NS Splitsko-dalmatinske županije" },
  { year: "1970.", title: "Osvajač regionalnog kupa" },
  { year: "1966./67.", title: "Prvak splitskog nogometnog podsaveza" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const description = `Povijest, stadion i uspjesi kluba ${tenant.displayName} — nogometni klub iz Mravinaca, osnovan 1925. godine.`;

  return {
    title: "O klubu",
    description,
    alternates: { canonical: "/o-klubu" },
    openGraph: { title: `O klubu | ${tenant.displayName}`, description },
    twitter: { title: `O klubu | ${tenant.displayName}`, description },
  };
}

export default async function AboutPage() {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const address = tenant.contact?.address;
  const city = tenant.contact?.city;
  const region = tenant.contact?.region;
  const email = tenant.contact?.email;
  const facebook = tenant.social?.facebook;

  const locationLine = [address, city, region].filter(Boolean).join(", ");

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "O klubu",
        item: `${BASE_URL}/o-klubu`,
      },
    ],
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <InkPageHero title={["O", "klubu"]} watermark="1925" />

      {/* Povijest */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-club-red">
          Naša povijest
        </p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl">
          Od 15. lipnja 1925.
        </h2>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/80">
          <p>
            {name} osnovan je 15. lipnja 1925. godine u Mravincima, isprva pod
            imenom <strong>Jadro</strong>. Osnivači kluba bili su profesor Ivo
            Bućan, Albert Perko i skupina mjesnih srednjoškolaca.
          </p>
          <p>
            Kroz gotovo cijelo stoljeće klub je ostao u srcu Mravinca —
            generacije igrača, navijača i klupskih ljudi izgradile su Slogu u
            prepoznatljiv dio dalmatinske nogometne priče. Klupske boje su
            crveno-bijele.
          </p>
        </div>
      </section>

      {/* Stadion Glavica */}
      <section className="bg-ink-deep py-16 text-chalk md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-club-red">
            Naš dom
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight sm:text-5xl">
            Stadion Glavica
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-chalk/70">
            Domaće utakmice Sloga igra na stadionu Glavica u Mravincima.
            Igralište je dovršeno 1974. godine, a stadion prima oko 1.000
            gledatelja te uz teren okuplja klupske prostorije i pomoćne sadržaje.
          </p>
        </div>
      </section>

      {/* Uspjesi */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-club-red">
          Trofeji
        </p>
        <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl">
          Klupski uspjesi
        </h2>
        <ul className="mt-10 divide-y divide-foreground/10 border-y border-foreground/10">
          {HONOURS.map((honour) => (
            <li
              key={`${honour.year}-${honour.title}`}
              className="flex items-baseline gap-6 py-5"
            >
              <span className="w-24 shrink-0 font-display text-2xl tabular-nums text-club-red">
                {honour.year}
              </span>
              <span className="text-base font-semibold uppercase tracking-wide text-foreground">
                {honour.title}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Lokacija i kontakt */}
      <section className="bg-ink-deep py-16 text-chalk md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-club-red">
            Kontakt
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight sm:text-5xl">
            Gdje nas naći
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {locationLine && (
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-club-red" />
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-chalk/45">
                    Adresa
                  </p>
                  <p className="mt-1 text-base text-chalk/85">{locationLine}</p>
                </div>
              </div>
            )}
            {email && (
              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 size-5 shrink-0 text-club-red" />
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-chalk/45">
                    E-mail
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 block text-base text-chalk/85 underline-offset-4 hover:text-chalk hover:underline"
                  >
                    {email}
                  </a>
                </div>
              </div>
            )}
            {facebook && (
              <div className="flex items-start gap-4">
                <ExternalLink className="mt-0.5 size-5 shrink-0 text-club-red" />
                <div>
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-chalk/45">
                    Društvene mreže
                  </p>
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-base text-chalk/85 underline-offset-4 hover:text-chalk hover:underline"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            )}
          </div>

          <p className="mt-12 text-sm text-chalk/60">
            Želiš postati član ili navijati s tribina?{" "}
            <Link
              href="/novosti"
              className="font-semibold text-chalk underline underline-offset-4"
            >
              Prati novosti
            </Link>{" "}
            i javi nam se.
          </p>
        </div>
      </section>
    </div>
  );
}

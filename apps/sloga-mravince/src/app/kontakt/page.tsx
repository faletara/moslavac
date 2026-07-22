import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { InkPageHero } from "@/components/layout/InkPageHero";
import { fetchClubDetails } from "@/lib/hns/team";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const description = `Kontakt i učlanjenje — javi se klubu ${tenant.displayName}. Adresa, e-mail i sve o tome kako postati član.`;

  return {
    title: "Kontakt",
    description,
    alternates: { canonical: "/kontakt" },
    openGraph: { title: `Kontakt | ${tenant.displayName}`, description },
    twitter: { title: `Kontakt | ${tenant.displayName}`, description },
  };
}

export default async function ContactPage() {
  // The tenant record is the club's explicit control; HNS club details fill any
  // gaps (e.g. phone), so every club gets contact data without manual entry.
  const [tenant, club] = await Promise.all([getTenant(), fetchClubDetails()]);
  const name = tenant.displayName;
  const email = tenant.contact?.email ?? club?.email ?? null;
  // Phone intentionally CMS-only — the HNS landline is unformatted/undesired.
  const phone = tenant.contact?.phone ?? null;
  const facebook = tenant.social?.facebook ?? null;
  const iban = tenant.payment?.iban;
  const recipient = tenant.payment?.recipient;

  const cmsLocation = [
    tenant.contact?.address,
    tenant.contact?.city,
    tenant.contact?.region,
  ]
    .filter(Boolean)
    .join(", ");
  const locationLine = cmsLocation || club?.address || club?.facility?.address || "";
  const mapQuery = locationLine
    ? encodeURIComponent(`${name}, ${locationLine}`)
    : null;
  const membershipHref = email
    ? `mailto:${email}?subject=${encodeURIComponent("Učlanjenje u klub")}`
    : (facebook ?? null);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kontakt",
        item: `${BASE_URL}/kontakt`,
      },
    ],
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <InkPageHero title={["Kontakt"]} watermark="Kontakt" />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Kontakt podaci */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-club-red">
              Javi nam se
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-foreground sm:text-5xl">
              Kontakt
            </h2>

            <dl className="mt-10 space-y-7">
              {locationLine && (
                <div className="flex items-start gap-4">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-club-red" />
                  <div>
                    <dt className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Adresa
                    </dt>
                    <dd className="mt-1 text-base text-foreground/85">
                      {locationLine}
                    </dd>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-4">
                  <Mail className="mt-0.5 size-5 shrink-0 text-club-red" />
                  <div>
                    <dt className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      E-mail
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${email}`}
                        className="text-base text-foreground/85 underline-offset-4 hover:text-club-red hover:underline"
                      >
                        {email}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-start gap-4">
                  <Phone className="mt-0.5 size-5 shrink-0 text-club-red" />
                  <div>
                    <dt className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Telefon
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="text-base text-foreground/85 underline-offset-4 hover:text-club-red hover:underline"
                      >
                        {phone}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
              {facebook && (
                <div className="flex items-start gap-4">
                  <ExternalLink className="mt-0.5 size-5 shrink-0 text-club-red" />
                  <div>
                    <dt className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Društvene mreže
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-foreground/85 underline-offset-4 hover:text-club-red hover:underline"
                      >
                        Facebook
                      </a>
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          {/* Karta */}
          {mapQuery && (
            <div className="min-h-72 overflow-hidden border border-foreground/10 clip-corner">
              <iframe
                title={`Lokacija — ${name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-72 w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Postani član */}
      <section className="bg-ink-deep py-16 text-chalk md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-club-red">
            Podrži klub
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight sm:text-5xl">
            Postani član
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-chalk/70">
            Jedan klub, jedna strast. Podrži nas s tribina i budi dio svake
            pobjede. Za sve o učlanjenju javi nam se{email ? " e-mailom" : ""} —
            rado ćemo ti odgovoriti.
          </p>

          {membershipHref && (
            <a
              href={membershipHref}
              {...(membershipHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group mt-10 inline-flex items-center gap-3 bg-club-red px-9 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-white hover:text-ink-deep"
            >
              Postani član
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}

          {iban && (
            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-chalk/45">
                Uplate {recipient ? `· ${recipient}` : ""}
              </p>
              <p className="mt-2 font-display text-xl tracking-wide text-chalk tabular-nums">
                {iban}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

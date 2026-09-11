import { ExternalLink, Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { RevealHeading } from "@/components/animations";
import BreadcrumbJsonLd from "@/lib/app-shell/seo/BreadcrumbJsonLd";
import { BASE_URL } from "@/lib/siteUrl";
import { Button } from "@/components/ui/button";
import { getCometImageUrl } from "@/lib/hns/imageUrl";
import { fetchTeamDetails } from "@/lib/hns/team";
import { getTenant } from "@/lib/payload/getTenant";
import type { Facility } from "@/types/hns";

export const metadata: Metadata = {
  title: "O klubu",
  description: "Informacije o klubu, kontakt i lokacija stadiona",
  alternates: { canonical: "/klub" },
};

export default async function KlubPage() {
  const tenant = await getTenant();
  const team = await fetchTeamDetails({
    teamId: tenant.hns.teamId,
  });

  const displayName = tenant.displayName || team?.name || "";
  const shortName = tenant.branding?.shortName ?? displayName;
  const founded = tenant.branding?.founded ?? null;
  const motto = tenant.branding?.motto ?? null;
  const place = team?.place ?? null;
  const country = team?.country ?? null;
  const address = team?.address?.trim() || tenant.contact?.address || null;
  const email = tenant.contact?.email || team?.email || null;
  const phone = tenant.contact?.phone || team?.mobilePhone || null;
  const facility = team?.facility ?? null;
  const social = tenant.social ?? null;

  const logoUrl = resolveLogoUrl(tenant.branding?.logo, team?.picture);

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-24 px-6 py-16 sm:space-y-32 sm:py-24 lg:px-8">
      <BreadcrumbJsonLd
        baseUrl={BASE_URL}
        trail={[{ name: "O klubu", path: "/klub" }]}
      />
      <Hero
        logoUrl={logoUrl}
        displayName={displayName}
        shortName={shortName}
        founded={founded}
        motto={motto}
      />

      <SectionBlock title="Osnovne informacije">
        <InfoList
          rows={[
            { label: "Klub", value: displayName },
            founded != null
              ? { label: "Osnovan", value: String(founded) }
              : null,
            place ? { label: "Mjesto", value: place } : null,
            country ? { label: "Država", value: country } : null,
            address ? { label: "Adresa", value: address } : null,
          ].filter((r): r is { label: string; value: string } => r !== null)}
        />
      </SectionBlock>

      <SectionBlock title="Kako nas kontaktirati">
        <ContactGrid email={email} phone={phone} social={social} />
      </SectionBlock>

      {facility && (
        <SectionBlock title={facility.name ?? "Stadion"}>
          <StadiumPanel facility={facility} />
        </SectionBlock>
      )}
    </div>
  );
}

function Hero({
  logoUrl,
  displayName,
  shortName,
  founded,
  motto,
}: {
  logoUrl: string | null;
  displayName: string;
  shortName: string;
  founded: number | null;
  motto: string | null;
}) {
  return (
    <header className="flex flex-col items-center gap-8 text-center">
      {/* Grb, ne avatar. `Avatar` je `rounded-full` + `aspect-square`, pa je
          grbu odrezao vrhove štita — jedina slika na stranici koja se ne smije
          rezati. `object-contain` ga prikazuje cijelog, kao i `HnsCrest`
          drugdje u aplikaciji. */}
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={displayName}
          width={160}
          height={160}
          className="size-32 object-contain sm:size-40"
          priority
        />
      ) : (
        <span
          aria-label={displayName}
          className="flex size-32 items-center justify-center bg-muted text-xl font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:size-40"
        >
          {shortName.slice(0, 2).toUpperCase()}
        </span>
      )}

      <span className="h-px w-12 bg-primary" />
      {founded != null && (
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
          Osnovan {founded}.
        </p>
      )}

      <RevealHeading
        as="h1"
        lines={[displayName]}
        className="text-balance font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
        lineClassName="text-4xl sm:text-6xl md:text-7xl"
      />

      {motto && (
        <p className="max-w-md text-balance text-sm leading-relaxed text-muted-foreground md:text-base">
          &bdquo;{motto}&ldquo;
        </p>
      )}
    </header>
  );
}

function InfoList({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Nema podataka.</p>
    );
  }
  return (
    <dl className="flex flex-col divide-y divide-border/60 border-y border-border/60">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 sm:gap-x-10"
        >
          <dt className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.4em]">
            {row.label}
          </dt>
          <dd className="wrap-break-word text-right text-sm text-foreground sm:text-base">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ContactGrid({
  email,
  phone,
  social,
}: {
  email: string | null;
  phone: string | null;
  social: {
    facebook?: string | null;
    youtube?: string | null;
    webshop?: string | null;
  } | null;
}) {
  const links: Array<{ label: string; href: string; value: string }> = [];
  if (email) {
    links.push({ label: "Email", href: `mailto:${email}`, value: email });
  }
  if (phone) {
    const tel = phone.replace(/\s+/g, "");
    links.push({ label: "Telefon", href: `tel:${tel}`, value: phone });
  }
  if (social?.facebook) {
    links.push({
      label: "Facebook",
      href: social.facebook,
      value: social.facebook.replace(/^https?:\/\//, ""),
    });
  }
  if (social?.youtube) {
    links.push({
      label: "YouTube",
      href: social.youtube,
      value: social.youtube.replace(/^https?:\/\//, ""),
    });
  }
  if (social?.webshop) {
    links.push({
      label: "Webshop",
      href: social.webshop,
      value: social.webshop.replace(/^https?:\/\//, ""),
    });
  }

  if (links.length === 0) {
    return <p className="text-sm text-muted-foreground">Nema kontakta.</p>;
  }

  return (
    // Deliberately NOT the InfoList hairline-row layout: two sections on one
    // page must not share a layout family. Contact rows are links, so they get
    // tappable cards instead of a definition list.
    <ul className="grid gap-px bg-border/60 sm:grid-cols-2">
      {links.map((link) => {
        const isExternal = link.href.startsWith("http");
        const Icon =
          link.label === "Email"
            ? Mail
            : link.label === "Telefon"
              ? Phone
              : ExternalLink;
        return (
          <li key={link.label} className="bg-background">
            <a
              href={link.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-muted/40 sm:p-8"
            >
              <span className="flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:tracking-[0.4em]">
                <Icon className="size-3 shrink-0" aria-hidden />
                {link.label}
              </span>
              <span className="wrap-break-word text-sm text-foreground transition-colors group-hover:text-primary sm:text-base">
                {link.value}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function StadiumPanel({ facility }: { facility: Facility }) {
  const name = facility.name?.trim() ?? "";
  const address = facility.address?.trim() ?? "";
  const place = facility.place?.trim() ?? "";
  const hasCoords = facility.latitude != null && facility.longitude != null;

  const query = hasCoords
    ? `${facility.latitude},${facility.longitude}`
    : encodeURIComponent([name, address, place].filter(Boolean).join(", "));

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
      <div className="flex flex-col gap-6">
        <InfoList
          rows={[
            name ? { label: "Naziv", value: name } : null,
            address ? { label: "Adresa", value: address } : null,
            place ? { label: "Mjesto", value: place } : null,
          ].filter((r): r is { label: string; value: string } => r !== null)}
        />

        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="size-3.5" />
              Pogledaj na karti
            </a>
          </Button>
          <Button asChild variant="default" size="sm">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="size-3.5" />
              Navigacija
            </a>
          </Button>
        </div>
      </div>

      {hasCoords && (
        <figure className="relative aspect-square w-full overflow-hidden border border-border/60 bg-muted">
          <iframe
            title={`Lokacija: ${name || "stadion"}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(facility.longitude ?? 0) - 0.005},${(facility.latitude ?? 0) - 0.003},${(facility.longitude ?? 0) + 0.005},${(facility.latitude ?? 0) + 0.003}&layer=mapnik&marker=${facility.latitude},${facility.longitude}`}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </figure>
      )}
    </div>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-12 sm:space-y-16">
      <div className="border-b border-border/60 pb-6">
        <h2 className="font-display font-black uppercase leading-[0.85] tracking-[-0.02em] text-3xl sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function resolveLogoUrl(
  brandingLogo: { url?: string | null } | string | null | undefined,
  hnsPicture: string | null | undefined,
): string | null {
  if (brandingLogo) {
    if (typeof brandingLogo === "string") return brandingLogo;
    if (brandingLogo.url) return brandingLogo.url;
  }
  if (hnsPicture) return getCometImageUrl(hnsPicture);
  return null;
}


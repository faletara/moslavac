import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCometImageUrl } from "@/lib/api";
import { fetchTeamDetails } from "@/lib/hns/team";
import { getTenant } from "@/lib/payload/getTenant";
import type { HnsFacility } from "@/types/hns";

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
    <div className="mx-auto w-full max-w-screen-xl px-6 py-16 sm:py-24 lg:px-8">
      <Hero
        logoUrl={logoUrl}
        displayName={displayName}
        shortName={shortName}
        founded={founded}
        motto={motto}
      />

      <SectionBlock index={1} eyebrow="O klubu" title="Osnovne informacije">
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

      <SectionBlock index={2} eyebrow="Kontakt" title="Kako nas kontaktirati">
        <ContactGrid email={email} phone={phone} social={social} />
      </SectionBlock>

      {facility && (
        <SectionBlock index={3} eyebrow="Stadion" title={facility.name ?? "Stadion"}>
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
    <header className="flex flex-col items-center gap-8">
      <Avatar className="size-32 sm:size-40">
        {logoUrl && <AvatarImage src={logoUrl} alt={displayName} />}
        <AvatarFallback>
          {shortName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <p>
        Klub{founded != null ? ` · Osnovan ${founded}.` : ""}
      </p>

      <h1>{displayName}</h1>

      {motto && (
        <p className="max-w-md">
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
      <p>Nema podataka.</p>
    );
  }
  return (
    <dl className="flex flex-col">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 sm:gap-x-10"
        >
          <dt>{row.label}</dt>
          <dd className="wrap-break-word text-right">
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
    return <p>Nema kontakta.</p>;
  }

  return (
    <dl className="flex flex-col">
      {links.map((link) => {
        const isExternal = link.href.startsWith("http");
        const Icon =
          link.label === "Email"
            ? Mail
            : link.label === "Telefon"
              ? Phone
              : null;
        return (
          <div
            key={link.label}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 sm:gap-x-10"
          >
            <dt className="flex items-center gap-2">
              {Icon && <Icon className="size-3" aria-hidden />}
              {link.label}
            </dt>
            <dd className="text-right">
              <a
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="wrap-break-word"
              >
                {link.value}
              </a>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function StadiumPanel({ facility }: { facility: HnsFacility }) {
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
        <figure className="relative aspect-square w-full overflow-hidden">
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
  index,
  eyebrow,
  title,
  children,
}: {
  index: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const indexStr = String(index).padStart(2, "0");
  return (
    <section className="space-y-12 sm:space-y-16">
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 pb-6 sm:gap-x-10">
        <span>{indexStr}</span>
        <div className="flex flex-col gap-2 sm:gap-3">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
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

import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";
import type { Team } from "@/types/hns";

interface FooterProps {
  tenant: FrontendTenant;
  clubDetails: Team | null;
}

const CLUB_ITEMS = [
  "Novosti",
  "Momčad",
  "Raspored i rezultati",
  "Tablica",
  "Video",
] as const;

function textOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/**
 * Ink footer s masivnim Anton wordmarkom preko cijele širine, crvenim
 * hairline potpisom na vrhu i stupcima podataka. Prikazuje samo stvarne
 * podatke iz tenanta i HNS-a — kontakt i društvene mreže renderiraju se samo
 * ako postoje. Klupski linkovi su placeholderi (nema ruta još).
 */
export default function Footer({ tenant, clubDetails }: FooterProps) {
  const year = new Date().getFullYear();
  const logo =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo as PayloadMedia)
      : null;

  const wordmark = tenant.branding?.shortName ?? tenant.displayName;
  const { contact, social, branding } = tenant;
  const clubName = clubDetails?.name ?? tenant.displayName;
  const email = textOrNull(clubDetails?.email) ?? textOrNull(contact?.email);
  const phone =
    textOrNull(clubDetails?.phone) ??
    textOrNull(clubDetails?.mobilePhone) ??
    textOrNull(contact?.phone);
  const tenantLocation = [contact?.address, contact?.city]
    .filter(Boolean)
    .join(", ");
  const address =
    textOrNull(clubDetails?.address) ?? textOrNull(tenantLocation);
  const stadium = textOrNull(clubDetails?.facility?.name);
  const place = textOrNull(clubDetails?.place) ?? textOrNull(contact?.city);
  const identityLocation = address;
  const infoItems = [
    { label: "Puni naziv", value: clubName },
    stadium && { label: "Stadion", value: stadium },
    address && { label: "Adresa", value: address },
    place && !address?.includes(place) && { label: "Mjesto", value: place },
  ].filter(Boolean) as { label: string; value: string }[];

  const socials = [
    social?.facebook && { label: "Facebook", href: social.facebook },
    social?.youtube && { label: "YouTube", href: social.youtube },
    social?.webshop && { label: "Web trgovina", href: social.webshop },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-deep text-chalk">
      {/* Crveni potpis */}
      <div aria-hidden className="h-0.75 w-full bg-club-red" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1fr_auto]">
          {/* Identitet */}
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              {logo?.url && (
                <Image
                  src={logo.url}
                  alt={logo.alt || tenant.displayName}
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              )}
              <span className="flex flex-col">
                <span className="font-display text-3xl uppercase leading-none tracking-wide">
                  {wordmark}
                </span>
                <span className="mt-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.34em] text-chalk/45">
                  Mravince{branding?.founded ? ` · od ${branding.founded}.` : ""}
                </span>
              </span>
            </Link>
            {identityLocation && (
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-chalk/55">
                {identityLocation}
              </p>
            )}
          </div>

          {/* Stupci */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
            <div>
              <h3 className="mb-5 text-[0.62rem] font-black uppercase tracking-[0.3em] text-club-red">
                Klub
              </h3>
              <ul className="space-y-3">
                {CLUB_ITEMS.map((item) => (
                  <li key={item}>
                    <span className="cursor-default text-sm uppercase tracking-wide text-chalk/70 transition-colors hover:text-chalk">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {infoItems.length > 0 && (
              <div>
                <h3 className="mb-5 text-[0.62rem] font-black uppercase tracking-[0.3em] text-club-red">
                  Podaci
                </h3>
                <ul className="space-y-4 text-sm text-chalk/70">
                  {infoItems.map((item) => (
                    <li key={item.label}>
                      <span className="block text-[0.56rem] font-black uppercase tracking-[0.24em] text-chalk/35">
                        {item.label}
                      </span>
                      <span className="mt-1 block max-w-56 leading-relaxed">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(email || phone) && (
              <div>
                <h3 className="mb-5 text-[0.62rem] font-black uppercase tracking-[0.3em] text-club-red">
                  Kontakt
                </h3>
                <ul className="space-y-3 text-sm text-chalk/70">
                  {email && (
                    <li>
                      <a
                        href={`mailto:${email}`}
                        className="break-all transition-colors hover:text-chalk"
                      >
                        {email}
                      </a>
                    </li>
                  )}
                  {phone && (
                    <li>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="transition-colors hover:text-chalk"
                      >
                        {phone}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {socials.length > 0 && (
              <div>
                <h3 className="mb-5 text-[0.62rem] font-black uppercase tracking-[0.3em] text-club-red">
                  Pratite nas
                </h3>
                <ul className="space-y-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm uppercase tracking-wide text-chalk/70 transition-colors hover:text-chalk"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Masivni wordmark preko cijele širine */}
        <p
          aria-hidden
          className="pointer-events-none mt-16 select-none whitespace-nowrap text-center font-display text-[13.5vw] uppercase leading-[0.85] text-chalk/8"
        >
          {wordmark}
        </p>

        <div className="mt-4 flex flex-col gap-1 border-t border-chalk/10 pt-6 text-xs text-chalk/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {tenant.displayName}
            {branding?.founded ? ` — osnovan ${branding.founded}.` : ""}
          </p>
          <p>Sva prava pridržana</p>
        </div>
      </div>
    </footer>
  );
}

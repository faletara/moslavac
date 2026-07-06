import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

interface FooterProps {
  tenant: FrontendTenant;
}

const CLUB_ITEMS = [
  "Novosti",
  "Momčad",
  "Raspored i rezultati",
  "Tablica",
  "Video",
] as const;

/**
 * Footer u AS Monaco stilu: crvena pozadina, wordmark, tanka linija i stupci.
 * Prikazuje samo stvarne podatke iz tenanta — kontakt i društvene mreže se
 * renderiraju samo ako postoje. Klupski linkovi su placeholderi (nema ruta još).
 */
export default function Footer({ tenant }: FooterProps) {
  const year = new Date().getFullYear();
  const logo =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo as PayloadMedia)
      : null;

  const wordmark = tenant.branding?.shortName ?? tenant.displayName;
  const { contact, social, branding } = tenant;
  const location = [contact?.address, contact?.city]
    .filter(Boolean)
    .join(", ");

  const socials = [
    social?.facebook && { label: "Facebook", href: social.facebook },
    social?.youtube && { label: "YouTube", href: social.youtube },
    social?.webshop && { label: "Web trgovina", href: social.webshop },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="mt-24 bg-club text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Wordmark */}
        <Link href="/" className="inline-flex items-center gap-3">
          {logo?.url && (
            <Image
              src={logo.url}
              alt={logo.alt || tenant.displayName}
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
            />
          )}
          <span className="text-xl font-extrabold uppercase tracking-[0.2em]">
            {wordmark}
          </span>
        </Link>

        <div className="my-10 h-px w-full bg-white/20" />

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Klub */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide">
              Klub
            </h3>
            <ul className="space-y-3">
              {CLUB_ITEMS.map((item) => (
                <li key={item}>
                  <span className="cursor-default text-sm uppercase tracking-wide text-white/80 transition-colors hover:text-white">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          {(contact?.email || contact?.phone || location) && (
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wide">
                Kontakt
              </h3>
              <ul className="space-y-3 text-sm text-white/80">
                {contact?.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition-colors hover:text-white"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact?.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-white"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {location && <li>{location}</li>}
              </ul>
            </div>
          )}

          {/* Društvene mreže */}
          {socials.length > 0 && (
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wide">
                Društvene mreže
              </h3>
              <ul className="space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm uppercase tracking-wide text-white/80 transition-colors hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-white/20 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
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

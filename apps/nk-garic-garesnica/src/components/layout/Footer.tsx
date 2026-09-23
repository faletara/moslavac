import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

interface FooterProps {
  tenant: FrontendTenant;
}

/**
 * Footer — tamna traka koja zatvara stranicu: golemi condensed naziv kluba
 * preko cijele širine, ispod grb, kontakt i društvene mreže, copyright u
 * donjoj liniji. Prikazuje samo ono što je upisano u Payloadu; prazna polja
 * se preskaču, i nema linkova na rute koje još ne postoje.
 */
export default function Footer({ tenant }: FooterProps) {
  const year = new Date().getFullYear();

  const logo =
    tenant.branding?.logo ?? null;

  const { email, phone, address, city } = tenant.contact ?? {};
  const { facebook, youtube } = tenant.social ?? {};
  const founded = tenant.branding?.founded ?? null;
  const location = [address, city].filter(Boolean).join(", ");
  const clubName = tenant.displayName.replace(/^NK\s+/i, "");

  const socials = [
    { href: facebook, label: "Facebook" },
    { href: youtube, label: "YouTube" },
  ].filter((s): s is { href: string; label: string } => Boolean(s.href));

  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      {/* Halftone raster — motiv dresa u gornjem desnom kutu plohe. */}
      <div
        aria-hidden
        className="halftone pointer-events-none absolute -right-16 -top-16 hidden h-105 w-105 rotate-18 opacity-15 md:block"
        style={
          // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
          // standardna svojstva, pa ga inline stil ovdje mora proširiti.
          {
            "--halftone-size": "15px",
            "--halftone-color": "rgba(255,255,255,0.6)",
            maskImage:
              "radial-gradient(circle at 35% 60%, black 0%, black 22%, transparent 62%)",
          } as React.CSSProperties
        }
      />

      <div className="relative mx-auto w-full max-w-350 px-4 pt-16 sm:px-6 lg:px-10 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Klub */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-4"
              aria-label={tenant.displayName}
            >
              {logo?.url && (
                <Image
                  src={logo.url}
                  alt={logo.alt || tenant.displayName}
                  width={56}
                  height={56}
                  className="h-14 w-auto"
                />
              )}
              <span className="max-w-56 font-display text-2xl leading-[0.95] uppercase tracking-wide">
                {tenant.displayName}
              </span>
            </Link>
            {founded && (
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/85">
                Nogometni klub iz Garešnice, osnovan {founded}. godine.
              </p>
            )}
          </div>

          {/* Kontakt */}
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.3em] text-white/75 uppercase">
              Kontakt
            </p>
            <ul className="mt-5 space-y-3.5 text-sm">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-3 text-white/75 transition-colors hover:text-white"
                  >
                    <Mail
                      className="size-4 shrink-0 text-chart-4"
                      strokeWidth={1.5}
                    />
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-3 text-white/75 transition-colors hover:text-white"
                  >
                    <Phone
                      className="size-4 shrink-0 text-chart-4"
                      strokeWidth={1.5}
                    />
                    {phone}
                  </a>
                </li>
              )}
              {location && (
                <li className="flex items-start gap-3 text-white/75">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-chart-4"
                    strokeWidth={1.5}
                  />
                  {location}
                </li>
              )}
            </ul>
          </div>

          {/* Društvene mreže */}
          {socials.length > 0 && (
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.3em] text-white/75 uppercase">
                Pratite klub
              </p>
              <ul className="mt-5 space-y-3.5 text-sm">
                {socials.map(({ href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-white/75 transition-colors hover:text-white"
                    >
                      {label}
                      <ArrowUpRight
                        className="size-4 shrink-0 text-chart-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                        strokeWidth={1.5}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 font-mono text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {tenant.displayName}
          </p>
          <p>Sva prava pridržana</p>
        </div>

        {/* Golemi wordmark — poster potpis dresa, namjerno odrezan donjim
            rubom footera (translate prema dolje unutar overflow-hidden). */}
        <p
          aria-hidden
          className="pointer-events-none mt-8 translate-y-[24%] select-none whitespace-nowrap text-center font-display text-[13vw] uppercase leading-[0.78] tracking-tight text-white/8"
        >
          {clubName}
        </p>
      </div>
    </footer>
  );
}

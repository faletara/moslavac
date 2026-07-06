import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

interface FooterProps {
  tenant: FrontendTenant;
}

/**
 * Minimalni skeleton footera — logo/naziv + copyright. Namjerno bez linkova na
 * stranice; dodaješ ih kad izgradiš pripadajuće rute.
 */
export default function Footer({ tenant }: FooterProps) {
  const year = new Date().getFullYear();
  const logo =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo as PayloadMedia)
      : null;

  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={tenant.displayName}
        >
          {logo?.url && (
            <Image
              src={logo.url}
              alt={logo.alt || tenant.displayName}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span>{tenant.branding?.shortName ?? tenant.displayName}</span>
        </Link>
        <p>
          &copy; {year} {tenant.displayName} — Sva prava pridržana
        </p>
      </div>
    </footer>
  );
}

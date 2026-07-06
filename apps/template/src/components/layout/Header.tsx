import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

interface HeaderProps {
  tenant: FrontendTenant;
}

/**
 * Minimalni skeleton headera. Prikazuje samo logo + naziv kluba i sticky je.
 * Namjerno bez navigacije — nova stranica se gradi od nule, pa ovdje dodaješ
 * linkove kad kreiraš odgovarajuće rute.
 */
export default function Header({ tenant }: HeaderProps) {
  const logo =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo as PayloadMedia)
      : null;

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={tenant.displayName}
        >
          {logo?.url && (
            <Image
              src={logo.url}
              alt={logo.alt || tenant.displayName}
              width={44}
              height={44}
              className="rounded-full"
            />
          )}
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em]">
            {tenant.branding?.shortName ?? tenant.displayName}
          </span>
        </Link>
      </div>
    </header>
  );
}

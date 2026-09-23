import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

interface HeaderProps {
  tenant: FrontendTenant;
}

/**
 * Minimalni sticky header: grb + naziv kluba u display registru, hairline
 * umjesto sjene. Namjerno bez navigacije — linkovi se dodaju kad nastanu rute.
 */
export default function Header({ tenant }: HeaderProps) {
  const logo =
    tenant.branding?.logo ?? null;

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/92 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-350 items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={tenant.displayName}
        >
          {logo?.url && (
            <Image
              src={logo.url}
              alt={logo.alt || tenant.displayName}
              width={36}
              height={36}
              className="h-9 w-auto"
            />
          )}
          <span className="truncate font-display text-lg uppercase leading-none tracking-wide text-foreground">
            {tenant.branding?.shortName ?? tenant.displayName}
          </span>
        </Link>
      </div>
    </header>
  );
}

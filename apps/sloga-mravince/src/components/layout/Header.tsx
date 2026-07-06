import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";
import MobileNav from "./MobileNav";

interface HeaderProps {
  tenant: FrontendTenant;
}

const NAV_ITEMS = [
  "Novosti",
  "Momčad",
  "Raspored i rezultati",
  "Webshop",
] as const;

/**
 * Header u AS Monaco stilu: grb kluba + navigacijski itemi.
 * Namjerno bez tražilice, hamburgera i language switchera. Itemi su placeholderi
 * i ne vode nigdje — zamijeni ih linkovima kad kreiraš odgovarajuće rute.
 */
export default function Header({ tenant }: HeaderProps) {
  const logo =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo as PayloadMedia)
      : null;

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-border/60 bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-10 px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label={tenant.displayName}>
          <Image
            src={logo?.url ?? "/crest.png"}
            alt={logo?.alt || tenant.displayName}
            width={48}
            height={48}
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav aria-label="Glavna navigacija" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <span className="cursor-default text-sm font-semibold uppercase tracking-wide text-foreground/90 transition-colors hover:text-foreground">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav items={NAV_ITEMS} />
      </div>
    </header>
  );
}

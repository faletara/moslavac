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
 * Editorial ink header — crna traka s crvenim hairline potpisom na vrhu,
 * grb + Anton wordmark lijevo, navigacija desno s underline hover animacijom.
 * Itemi su placeholderi i ne vode nigdje — zamijeni ih linkovima kad kreiraš
 * odgovarajuće rute.
 */
export default function Header({ tenant }: HeaderProps) {
  const logo =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo as PayloadMedia)
      : null;
  const wordmark = tenant.branding?.shortName ?? tenant.displayName;
  const founded = tenant.branding?.founded;

  return (
    <header className="sticky top-0 z-50 h-20 bg-ink-deep text-chalk">
      {/* Crveni potpis na vrhu */}
      <div aria-hidden className="h-0.75 w-full bg-club-red" />

      <div className="mx-auto flex h-[calc(100%-3px)] max-w-400 items-center gap-8 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label={tenant.displayName}
          className="group flex shrink-0 items-center gap-3.5"
        >
          <Image
            src={logo?.url ?? "/crest.png"}
            alt={logo?.alt || tenant.displayName}
            width={44}
            height={44}
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl uppercase leading-none tracking-wide">
              {wordmark}
            </span>
            <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.34em] text-chalk/50">
              Mravince{founded ? ` · ${founded}` : ""}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Glavna navigacija"
          className="ml-auto hidden md:block"
        >
          <ul className="flex items-center gap-9">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <span className="group relative cursor-default pb-1 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-chalk/80 transition-colors hover:text-chalk">
                  {item}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-club-red transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
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

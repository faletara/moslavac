"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/novosti", label: "Vijesti" },
  { href: "/seniori", label: "Seniori" },
  { href: "/skola-nogometa", label: "Škola" },
  { href: "/povijest", label: "Povijest" },
  { href: "/uprava", label: "Uprava" },
  { href: "/statut", label: "Statut" },
  { href: "/galerija", label: "Galerija" },
  { href: "/navijaci", label: "Lunatics" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/oprema", label: "Webshop" },
];

export default function Header({ clubName }: { clubName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`bg-white/90 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "shadow-[0_4px_24px_-8px_rgba(10,28,51,0.25)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label={`${clubName} — naslovna`}
          >
            <Image
              src="/grb-vrapce.png"
              alt={clubName}
              width={192}
              height={192}
              quality={90}
              priority
              className="h-16 w-16 object-contain"
            />
            <span className="font-display text-lg leading-none font-extrabold tracking-tight text-brand-navy uppercase">
              {clubName}
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden items-center gap-x-5 xl:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[0.78rem] font-semibold uppercase tracking-wide transition-colors hover:text-brand-blue ${
                  isActive(item.href) ? "text-brand-navy" : "text-muted-foreground"
                }`}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded bg-brand-yellow" />
                ) : null}
              </Link>
            ))}
          </nav>

          {/* mobile drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-navy transition-colors hover:bg-surface-2 xl:hidden"
                aria-label="Otvori izbornik"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 max-w-[85vw] gap-0 p-0">
              <SheetHeader className="border-b border-line">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <Image
                    src="/grb-vrapce.png"
                    alt=""
                    width={96}
                    height={96}
                    className="h-10 w-10 object-contain"
                  />
                  <span className="font-display text-base font-extrabold uppercase tracking-tight text-brand-navy">
                    {clubName}
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-5 py-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`border-b border-line/70 py-3.5 text-base font-semibold uppercase tracking-tight transition-colors last:border-0 ${
                      isActive(item.href)
                        ? "text-brand-blue"
                        : "text-brand-navy hover:text-brand-blue"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";

import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavLeaf = { href: string; label: string };
type NavEntry = NavLeaf | { label: string; children: NavLeaf[] };

const NAV: NavEntry[] = [
  { href: "/novosti", label: "Vijesti" },
  {
    label: "Klub",
    children: [
      { href: "/povijest", label: "Povijest" },
      { href: "/uprava", label: "Uprava" },
      { href: "/statut", label: "Statut" },
      { href: "/navijaci", label: "Lunatics" },
    ],
  },
  {
    label: "Momčad",
    children: [
      { href: "/seniori", label: "Seniori" },
      { href: "/skola-nogometa", label: "Škola nogometa" },
    ],
  },
  { href: "/galerija", label: "Galerija" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/oprema", label: "Webshop" },
];

function isLeaf(entry: NavEntry): entry is NavLeaf {
  return "href" in entry;
}

export default function Header({ clubName }: { clubName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  // Otvoreni mobilni izbornik zaključava body scroll i okida sintetički scroll
  // event — bez ovog guarda header bi se sakrio baš dok korisnik otvara meni.
  const menuOpenRef = useRef(false);
  menuOpenRef.current = open;

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setAtTop(y <= 80);

      if (!menuOpenRef.current) {
        if (y <= 80) {
          setHidden(false);
        } else if (y > lastY) {
          setHidden(true); // scroll dolje → sakrij
        } else if (y < lastY) {
          setHidden(false); // scroll gore → vrati
        }
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isGroupActive = (children: NavLeaf[]) =>
    children.some((c) => isActive(c.href));

  // Sve glavne stranice imaju tamni hero na vrhu → header proziran (bijeli tekst)
  // dok je na vrhu, solid bijeli niže. Iznimka: detalj-stranice (vijest, album)
  // koje imaju svijetli vrh. Negacija (default = proziran) je namjerna: tako se
  // prerender i klijent slažu i bez ovisnosti o točnom pathname-u na vrhu.
  const lightTop =
    !!pathname &&
    (pathname.startsWith("/novosti/") || pathname.startsWith("/galerija/"));
  // Dok je header sakriven (scroll dolje) držimo ga prozirnim — inače bi se
  // tijekom klizanja prema gore na tren obojao bijelo pa nestao (bljesak).
  // Bijela podloga se pojavi tek kad se header VRATI (scroll gore, nije na vrhu).
  const transparent = (atTop || hidden) && !lightTop;

  return (
    <header
      className={`sticky top-0 z-50 h-[5.5rem] transition-transform duration-300 will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`h-full border-b transition-colors duration-300 ${
          transparent
            ? "border-transparent bg-transparent"
            : "border-line bg-white/95 shadow-[0_4px_24px_-8px_rgba(10,28,51,0.12)] backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-6 px-6 sm:px-10">
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
            <span
              className={`font-display text-lg leading-none font-extrabold tracking-tight uppercase transition-colors ${
                transparent ? "text-white" : "text-brand-navy"
              }`}
            >
              {clubName}
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden items-center gap-x-6 lg:flex">
            {NAV.map((entry) => {
              const active = isLeaf(entry)
                ? isActive(entry.href)
                : isGroupActive(entry.children);
              const base =
                "relative inline-flex items-center text-[0.78rem] font-semibold uppercase leading-none tracking-wide transition-colors";
              const tone = active
                ? transparent
                  ? "text-white"
                  : "text-brand-navy"
                : transparent
                  ? "text-white/70 hover:text-brand-yellow"
                  : "text-brand-navy/60 hover:text-brand-blue";
              const underline = active ? (
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-brand-yellow" />
              ) : null;

              if (isLeaf(entry)) {
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={`${base} ${tone}`}
                  >
                    {entry.label}
                    {underline}
                  </Link>
                );
              }

              return (
                <div key={entry.label} className="group relative">
                  <button
                    type="button"
                    className={`${base} ${tone} gap-1`}
                    aria-haspopup="menu"
                  >
                    {entry.label}
                    <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    {underline}
                  </button>
                  {/* pt-3 = hover-most do panela da se ne zatvori između */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="flex min-w-[13rem] flex-col border border-line bg-white p-2 shadow-[0_24px_60px_-24px_rgba(10,28,51,0.3)]">
                      {entry.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`px-3 py-2.5 text-[0.78rem] font-semibold uppercase tracking-wide transition-colors hover:bg-surface ${
                            isActive(child.href)
                              ? "text-brand-blue"
                              : "text-brand-navy/70 hover:text-brand-navy"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* mobile drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className={`inline-flex h-10 w-10 items-center justify-center transition-colors lg:hidden ${
                  transparent
                    ? "text-white hover:bg-white/10"
                    : "text-brand-navy hover:bg-brand-navy/5"
                }`}
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
                {NAV.map((entry) => {
                  if (isLeaf(entry)) {
                    return (
                      <Link
                        key={entry.href}
                        href={entry.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center border-b border-line/70 py-3.5 text-sm font-semibold uppercase leading-none tracking-tight transition-colors ${
                          isActive(entry.href)
                            ? "text-brand-blue"
                            : "text-brand-navy hover:text-brand-blue"
                        }`}
                      >
                        {entry.label}
                      </Link>
                    );
                  }

                  return (
                    <Accordion key={entry.label} type="single" collapsible>
                      <AccordionItem
                        value={entry.label}
                        className="border-b border-line/70 last:border-b"
                      >
                        <AccordionTrigger className="items-center py-3.5 text-brand-navy hover:text-brand-blue hover:no-underline">
                          <span className="font-sans text-sm font-semibold uppercase tracking-tight leading-none">
                            {entry.label}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col pb-1 pl-3">
                            {entry.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className={`py-2 text-xs font-medium uppercase tracking-tight transition-colors ${
                                  isActive(child.href)
                                    ? "text-brand-blue"
                                    : "text-brand-navy/60 hover:text-brand-blue"
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

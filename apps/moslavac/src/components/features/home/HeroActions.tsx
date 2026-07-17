import { ArrowRight } from "lucide-react";
import Link from "next/link";

type HeroActionsProps = {
  hasNextMatch: boolean;
};

export function HeroActions({ hasNextMatch }: HeroActionsProps) {
  const primary = hasNextMatch
    ? {
        href: "#sljedeca-utakmica",
        label: "Pogledaj sljedeću utakmicu",
      }
    : { href: "/utakmice", label: "Pogledaj raspored" };

  return (
    <Link
      href={primary.href}
      className="group inline-flex min-h-11 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-chalk px-5 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-navy-deep transition-colors duration-300 hover:bg-club hover:text-chalk focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-3 focus-visible:ring-offset-navy-deep sm:px-7 sm:text-xs sm:tracking-[0.22em]"
    >
      <span>{primary.label}</span>
      <ArrowRight
        aria-hidden
        className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={2.5}
      />
    </Link>
  );
}

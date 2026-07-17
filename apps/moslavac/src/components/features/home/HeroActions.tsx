import { ArrowRight } from "lucide-react";
import Link from "next/link";

type HeroActionsProps = {
  hasNextMatch: boolean;
};

const actionBase =
  "group inline-flex min-h-11 items-center justify-center gap-3 whitespace-nowrap rounded-full px-5 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-3 focus-visible:ring-offset-navy-deep sm:px-7 sm:text-xs sm:tracking-[0.22em]";

export function HeroActions({ hasNextMatch }: HeroActionsProps) {
  const primary = hasNextMatch
    ? {
        href: "#sljedeca-utakmica",
        label: "Pogledaj sljedeću utakmicu",
      }
    : { href: "/utakmice", label: "Pogledaj raspored" };

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href={primary.href}
        className={`${actionBase} bg-chalk text-navy-deep hover:bg-club hover:text-chalk`}
      >
        <span>{primary.label}</span>
        <ArrowRight
          aria-hidden
          className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={2.5}
        />
      </Link>

      <Link
        href="/prva-momcad"
        className={`${actionBase} border border-foreground/25 bg-transparent text-foreground hover:border-foreground/50 hover:bg-foreground/10`}
      >
        <span>Naša momčad</span>
        <ArrowRight
          aria-hidden
          className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={2.5}
        />
      </Link>
    </div>
  );
}

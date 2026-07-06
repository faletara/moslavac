import Link from "next/link";
import { RevealHeading } from "@/components/animations";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  /** Redni broj sekcije, npr. "01". */
  index: string;
  /** Mala uppercase najava uz broj. */
  eyebrow: string;
  /** Veliki Anton naslov — niz renderira više reveal linija. */
  title: string | string[];
  /** Link desno u gornjem redu (npr. "Sve vijesti"). */
  link?: { href: string; label: string };
  /** Sekcija na tamnoj podlozi. */
  dark?: boolean;
  className?: string;
}

/**
 * Editorial zaglavlje sekcije — potpis redizajna: gornji red s rednim brojem,
 * hairline linijom, eyebrow tekstom i opcionalnim linkom, ispod masivni Anton
 * naslov s clip-reveal ulaskom.
 */
export default function SectionHead({
  index,
  eyebrow,
  title,
  link,
  dark = false,
  className,
}: SectionHeadProps) {
  const lines = Array.isArray(title) ? title : [title];
  const muted = dark ? "text-white/45" : "text-muted-foreground";

  return (
    <div className={cn(dark ? "text-white" : "text-foreground", className)}>
      <div className="flex items-center gap-4">
        <span className="font-display text-sm tabular-nums tracking-[0.2em] text-club-red">
          N°{index}
        </span>
        <span
          aria-hidden
          className={cn("h-px flex-1", dark ? "bg-white/15" : "bg-foreground/15")}
        />
        <span
          className={cn(
            "text-[0.62rem] font-bold uppercase tracking-[0.3em]",
            muted,
          )}
        >
          {eyebrow}
        </span>
        {link && (
          <Link
            href={link.href}
            className={cn(
              "group hidden items-center gap-2 text-[0.62rem] font-black uppercase tracking-[0.24em] transition-colors sm:inline-flex",
              dark
                ? "text-white hover:text-club-red"
                : "text-foreground hover:text-club-red",
            )}
          >
            {link.label}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        )}
      </div>

      <RevealHeading
        lines={lines}
        className="mt-6 font-display uppercase leading-[0.92] tracking-normal"
        lineClassName="text-5xl sm:text-6xl md:text-7xl"
      />
    </div>
  );
}

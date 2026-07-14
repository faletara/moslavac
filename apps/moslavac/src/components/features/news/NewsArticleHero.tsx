import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NewsArticleHeroProps {
  title: string;
  /** Pre-formatted long date, e.g. "12. lipnja 2026.". */
  date: string;
  /** Pre-formatted time, e.g. "18:00". */
  time: string;
  thumbnailPath: string | null;
}

/**
 * Immersive cover hero for a news article — a full-bleed dark canvas (the cover
 * photo when present, otherwise a club-blue floodlit fallback) with the title
 * overlaid at the foot, giving articles a magazine-grade opening consistent with
 * the home and match heroes.
 */
export default function NewsArticleHero({
  title,
  date,
  time,
  thumbnailPath,
}: NewsArticleHeroProps) {
  return (
    <header className="dark relative isolate -mt-20 flex min-h-[68svh] w-full flex-col justify-end overflow-hidden bg-navy-deep pt-20 text-foreground">
      {thumbnailPath ? (
        <>
          <Image
            src={thumbnailPath}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          {/* The cover photo is user-uploaded, so its brightness is unknown —
              the scrim has to hold AA on a white-sky photo too, top (back link)
              included. Deeper stops only; the floodlit navy wash stays. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-t from-navy-deep via-navy-deep/85 to-navy-deep/65"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden
            className="absolute -top-[16vw] left-[12%] -z-20 size-[50vw] rounded-full bg-club/25 blur-[120px]"
          />
          <div
            aria-hidden
            className="absolute -right-[12vw] top-1/3 -z-20 size-[38vw] rounded-full bg-club/15 blur-[100px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-b from-navy-deep/40 via-transparent to-navy-deep"
          />
        </>
      )}

      {/* Back link — pinned below the header */}
      <div className="absolute inset-x-0 top-0 z-10 pt-24">
        <div className="mx-auto w-full max-w-3xl px-6 lg:px-8">
          <Link
            href="/novosti"
            className="group inline-flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-foreground sm:text-xs"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Sve vijesti
          </Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-14 sm:pb-20 lg:px-8">
        <div className="flex flex-col gap-5">
          <span aria-hidden className="h-px w-12 bg-primary" />
          <p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-foreground/80 sm:text-xs">
            <span>{date}</span>
            <span aria-hidden className="h-3 w-px shrink-0 bg-current/20" />
            <span>{time}</span>
          </p>
          <h1 className="text-balance font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}

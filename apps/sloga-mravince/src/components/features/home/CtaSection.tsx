import Image from "next/image";
import Link from "next/link";
import { FadeInView } from "@/components/animations";
import type { FrontendTenant } from "@/lib/payload/types";

/**
 * Završni poziv — fullscreen momčadska fotografija u crvenom duotonu s
 * masivnim Anton naslovom preko dva reda i tvrdim (uglatim) CTA gumbima.
 */
export default function CtaSection({ tenant }: { tenant: FrontendTenant }) {
  const phone = tenant.contact?.phone ?? null;

  return (
    <section className="relative isolate w-full overflow-hidden bg-ink-deep">
      {/* Pozadinska slika momčadi — crveni duoton */}
      <Image
        src="/momcad.jpg"
        alt=""
        fill
        aria-hidden
        sizes="100vw"
        className="-z-20 object-cover object-center grayscale"
      />
      <div className="absolute inset-0 -z-10 bg-club-red/40 mix-blend-multiply" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/95 via-black/70 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-transparent to-black/40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.07] mix-blend-overlay"
      />
      {/* Zlatni hairline gore/dolje */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-club-gold/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-club-gold/40 to-transparent" />

      <div className="mx-auto flex min-h-140 max-w-6xl items-center px-6 py-24 md:min-h-170 md:py-36">
        <FadeInView className="max-w-3xl text-white">
          <h2 className="font-display uppercase leading-[1.12] tracking-normal drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            <span className="block pt-[0.12em] text-6xl sm:text-7xl md:text-8xl">
              Postani dio
            </span>
            {/* Crvena greda umjesto obrisanog reda: isti kontrast dvaju
                redaka, ali naslov ostaje čitljiv preko fotografije. */}
            <span
              aria-hidden
              className="my-4 block h-1.5 w-24 bg-club-red sm:my-5 sm:w-32"
            />
            <span className="block pt-[0.12em] text-6xl sm:text-7xl md:text-8xl">
              naše priče
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-base text-white/80 sm:text-lg">
            Jedan klub, jedna strast. Podrži nas s tribina, postani član i budi
            dio svake pobjede. Javi nam se za sve o učlanjenju.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <Link
              href="/kontakt"
              className="group inline-flex items-center gap-3 bg-club-red px-9 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-club-red/30 transition-colors duration-300 hover:bg-white hover:text-ink-deep"
            >
              Postani član
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center border border-white/30 px-9 py-4 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                {phone}
              </a>
            )}
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

import Image from "next/image";
import { FadeInView } from "@/components/animations";
import type { FrontendTenant } from "@/lib/payload/types";

/**
 * Završni poziv — fullscreen momčadska fotografija u crvenom duotonu s
 * masivnim Anton naslovom preko dva reda i tvrdim (uglatim) CTA gumbima.
 */
export default function CtaSection({ tenant }: { tenant: FrontendTenant }) {
  const clubName = tenant.branding?.shortName ?? tenant.displayName;
  const founded = tenant.branding?.founded ?? null;
  const email = tenant.contact?.email ?? null;
  const phone = tenant.contact?.phone ?? null;
  const facebook = tenant.social?.facebook ?? null;

  const primary = email
    ? { href: `mailto:${email}?subject=Učlanjenje u klub`, label: "Postani član" }
    : facebook
      ? { href: facebook, label: "Postani član" }
      : null;

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
          <p className="flex items-center gap-3 text-[0.62rem] font-black uppercase tracking-[0.34em] text-club-gold">
            <span aria-hidden className="h-4 w-1 bg-club-red" />
            {founded ? `${clubName} · od ${founded}.` : clubName}
          </p>

          <h2 className="mt-7 flex flex-col gap-3 font-display uppercase leading-[1.12] tracking-normal drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] sm:gap-4">
            <span className="block pt-[0.12em] text-6xl sm:text-7xl md:text-8xl">
              Postani dio
            </span>
            <span className="[--text-stroke-color:#ffffff] block pt-[0.18em] text-6xl text-stroke-thick sm:text-7xl md:text-8xl">
              naše priče
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-base text-white/80 sm:text-lg">
            Jedan klub, jedna strast. Podrži nas s tribina, postani član i budi
            dio svake pobjede. Javi nam se za sve o učlanjenju.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            {primary && (
              <a
                href={primary.href}
                className="group inline-flex items-center gap-3 bg-club-red px-9 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-club-red/30 transition-colors duration-300 hover:bg-white hover:text-ink-deep"
              >
                {primary.label}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            )}
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

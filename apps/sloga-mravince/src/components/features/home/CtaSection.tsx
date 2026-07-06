import Image from "next/image";
import { FadeInView } from "@/components/animations";
import type { FrontendTenant } from "@/lib/payload/types";

export default function CtaSection({
  tenant,
}: {
  tenant: FrontendTenant;
}) {
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
    <section className="relative isolate w-full overflow-hidden bg-navy-deep">
      {/* Pozadinska slika momčadi */}
      <Image
        src="/momcad.jpg"
        alt=""
        fill
        aria-hidden
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Duotone / tamni overlay za čitljivost i AS Monaco dojam */}
      <div className="absolute inset-0 -z-10 bg-navy-deep/50" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/95 via-black/70 to-black/30" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-transparent to-black/40" />
      {/* Crveni sjaj */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -z-10 size-144 -translate-y-1/2 rounded-full bg-club-red/30 blur-3xl" />
      {/* Zlatni hairline gore/dolje */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-club-gold/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-club-gold/40 to-transparent" />

      <div className="mx-auto flex min-h-140 max-w-6xl items-center px-6 py-24 md:min-h-160 md:py-32">
        <FadeInView className="max-w-2xl text-white">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-club-gold">
            <span className="h-4 w-1 rounded-full bg-club-red" />
            {founded ? `${clubName} · od ${founded}.` : clubName}
          </p>

          <h2 className="mt-6 text-5xl font-extrabold uppercase leading-[0.92] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl">
            Postani dio
            <br />
            <span className="text-club-red">naše priče</span>
          </h2>

          <p className="mt-6 max-w-lg text-base text-white/80 sm:text-lg">
            Jedan klub, jedna strast. Podrži nas s tribina, postani član i budi
            dio svake pobjede. Javi nam se za sve o učlanjenju.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {primary && (
              <a
                href={primary.href}
                className="inline-flex items-center rounded-full bg-club-red px-9 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-club-red/30 transition-transform hover:scale-105"
              >
                {primary.label}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center rounded-full border border-white/30 px-9 py-4 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/10"
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

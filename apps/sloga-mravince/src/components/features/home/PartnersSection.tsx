/**
 * Partneri — mirna chalk traka s hairline okvirom; logotipi u grayscale koji
 * na hover dobivaju boju.
 */
export default function PartnersSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="flex items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-foreground/15" />
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.34em] text-muted-foreground">
          Naši partneri
        </p>
        <span aria-hidden className="h-px flex-1 bg-foreground/15" />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {/* Dodati /partners/blindo.svg ili .png u public/partners/ */}
        <a
          href="https://www.blindo.hr"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/blindo-logotip2.png"
            alt="Blindo"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </a>
      </div>
    </section>
  );
}

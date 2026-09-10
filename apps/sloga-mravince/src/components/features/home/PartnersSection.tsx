/**
 * Partneri — mirna chalk traka na kraju stranice.
 *
 * Klub ima jednog partnera, pa sekcija to i pokazuje: naslov lijevo, logotip
 * desno, jedna hairline crta među njima. Centrirani zid s razmakom za pet
 * logotipa u kojem stoji jedan izgleda kao greška u rasporedu, ne kao izbor.
 * Kad partnera bude više, `PARTNERS` se proširi i grid se sam presloži.
 */
const PARTNERS = [
  {
    name: "Blindo",
    href: "https://www.blindo.hr",
    logo: "/blindo-logotip2.png",
  },
] as const;

export default function PartnersSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <div className="grid items-center gap-8 border-t border-foreground/15 pt-10 sm:grid-cols-[auto_1fr] sm:gap-12">
        <h2 className="font-display text-2xl uppercase leading-none tracking-wide text-foreground sm:text-3xl">
          Naši partneri
        </h2>

        <ul className="flex flex-wrap items-center gap-10 sm:justify-end md:gap-14">
          {PARTNERS.map((partner) => (
            <li key={partner.name}>
              <a
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  width={132}
                  height={44}
                  className="h-11 w-auto object-contain"
                />
                <span className="sr-only">(otvara se u novoj kartici)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

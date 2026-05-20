import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { getTenant } from "@/lib/payload/getTenant";

export const metadata: Metadata = {
  title: "Sezonska ulaznica",
  description: "Kupite sezonsku ulaznicu",
};

export default async function SeasonTicketPage() {
  const tenant = await getTenant();
  const price = tenant.payment?.seasonTicketPrice ?? 0;
  const shortName = tenant.branding?.shortName ?? tenant.displayName;
  const iban = tenant.payment?.iban ?? "";
  const recipient = tenant.payment?.recipient ?? "";

  const paymentRows: Array<{ label: string; value: string }> = [
    { label: "IBAN", value: iban },
    { label: "Primatelj", value: recipient },
    { label: "Iznos", value: `${price} EUR` },
    {
      label: "Opis plaćanja",
      value: "Članarica 2024-25 — [Vaše ime i prezime]",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-24 px-6 py-16 sm:space-y-32 sm:py-24 lg:px-8">
      <TrackEvent event="Season Ticket Page" />
      <PageHero price={price} />

      <SectionBlock
        index={1}
        eyebrow="Iskaznica · Sezona 2024/25"
        title="Tvoje mjesto na tribini"
      >
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            <Image
              src="/fans.jpg"
              alt="SNK Moslavac navijači"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-4 right-2 select-none font-black tabular-nums leading-[0.75] tracking-tighter text-[8rem] text-background mix-blend-difference sm:-bottom-6 sm:right-4 sm:text-[10rem]"
            >
              12
            </span>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Napravili smo članske iskaznice za narednu sezonu. Cijena članske
              iskaznice je{" "}
              <span className="font-semibold text-foreground">
                {price} eura
              </span>{" "}
              te se može kupiti uplatom na račun od {shortName}. Također,
              članske iskaznice će se moći kupiti na tribini na svakoj domaćoj
              utakmici.
            </p>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Svi zainteresirani za kupnju članske iskaznice neka se jave u
              inbox stranice ili nekom od članova uprave.
            </p>

            <div className="flex flex-col gap-3 border-t border-border/60 pt-6">
              <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.4em]">
                Vrijedi za
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                Domaće utakmice u 4. NL Središte B, kup utakmice i europske
                utakmice od 1.8.2024. do 31.7.2025.
              </p>
            </div>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock
        index={2}
        eyebrow="Uplata · Bankovni račun"
        title="Podaci za uplatu"
      >
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <dl className="flex flex-col divide-y divide-border/60 border-y border-border/60">
            {paymentRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 sm:gap-x-10"
              >
                <dt className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.4em]">
                  {row.label}
                </dt>
                <dd className="wrap-break-word text-right font-mono text-sm tracking-tight text-foreground sm:text-base">
                  {row.value || "—"}
                </dd>
              </div>
            ))}
          </dl>

          <figure className="flex flex-col gap-4">
            <div className="relative aspect-2/1 w-full overflow-hidden bg-muted">
              <Image
                src="/uplatnica.png"
                alt="Primjer ispunjene uplatnice"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.4em]">
              Primjer ispunjene uplatnice
            </figcaption>
          </figure>
        </div>
      </SectionBlock>
    </div>
  );
}

function PageHero({ price }: { price: number }) {
  return (
    <header className="relative isolate flex flex-col items-center gap-8 overflow-hidden text-center">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 left-1/2 -z-10 -translate-x-1/2 select-none font-black leading-none tracking-tighter text-foreground/4 text-[42vw] md:-top-12 md:text-[28vw]"
      >
        12
      </span>

      <span className="h-px w-12 bg-foreground" />
      <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Sezonska iskaznica · {price} EUR
      </p>

      <h1
        aria-label="Postani naš 12. igrač"
        className="select-none text-balance font-black uppercase leading-[0.85] tracking-tighter"
      >
        <span className="block text-[16vw] sm:text-7xl md:text-8xl lg:text-9xl">
          Postani naš
        </span>
        <span className="block text-[16vw] sm:text-7xl md:text-8xl lg:text-9xl">
          12. igrač
        </span>
      </h1>

      <p className="max-w-md text-balance text-sm leading-relaxed text-muted-foreground md:text-base">
        Osiguraj svoje mjesto na tribinama i podržavaj klub tijekom cijele
        sezone. Tvoja iskaznica — tvoj klub.
      </p>

      <a
        href="#podaci-za-uplatu"
        className="group mt-2 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground"
      >
        Podaci za uplatu
        <ArrowDown className="size-3 transition-transform duration-300 group-hover:translate-y-1" />
      </a>
    </header>
  );
}

function SectionBlock({
  index,
  eyebrow,
  title,
  children,
}: {
  index: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const indexStr = String(index).padStart(2, "0");
  const anchor = index === 2 ? "podaci-za-uplatu" : undefined;

  return (
    <section id={anchor} className="space-y-12 sm:space-y-16">
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 border-b border-border/60 pb-6 sm:gap-x-10">
        <span className="font-black tabular-nums leading-none tracking-tighter text-5xl text-foreground sm:text-7xl">
          {indexStr}
        </span>
        <div className="flex flex-col gap-2 sm:gap-3">
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem] sm:tracking-[0.4em]">
            {eyebrow}
          </span>
          <h2 className="font-black uppercase leading-[0.85] tracking-tighter text-3xl sm:text-5xl md:text-6xl">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

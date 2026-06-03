import Image from "next/image";
import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { getTenant } from "@/lib/payload/getTenant";

export const metadata: Metadata = {
  title: "Sezonska ulaznica",
  description: "Kupite sezonsku ulaznicu",
  alternates: { canonical: "/sezonska-iskaznica" },
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
    <div className="mx-auto w-full max-w-screen-xl px-6 py-16 sm:py-24 lg:px-8">
      <TrackEvent event="Season Ticket Page" />
      <PageHero price={price} />

      <SectionBlock
        index={1}
        eyebrow="Iskaznica · Sezona 2024/25"
        title="Tvoje mjesto na tribini"
      >
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src="/fans.jpg"
              alt={`${tenant.displayName} navijači`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute -bottom-4 right-2 sm:-bottom-6 sm:right-4"
            >
              12
            </span>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <p className="max-w-md">
              Napravili smo članske iskaznice za narednu sezonu. Cijena članske
              iskaznice je{" "}
              <span>
                {price} eura
              </span>{" "}
              te se može kupiti uplatom na račun od {shortName}. Također,
              članske iskaznice će se moći kupiti na tribini na svakoj domaćoj
              utakmici.
            </p>
            <p className="max-w-md">
              Svi zainteresirani za kupnju članske iskaznice neka se jave u
              inbox stranice ili nekom od članova uprave.
            </p>

            <div className="flex flex-col gap-3 pt-6">
              <span>
                Vrijedi za
              </span>
              <p>
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
          <dl className="flex flex-col">
            {paymentRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-5 sm:gap-x-10"
              >
                <dt>
                  {row.label}
                </dt>
                <dd className="wrap-break-word text-right">
                  {row.value || "—"}
                </dd>
              </div>
            ))}
          </dl>

          <figure className="flex flex-col gap-4">
            <div className="relative aspect-2/1 w-full overflow-hidden">
              <Image
                src="/uplatnica.png"
                alt="Primjer ispunjene uplatnice"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption>
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
      <span aria-hidden className="absolute -top-6 left-1/2 -z-10 -translate-x-1/2 md:-top-12">
        12
      </span>

      <span className="h-px w-12" />
      <p>
        Sezonska iskaznica · {price} EUR
      </p>

      <h1 aria-label="Postani naš 12. igrač">
        <span className="block">
          Postani naš
        </span>
        <span className="block">
          12. igrač
        </span>
      </h1>

      <p className="max-w-md">
        Osiguraj svoje mjesto na tribinama i podržavaj klub tijekom cijele
        sezone. Tvoja iskaznica — tvoj klub.
      </p>

      <a
        href="#podaci-za-uplatu"
        className="mt-2 inline-flex items-center gap-3"
      >
        Podaci za uplatu
        <ArrowDown className="size-3" />
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
      <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 pb-6 sm:gap-x-10">
        <span>
          {indexStr}
        </span>
        <div className="flex flex-col gap-2 sm:gap-3">
          <span>
            {eyebrow}
          </span>
          <h2>
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

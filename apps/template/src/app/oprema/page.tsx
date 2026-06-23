import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  return {
    title: "Oprema",
    description: `Dresovi, oprema i navijački artikli ${tenant.displayName}.`,
    alternates: { canonical: "/oprema" },
  };
}
import { fetchEquipment } from "@/lib/payload/getEquipment";
import { getTenant } from "@/lib/payload/getTenant";
import type { Equipment, EquipmentCategory } from "@/types/equipment";

const categoryOrder: EquipmentCategory[] = [
  "paketi",
  "dresovi",
  "trenirke",
  "jakne",
  "dodaci",
];

const categoryLabels: Record<EquipmentCategory, string> = {
  paketi: "Paketi",
  dresovi: "Dresovi",
  trenirke: "Trenirke",
  jakne: "Jakne",
  dodaci: "Dodaci",
};

const priceFormatter = new Intl.NumberFormat("hr-HR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} €`;
}

export default async function OpremaPage() {
  const [items, tenant] = await Promise.all([fetchEquipment(), getTenant()]);

  const grouped = categoryOrder.reduce<Record<EquipmentCategory, Equipment[]>>(
    (acc, cat) => {
      acc[cat] = items
        .filter((e) => e.category === cat)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      return acc;
    },
    { paketi: [], dresovi: [], trenirke: [], jakne: [], dodaci: [] },
  );

  const populated = categoryOrder.filter((cat) => grouped[cat].length > 0);
  const webshopHref = tenant.social?.webshop ?? null;

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-24 px-6 py-16 sm:space-y-32 sm:py-24 lg:px-8">
      <PageHero
        eyebrow="Službena oprema kluba"
        title="Oprema"
        lineClassName="text-[16vw] sm:text-6xl md:text-7xl lg:text-8xl"
      >
        <div className="flex flex-col items-center gap-8">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {items.length} proizvoda u ponudi. Sva oprema dostupna je za narudžbu
            kod našeg partnera.
          </p>
          {webshopHref && (
            <a
              href={webshopHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Posjeti webshop
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </PageHero>

      {populated.length === 0 ? (
        <p className="py-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Trenutno nema dostupne opreme.
        </p>
      ) : (
        populated.map((cat) => {
          const group = grouped[cat];
          return (
            <section key={cat} className="space-y-12 sm:space-y-16">
              <SectionHeader title={categoryLabels[cat]} count={group.length} />
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-8">
                {group.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border/60 pb-6">
      <h2 className="font-display font-black uppercase leading-[0.85] tracking-[-0.02em] text-3xl sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <span className="whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
        {count} {count === 1 ? "proizvod" : "proizvoda"}
      </span>
    </div>
  );
}

function ProductCard({ item }: { item: Equipment }) {
  return (
    <a
      href={item.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Kupi ${item.displayName} na alpas.hr`}
      className="group flex flex-col gap-5"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {item.imagePath ? (
          <Image
            src={item.imagePath}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="h-px w-8 bg-foreground transition-all duration-300 group-hover:w-16" />
          <span className="line-clamp-2 text-balance text-sm font-semibold uppercase tracking-[0.15em]">
            {item.displayName}
          </span>
          <span className="font-black tabular-nums tracking-tight text-lg">
            {formatPrice(item.price)}
          </span>
        </div>
        <span className="flex items-center gap-1.5 whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-foreground">
          Kupi
          <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

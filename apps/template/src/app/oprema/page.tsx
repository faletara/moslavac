import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  return {
    title: "Oprema",
    description: `Dresovi, oprema i navijački artikli ${tenant.displayName}.`,
    alternates: { canonical: "/oprema" },
  };
}
import { fetchEquipment } from "@/lib/payload/getEquipment";
import { getTenant, tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadEquipment } from "@/lib/payload/equipment-adapter";
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
  const [docs, tenant] = await Promise.all([fetchEquipment(), getTenant()]);
  const items = docs.map((d) => adaptPayloadEquipment(d, tenantSlug));

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
      <PageHero webshopHref={webshopHref} totalItems={items.length} />

      {populated.length === 0 ? (
        <p className="py-16 text-center">
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

function PageHero({
  webshopHref,
  totalItems,
}: {
  webshopHref: string | null;
  totalItems: number;
}) {
  return (
    <header className="flex flex-col items-center gap-8 text-center">
      <p>
        Službena oprema kluba
      </p>
      <h1 aria-label="Oprema">
        <span className="block">
          Oprema
        </span>
      </h1>
      <p className="max-w-md">
        {totalItems} proizvoda u ponudi. Sva oprema dostupna je za narudžbu kod
        našeg partnera.
      </p>
      {webshopHref && (
        <a
          href={webshopHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3"
        >
          Posjeti webshop
          <ArrowUpRight className="size-3.5" />
        </a>
      )}
    </header>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between gap-6 pb-6">
      <h2>
        {title}
      </h2>
      <span className="whitespace-nowrap">
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
      className="flex flex-col gap-5"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {item.imagePath ? (
          <Image
            src={item.imagePath}
            alt={item.imageAlt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="line-clamp-2">
            {item.displayName}
          </span>
          <span>
            {formatPrice(item.price)}
          </span>
        </div>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          Kupi
          <ArrowUpRight className="size-3" />
        </span>
      </div>
    </a>
  );
}

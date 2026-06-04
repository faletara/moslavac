import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatedLine,
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import Hero from "@/components/features/home/Hero";
import { formatDateShort } from "@/lib/helpers/date";
import { adaptPayloadEquipment } from "@/lib/payload/equipment-adapter";
import { fetchFeaturedEquipment } from "@/lib/payload/getEquipment";
import { fetchAlbums } from "@/lib/payload/getGallery";
import { fetchLatestNews } from "@/lib/payload/getNews";
import { getTenant, tenantSlug } from "@/lib/payload/getTenant";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  return {
    title: {
      absolute: tenant.displayName,
    },
    description:
      tenant.branding?.motto ??
      `Službena web stranica nogometnog kluba ${tenant.displayName}.`,
    alternates: { canonical: "/" },
  };
}

const priceFormatter = new Intl.NumberFormat("hr-HR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default async function HomePage() {
  const [tenant, news, featuredDocs, albums] = await Promise.all([
    getTenant(),
    fetchLatestNews(),
    fetchFeaturedEquipment(),
    fetchAlbums(),
  ]);

  const featured = featuredDocs.map((d) => adaptPayloadEquipment(d, tenantSlug));
  const galleryPreview = albums.slice(0, 3);
  const logoFallback =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo.url ?? "")
      : "";

  return (
    <>
      <Hero tenant={tenant} />

      <div className="space-y-28 py-24 sm:space-y-36 sm:py-32">
        {news.length > 0 && (
          <LatestNews news={news} logoFallback={logoFallback} />
        )}

        <TeaserBand
          eyebrow="Generacije koje dolaze"
          title="Škola nogometa"
          text="Upisi su otvoreni. Pridruži se najmlađim Vrapčićima i razvijaj se uz iskusne trenere."
          href="/skola-nogometa"
          cta="Saznaj više"
        />

        {featured.length > 0 && (
          <FeaturedShop
            items={featured.map((item) => ({
              id: item.id,
              displayName: item.displayName,
              price: `${priceFormatter.format(item.price)} €`,
              imagePath: item.imagePath,
              imageAlt: item.imageAlt,
              externalUrl: item.externalUrl,
            }))}
            webshopHref="/oprema"
          />
        )}

        {galleryPreview.length > 0 && (
          <GalleryTeaser
            albums={galleryPreview.map((a) => ({
              id: a.id,
              title: a.title,
              href: `/galerija/${a.slug ?? a.id}`,
              cover:
                a.coverImage?.sizes?.card?.url ??
                a.coverImage?.url ??
                a.photos[0]?.image.url ??
                "",
            }))}
          />
        )}

        <LunaticsBand />
      </div>
    </>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <AnimatedLine className="mx-auto bg-brand-yellow" />
      <FadeInView delay={0.05}>
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          {eyebrow}
        </p>
      </FadeInView>
      <FadeInView delay={0.1}>
        <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </FadeInView>
    </div>
  );
}

function LatestNews({
  news,
  logoFallback,
}: {
  news: Awaited<ReturnType<typeof fetchLatestNews>>;
  logoFallback: string;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      <SectionHeading eyebrow="Aktualno" title="Vijesti" />
      <StaggerContainer
        className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
        staggerChildren={0.06}
      >
        {news.slice(0, 3).map((doc) => {
          const thumb =
            doc.thumbnail && typeof doc.thumbnail === "object"
              ? doc.thumbnail.url
              : null;
          const date = doc.publishedAt ?? doc.createdAt;
          return (
            <StaggerItem key={doc.id}>
              <Link
                href={`/novosti/${doc.slug ?? doc.id}`}
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={thumb || logoFallback}
                    alt={doc.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className={`transition-transform duration-500 group-hover:scale-105 ${
                      thumb ? "object-cover" : "object-contain p-6"
                    }`}
                  />
                </div>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  {formatDateShort(date)}
                </p>
                <h3 className="line-clamp-2 text-balance text-lg font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-brand-blue">
                  {doc.title}
                </h3>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
      <div className="mt-12 flex justify-center">
        <Link
          href="/novosti"
          className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy transition-colors hover:text-brand-blue"
        >
          Sve vijesti
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function TeaserBand({
  eyebrow,
  title,
  text,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <FadeInView>
      <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-brand-navy px-8 py-16 text-center sm:px-16 sm:py-20">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-brand-yellow sm:text-xs">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-black uppercase leading-[1.02] tracking-tighter text-white sm:text-5xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            {text}
          </p>
          <Link
            href={href}
            className="group mt-2 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy transition-transform hover:scale-[1.03]"
          >
            {cta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </FadeInView>
  );
}

function FeaturedShop({
  items,
  webshopHref,
}: {
  items: {
    id: number;
    displayName: string;
    price: string;
    imagePath: string;
    imageAlt: string;
    externalUrl: string;
  }[];
  webshopHref: string;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      <SectionHeading eyebrow="Službena oprema" title="Webshop" />
      <StaggerContainer
        className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8"
        staggerChildren={0.06}
      >
        {items.slice(0, 4).map((item) => (
          <StaggerItem key={item.id}>
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                {item.imagePath && (
                  <Image
                    src={item.imagePath}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span className="line-clamp-1 text-sm font-semibold uppercase tracking-[0.12em]">
                  {item.displayName}
                </span>
                <span className="font-black tabular-nums tracking-tight">
                  {item.price}
                </span>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
      <div className="mt-12 flex justify-center">
        <Link
          href={webshopHref}
          className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy transition-colors hover:text-brand-blue"
        >
          Cijela ponuda
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function GalleryTeaser({
  albums,
}: {
  albums: { id: number; title: string; href: string; cover: string }[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      <SectionHeading eyebrow="Trenuci kluba" title="Galerija" />
      <StaggerContainer
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8"
        staggerChildren={0.06}
      >
        {albums.map((album) => (
          <StaggerItem key={album.id}>
            <Link href={album.href} className="group flex flex-col gap-3">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-2">
                {album.cover && (
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="text-balance text-base font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-brand-blue">
                {album.title}
              </h3>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function LunaticsBand() {
  return (
    <FadeInView>
      <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <Link
          href="/navijaci"
          className="group grid items-center gap-8 overflow-hidden rounded-2xl bg-brand-navy px-8 py-12 sm:px-12 sm:py-16 md:grid-cols-[auto_1fr] md:gap-12"
        >
          <div className="relative mx-auto size-40 shrink-0 sm:size-48">
            <Image
              src="/lunatics/714443271_26680475911631257_7650010142066840067_n.jpg"
              alt="Lunatics Vrapče"
              fill
              sizes="12rem"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-brand-yellow sm:text-xs">
              Bedem uz momčad · 1993
            </p>
            <h2 className="text-3xl font-black uppercase leading-[1.02] tracking-tighter text-brand-yellow sm:text-5xl">
              Lunatics Vrapče
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Naša boja, naš ponos. Upoznaj navijačku skupinu koja diže tribine
              na svakoj utakmici.
            </p>
            <span className="mt-1 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-yellow">
              Upoznaj navijače
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>
    </FadeInView>
  );
}

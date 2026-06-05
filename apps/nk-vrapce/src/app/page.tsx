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

/** Fina filmska grain tekstura — daje dubinu tamnim navy plohama. */
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

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
          image="/momcad.jpg"
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

type NewsDoc = Awaited<ReturnType<typeof fetchLatestNews>>[number];

function newsThumb(doc: NewsDoc): string | null {
  return doc.thumbnail && typeof doc.thumbnail === "object"
    ? doc.thumbnail.url
    : null;
}

function LatestNews({
  news,
  logoFallback,
}: {
  news: NewsDoc[];
  logoFallback: string;
}) {
  const [lead, ...rest] = news;
  if (!lead) return null;
  const secondary = rest.slice(0, 3);
  const hasList = secondary.length > 0;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      {/* Editorial header: naslov lijevo, link u istom redu desno */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="flex flex-col gap-3">
          <AnimatedLine className="bg-brand-yellow" />
          <FadeInView delay={0.05}>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
              Aktualno
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl">
              Vijesti
            </h2>
          </FadeInView>
        </div>
        <FadeInView delay={0.15}>
          <Link
            href="/novosti"
            className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy transition-colors hover:text-brand-blue sm:inline-flex"
          >
            Sve vijesti
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </FadeInView>
      </div>

      <StaggerContainer
        className={`mt-12 grid gap-8 lg:gap-12 ${hasList ? "lg:grid-cols-12" : ""}`}
        staggerChildren={0.08}
      >
        {/* Lead priča */}
        <StaggerItem className={hasList ? "lg:col-span-7" : ""}>
          <Link
            href={`/novosti/${lead.slug ?? lead.id}`}
            className="group flex flex-col gap-5"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
              <Image
                src={newsThumb(lead) || logoFallback}
                alt={lead.title}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className={`transition-transform duration-[700ms] ease-out group-hover:scale-[1.04] ${
                  newsThumb(lead) ? "object-cover" : "object-contain p-10"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                {formatDateShort(lead.publishedAt ?? lead.createdAt)}
              </p>
              <h3 className="text-balance text-2xl font-black uppercase leading-[1.05] tracking-tight transition-colors group-hover:text-brand-blue sm:text-3xl">
                {lead.title}
              </h3>
              {lead.excerpt && (
                <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {lead.excerpt}
                </p>
              )}
            </div>
          </Link>
        </StaggerItem>

        {/* Sporedne priče — kompaktna lista */}
        {hasList && (
          <div className="flex flex-col lg:col-span-5">
            {secondary.map((doc) => (
              <StaggerItem key={doc.id}>
                <Link
                  href={`/novosti/${doc.slug ?? doc.id}`}
                  className="group flex gap-5 border-b border-line py-5 first:pt-0"
                >
                  <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-32">
                    <Image
                      src={newsThumb(doc) || logoFallback}
                      alt={doc.title}
                      fill
                      sizes="128px"
                      className={`transition-transform duration-500 group-hover:scale-105 ${
                        newsThumb(doc) ? "object-cover" : "object-contain p-3"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-2 py-0.5">
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                      {formatDateShort(doc.publishedAt ?? doc.createdAt)}
                    </p>
                    <h3 className="line-clamp-3 text-balance text-sm font-bold uppercase leading-snug tracking-tight transition-colors group-hover:text-brand-blue sm:text-base">
                      {doc.title}
                    </h3>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </div>
        )}
      </StaggerContainer>

      {/* Mobilni "Sve vijesti" */}
      <div className="mt-10 flex justify-center sm:hidden">
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
  image,
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  image: string;
}) {
  return (
    <section className="relative isolate flex min-h-[62vh] w-full items-center overflow-hidden bg-brand-navy sm:min-h-[70vh]">
      {/* Pozadinska slika */}
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover object-center"
      />
      {/* Navy gradient slojevi — čitljivost + brand ton */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/30" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-brand-navy/85 via-transparent to-brand-navy/50" />
      {/* Žuti glow akcent gore lijevo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[5%] top-0 -z-10 h-2/3 w-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,203,5,0.14), transparent 70%)",
        }}
      />
      {/* Grain tekstura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.1] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN_URL }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <FadeInView>
          <div className="flex max-w-xl flex-col items-start gap-6 text-left">
            <span className="h-px w-12 bg-gradient-to-r from-brand-yellow to-transparent" />
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-brand-yellow sm:text-xs">
              {eyebrow}
            </p>
            <h2 className="text-balance text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl">
              {title}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              {text}
            </p>
            <Link
              href={href}
              className="group mt-2 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy shadow-[0_8px_30px_-6px_rgba(255,203,5,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_10px_40px_-6px_rgba(255,203,5,0.65)]"
            >
              {cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
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
  const visible = items.slice(0, 4);
  const cols = visible.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      {/* Editorial header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="flex flex-col gap-3">
          <AnimatedLine className="bg-brand-yellow" />
          <FadeInView delay={0.05}>
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
              Službena oprema
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl">
              Webshop
            </h2>
          </FadeInView>
        </div>
        <FadeInView delay={0.15}>
          <Link
            href={webshopHref}
            className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy transition-colors hover:text-brand-blue sm:inline-flex"
          >
            Cijela ponuda
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </FadeInView>
      </div>

      <StaggerContainer
        className={`mt-12 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:gap-6 ${cols}`}
        staggerChildren={0.06}
      >
        {visible.map((item) => (
          <StaggerItem key={item.id}>
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface-2 transition-all duration-300 hover:-translate-y-1 hover:border-brand-yellow/60 hover:shadow-[0_18px_40px_-18px_rgba(10,28,51,0.3)]"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-white">
                {item.imagePath ? (
                  <Image
                    src={item.imagePath}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  // Branded fallback dok proizvod nema sliku
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
                    <Image
                      src="/grb-vrapce.png"
                      alt=""
                      width={120}
                      height={120}
                      className="h-2/5 w-2/5 object-contain opacity-10"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-1 items-end justify-between gap-3 px-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <span className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.12em] sm:text-sm">
                    {item.displayName}
                  </span>
                  <span className="font-black tabular-nums tracking-tight text-brand-navy">
                    {item.price}
                  </span>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy transition-colors duration-300 group-hover:bg-brand-yellow">
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Mobilni "Cijela ponuda" */}
      <div className="mt-10 flex justify-center sm:hidden">
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
    <section className="relative isolate w-full overflow-hidden bg-brand-navy py-20 sm:py-28">
      {/* Tribinska atmosfera — pozadina (krop prema navijačima/zastavama) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-40">
        <Image
          src="/lunatics/lunatics.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_30%] brightness-[0.65]"
        />
      </div>
      {/* Jak navy overlay — čitljivost + brand ton, guši tekst transparenata */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-b from-brand-navy/92 via-brand-navy/72 to-brand-navy/95"
      />
      {/* Dual glow — ultras boje (plava + žuta) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[8%] -top-[10%] -z-10 h-2/3 w-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(27,160,224,0.20), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[15%] left-1/3 -z-10 h-2/3 w-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,203,5,0.12), transparent 70%)",
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.1] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN_URL }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <FadeInView>
          <Link
            href="/navijaci"
            className="group grid items-center gap-10 text-center md:grid-cols-[auto_1fr] md:gap-14 md:text-left"
          >
            {/* Grafiti logo kao patch — ring + glow da iskoči */}
            <div className="relative mx-auto size-44 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_20px_50px_-15px_rgba(27,160,224,0.5)] transition-transform duration-500 group-hover:scale-[1.03] sm:size-52">
              <Image
                src="/lunatics/714443271_26680475911631257_7650010142066840067_n.jpg"
                alt="Lunatics Vrapče"
                fill
                sizes="13rem"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-5 md:items-start">
              <span className="h-px w-12 bg-gradient-to-r from-brand-yellow to-transparent" />
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-brand-yellow sm:text-xs">
                Bedem uz momčad · 1993
              </p>
              <h2 className="text-balance text-4xl font-black uppercase leading-[0.95] tracking-tighter text-brand-yellow sm:text-6xl">
                Lunatics Vrapče
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                Naša boja, naš ponos. Upoznaj navijačku skupinu koja diže tribine
                na svakoj utakmici.
              </p>
              <span className="mt-1 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-yellow">
                Upoznaj navijače
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </FadeInView>
      </div>
    </section>
  );
}

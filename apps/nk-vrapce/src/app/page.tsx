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
import { StandingsTable } from "@/components/features/home/StandingsTable";
import { BrandGlow } from "@/components/ui/BrandGlow";
import { formatDateShort } from "@/lib/helpers/date";
import { fetchSeniorCompetition } from "@/lib/hns/competitions";
import { fetchTeamStandings } from "@/lib/hns/standings";
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
  const [tenant, news, featuredDocs, albums, standings] = await Promise.all([
    getTenant(),
    fetchLatestNews(),
    fetchFeaturedEquipment(),
    fetchAlbums(),
    (async () => {
      const competition = await fetchSeniorCompetition();
      if (!competition?.id) return null;
      const rows = await fetchTeamStandings({ competitionId: competition.id });
      return { competition, rows };
    })(),
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

        {standings && standings.rows.length > 0 && (
          <StandingsTable
            rows={standings.rows}
            competitionName={standings.competition.name}
          />
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
    <div className="flex flex-col items-center gap-4 text-center">
      <FadeInView delay={0.05}>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
          {eyebrow}
        </p>
      </FadeInView>
      <FadeInView delay={0.1}>
        <h2 className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </FadeInView>
      <AnimatedLine className="mx-auto h-[3px] w-10 rounded-full bg-brand-yellow" />
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
    <section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
      <BrandGlow
        color="yellow"
        intensity={0.12}
        className="-right-[8%] -top-[30%] h-[32vmax] w-[32vmax]"
      />
      {/* Editorial header: naslov lijevo, link u istom redu desno */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="flex flex-col gap-3">
          <FadeInView delay={0.05}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
              Aktualno
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="flex items-center gap-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl">
              <span className="h-7 w-[3px] rounded-full bg-brand-yellow sm:h-9" />
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
              <h3 className="text-balance text-2xl font-bold uppercase leading-[1.05] tracking-tight transition-colors group-hover:text-brand-blue sm:text-3xl">
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
    <section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
      <BrandGlow
        color="yellow"
        intensity={0.13}
        className="-left-[6%] top-[10%] h-[34vmax] w-[34vmax]"
      />
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Uokvirena fotografija — čisto, mekane sjene */}
        <FadeInView direction="right">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2 shadow-[0_30px_80px_-45px_rgba(10,28,51,0.45)] ring-1 ring-line">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </FadeInView>

        {/* Tekst */}
        <FadeInView direction="left" delay={0.1}>
          <div className="flex flex-col items-start gap-5">
            <span className="h-[3px] w-10 rounded-full bg-brand-yellow" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
              {eyebrow}
            </p>
            <h2 className="text-balance font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {text}
            </p>
            <Link
              href={href}
              className="group mt-2 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_10px_30px_-12px_rgba(255,203,5,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(255,203,5,0.9)]"
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
    <section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
      <BrandGlow
        color="yellow"
        intensity={0.12}
        className="-right-[6%] -top-[28%] h-[32vmax] w-[32vmax]"
      />
      {/* Editorial header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div className="flex flex-col gap-3">
          <FadeInView delay={0.05}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
              Službena oprema
            </p>
          </FadeInView>
          <FadeInView delay={0.1}>
            <h2 className="flex items-center gap-3 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl">
              <span className="h-7 w-[3px] rounded-full bg-brand-yellow sm:h-9" />
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
                  <span className="font-bold tabular-nums tracking-tight text-brand-navy">
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
    <section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
      <BrandGlow
        color="yellow"
        intensity={0.11}
        className="left-1/2 -top-[18%] h-[36vmax] w-[36vmax] -translate-x-1/2"
      />
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
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      <FadeInView>
        <Link
          href="/navijaci"
          className="group relative isolate block overflow-hidden rounded-3xl bg-brand-navy shadow-[0_40px_100px_-50px_rgba(10,28,51,0.6)] ring-1 ring-brand-navy/10"
        >
          {/* Tribinska atmosfera — suptilna pozadina */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
            <Image
              src="/lunatics/lunatics.webp"
              alt=""
              fill
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="object-cover object-[center_30%] brightness-[0.7] transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          {/* Jedan čist navy gradijent — čitljivost, bez graina i višestrukih glowova */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/55"
          />

          <div className="grid items-center gap-9 p-8 text-center sm:p-12 md:grid-cols-[auto_1fr] md:gap-12 md:text-left lg:p-16">
            {/* Grafiti logo kao patch */}
            <div className="relative mx-auto size-40 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-[1.03] sm:size-48">
              <Image
                src="/lunatics/714443271_26680475911631257_7650010142066840067_n.jpg"
                alt="Lunatics Vrapče"
                fill
                sizes="12rem"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-4 md:items-start">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-yellow sm:text-xs">
                Bedem uz momčad · 1993
              </p>
              <h2 className="text-balance font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-brand-yellow sm:text-4xl md:text-5xl">
                Lunatics Vrapče
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
                Naša boja, naš ponos. Upoznaj navijačku skupinu koja diže tribine
                na svakoj utakmici.
              </p>
              <span className="mt-1 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-yellow">
                Upoznaj navijače
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </FadeInView>
    </section>
  );
}

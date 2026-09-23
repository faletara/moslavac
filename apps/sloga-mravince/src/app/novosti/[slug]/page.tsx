import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchResultCard } from "@/components/features/news/MatchResultCard";
import JsonLdScript from "@/lib/app-shell/seo/JsonLdScript";
import { formatDateLong } from "@/lib/helpers/date";
import { fetchMatchInfo } from "@/lib/hns/matches";
import { htmlToMetaDescription } from "@/lib/helpers/text";
import { fetchNewsBySlug } from "@/lib/payload/getNews";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";
import type { News } from "@/types/news";
import type {
  JsonLdNode,
  NewsArticleJsonLd,
  OrganizationJsonLd,
} from "@/types/jsonld";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [news, tenant] = await Promise.all([
    fetchNewsBySlug({ slug }),
    getTenant(),
  ]);

  if (!news) return {};

  // Fall back to a plain-text lead derived from the body so every article emits
  // a meta description even when no explicit excerpt was entered in the CMS.
  const description =
    news.excerpt ??
    (news.content ? htmlToMetaDescription(news.content) || undefined : undefined);

  const canonical = `/novosti/${news.slug ?? slug}`;

  const openGraph: Metadata["openGraph"] = {
    type: "article",
    title: news.title,
    description,
    publishedTime: news.date,
    modifiedTime: news.updatedAt ?? news.date,
    authors: [tenant.displayName],
    section: "Vijesti",
  };

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: news.title,
    description,
  };

  if (news.thumbnailPath) {
    openGraph.images = [{ url: news.thumbnailPath, alt: news.title }];
    twitter.images = [news.thumbnailPath];
  }

  return {
    title: news.title,
    description,
    alternates: { canonical },
    authors: [{ name: tenant.displayName }],
    openGraph,
    twitter,
  };
}

/**
 * NewsArticle + BreadcrumbList. The club is both author and publisher — news
 * docs carry no per-author byline — so a single SportsOrganization node fills
 * both roles.
 */
function buildNewsJsonLd({
  news,
  slug,
  tenantName,
  logoUrl,
}: {
  news: News;
  slug: string;
  tenantName: string;
  logoUrl: string | null;
}): JsonLdNode[] {
  const url = `${BASE_URL}/novosti/${news.slug ?? slug}`;

  const publisher: OrganizationJsonLd = {
    "@type": "SportsOrganization",
    name: tenantName,
    url: BASE_URL,
  };

  if (logoUrl) publisher.logo = { "@type": "ImageObject", url: logoUrl };

  const article: NewsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    datePublished: news.date,
    dateModified: news.updatedAt ?? news.date,
    author: publisher,
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  if (news.excerpt) article.description = news.excerpt;

  if (news.thumbnailPath) article.image = [news.thumbnailPath];

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Novosti",
          item: `${BASE_URL}/novosti`,
        },
        { "@type": "ListItem", position: 3, name: news.title, item: url },
      ],
    },
    article,
  ];
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  const [news, tenant] = await Promise.all([
    fetchNewsBySlug({ slug }),
    getTenant(),
  ]);

  if (!news) notFound();

  // Automatski izvještaj nosi `sourceMatchId`; ručno pisana novost ga nema i
  // stranica onda ne dira HNS. Ako HNS zakaže, izvještaj ostaje čitljiv kao
  // običan tekst — zato `null` prolazi bez greške.
  const match = news.sourceMatchId
    ? await fetchMatchInfo({ matchId: news.sourceMatchId })
    : null;

  const logoUrl = tenant.branding?.logo?.url ?? null;

  const jsonLd = buildNewsJsonLd({
    news,
    slug,
    tenantName: tenant.displayName,
    logoUrl,
  });

  return (
    <article>
      {jsonLd.map((schema) => (
        <JsonLdScript key={schema["@type"]} data={schema} />
      ))}

      {/* Zaglavlje članka nosi isti kino-tretman kao udarna vijest na
          naslovnici: fotografija puni širinu, scrim i zrno je spuštaju u ink,
          naslov stoji na dnu u Antonu. Bez fotografije ostaje čisti ink blok
          da se stranica ne raspadne na članku bez slike. */}
      <header className="relative isolate overflow-hidden bg-ink-deep text-chalk">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-club-red" />

        {news.thumbnailPath && (
          <>
            <Image
              src={news.thumbnailPath}
              alt=""
              aria-hidden
              fill
              priority
              sizes="100vw"
              className="-z-20 object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-linear-to-t from-ink-deep via-ink-deep/80 via-55% to-ink-deep/45"
            />
          </>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay"
        />

        <div className="mx-auto flex min-h-96 max-w-4xl flex-col justify-end px-6 pb-14 pt-10 sm:min-h-[30rem] lg:px-8">
          {/* Nadređena ruta članka je popis vijesti, ne naslovnica — isto što
              tvrdi i BreadcrumbList u JSON-LD-u iznad. */}
          <Link
            href="/novosti"
            className="group inline-flex w-fit items-center gap-2.5 text-[0.68rem] font-black uppercase tracking-[0.2em] text-chalk/60 transition-colors hover:text-chalk"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Sve vijesti
          </Link>

          <p className="mt-auto pt-12 text-[0.62rem] font-black uppercase tracking-[0.24em] text-club-red">
            {formatDateLong(news.date)}
          </p>
          <h1 className="mt-4 max-w-3xl text-balance pt-[0.1em] font-display text-4xl uppercase leading-[1.14] text-chalk sm:text-5xl md:text-6xl">
            {news.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        {match && <MatchResultCard match={match} />}

        {news.content && (
          <div
            className="leading-relaxed text-foreground/85 [&_a]:text-club-red [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:uppercase [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-6 [&_img]:clip-corner [&_li]:mt-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}

        <div className="mt-14 border-t border-foreground/10 pt-8">
          <Link
            href="/novosti"
            className="group inline-flex items-center gap-3 bg-ink-deep px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-chalk transition-colors duration-300 hover:bg-club-red"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Sve vijesti
          </Link>
        </div>
      </div>
    </article>
  );
}

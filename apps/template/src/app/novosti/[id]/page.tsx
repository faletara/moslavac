import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import NewsArticleHero from "@/components/features/news/NewsArticleHero";
import { formatDateLong } from "@/lib/helpers/date";
import {
  fetchNewsById,
  fetchNewsBySlug,
  fetchNewsPaginated,
} from "@/lib/payload/getNews";
import { getTenant, tenantSlug } from "@/lib/payload/getTenant";
import { redirectToCanonical } from "@/lib/canonical";
import { BASE_URL } from "@/lib/siteUrl";

interface Props {
  params: Promise<{ id: string }>;
}

// Param is the news slug; numeric ids still resolve for backwards compatibility.
function fetchNewsDoc(idOrSlug: string) {
  return /^\d+$/.test(idOrSlug)
    ? fetchNewsById({ id: idOrSlug })
    : fetchNewsBySlug({ slug: idOrSlug });
}

export async function generateStaticParams() {
  const result = await fetchNewsPaginated({ page: 1, size: 200 });
  return result.content.map((item) => ({ id: item.slug ?? String(item.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const news = await fetchNewsDoc(id);
  if (!news) return { title: "Vijest nije pronađena" };
  const text = news.content.replace(/<[^>]+>/g, "").trim();
  const description = text.slice(0, 160);
  const slug = news.slug ?? id;
  return {
    title: news.title,
    description,
    alternates: {
      canonical: `${BASE_URL}/novosti/${slug}`,
    },
    openGraph: {
      type: "article",
      title: news.title,
      description,
      publishedTime: news.date,
      ...(news.thumbnailPath
        ? { images: [{ url: news.thumbnailPath, alt: news.title }] }
        : {}),
    },
    twitter: {
      card: news.thumbnailPath ? "summary_large_image" : "summary",
      title: news.title,
      description,
      ...(news.thumbnailPath ? { images: [news.thumbnailPath] } : {}),
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = await fetchNewsDoc(id);
  if (!news || news.tenantId !== tenantSlug) notFound();
  const slug = news.slug ?? id;
  // Redirect legacy numeric ids onto the canonical slug URL.
  if (news.slug) {
    redirectToCanonical(`/novosti/${id}`, `/novosti/${news.slug}`);
  }
  const tenant = await getTenant();

  const date = new Date(news.date);
  const formattedDate = formatDateLong(news.date);
  const formattedTime = date.toLocaleTimeString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    datePublished: news.date,
    dateModified: news.updatedAt,
    mainEntityOfPage: `${BASE_URL}/novosti/${slug}`,
    publisher: {
      "@type": "Organization",
      name: tenant.displayName,
    },
    ...(news.thumbnailPath ? { image: [news.thumbnailPath] } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Vijesti", item: `${BASE_URL}/novosti` },
      { "@type": "ListItem", position: 3, name: news.title, item: `${BASE_URL}/novosti/${slug}` },
    ],
  };

  return (
    <article className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TrackEvent event="News Article View" props={{ title: news.title }} />

      <NewsArticleHero
        title={news.title}
        date={formattedDate}
        time={formattedTime}
        thumbnailPath={news.thumbnailPath ?? null}
      />

      <div
        className="news-content mx-auto mt-12 max-w-2xl px-6 space-y-5 text-base leading-[1.75] sm:mt-16 sm:text-[1.0625rem] lg:px-8"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {news.imagePaths && news.imagePaths.length > 0 && (
        <section className="mx-auto mt-20 max-w-3xl px-6 sm:mt-24 lg:px-8">
          <header className="flex flex-col items-center gap-4 text-center">
            <span className="h-px w-12 bg-primary" />
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
              Galerija
            </p>
          </header>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {news.imagePaths.map((path) => (
              <figure
                key={path}
                className="group relative aspect-square overflow-hidden bg-muted"
              >
                <Image
                  src={path}
                  alt={news.title}
                  fill
                  sizes="(min-width: 640px) 384px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { formatDateLong } from "@/lib/helpers/date";
import {
  fetchNewsById,
  fetchNewsBySlug,
  fetchNewsPaginated,
} from "@/lib/payload/getNews";
import { getTenant, tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadNews } from "@/lib/payload/news-adapter";
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
  return result.docs.map((doc) => ({ id: doc.slug ?? String(doc.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doc = await fetchNewsDoc(id);
  if (!doc) return { title: "Vijest nije pronađena" };
  const news = adaptPayloadNews(doc, tenantSlug);
  const text = news.content.replace(/<[^>]+>/g, "").trim();
  const description = text.slice(0, 160);
  const slug = doc.slug ?? id;
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
      publishedTime: doc.publishedAt ?? doc.createdAt,
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
  const doc = await fetchNewsDoc(id);
  if (!doc) notFound();
  const slug = doc.slug ?? id;
  if (
    doc.tenant &&
    typeof doc.tenant === "object" &&
    doc.tenant.slug !== tenantSlug
  ) {
    notFound();
  }
  const news = adaptPayloadNews(doc, tenantSlug);
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
    datePublished: doc.publishedAt ?? doc.createdAt,
    dateModified: doc.updatedAt ?? doc.publishedAt ?? doc.createdAt,
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
    <article className="mx-auto w-full max-w-3xl px-6 pt-12 pb-24 sm:pt-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TrackEvent event="News Article View" props={{ title: news.title }} />
      <Link
        href="/novosti"
        className="inline-flex items-center gap-3"
      >
        <ArrowLeft className="size-4" />
        Sve vijesti
      </Link>

      <header className="mt-12 flex flex-col items-center gap-6 sm:mt-16">
        <p>
          {formattedDate} · {formattedTime}
        </p>
        <h1>
          {news.title}
        </h1>
      </header>

      {news.thumbnailPath && (
        <figure className="relative mt-12 aspect-video w-full overflow-hidden sm:mt-16">
          <Image
            src={news.thumbnailPath}
            alt={news.title}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            priority
            className="object-cover"
          />
        </figure>
      )}

      <div
        className="mx-auto mt-12 max-w-2xl sm:mt-16"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {news.imagePaths && news.imagePaths.length > 0 && (
        <section className="mt-20 sm:mt-24">
          <header className="flex flex-col items-center gap-4">
            <p>Galerija</p>
          </header>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {news.imagePaths.map((path) => (
              <figure
                key={path}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={path}
                  alt={news.title}
                  fill
                  sizes="(min-width: 640px) 384px, 100vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

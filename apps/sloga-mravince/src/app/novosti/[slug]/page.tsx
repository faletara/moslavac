import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateLong } from "@/lib/helpers/date";
import { fetchNewsBySlug } from "@/lib/payload/getNews";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";
import type { News } from "@/types/news";

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

  const description = news.excerpt ?? undefined;
  const canonical = `/novosti/${news.slug ?? slug}`;

  return {
    title: news.title,
    description,
    alternates: { canonical },
    authors: [{ name: tenant.displayName }],
    openGraph: {
      type: "article",
      title: news.title,
      description,
      publishedTime: news.date,
      modifiedTime: news.updatedAt ?? news.date,
      authors: [tenant.displayName],
      section: "Vijesti",
      ...(news.thumbnailPath
        ? { images: [{ url: news.thumbnailPath, alt: news.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      ...(news.thumbnailPath ? { images: [news.thumbnailPath] } : {}),
    },
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
}): Record<string, unknown>[] {
  const url = `${BASE_URL}/novosti/${news.slug ?? slug}`;
  const publisher = {
    "@type": "SportsOrganization",
    name: tenantName,
    url: BASE_URL,
    ...(logoUrl ? { logo: { "@type": "ImageObject", url: logoUrl } } : {}),
  };

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
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: news.title,
      ...(news.excerpt ? { description: news.excerpt } : {}),
      datePublished: news.date,
      dateModified: news.updatedAt ?? news.date,
      ...(news.thumbnailPath ? { image: [news.thumbnailPath] } : {}),
      author: publisher,
      publisher,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      url,
    },
  ];
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const [news, tenant] = await Promise.all([
    fetchNewsBySlug({ slug }),
    getTenant(),
  ]);
  if (!news) notFound();

  const logo = tenant.branding?.logo;
  const logoUrl = !logo ? null : typeof logo === "string" ? logo : logo.url;
  const jsonLd = buildNewsJsonLd({
    news,
    slug,
    tenantName: tenant.displayName,
    logoUrl,
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Link
        href="/"
        className="text-sm font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        ← Naslovnica
      </Link>

      <p className="mt-8 text-sm uppercase tracking-widest text-club-red">
        {formatDateLong(news.date)}
      </p>
      <h1 className="mt-3 text-3xl font-bold uppercase leading-tight tracking-tight md:text-5xl">
        {news.title}
      </h1>

      {news.thumbnailPath && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={news.thumbnailPath}
            alt={news.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {news.content && (
        <div
          className="mt-10 leading-relaxed [&_a]:text-club-red [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-6 [&_img]:rounded-lg [&_li]:mt-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      )}
    </article>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { formatDateLong } from "@/lib/helpers/date";
import { fetchNewsById, fetchNewsPaginated } from "@/lib/payload/getNews";
import { tenantSlug } from "@/lib/payload/getTenant";
import { adaptPayloadNews } from "@/lib/payload/news-adapter";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const result = await fetchNewsPaginated({ page: 1, size: 200 });
  return result.docs.map((doc) => ({ id: String(doc.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doc = await fetchNewsById({ id });
  if (!doc) return { title: "Vijest nije pronađena" };
  const news = adaptPayloadNews(doc, tenantSlug);
  const text = news.content.replace(/<[^>]+>/g, "").trim();
  const description = text.slice(0, 160);
  return {
    title: news.title,
    description,
    alternates: {
      canonical: `${BASE_URL}/novosti/${id}`,
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
  const doc = await fetchNewsById({ id });
  if (!doc) notFound();
  if (
    doc.tenant &&
    typeof doc.tenant === "object" &&
    doc.tenant.slug !== tenantSlug
  ) {
    notFound();
  }
  const news = adaptPayloadNews(doc, tenantSlug);

  const date = new Date(news.date);
  const formattedDate = formatDateLong(news.date);
  const formattedTime = date.toLocaleTimeString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pt-12 pb-24 sm:pt-16 lg:px-8">
      <TrackEvent event="News Article View" props={{ title: news.title }} />
      <Link
        href="/novosti"
        className="group inline-flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground sm:text-xs"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Sve vijesti
      </Link>

      <header className="mt-12 flex flex-col items-center gap-6 text-center sm:mt-16">
        <span className="h-px w-12 bg-foreground" />
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          {formattedDate} · {formattedTime}
        </p>
        <h1 className="text-balance text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl">
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
        className="news-content mx-auto mt-12 max-w-2xl space-y-5 text-base leading-[1.75] sm:mt-16 sm:text-[1.0625rem]"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {news.imagePaths && news.imagePaths.length > 0 && (
        <section className="mt-20 sm:mt-24">
          <header className="flex flex-col items-center gap-4 text-center">
            <span className="h-px w-12 bg-foreground" />
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

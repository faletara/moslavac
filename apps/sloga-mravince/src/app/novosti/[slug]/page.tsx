import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateLong } from "@/lib/helpers/date";
import { fetchNewsBySlug } from "@/lib/payload/getNews";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await fetchNewsBySlug({ slug });
  if (!news) return {};

  const description = news.excerpt ?? undefined;
  const canonical = `/novosti/${news.slug}`;

  return {
    title: news.title,
    description,
    alternates: { canonical },
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
      card: "summary_large_image",
      title: news.title,
      description,
      ...(news.thumbnailPath ? { images: [news.thumbnailPath] } : {}),
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const news = await fetchNewsBySlug({ slug });
  if (!news) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
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

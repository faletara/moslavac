import type { Metadata } from "next";
import Image from "next/image";
import { InkPageHero } from "@/components/layout/InkPageHero";
import { fetchPageByKey } from "@/lib/payload/getPages";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

const PAGE_KEY = "povijest" as const;
const FALLBACK_TITLE = "O klubu";

export async function generateMetadata(): Promise<Metadata> {
  const [page, tenant] = await Promise.all([
    fetchPageByKey({ key: PAGE_KEY }),
    getTenant(),
  ]);
  const title = page?.title ?? FALLBACK_TITLE;
  const description =
    page?.seoDescription ??
    `Povijest i priča kluba ${tenant.displayName} — nogometni klub iz Mravinaca, osnovan 1925. godine.`;

  return {
    title,
    description,
    alternates: { canonical: "/o-klubu" },
    openGraph: { title: `${title} | ${tenant.displayName}`, description },
    twitter: { title: `${title} | ${tenant.displayName}`, description },
  };
}

export default async function AboutPage() {
  const page = await fetchPageByKey({ key: PAGE_KEY });
  const title = page?.title ?? FALLBACK_TITLE;
  const heroUrl = page?.heroImage?.sizes?.hero?.url ?? page?.heroImage?.url;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `${BASE_URL}/o-klubu`,
      },
    ],
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <InkPageHero title={page?.eyebrow ? [page.eyebrow, title] : [title]} watermark="1925" />

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24 lg:px-8">
        {heroUrl && (
          <figure className="relative mb-12 aspect-video w-full overflow-hidden clip-corner">
            <Image
              src={heroUrl}
              alt={page?.heroImage?.alt || title}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </figure>
        )}

        {page?.content ? (
          <article
            className="leading-relaxed text-foreground/85 [&_a]:text-club-red [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:uppercase [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-6 [&_img]:rounded-lg [&_li]:mt-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Sadržaj uskoro.
          </p>
        )}
      </section>

      {page && page.gallery.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-20 lg:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {page.gallery.map((media) => (
              <figure
                key={media.id}
                className="group relative aspect-square overflow-hidden bg-muted"
              >
                <Image
                  src={media.sizes?.card?.url ?? media.url}
                  alt={media.alt || title}
                  fill
                  sizes="(min-width: 640px) 384px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

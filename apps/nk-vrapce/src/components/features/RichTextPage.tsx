import Image from "next/image";
import { FadeInView } from "@/components/animations";
import { PageHero } from "@/components/features/PageHero";
import type { ClubPage } from "@/types/page";

interface RichTextPageProps {
  page: ClubPage | null;
  /** Nadnaslov i naslov koji se koriste ako CMS zapis još ne postoji. */
  fallbackEyebrow: string;
  fallbackTitle: string;
  emptyMessage?: string;
}

/**
 * Prikaz statične rich-text stranice iz CMS-a (Povijest, Navijači, …).
 * Gradi premium hero + naslovnu sliku + HTML sadržaj + galeriju.
 */
export function RichTextPage({
  page,
  fallbackEyebrow,
  fallbackTitle,
  emptyMessage = "Sadržaj uskoro.",
}: RichTextPageProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow={page?.eyebrow ?? fallbackEyebrow}
        title={page?.title ?? fallbackTitle}
      />

      {page?.heroImage?.url && (
        <FadeInView delay={0.1}>
          <figure className="relative mt-12 aspect-[16/7] w-full overflow-hidden rounded-lg sm:mt-16">
            <Image
              src={page.heroImage.sizes?.hero?.url ?? page.heroImage.url}
              alt={page.heroImage.alt || page.title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              priority
              className="object-cover"
            />
          </figure>
        </FadeInView>
      )}

      {page && page.content ? (
        <article
          className="news-content mx-auto mt-12 max-w-2xl sm:mt-16"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {emptyMessage}
        </p>
      )}

      {page && page.gallery.length > 0 && (
        <section className="mt-20 sm:mt-24">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {page.gallery.map((media) => (
              <figure
                key={media.id}
                className="group relative aspect-square overflow-hidden rounded-md bg-muted"
              >
                <Image
                  src={media.sizes?.card?.url ?? media.url}
                  alt={media.alt || page.title}
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

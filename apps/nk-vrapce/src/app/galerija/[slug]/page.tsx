import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlbumGallery,
  type AlbumPhoto,
} from "@/components/features/gallery/AlbumGallery";
import { formatDateLong } from "@/lib/helpers/date";
import { fetchAlbumBySlug, fetchAlbums } from "@/lib/payload/getGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const albums = await fetchAlbums();
  return albums.map((album) => ({ slug: album.slug ?? String(album.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await fetchAlbumBySlug({ slug });
  if (!album) return { title: "Album nije pronađen" };
  return {
    title: album.title,
    description: album.description ?? `Foto album: ${album.title}.`,
    alternates: { canonical: `/galerija/${album.slug ?? album.id}` },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await fetchAlbumBySlug({ slug });
  if (!album) notFound();

  const photos: AlbumPhoto[] = album.photos.map((photo) => ({
    url: photo.image.sizes?.card?.url ?? photo.image.url,
    alt: photo.image.alt || album.title,
    caption: photo.caption,
  }));

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 pt-12 pb-24 sm:pt-16 lg:px-8">
      <Link
        href="/galerija"
        className="group inline-flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue sm:text-xs"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Sve galerije
      </Link>

      <header className="mt-10 flex flex-col items-center gap-5 text-center sm:mt-14">
        <span className="h-[3px] w-10 rounded-full bg-brand-yellow" />
        {album.date && (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
            {formatDateLong(album.date)}
          </p>
        )}
        <h1 className="text-balance font-display text-3xl font-extrabold uppercase leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
          {album.title}
        </h1>
        {album.description && (
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {album.description}
          </p>
        )}
      </header>

      <div className="mt-12 sm:mt-16">
        {photos.length === 0 ? (
          <p className="py-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Album još nema fotografija.
          </p>
        ) : (
          <AlbumGallery photos={photos} />
        )}
      </div>
    </div>
  );
}

import { ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero, type HeroStat } from "@/components/features/BrandedHero";
import { formatDateShort } from "@/lib/helpers/date";
import { fetchAlbums } from "@/lib/payload/getGallery";
import type { GalleryAlbum } from "@/types/gallery";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Foto galerija NK Vrapče — utakmice, treninzi i događanja kluba.",
  alternates: { canonical: "/galerija" },
};

export default async function GalerijaPage() {
  const albums = await fetchAlbums();

  const totalPhotos = albums.reduce((sum, a) => sum + a.photos.length, 0);
  const stats: HeroStat[] = [
    { value: String(albums.length), label: "Albuma" },
    ...(totalPhotos > 0
      ? [{ value: String(totalPhotos), label: "Fotografija" }]
      : []),
  ];

  return (
    <>
      <BrandedHero
        eyebrow="Trenuci kluba"
        title="Galerija"
        description="Fotografije s utakmica, treninga i događanja NK Vrapče."
        stats={stats}
      />

      <div className="mx-auto w-full max-w-screen-xl px-6 pb-24 lg:px-8">
        {albums.length === 0 ? (
          <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Albumi uskoro.
          </p>
        ) : (
          <StaggerContainer
            className="mt-20 grid grid-cols-1 gap-6 sm:mt-28 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            staggerChildren={0.06}
          >
            {albums.map((album) => (
              <StaggerItem key={album.id}>
                <AlbumCard album={album} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </>
  );
}

function AlbumCard({ album }: { album: GalleryAlbum }) {
  const cover =
    album.coverImage?.sizes?.card?.url ??
    album.coverImage?.url ??
    album.photos[0]?.image.sizes?.card?.url ??
    album.photos[0]?.image.url ??
    null;
  const href = `/galerija/${album.slug ?? album.id}`;
  return (
    <Link href={href} className="group flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-2">
        {cover ? (
          <Image
            src={cover}
            alt={album.coverImage?.alt || album.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-black text-brand-yellow">
            <ImageIcon className="size-10" />
          </div>
        )}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
          <ImageIcon className="size-3" />
          {album.photos.length}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="h-px w-6 bg-brand-yellow transition-all duration-300 group-hover:w-12" />
        <h2 className="text-balance text-base font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-brand-blue sm:text-lg">
          {album.title}
        </h2>
        {album.date && (
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {formatDateShort(album.date)}
          </p>
        )}
      </div>
    </Link>
  );
}

import "server-only";
import type { GalleryAlbum } from "@/types/gallery";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchList, fetchOne } from "./fetchCollection";
import { mediaObject } from "./media";
import type { PayloadMedia } from "./types";

interface PayloadAlbum {
  id: number;
  title: string;
  slug: string | null;
  date: string | null;
  coverImage: PayloadMedia | number | null;
  description: string | null;
  photos:
    | { id?: string; image: PayloadMedia | number; caption: string | null }[]
    | null;
}

export function adaptAlbum(doc: PayloadAlbum): GalleryAlbum {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug ?? null,
    date: doc.date ?? null,
    coverImage: mediaObject(doc.coverImage),
    description: doc.description ?? null,
    photos:
      doc.photos
        ?.map((item) => {
          const image = mediaObject(item.image);
          return image ? { image, caption: item.caption ?? null } : null;
        })
        .filter((p): p is { image: PayloadMedia; caption: string | null } =>
          Boolean(p),
        ) ?? [],
  };
}

const galleryFeature = clubFeatureQuery("gallery");

export const fetchAlbums = (): Promise<GalleryAlbum[]> =>
  fetchList<PayloadAlbum, GalleryAlbum>({
    ...galleryFeature,
    sort: "displayOrder",
    limit: 100,
    adapt: adaptAlbum,
  });

export const fetchAlbumBySlug = (params: {
  slug: string;
}): Promise<GalleryAlbum | null> =>
  fetchOne<PayloadAlbum, GalleryAlbum>({
    ...galleryFeature,
    where: { "where[slug][equals]": params.slug },
    adapt: adaptAlbum,
  });

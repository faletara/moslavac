import "server-only";
import { z } from "zod";
import type { GalleryAlbum, GalleryPhoto } from "@/types/gallery";
import { clubFeatureQuery } from "./clubFeatures";
import { fetchList, fetchOne } from "./fetchCollection";
import { mediaRef } from "./schemas";

export const albumSchema = z.object({
  id: z.number(),
  title: z.string().nullish().transform((text) => text ?? ""),
  slug: z.string().nullish().default(null),
  date: z.string().nullish().default(null),
  coverImage: mediaRef,
  description: z.string().nullish().default(null),
  photos: z.array(mediaRef).nullish().default(null),
});

type PayloadAlbum = z.output<typeof albumSchema>;

export function adaptAlbum(doc: PayloadAlbum): GalleryAlbum {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug ?? null,
    date: doc.date ?? null,
    coverImage: doc.coverImage,
    description: doc.description ?? null,
    photos: (doc.photos ?? []).flatMap((image): GalleryPhoto[] =>
      // `caption` je uklonjen kao editorsko polje (ADR-0001), ali ostaje u
      // domenskom tipu kao uvijek-null dok se ne prikazuje na frontendu.
      image === null ? [] : [{ image, caption: null }],
    ),
  };
}

const galleryFeature = clubFeatureQuery("gallery");

export const fetchAlbums = (): Promise<GalleryAlbum[]> =>
  fetchList<PayloadAlbum, GalleryAlbum>({
    ...galleryFeature,
    schema: albumSchema,
    sort: "displayOrder",
    limit: 100,
    adapt: adaptAlbum,
  });

export const fetchAlbumBySlug = (params: {
  slug: string;
}): Promise<GalleryAlbum | null> =>
  fetchOne<PayloadAlbum, GalleryAlbum>({
    ...galleryFeature,
    schema: albumSchema,
    where: { "where[slug][equals]": params.slug },
    adapt: adaptAlbum,
  });

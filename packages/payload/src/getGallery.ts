import "server-only";
import type { GalleryAlbum } from "@/types/gallery";
import { payloadFetch } from "./client";
import { tenantSlug } from "./getTenant";
import { mediaObject } from "./media";
import { buildQuery, tenantWhere } from "./query";
import type { PayloadMedia, PayloadPaginated } from "./types";

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

const galleryTags = () => [`gallery-${tenantSlug}`];

function adaptAlbum(doc: PayloadAlbum): GalleryAlbum {
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

export async function fetchAlbums(): Promise<GalleryAlbum[]> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    limit: 100,
    sort: "displayOrder",
    depth: 2,
  });
  try {
    const result = await payloadFetch<PayloadPaginated<PayloadAlbum>>(
      `/gallery-albums?${query}`,
      { next: { revalidate: 60, tags: galleryTags() } },
    );
    return result.docs.map(adaptAlbum);
  } catch {
    // Kolekcija još nije deployana ili je prazna → graciozno prazno.
    return [];
  }
}

export async function fetchAlbumBySlug(params: {
  slug: string;
}): Promise<GalleryAlbum | null> {
  const query = buildQuery({
    ...tenantWhere(tenantSlug),
    "where[slug][equals]": params.slug,
    limit: 1,
    depth: 2,
  });
  try {
    const result = await payloadFetch<PayloadPaginated<PayloadAlbum>>(
      `/gallery-albums?${query}`,
      { next: { revalidate: 60, tags: galleryTags() } },
    );
    const doc = result.docs[0];
    return doc ? adaptAlbum(doc) : null;
  } catch {
    return null;
  }
}

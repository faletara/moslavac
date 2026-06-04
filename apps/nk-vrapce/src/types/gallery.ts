import type { PayloadMedia } from "@/lib/payload/types";

export interface GalleryPhoto {
  image: PayloadMedia;
  caption: string | null;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  slug: string | null;
  date: string | null;
  coverImage: PayloadMedia | null;
  description: string | null;
  photos: GalleryPhoto[];
}

import type { MediaImage } from "@/lib/payload/schemas";

export interface GalleryPhoto {
  image: MediaImage;
  caption: string | null;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  slug: string | null;
  date: string | null;
  coverImage: MediaImage | null;
  description: string | null;
  photos: GalleryPhoto[];
}

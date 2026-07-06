interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Passthrough image loader — serves every image directly from its source
 * (R2 variants are already web-sized, crests proxy through `/api/images`, local
 * assets are static) instead of routing through Vercel's metered Image
 * Optimization. This keeps transformation usage at zero so images never break
 * once the free optimization quota is exhausted.
 */
export default function imageLoader({ src }: ImageLoaderParams): string {
  return src;
}

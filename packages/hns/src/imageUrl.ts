interface CometImageUrlOptions {
  transparent?: boolean;
}

/**
 * URL of an HNS (Comet) image as served by this app's `/api/images/[uuid]`
 * route, which proxies `fetchHnsImageBytes`. Deliberately free of `server-only`
 * — client components build these URLs too.
 */
export const getCometImageUrl = (
  uuid: string,
  options: CometImageUrlOptions = {},
): string => {
  return `/api/images/${uuid}${options.transparent ? "?transparent=1" : ""}`;
};

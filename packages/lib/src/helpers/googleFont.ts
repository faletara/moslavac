/**
 * Raw font bytes for `next/og`.
 *
 * `next/font` cannot reach into an `ImageResponse` — satori needs the actual
 * font file. Two things make this fussier than it looks:
 *
 * - The User-Agent decides the format Google serves. A modern browser string
 *   gets woff2, which satori cannot parse; this plain one gets a TTF.
 * - satori ignores `fontWeight` unless a face for that weight is loaded. Bold
 *   text silently renders regular, so every weight you style with must be
 *   requested here.
 *
 * Returns null instead of throwing: a share card in the fallback face still
 * does its job, one that failed to render does not.
 */
export async function loadGoogleFont(
  family: string,
  weight = 400,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}&display=swap`;

    const css = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((res) => res.text());

    const fontUrl = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
    if (!fontUrl) return null;

    return await fetch(fontUrl).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

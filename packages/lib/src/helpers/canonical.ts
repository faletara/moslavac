import { permanentRedirect } from "next/navigation";

/**
 * Collapses duplicate URL forms onto the canonical slug form.
 *
 * Dynamic routes accept both a bare numeric id (`/sezona/100444234`) and the
 * SEO slug (`/sezona/4-nl-srediste-b-25-26-100444234`). Both render identical
 * content, which Google reports as duplicates. Once the entity is fetched and
 * its canonical slug is known, this issues a 308 redirect from any non-canonical
 * form to the canonical one.
 *
 * Call ONLY after confirming the entity exists (otherwise `notFound()`), and
 * only with a non-empty `canonicalPath` — an empty slug would build a broken
 * target and loop. Comparing full paths makes it self-terminating: once on the
 * canonical URL the paths match and no redirect fires.
 */
export function redirectToCanonical(
  currentPath: string,
  canonicalPath: string,
): void {
  if (canonicalPath && currentPath !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }
}

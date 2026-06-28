/** Filtrira kolekciju po slug-u tenanta (multi-tenant izolacija). */
export const tenantWhere = (slug: string) => ({
  "where[tenant.slug][equals]": slug,
});

/**
 * Vraća samo objavljene dokumente kolekcija s uključenim Payload draftovima
 * (`versions.drafts`). Jedna točka istine — koristi se gdje god frontend čita
 * draftabilnu kolekciju da se neobjavljeni nацrti ne prikažu javno.
 */
export const publishedWhere = () => ({
  "where[_status][equals]": "published",
});

/** Gradi query string iz objekta parametara. */
export function buildQuery(
  params: Record<string, string | number>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  return search.toString();
}

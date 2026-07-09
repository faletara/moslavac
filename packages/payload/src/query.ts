/** Filtrira kolekciju po slug-u tenanta (multi-tenant izolacija). */
export const tenantWhere = (slug: string) => ({
  "where[tenant.slug][equals]": slug,
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

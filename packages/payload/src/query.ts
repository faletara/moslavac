/** Filtrira kolekciju po slug-u tenanta (multi-tenant izolacija). */
export const tenantWhere = (slug: string) => ({
  "where[tenant.slug][equals]": slug,
});

/**
 * Dodaje Payloadove `where[...]` uvjete u query. Ključevi su dinamični (dolaze
 * s pozivnog mjesta), pa se upisuju izravno u `URLSearchParams` umjesto da se
 * skupljaju u međurječnik.
 */
export function appendWhere(
  search: URLSearchParams,
  where: Record<string, string | number> | undefined,
): void {
  if (!where) return;

  for (const [key, value] of Object.entries(where)) {
    search.set(key, String(value));
  }
}

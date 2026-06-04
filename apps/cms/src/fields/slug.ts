import type { FieldHook } from 'payload'

/** Pretvara proizvoljan string u URL-safe slug (bez dijakritike). */
export const slugify = (value: string): string =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * beforeValidate hook za slug polja: koristi unesenu vrijednost, a ako je prazna,
 * generira slug iz `title`. Isti obrazac kao u News kolekciji.
 */
export const formatSlug: FieldHook = ({ value, originalDoc, data }) => {
  if (typeof value === 'string' && value.length > 0) {
    return slugify(value)
  }
  const fallback = data?.title ?? originalDoc?.title
  if (typeof fallback === 'string' && fallback.length > 0) {
    return slugify(fallback)
  }
  return value
}

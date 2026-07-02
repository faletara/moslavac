import type { Field, FieldHook } from 'payload'

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

/**
 * Cijelo `slug` text polje (indexed, sidebar, auto-generira iz `title` preko
 * formatSlug). Koriste News i GalleryAlbums.
 */
export const slugField = (opts: { description?: string } = {}): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  admin: {
    position: 'sidebar',
    description: opts.description ?? 'Auto-generiran iz naziva ako je prazno.',
  },
  hooks: {
    beforeValidate: [formatSlug],
  },
})

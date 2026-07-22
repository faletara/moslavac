import type { Field, FieldHook } from 'payload'

/** Pretvara proizvoljan string u URL-safe slug (bez dijakritike). */
export const slugify = (value: string): string =>
  value
    .toString()
    // NFKD (ne NFD) da se i Unicode "fancy"/bold slova (npr. 𝗞, 𝐌) i ligature
    // dekompoziraju u obični ASCII prije uklanjanja dijakritike.
    .normalize('NFKD')
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
export const slugField = (
  opts: { label?: string; description?: string; hidden?: boolean } = {},
): Field => ({
  name: 'slug',
  label: opts.label ?? 'URL adresa (slug)',
  type: 'text',
  index: true,
  admin: opts.hidden
    ? // Skriveno iz forme — formatSlug hook svejedno auto-generira iz naziva.
      { hidden: true }
    : {
        position: 'sidebar',
        description: opts.description ?? 'Auto-generira se iz naziva ako ostaviš prazno.',
      },
  hooks: {
    beforeValidate: [formatSlug],
  },
})

import type { Field } from 'payload'

interface MediaFieldOptions {
  label?: string
  required?: boolean
  description?: string
}

/** Single upload polje vezano na `media`. Koristi 7+ kolekcija. */
export const mediaField = (name: string, opts: MediaFieldOptions = {}): Field => ({
  name,
  label: opts.label ?? 'Slika',
  type: 'upload',
  relationTo: 'media',
  ...(opts.required ? { required: true } : {}),
  ...(opts.description ? { admin: { description: opts.description } } : {}),
})

interface MediaArrayOptions {
  label?: string
  /** Dodaj `caption` text polje uz svaku sliku (GalleryAlbums). */
  withCaption?: boolean
  description?: string
}

/** Array galerije: `{ image (required upload→media), caption? }`. */
export const mediaArrayField = (
  name: string,
  opts: MediaArrayOptions = {},
): Field => ({
  name,
  label: opts.label ?? 'Fotografije',
  type: 'array',
  ...(opts.description ? { admin: { description: opts.description } } : {}),
  fields: [
    {
      name: 'image',
      label: 'Slika',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    ...(opts.withCaption
      ? [{ name: 'caption', label: 'Opis (natpis)', type: 'text' } as Field]
      : []),
  ],
})

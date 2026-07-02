import type { Field } from 'payload'

interface MediaFieldOptions {
  required?: boolean
  description?: string
}

/** Single upload polje vezano na `media`. Koristi 7+ kolekcija. */
export const mediaField = (name: string, opts: MediaFieldOptions = {}): Field => ({
  name,
  type: 'upload',
  relationTo: 'media',
  ...(opts.required ? { required: true } : {}),
  ...(opts.description ? { admin: { description: opts.description } } : {}),
})

interface MediaArrayOptions {
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
  type: 'array',
  ...(opts.description ? { admin: { description: opts.description } } : {}),
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    ...(opts.withCaption
      ? [{ name: 'caption', type: 'text' } as Field]
      : []),
  ],
})

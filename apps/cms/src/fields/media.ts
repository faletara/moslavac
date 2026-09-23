import type { ArrayField, Field, UploadField } from 'payload'

interface MediaFieldOptions {
  label?: string
  required?: boolean
  description?: string
}

/** Single upload polje vezano na `media`. Koristi 7+ kolekcija. */
export const mediaField = (name: string, opts: MediaFieldOptions = {}): Field => {
  const field: UploadField = {
    name,
    label: opts.label ?? 'Slika',
    type: 'upload',
    relationTo: 'media',
  }

  if (opts.required) field.required = true

  if (opts.description) field.admin = { description: opts.description }

  return field
}

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
): Field => {
  const fields: Field[] = [
    {
      name: 'image',
      label: 'Slika',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ]

  if (opts.withCaption) {
    fields.push({ name: 'caption', label: 'Opis (natpis)', type: 'text' })
  }

  const field: ArrayField = {
    name,
    label: opts.label ?? 'Fotografije',
    type: 'array',
    fields,
  }

  if (opts.description) field.admin = { description: opts.description }

  return field
}

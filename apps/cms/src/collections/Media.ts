import type { FieldHook } from 'payload'
import { createCollection } from '../factories/createCollection'

/**
 * Auto-alt: ako editor ne upiše alt tekst, izvedi ga iz naziva datoteke
 * ("ekipa-2024.jpg" → "ekipa 2024"). Zadržava SEO/pristupačnost bez trenja
 * pri uploadu — editor može prepisati vrijednost.
 */
const altFromFilename: FieldHook = ({ value, data }) => {
  if (typeof value === 'string' && value.trim().length > 0) return value
  const filename = typeof data?.filename === 'string' ? data.filename : ''
  if (!filename) return value
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
}

export const Media = createCollection({
  slug: 'media',
  labels: { singular: 'Slika', plural: 'Slike' },
  fields: [
    {
      name: 'alt',
      label: 'Alt tekst (opis slike)',
      type: 'text',
      admin: {
        description: 'Ostavi prazno — automatski se popuni iz naziva datoteke.',
      },
      hooks: {
        beforeValidate: [altFromFilename],
      },
    },
  ],
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, position: 'centre' },
      { name: 'card', width: 800, position: 'centre' },
      { name: 'hero', width: 1600, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
})

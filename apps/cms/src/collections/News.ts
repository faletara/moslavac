import { createCollection } from '../factories/createCollection'
import { mediaArrayField, mediaField } from '../fields/media'
import { slugField } from '../fields/slug'

export const News = createCollection({
  slug: 'news',
  labels: { singular: 'Novost', plural: 'Novosti' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'tenant'],
  },
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'publishedAt',
      label: 'Datum objave',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    mediaField('thumbnail', { label: 'Naslovna slika' }),
    {
      name: 'excerpt',
      label: 'Sažetak',
      type: 'textarea',
      admin: {
        description: 'Kratki sažetak za kartice. Ako ostaviš prazno, generira se iz teksta.',
      },
    },
    {
      name: 'content',
      label: 'Tekst',
      type: 'richText',
    },
    mediaArrayField('gallery', { label: 'Galerija' }),
  ],
})

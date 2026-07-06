import { createCollection } from '../factories/createCollection'
import { mediaArrayField, mediaField } from '../fields/media'
import { slugField } from '../fields/slug'

export const News = createCollection({
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'publishedAt', 'tenant'],
  },
  versions: {
    drafts: true,
  },
  // Auto-publish: svaki spremljeni članak je odmah objavljen (bez ručnog
  // "Publish" koraka). Draft sustav ostaje radi povijesti verzija.
  hooks: {
    beforeChange: [
      ({ data }) => {
        ;(data as { _status?: string })._status = 'published'
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({ description: 'Auto-generated from title if left empty' }),
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    mediaField('thumbnail'),
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary for cards. Auto-generated from content if empty.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    mediaArrayField('gallery'),
  ],
})

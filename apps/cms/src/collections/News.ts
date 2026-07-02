import { createCollection } from '../factories/createCollection'
import { mediaArrayField, mediaField } from '../fields/media'
import { slugField } from '../fields/slug'
import { sendNewsPublishedPush } from '../hooks/newsPush'

export const News = createCollection({
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'publishedAt', 'tenant'],
  },
  // Drafts: AI piše neobjavljen nацrt (_status: draft); admin ga objavi ručno.
  // Frontend čita samo published (vidi packages/payload publishedWhere()).
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [sendNewsPublishedPush],
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

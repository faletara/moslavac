import { createCollection } from '../factories/createCollection'

export const Media = createCollection({
  slug: 'media',
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
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

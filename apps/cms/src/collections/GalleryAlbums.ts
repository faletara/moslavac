import type { CollectionConfig } from 'payload'
import { tenantScopedAdmin } from '../access/tenantScopedAdmin'
import { formatSlug } from '../fields/slug'

/** Galerija — albumi fotografija (događaj → više slika). */
export const GalleryAlbums: CollectionConfig = {
  slug: 'gallery-albums',
  admin: {
    ...tenantScopedAdmin(['nk-vrapce']),
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'displayOrder', 'tenant'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Naziv albuma.' },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generiran iz naziva ako je prazno.',
      },
      hooks: {
        beforeValidate: [formatSlug],
      },
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Naslovna slika albuma.' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'photos',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Redoslijed prikaza albuma (manji broj prvi).',
      },
    },
  ],
}

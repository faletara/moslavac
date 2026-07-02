import { tenantScopedAdmin } from '../access/tenantScopedAdmin'
import { createCollection } from '../factories/createCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaArrayField, mediaField } from '../fields/media'
import { slugField } from '../fields/slug'

/** Galerija — albumi fotografija (događaj → više slika). */
export const GalleryAlbums = createCollection({
  slug: 'gallery-albums',
  admin: {
    ...tenantScopedAdmin('gallery'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'displayOrder', 'tenant'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Naziv albuma.' },
    },
    slugField(),
    {
      name: 'date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    mediaField('coverImage', { description: 'Naslovna slika albuma.' }),
    {
      name: 'description',
      type: 'textarea',
    },
    mediaArrayField('photos', { withCaption: true }),
    displayOrderField({ description: 'Redoslijed prikaza albuma (manji broj prvi).' }),
  ],
})

import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaArrayField, mediaField } from '../fields/media'
import { slugField } from '../fields/slug'

/** Galerija — albumi fotografija (događaj → više slika). */
export const GalleryAlbums = clubFeatureCollection('gallery', {
  labels: { singular: 'Album', plural: 'Galerija (albumi)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'displayOrder', 'tenant'],
  },
  fields: [
    {
      name: 'title',
      label: 'Naziv albuma',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'date',
      label: 'Datum',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    mediaField('coverImage', { label: 'Naslovna slika', description: 'Naslovna slika albuma.' }),
    {
      name: 'description',
      label: 'Opis',
      type: 'textarea',
    },
    mediaArrayField('photos', { label: 'Fotografije', withCaption: true }),
    displayOrderField({ description: 'Redoslijed prikaza albuma (manji broj prvi).' }),
  ],
})

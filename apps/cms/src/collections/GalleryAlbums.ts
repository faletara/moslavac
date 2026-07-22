import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'
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
    {
      name: 'photos',
      label: 'Fotografije',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Dodaj više slika odjednom (drag & drop u galeriju).' },
    },
    displayOrderField({ description: 'Redoslijed prikaza albuma (manji broj prvi).' }),
  ],
})

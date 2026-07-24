import { activeField } from '../fields/active'
import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'

/**
 * Webshop proizvodi. Rubrika je opcionalna — vide je samo klubovi koji imaju
 * `equipment` u `tenant.features` (Moslavac, Vrapče). Slug ostaje `equipment`.
 */
export const Equipment = clubFeatureCollection('equipment', {
  labels: { singular: 'Proizvod (oprema)', plural: 'Oprema' },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'category', 'price', 'featured', 'active', 'displayOrder'],
  },
  fields: [
    {
      name: 'displayName',
      label: 'Naziv',
      type: 'text',
      required: true,
      admin: {
        description: 'Naziv proizvoda prikazan na kartici (npr. "Dres domaći", "Polaris jakna").',
      },
    },
    {
      name: 'category',
      label: 'Kategorija',
      type: 'select',
      required: true,
      options: [
        { label: 'Paketi', value: 'paketi' },
        { label: 'Dresovi', value: 'dresovi' },
        { label: 'Trenirke', value: 'trenirke' },
        { label: 'Jakne', value: 'jakne' },
        { label: 'Dodaci', value: 'dodaci' },
      ],
    },
    {
      name: 'price',
      label: 'Cijena (EUR)',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    mediaField('image', {
      label: 'Slika proizvoda',
      description: 'Sliku uploadaj u galeriju i ovdje je odaberi.',
    }),
    {
      name: 'externalUrl',
      label: 'Link na proizvod',
      type: 'text',
      required: true,
      admin: {
        description: 'Direktan link na proizvod u web trgovini (mora počinjati s http:// ili https://).',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Link je obavezan'
        if (!/^https?:\/\//i.test(value)) return 'Link mora počinjati s http:// ili https://'
        return true
      },
    },
    displayOrderField({ description: 'Redoslijed unutar kategorije (manji broj se prikazuje prvi).' }),
    {
      name: 'featured',
      label: 'Istaknuto na naslovnici',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Prikaži proizvod u carouselu na naslovnici.',
      },
    },
    activeField('Isključi da sakriješ proizvod bez brisanja.'),
  ],
})

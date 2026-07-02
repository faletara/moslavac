import { activeField } from '../fields/active'
import { createCollection } from '../factories/createCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'

export const Equipment = createCollection({
  slug: 'equipment',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'category', 'price', 'featured', 'active', 'displayOrder'],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: {
        description: 'Kratki naziv prikazan na kartici (npr. "Paket", "Polaris jakna")',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Pun naziv proizvoda (npr. "SNK Moslavac Popovača — paket")',
      },
    },
    {
      name: 'category',
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
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Cijena u EUR',
        step: 0.01,
      },
    },
    mediaField('image', {
      description: 'Slika proizvoda (uploadaj u admin UI nakon kreiranja zapisa)',
    }),
    {
      name: 'externalUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Direktan link na proizvod na alpas.hr (mora počinjati s http:// ili https://)',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Link je obavezan'
        if (!/^https?:\/\//i.test(value)) return 'Link mora počinjati s http:// ili https://'
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Opcionalni kratki opis proizvoda',
      },
    },
    displayOrderField({ description: 'Redoslijed unutar kategorije (manji broj se prikazuje prvi)' }),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Prikaži u carouselu na naslovnici',
      },
    },
    activeField('Sakrij proizvod bez brisanja (ako je isključeno)'),
  ],
})

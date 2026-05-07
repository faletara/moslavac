import type { CollectionConfig } from 'payload'

export const Equipment: CollectionConfig = {
  slug: 'equipment',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'category', 'price', 'featured', 'active', 'displayOrder'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Slika proizvoda (uploadaj u admin UI nakon kreiranja zapisa)',
      },
    },
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
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Redoslijed unutar kategorije (manji broj se prikazuje prvi)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Prikaži u carouselu na naslovnici',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Sakrij proizvod bez brisanja (ako je isključeno)',
      },
    },
  ],
}

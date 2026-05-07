import type { CollectionConfig } from 'payload'

export const Roster: CollectionConfig = {
  slug: 'roster',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'position', 'jerseyNumber', 'captain', 'displayOrder'],
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
        description: 'Ime koje se prikazuje na stranici (može biti puno ime ili nadimak)',
      },
    },
    {
      name: 'personId',
      type: 'number',
      required: true,
      index: true,
      admin: {
        description:
          'Pretraži igrača po imenu — odabir automatski popuni personId i Display name. Mora biti odabran prije spremanja.',
        components: {
          Field: '@/components/PlayerSearchField#PlayerSearchField',
        },
      },
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      options: [
        { label: 'Vratar', value: 'vratar' },
        { label: 'Obrambeni', value: 'obrambeni' },
        { label: 'Vezni', value: 'vezni' },
        { label: 'Napadač', value: 'napadac' },
        { label: 'Trener', value: 'trener' },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Redoslijed unutar pozicije (manji broj se prikazuje prvi)',
      },
    },
    {
      name: 'jerseyNumber',
      type: 'number',
    },
    {
      name: 'captain',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Fotografija igrača',
      },
    },
  ],
}

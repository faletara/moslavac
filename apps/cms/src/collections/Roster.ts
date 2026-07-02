import { createCollection } from '../factories/createCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'

export const Roster = createCollection({
  slug: 'roster',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'position', 'jerseyNumber', 'captain', 'displayOrder'],
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
    displayOrderField({
      sidebar: false,
      description: 'Redoslijed unutar pozicije (manji broj se prikazuje prvi)',
    }),
    {
      name: 'jerseyNumber',
      type: 'number',
    },
    {
      name: 'captain',
      type: 'checkbox',
      defaultValue: false,
    },
    mediaField('photo', { description: 'Fotografija igrača' }),
  ],
})

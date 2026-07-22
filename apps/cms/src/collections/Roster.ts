import { createCollection } from '../factories/createCollection'
import { mediaField } from '../fields/media'

export const Roster = createCollection({
  slug: 'roster',
  labels: { singular: 'Igrač', plural: 'Igrači (momčad)' },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'position', 'jerseyNumber', 'captain'],
  },
  fields: [
    {
      name: 'personId',
      label: 'Igrač',
      type: 'number',
      required: true,
      index: true,
      admin: {
        description: 'Pretraži igrača po imenu — odabir automatski popuni ime. Odaberi prije spremanja.',
        components: {
          Field: '@/components/PlayerSearchField#PlayerSearchField',
        },
      },
    },
    {
      name: 'displayName',
      label: 'Ime na stranici',
      type: 'text',
      required: true,
      admin: {
        description: 'Ime koje se prikazuje na stranici (puno ime ili nadimak).',
      },
    },
    {
      name: 'position',
      label: 'Pozicija',
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
      name: 'jerseyNumber',
      label: 'Broj dresa',
      type: 'number',
    },
    {
      name: 'captain',
      label: 'Kapetan',
      type: 'checkbox',
      defaultValue: false,
    },
    mediaField('photo', { label: 'Fotografija', description: 'Fotografija igrača.' }),
  ],
})

import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'

/** Uprava kluba — predsjedništvo, nadzorni odbor, stručni stožer. */
export const BoardMembers = clubFeatureCollection('board', {
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'roleGroup', 'displayOrder', 'tenant'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Ime i prezime člana.' },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { description: 'Funkcija (npr. "Predsjednik", "Tajnik", "Trener vratara").' },
    },
    {
      name: 'roleGroup',
      type: 'select',
      required: true,
      defaultValue: 'predsjednistvo',
      options: [
        { label: 'Predsjedništvo', value: 'predsjednistvo' },
        { label: 'Nadzorni odbor', value: 'nadzorni-odbor' },
        { label: 'Stručni stožer', value: 'strucni-stozer' },
        { label: 'Ostalo', value: 'ostalo' },
      ],
      admin: { description: 'Sekcija u kojoj se član prikazuje.' },
    },
    mediaField('photo', { description: 'Fotografija člana (opcionalno).' }),
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: { description: 'Kratki opis (opcionalno).' },
    },
    displayOrderField({ description: 'Redoslijed unutar sekcije (manji broj prvi).' }),
  ],
})

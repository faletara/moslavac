import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'

/** Uprava kluba — predsjedništvo, nadzorni odbor, stručni stožer. */
export const BoardMembers = clubFeatureCollection('board', {
  labels: { singular: 'Član uprave', plural: 'Uprava kluba' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'roleGroup', 'displayOrder', 'tenant'],
  },
  fields: [
    {
      name: 'name',
      label: 'Ime i prezime',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Funkcija',
      type: 'text',
      required: true,
      admin: { description: 'Npr. "Predsjednik", "Tajnik", "Trener vratara".' },
    },
    {
      name: 'roleGroup',
      label: 'Sekcija',
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
    mediaField('photo', { label: 'Fotografija', description: 'Fotografija člana (opcionalno).' }),
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'text',
    },
    displayOrderField({ description: 'Redoslijed unutar sekcije (manji broj prvi).' }),
  ],
})

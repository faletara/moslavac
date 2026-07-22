import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { activeField } from '../fields/active'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'

/** Škola nogometa — programi po dobnim skupinama (Limači, Zagici, Pioniri…). */
export const SchoolPrograms = clubFeatureCollection('school', {
  labels: { singular: 'Program (škola nogometa)', plural: 'Škola nogometa' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'ageRange', 'coach', 'active', 'displayOrder', 'tenant'],
  },
  fields: [
    {
      name: 'name',
      label: 'Naziv skupine',
      type: 'text',
      required: true,
      admin: { description: 'Naziv skupine/programa (npr. "Limači U7–U9").' },
    },
    {
      name: 'ageRange',
      label: 'Dobni raspon',
      type: 'text',
      admin: { description: 'Npr. "U7–U9", "7–9 godina".' },
    },
    {
      name: 'coach',
      label: 'Trener',
      type: 'text',
      admin: { description: 'Ime trenera (opcionalno).' },
    },
    {
      name: 'schedule',
      label: 'Termini treninga',
      type: 'textarea',
      admin: { description: 'Npr. "Pon, Sri, Pet — 17:00–18:30".' },
    },
    {
      name: 'description',
      label: 'Opis programa',
      type: 'textarea',
      admin: {
        description: 'Prikazuje se na kartici i kao glavni tekst ("O programu") na stranici programa.',
      },
    },
    mediaField('photo', { label: 'Fotografija' }),
    displayOrderField({ description: 'Redoslijed prikaza (manji broj prvi).' }),
    activeField('Isključi da sakriješ program bez brisanja.'),
  ],
})

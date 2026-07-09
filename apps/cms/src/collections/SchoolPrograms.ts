import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { activeField } from '../fields/active'
import { displayOrderField } from '../fields/displayOrder'
import { mediaField } from '../fields/media'

/** Škola nogometa — programi po dobnim skupinama (Limači, Zagici, Pioniri…). */
export const SchoolPrograms = clubFeatureCollection('school', {
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'ageRange', 'coach', 'active', 'displayOrder', 'tenant'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Naziv skupine/programa (npr. "Limači U7–U9").' },
    },
    {
      name: 'ageRange',
      type: 'text',
      admin: { description: 'Dobni raspon (npr. "U7–U9", "7–9 godina").' },
    },
    {
      name: 'coach',
      type: 'text',
      admin: { description: 'Ime trenera (opcionalno).' },
    },
    {
      name: 'schedule',
      type: 'textarea',
      admin: { description: 'Termini treninga (npr. "Pon, Sri, Pet — 17:00–18:30").' },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description:
          'Opis programa — prikazuje se na kartici i kao glavni tekst ("O programu") na stranici programa.',
      },
    },
    mediaField('photo'),
    displayOrderField({ description: 'Redoslijed prikaza (manji broj prvi).' }),
    activeField('Sakrij program bez brisanja (ako je isključeno).'),
  ],
})

import type { CollectionConfig } from 'payload'
import { tenantScopedAdmin } from '../access/tenantScopedAdmin'

/** Škola nogometa — programi po dobnim skupinama (Limači, Zagici, Pioniri…). */
export const SchoolPrograms: CollectionConfig = {
  slug: 'school-programs',
  admin: {
    ...tenantScopedAdmin('school'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'ageRange', 'coach', 'active', 'displayOrder', 'tenant'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Redoslijed prikaza (manji broj prvi).',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Sakrij program bez brisanja (ako je isključeno).',
      },
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { tenantScopedAdmin } from '../access/tenantScopedAdmin'

/** Uprava kluba — predsjedništvo, nadzorni odbor, stručni stožer. */
export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  admin: {
    ...tenantScopedAdmin(['nk-vrapce']),
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'roleGroup', 'displayOrder', 'tenant'],
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
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Fotografija člana (opcionalno).' },
    },
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
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Redoslijed unutar sekcije (manji broj prvi).',
      },
    },
  ],
}

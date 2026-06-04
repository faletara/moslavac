import type { CollectionConfig } from 'payload'
import { tenantScopedAdmin } from '../access/tenantScopedAdmin'

/**
 * Dokumenti kluba za preuzimanje (PDF): statut, pravilnici, obrasci, izvješća.
 * Zasebna upload kolekcija jer Media prima samo slike (`image/*`).
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    ...tenantScopedAdmin(['nk-vrapce']),
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'tenant'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Naziv dokumenta prikazan na stranici.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'statut',
      options: [
        { label: 'Statut', value: 'statut' },
        { label: 'Pravilnik', value: 'pravilnik' },
        { label: 'Obrazac', value: 'obrazac' },
        { label: 'Izvješće', value: 'izvjesce' },
        { label: 'Ostalo', value: 'ostalo' },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Redoslijed unutar kategorije (manji broj prvi).',
      },
    },
  ],
}

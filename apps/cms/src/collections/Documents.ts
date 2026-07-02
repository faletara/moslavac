import { tenantScopedAdmin } from '../access/tenantScopedAdmin'
import { createCollection } from '../factories/createCollection'
import { displayOrderField } from '../fields/displayOrder'

/**
 * Dokumenti kluba za preuzimanje (PDF): statut, pravilnici, obrasci, izvješća.
 * Zasebna upload kolekcija jer Media prima samo slike (`image/*`).
 */
export const Documents = createCollection({
  slug: 'documents',
  admin: {
    ...tenantScopedAdmin('documents'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'tenant'],
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
    displayOrderField({ description: 'Redoslijed unutar kategorije (manji broj prvi).' }),
  ],
})

import { tenantScopedAdmin } from '../access/tenantScopedAdmin'
import { createCollection } from '../factories/createCollection'
import { mediaArrayField, mediaField } from '../fields/media'

/**
 * Generička rich-text stranica za statične rubrike koje klub sam uređuje.
 * Jedan zapis po `key` slotu (Povijest, Navijači, Statut-uvod, Škola-uvod, Seniori-uvod).
 * Frontend dohvaća deterministički po `key` (vidi getPages.ts).
 */
export const Pages = createCollection({
  slug: 'pages',
  admin: {
    ...tenantScopedAdmin('pages'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'tenant'],
  },
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Povijest kluba', value: 'povijest' },
        { label: 'Navijači', value: 'navijaci' },
        { label: 'Statut — uvodni tekst', value: 'statut' },
        { label: 'Škola nogometa — uvodni tekst', value: 'skola-info' },
        { label: 'Seniori — uvodni tekst', value: 'seniori-info' },
      ],
      admin: {
        description: 'Odredi kojoj rubrici ovaj sadržaj pripada (jedan zapis po rubrici).',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Glavni naslov stranice.' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Mali nadnaslov iznad glavnog naslova (opcionalno).' },
    },
    mediaField('heroImage', { description: 'Naslovna slika rubrike (opcionalno).' }),
    {
      name: 'content',
      type: 'richText',
    },
    mediaArrayField('gallery', {
      description: 'Dodatne fotografije prikazane uz tekst (opcionalno).',
    }),
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Kratki opis za tražilice (meta description).',
      },
    },
  ],
})

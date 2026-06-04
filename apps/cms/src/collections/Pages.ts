import type { CollectionConfig } from 'payload'
import { tenantScopedAdmin } from '../access/tenantScopedAdmin'

/**
 * Generička rich-text stranica za statične rubrike koje klub sam uređuje.
 * Jedan zapis po `key` slotu (Povijest, Navijači, Statut-uvod, Škola-uvod, Seniori-uvod).
 * Frontend dohvaća deterministički po `key` (vidi getPages.ts).
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    ...tenantScopedAdmin(['nk-vrapce']),
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'tenant'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Povijest kluba', value: 'povijest' },
        { label: 'Navijači (Lunatics Vrapče)', value: 'navijaci' },
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
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Naslovna slika rubrike (opcionalno).' },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'gallery',
      type: 'array',
      admin: { description: 'Dodatne fotografije prikazane uz tekst (opcionalno).' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Kratki opis za tražilice (meta description).',
      },
    },
  ],
}

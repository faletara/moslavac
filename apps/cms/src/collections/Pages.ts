import { clubFeatureCollection } from '../factories/clubFeatureCollection'
import { mediaArrayField, mediaField } from '../fields/media'

/**
 * Generička rich-text stranica za statične rubrike koje klub sam uređuje.
 * Jedan zapis po `key` slotu (Povijest, Navijači, Statut-uvod, Škola-uvod, Seniori-uvod).
 * Frontend dohvaća deterministički po `key` (vidi getPages.ts).
 */
export const Pages = clubFeatureCollection('pages', {
  labels: { singular: 'Stranica', plural: 'Stranice' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'tenant'],
  },
  fields: [
    {
      name: 'key',
      label: 'Rubrika',
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
        description: 'Kojoj rubrici ovaj sadržaj pripada (jedan zapis po rubrici).',
      },
    },
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
      admin: { description: 'Glavni naslov stranice.' },
    },
    {
      name: 'eyebrow',
      label: 'Nadnaslov',
      type: 'text',
      admin: { description: 'Mali nadnaslov iznad glavnog naslova (opcionalno).' },
    },
    mediaField('heroImage', { label: 'Naslovna slika', description: 'Naslovna slika rubrike (opcionalno).' }),
    {
      name: 'content',
      label: 'Tekst',
      type: 'richText',
    },
    mediaArrayField('gallery', {
      label: 'Galerija',
      description: 'Dodatne fotografije prikazane uz tekst (opcionalno).',
    }),
    {
      name: 'seoDescription',
      label: 'Opis za tražilice',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Kratki opis za Google (meta description).',
      },
    },
  ],
})

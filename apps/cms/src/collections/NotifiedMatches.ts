import type { CollectionConfig } from 'payload'

/**
 * Dedup stanje push obavijesti po HNS utakmici (tenant-scoped). Tri nezavisna
 * flaga omogućuju samo-oporavak: ako jedan korak padne, idući prolaz crona
 * ponovi samo njega bez dupliranja ostalih. Popunjava cron (overrideAccess).
 */
export const NotifiedMatches: CollectionConfig = {
  slug: 'notified-matches',
  admin: {
    useAsTitle: 'matchLabel',
    defaultColumns: [
      'matchLabel',
      'hnsMatchId',
      'reminderSent',
      'resultPushSent',
      'aiDraftCreated',
      'tenant',
    ],
    description: 'Stanje poslanih obavijesti po utakmici (dedup). Popunjava cron.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'hnsMatchId',
      type: 'number',
      required: true,
      index: true,
    },
    {
      name: 'matchLabel',
      type: 'text',
      admin: { description: 'Čitljiv opis utakmice (npr. "Moslavac – Kutina").' },
    },
    { name: 'reminderSent', type: 'checkbox', defaultValue: false },
    { name: 'resultPushSent', type: 'checkbox', defaultValue: false },
    { name: 'aiDraftCreated', type: 'checkbox', defaultValue: false },
  ],
}

import type { CollectionConfig } from 'payload'
import { CLUB_FEATURE_OPTIONS } from '@/lib/payload/clubFeatures'
import { isSuperAdmin, superAdminOnly } from '../access/roles'
import { mediaField } from '../fields/media'

/** UI-uvjet: polje/tab vidljivo samo platformi (super-adminu), ne vlasniku kluba. */
const superAdminUI = (_data: unknown, _sibling: unknown, { user }: { user?: unknown }): boolean =>
  isSuperAdmin(user as Parameters<typeof isSuperAdmin>[0])

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: { singular: 'Klub (postavke)', plural: 'Klubovi (postavke)' },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'slug', 'active'],
  },
  access: {
    read: () => true,
    create: superAdminOnly,
    // Multi-tenant plugin sužava update na korisnikov vlastiti tenant.
    update: ({ req: { user } }) => Boolean(user),
    delete: superAdminOnly,
  },
  fields: [
    {
      name: 'displayName',
      label: 'Naziv kluba',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'URL ključ (slug)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        condition: superAdminUI,
        description: 'Tehnički identifikator kluba — ne mijenjati (razbija stranicu).',
      },
    },
    {
      name: 'active',
      label: 'Klub aktivan',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: superAdminUI,
      },
    },
    {
      name: 'features',
      label: 'Uključene rubrike',
      type: 'select',
      hasMany: true,
      options: CLUB_FEATURE_OPTIONS,
      access: {
        // Samo platforma (super-admin) uključuje rubrike klubu; klub si ih ne dodjeljuje sam.
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
      admin: {
        condition: superAdminUI,
        description: 'Rubrike koje klub koristi — određuje vidljivost kolekcija u adminu.',
      },
    },
    {
      name: 'hns',
      type: 'group',
      label: 'HNS integracija',
      admin: {
        condition: superAdminUI,
        description: 'Integracija s Hrvatskim nogometnim savezom (održava platforma).',
      },
      fields: [
        {
          name: 'apiKey',
          label: 'API ključ',
          type: 'text',
          required: true,
          access: {
            read: ({ req: { user } }) => Boolean(user),
          },
          admin: {
            description: 'Šalje se kao API_KEY header prema HNS-u. Skriveno od javnosti.',
          },
        },
        {
          name: 'teamId',
          label: 'ID momčadi',
          type: 'text',
          required: true,
          admin: {
            description: 'ID momčadi kluba u HNS sustavu.',
          },
        },
        {
          name: 'seniorCompetitionFilter',
          label: 'Filter seniorskog natjecanja',
          type: 'text',
          admin: {
            description: 'Dio naziva natjecanja koji identificira seniorsko natjecanje.',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Izgled kluba',
          fields: [
            {
              name: 'branding',
              type: 'group',
              label: false,
              fields: [
                { name: 'shortName', label: 'Kratki naziv', type: 'text' },
                { name: 'motto', label: 'Moto', type: 'text' },
                { name: 'founded', label: 'Godina osnutka', type: 'number' },
                mediaField('logo', { label: 'Grb / logo' }),
              ],
            },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: false,
              fields: [
                { name: 'email', label: 'E-mail', type: 'email' },
                { name: 'phone', label: 'Telefon', type: 'text' },
                { name: 'address', label: 'Adresa', type: 'textarea' },
                {
                  name: 'city',
                  label: 'Mjesto',
                  type: 'text',
                  admin: {
                    description: 'Npr. "Popovača".',
                  },
                },
                {
                  name: 'region',
                  label: 'Županija',
                  type: 'text',
                  admin: {
                    description: 'Npr. "Sisačko-moslavačka županija".',
                  },
                },
                {
                  name: 'mapEmbedUrl',
                  label: 'Karta (embed URL)',
                  type: 'text',
                  admin: {
                    description: 'Link karte (src iz Google/OpenStreetMap <iframe> koda) za prikaz lokacije.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Društvene mreže',
          fields: [
            {
              name: 'social',
              type: 'group',
              label: false,
              fields: [
                { name: 'facebook', label: 'Facebook', type: 'text' },
                { name: 'youtube', label: 'YouTube', type: 'text' },
                { name: 'webshop', label: 'Web trgovina', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Plaćanje',
          fields: [
            {
              name: 'payment',
              type: 'group',
              label: false,
              fields: [
                { name: 'iban', label: 'IBAN', type: 'text' },
                { name: 'recipient', label: 'Primatelj', type: 'textarea' },
                { name: 'seasonTicketPrice', label: 'Cijena sezonske (EUR)', type: 'number' },
              ],
            },
          ],
        },
        {
          label: 'Pravno',
          description: 'Pravni podaci o udruzi (Impressum, Politika privatnosti).',
          fields: [
            {
              name: 'legal',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'oib',
                  label: 'OIB',
                  type: 'text',
                  admin: { description: 'OIB udruge (11 znamenki).' },
                },
                {
                  name: 'registryNumber',
                  label: 'Registarski broj',
                  type: 'text',
                  admin: { description: 'Broj u Registru udruga RH.' },
                },
                {
                  name: 'registryAuthority',
                  label: 'Nadležno tijelo upisa',
                  type: 'text',
                  admin: {
                    description: 'Npr. "Ured državne uprave u Sisačko-moslavačkoj županiji".',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

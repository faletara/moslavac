import type { CollectionConfig } from 'payload'
import { isSuperAdmin, superAdminOnly } from '../access/roles'
import { CLUB_FEATURES } from '../access/tenantScopedAdmin'
import { mediaField } from '../fields/media'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-safe identifier (e.g. "moslavac"). Used as tenant resolution key from frontend env.',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'features',
      type: 'select',
      hasMany: true,
      options: CLUB_FEATURES,
      access: {
        // Samo platforma (super-admin) uključuje rubrike klubu; klub si ih ne dodjeljuje sam.
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
      admin: {
        description:
          'Klub-specifične rubrike koje ovaj klub koristi — određuje vidljivost odgovarajućih kolekcija u adminu (Stranice, Dokumenti, Uprava, Škola, Galerija).',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'HNS',
          description: 'Hrvatski nogometni savez API integration',
          fields: [
            {
              name: 'hns',
              type: 'group',
              fields: [
                {
                  name: 'apiKey',
                  type: 'text',
                  required: true,
                  access: {
                    read: ({ req: { user } }) => Boolean(user),
                  },
                  admin: {
                    description: 'Sent as API_KEY header to HNS. Hidden from public reads.',
                  },
                },
                {
                  name: 'teamId',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Club team ID in HNS system',
                  },
                },
                {
                  name: 'seniorCompetitionFilter',
                  type: 'text',
                  admin: {
                    description: 'Substring matched against competition name to identify senior competition',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Branding',
          fields: [
            {
              name: 'branding',
              type: 'group',
              fields: [
                { name: 'shortName', type: 'text' },
                { name: 'motto', type: 'text' },
                { name: 'founded', type: 'number' },
                mediaField('logo'),
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                { name: 'email', type: 'email' },
                { name: 'phone', type: 'text' },
                { name: 'address', type: 'textarea' },
                {
                  name: 'city',
                  type: 'text',
                  admin: {
                    description: 'Mjesto (npr. "Popovača") — schema.org addressLocality.',
                  },
                },
                {
                  name: 'region',
                  type: 'text',
                  admin: {
                    description:
                      'Županija (npr. "Sisačko-moslavačka županija") — schema.org addressRegion.',
                  },
                },
                {
                  name: 'mapEmbedUrl',
                  type: 'text',
                  admin: {
                    description:
                      'Google/OpenStreetMap embed URL (src iz <iframe>) za prikaz lokacije na stranici kontakta.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'social',
              type: 'group',
              fields: [
                { name: 'facebook', type: 'text' },
                { name: 'youtube', type: 'text' },
                { name: 'webshop', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Payment',
          fields: [
            {
              name: 'payment',
              type: 'group',
              fields: [
                { name: 'iban', type: 'text' },
                { name: 'recipient', type: 'textarea' },
                { name: 'seasonTicketPrice', type: 'number' },
              ],
            },
          ],
        },
        {
          label: 'Legal',
          description: 'Pravni podaci o udruzi (Impressum, Politika privatnosti)',
          fields: [
            {
              name: 'legal',
              type: 'group',
              fields: [
                {
                  name: 'oib',
                  type: 'text',
                  admin: { description: 'OIB udruge (11 znamenki)' },
                },
                {
                  name: 'registryNumber',
                  type: 'text',
                  admin: { description: 'Registarski broj u Registru udruga RH' },
                },
                {
                  name: 'registryAuthority',
                  type: 'text',
                  admin: {
                    description:
                      'Nadležno tijelo upisa (npr. "Ured državne uprave u Sisačko-moslavačkoj županiji")',
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

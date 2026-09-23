import type { CollectionConfig, Condition, TextFieldSingleValidation } from 'payload'
import { CLUB_FEATURE_OPTIONS } from '@/lib/payload/clubFeatures'
import { isSuperAdmin, superAdminOnly, superAdminOnlyField, superAdminUI } from '../access/roles'
import { mediaField } from '../fields/media'
import type { Tenant } from '../payload-types'
import { parseClubOrigin } from '../lib/clubOrigin'
import { revalidateFrontend } from '../lib/revalidateFrontend'

/**
 * `siteUrl` mora biti https origin kluba (vidi `lib/clubOrigin`). Validacija ide
 * na svako spremanje Tenanta, i vlasnikovo, pa zatečena neispravna adresa ne
 * blokira spremanje polja koje on ne vidi; slanje je svejedno preskače.
 */
const validateSiteUrl: TextFieldSingleValidation = (value, { previousValue }) => {
  if (!value || value === previousValue) return true

  const parsed = parseClubOrigin(value)

  return parsed.ok ? true : parsed.reason
}

/**
 * `hns.matchPagePath` ide u poveznicu u objavljenoj novosti, pa ne smije nositi
 * host, upit ni fragment. Bez vrijednosti (i praznog stringa, kad se polje
 * očisti u adminu) cron uzima zadanu putanju.
 */
const validateMatchPagePath: TextFieldSingleValidation = (value) => {
  if (!value) return true

  if (!/^[a-z0-9/-]+$/.test(value)) {
    return 'Samo mala slova, brojevi, crtice i kose crte (npr. /raspored-i-rezultati).'
  }

  return true
}

/** UI-uvjet: prikaži samo Moslavcu (ili super-adminu) — druge klubove ne zanima. */
const moslavacOnlyUI: Condition<Tenant> = (data, _sibling, { user }) =>
  data?.slug === 'moslavac' || isSuperAdmin(user)

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: { singular: 'Postavke kluba', plural: 'Klubovi' },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'slug', 'active'],
    // Kolekcija ostaje vidljiva svima: skrivenoj kolekciji Payload vraća Not
    // Found i na edit ruti. Vlasnika kluba s liste preusmjerava
    // `admin/clubOwnerRedirect` prije renderiranja.
  },
  access: {
    read: () => true,
    create: superAdminOnly,
    // Multi-tenant plugin sužava update na korisnikov vlastiti tenant.
    update: ({ req: { user } }) => Boolean(user),
    delete: superAdminOnly,
  },
  // Tenants ne prolazi kroz `createCollection` (ima vlastiti access), pa
  // revalidaciju dobiva ovdje: promjena grba, naziva ili rubrika inače ostaje
  // nevidljiva na stranici do isteka cachea.
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        await revalidateFrontend({
          payload: req.payload,
          collectionSlug: 'tenants',
          tenant: doc.id,
        })

        return doc
      },
    ],
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
      access: { update: superAdminOnlyField },
      admin: {
        condition: superAdminUI,
        description: 'Tehnički identifikator kluba — ne mijenjati (razbija stranicu).',
      },
    },
    {
      name: 'siteUrl',
      label: 'URL stranice kluba',
      type: 'text',
      access: { update: superAdminOnlyField },
      validate: validateSiteUrl,
      admin: {
        condition: superAdminUI,
        description:
          'Npr. https://www.hnkslogamravince.com — na ovu adresu CMS javi da je sadržaj promijenjen, da se novost odmah vidi. Domena mora biti i u REVALIDATE_ALLOWED_HOSTS na CMS-u. Prazno = klub čeka istek cachea.',
      },
    },
    {
      name: 'active',
      label: 'Klub aktivan',
      type: 'checkbox',
      defaultValue: true,
      access: { update: superAdminOnlyField },
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
      // Samo platforma (super-admin) uključuje rubrike klubu; klub si ih ne dodjeljuje sam.
      access: { update: superAdminOnlyField },
      admin: {
        condition: superAdminUI,
        description: 'Rubrike koje klub koristi — određuje vidljivost kolekcija u adminu.',
      },
    },
    {
      name: 'hns',
      type: 'group',
      label: 'HNS integracija',
      // Pristup na grupi pokriva sva podpolja: Payload vlasnikov zapis odbaci i
      // zadrži spremljenu grupu.
      access: { update: superAdminOnlyField },
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
        {
          name: 'matchReports',
          label: 'Automatski izvještaji s utakmica',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Dnevni cron sam objavljuje novost za svaku odigranu seniorsku utakmicu. Objavljuje se bez pregleda — vidi docs/adr/0002.',
          },
        },
        {
          name: 'matchPagePath',
          label: 'Putanja do stranice utakmice',
          type: 'text',
          defaultValue: '/raspored-i-rezultati',
          validate: validateMatchPagePath,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.matchReports),
            description:
              'Rubrika s rasporedom na klupskom webu. Izvještaj dobiva poveznicu "Detalji utakmice" na <putanja>/<slug>.',
          },
        },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      label: 'Plaćanje (sezonska iskaznica)',
      admin: {
        condition: moslavacOnlyUI,
      },
      fields: [
        { name: 'iban', label: 'IBAN', type: 'text' },
        { name: 'recipient', label: 'Primatelj', type: 'textarea' },
        { name: 'seasonTicketPrice', label: 'Cijena sezonske (EUR)', type: 'number' },
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
                },
                {
                  name: 'region',
                  label: 'Županija',
                  type: 'text',
                },
                {
                  name: 'mapEmbedUrl',
                  type: 'text',
                  access: { update: superAdminOnlyField },
                  // Skriveno iz forme — nk-vrapce zadržava spremljenu vrijednost;
                  // ostali klubovi fallbackaju na koordinate stadiona.
                  admin: { hidden: true },
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
                { name: 'instagram', label: 'Instagram', type: 'text' },
                { name: 'youtube', label: 'YouTube', type: 'text' },
                { name: 'webshop', label: 'Web trgovina', type: 'text' },
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

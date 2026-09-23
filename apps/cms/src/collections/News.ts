import type { FieldHook } from 'payload'
import { createCollection } from '../factories/createCollection'
import { mediaArrayField, mediaField } from '../fields/media'
import { slugField } from '../fields/slug'
import { rawText, trimmedText } from '../lib/hookValues'

type LexicalNode = { text?: string; children?: LexicalNode[] }

/** Skupi sav tekst iz Lexical richText stabla u niz odlomaka. */
const collectText = (node: LexicalNode | undefined, out: string[]): void => {
  if (!node) return
  const text = rawText.safeParse(node.text)

  if (text.success) out.push(text.data)

  if (Array.isArray(node.children)) node.children.forEach((child) => collectText(child, out))
}

/**
 * Auto-sažetak: ako editor ne upiše Sažetak, izvedi ga iz prvih ~160 znakova
 * teksta (Tekst polje). Polje je skriveno — editor se time ne bavi, a kartice
 * novosti i SEO opis svejedno dobiju sažetak.
 */
const excerptFromContent: FieldHook = ({ value, data }) => {
  if (trimmedText.safeParse(value).success) return value
  const out: string[] = []
  // SAFETY: `data` u field hooku je netipiziran; `content` je richText stupac,
  // pa je njegovo stablo pod `root`. Nepoznat oblik samo daje prazan sažetak.
  collectText((data?.content as { root?: LexicalNode } | undefined)?.root, out)
  const text = out.join(' ').replace(/\s+/g, ' ').trim()

  if (!text) return value

  if (text.length <= 160) return text
  const cut = text.slice(0, 160)
  const lastSpace = cut.lastIndexOf(' ')

  return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`
}

export const News = createCollection({
  slug: 'news',
  labels: { singular: 'Novost', plural: 'Novosti' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'tenant'],
  },
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
    },
    slugField({ hidden: true }),
    {
      name: 'publishedAt',
      label: 'Datum objave',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    mediaField('thumbnail', { label: 'Naslovna slika' }),
    {
      name: 'content',
      label: 'Tekst',
      type: 'richText',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      // Skriveno — auto se popuni iz teksta (vidi excerptFromContent).
      admin: { hidden: true },
      hooks: {
        beforeValidate: [excerptFromContent],
      },
    },
    mediaArrayField('gallery', { label: 'Galerija' }),
    {
      name: 'sourceMatchId',
      label: 'HNS ID utakmice',
      type: 'number',
      index: true,
      // Skriveno — popunjava ga samo cron za izvještaje s utakmica, da istu
      // utakmicu ne objavi dvaput. Editor ga nema zašto vidjeti ni dirati.
      admin: { hidden: true },
    },
  ],
})

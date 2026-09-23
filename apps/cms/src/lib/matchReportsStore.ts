import type { Payload } from 'payload'
import { linkParagraph, paragraphsToLexical } from '@/lib/ai/lexical'
import type { MatchReportDraft, NewsStore } from '@/lib/match-reports/index'
import { slugify } from '../fields/slug'

const DEFAULT_MATCH_PAGE_PATH = '/raspored-i-rezultati'

/**
 * Putanja rubrike s utakmicama za poveznicu u izvještaju: s uvodnom kosom
 * crtom, bez one na kraju, da spajanje ne da "//". Prazna vrijednost (polje
 * očišćeno u adminu) uzima zadanu, jer bi "/" dao poveznicu "//<slug>".
 */
export function matchPageBasePath(matchPagePath: string | null | undefined): string {
  const trimmed = (matchPagePath ?? '').replace(/^\/+|\/+$/g, '')

  return trimmed ? `/${trimmed}` : DEFAULT_MATCH_PAGE_PATH
}

/**
 * Payload iza `NewsStore` sučelja. Testovi umjesto ovoga koriste `Map` — zato
 * šav i postoji.
 */
export function payloadNewsStore(
  payload: Payload,
  tenantId: number,
  matchPagePath: string | null | undefined,
): NewsStore {
  const basePath = matchPageBasePath(matchPagePath)

  return {
    async has(sourceMatchId) {
      const { totalDocs } = await payload.count({
        collection: 'news',
        where: {
          and: [
            { tenant: { equals: tenantId } },
            { sourceMatchId: { equals: sourceMatchId } },
          ],
        },
        overrideAccess: true,
      })

      return totalDocs > 0
    },

    async create(draft: MatchReportDraft) {
      await payload.create({
        collection: 'news',
        overrideAccess: true,
        data: {
          tenant: tenantId,
          title: draft.title,
          // HNS ID u slugu: dvije utakmice istih momčadi s istim rezultatom
          // (doma i u gostima 0:0) inače bi se borile za istu adresu.
          slug: `${slugify(draft.title)}-${draft.sourceMatchId}`,
          publishedAt: draft.publishedAt.toISOString(),
          content: paragraphsToLexical(draft.paragraphs, [
            linkParagraph(
              'Detalji utakmice',
              `${basePath}/${draft.matchSlug}`,
            ),
          ]),
          sourceMatchId: draft.sourceMatchId,
        },
      })
    },
  }
}

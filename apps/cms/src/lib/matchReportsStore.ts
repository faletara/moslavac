import type { Payload } from 'payload'
import { linkParagraph, paragraphsToLexical } from '@/lib/ai/lexical'
import type { MatchReportDraft, NewsStore } from '@/lib/match-reports/index'
import { slugify } from '../fields/slug'

/**
 * Payload iza `NewsStore` sučelja. Testovi umjesto ovoga koriste `Map` — zato
 * šav i postoji.
 */
export function payloadNewsStore(
  payload: Payload,
  tenantId: number,
  matchPagePath: string,
): NewsStore {
  // Bez uvodne kose crte i bez one na kraju, da spajanje ne da "//".
  const basePath = `/${matchPagePath.replace(/^\/+|\/+$/g, '')}`

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

import type { Endpoint, Payload, PayloadRequest } from 'payload'
import type {
  FallbackEvent,
  MatchReportWriter,
  PublishSummary,
} from '@/lib/match-reports/index'
import { matchesBearerSecret } from '@/lib/helpers/bearerSecret'
import { hnsDispatcher } from '../lib/hnsDispatcher'
import { payloadNewsStore } from '../lib/matchReportsStore'

/**
 * HNS fetcheri nose `server-only`, koji baci grešku čim ga učita bilo što izvan
 * Next runtimea — a `payload.config.ts` učitava i Payload CLI (`generate:types`,
 * `migrate`). Zato se modul uvlači tek unutar handlera, ne na vrhu datoteke.
 */
const loadMatchReports = () =>
  Promise.all([
    import('@/lib/match-reports/index'),
    import('@/lib/hns/context'),
  ])

/**
 * Cron zna samo za `CRON_SECRET`. Bez njega bi bilo tko mogao pokrenuti
 * generiranje i potrošiti kredit kod OpenAI-a.
 */
function isAuthorized(req: PayloadRequest): boolean {
  return matchesBearerSecret(
    req.headers.get('authorization'),
    process.env.CRON_SECRET,
  )
}

/**
 * Pisac za jedan tenant: model piše, provjera presuđuje, šablona hvata pad.
 * Bez `OPENAI_API_KEY` radi samo šablona — objava ne izostaje.
 *
 * `fallbacks` skuplja razloge pada da ih odgovor cron-a može vratiti. Bez toga
 * se iz odgovora ne vidi razlika između „model je napisao” i „model je pao”, a
 * Vercel logovi traže pristup dashboardu.
 */
function writerFor(
  reports: Awaited<ReturnType<typeof loadMatchReports>>[0],
  payload: Payload,
  slug: string,
  fallbacks: FallbackEvent[],
): MatchReportWriter {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) return reports.templateWriter

  return reports.withFallback(
    reports.openAiWriter({
      apiKey,
      model: process.env.OPENAI_MATCH_REPORT_MODEL,
    }),
    reports.templateWriter,
    (event) => {
      fallbacks.push(event)
      payload.logger.warn(
        { tenant: slug, ...event },
        'match-reports: pao na šablonu',
      )
    },
  )
}

async function handler(req: PayloadRequest): Promise<Response> {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { payload } = req
  const [reports, { runWithHnsContext }] = await loadMatchReports()

  const { docs } = await payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    where: { 'hns.matchReports': { equals: true } },
  })

  const results: Record<
    string,
    (PublishSummary & { fallbacks?: FallbackEvent[] }) | { error: string }
  > = {}

  for (const tenant of docs) {
    const slug = tenant.slug

    // Slug je ključ rezultata i cache tagova. Payload ga tipizira kao
    // neobavezan, pa tenant bez njega nema kamo upisati ishod — preskače se.
    if (!slug) continue

    const apiKey = tenant.hns?.apiKey
    const teamId = tenant.hns?.teamId

    if (!apiKey || !teamId) {
      results[slug] = { error: 'nedostaje hns.apiKey ili hns.teamId' }
      continue
    }

    const fallbacks: FallbackEvent[] = []

    try {
      const summary = await runWithHnsContext(
        {
          apiKey,
          teamId,
          seniorCompetitionFilter: tenant.hns?.seniorCompetitionFilter ?? null,
          dispatcher: hnsDispatcher,
        },
        () =>
          reports.publishMatchReports({
            writer: writerFor(reports, payload, slug, fallbacks),
            store: payloadNewsStore(payload, tenant.id, tenant.hns?.matchPagePath),
          }),
      )

      // Prazan niz znači da je model prošao provjeru na svakoj utakmici.
      results[slug] =
        fallbacks.length > 0 ? { ...summary, fallbacks } : summary
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      payload.logger.error({ tenant: tenant.slug, err: error }, 'match-reports')
      results[slug] = { error: message }
    }
  }

  return Response.json({ ranAt: new Date().toISOString(), results })
}

export const matchReportsCronEndpoint: Endpoint = {
  path: '/cron/match-reports',
  method: 'get',
  handler,
}

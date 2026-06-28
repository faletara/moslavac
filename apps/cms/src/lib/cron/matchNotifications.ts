import 'server-only'
import type { Payload } from 'payload'
import { runWithHnsContext } from '@/lib/hns/context'
import { fetchSeniorCompetition, fetchAllCompetitionMatches } from '@/lib/hns/competitions'
import { fetchMatchEvents } from '@/lib/hns/matches'
import { fetchTeamStandings } from '@/lib/hns/standings'
import { isFinished } from '@/lib/hns/matchStatus'
import type { HnsMatch, HnsMatchEvent } from '@/types/hns'
import { generateMatchReportDraft } from '@/lib/ai/matchReport'
import type {
  MatchReportCard,
  MatchReportScorer,
} from '@/lib/ai/matchReport'
import { paragraphsToLexical } from '@/lib/ai/lexical'
import { sendPushForTenant } from '@/lib/notify/push'
import { hnsDispatcher } from '@/lib/hnsDispatcher'

// Push the kickoff reminder when the match is between 55 and 65 minutes away,
// so a 30-minute cron reliably catches the window exactly once.
const REMINDER_MIN_MS = 55 * 60 * 1000
const REMINDER_MAX_MS = 65 * 60 * 1000

interface TenantRow {
  id: number
  slug: string
  displayName: string
  hns?: {
    apiKey?: string | null
    teamId?: string | null
    seniorCompetitionFilter?: string | null
  } | null
}

interface NotifiedRow {
  id: number
  reminderSent?: boolean | null
  resultPushSent?: boolean | null
  aiDraftCreated?: boolean | null
}

export interface CronSummary {
  tenants: number
  remindersSent: number
  resultsSent: number
  draftsCreated: number
}

function teamName(m: HnsMatch, side: 'home' | 'away'): string {
  return (side === 'home' ? m.homeTeam?.name : m.awayTeam?.name) ?? 'Nepoznato'
}

function score(m: HnsMatch, side: 'home' | 'away'): number {
  const result = side === 'home' ? m.homeTeamResult : m.awayTeamResult
  return result?.regular ?? result?.current ?? 0
}

function eventLabel(e: HnsMatchEvent): string {
  return (e.eventType?.name ?? e.eventType?.fcdName ?? '').toLowerCase()
}

// Best-effort extraction; the AI is instructed to ignore gaps and never invent.
function extractScorersAndCards(
  events: HnsMatchEvent[],
  homeName: string,
  awayName: string,
): { scorers: MatchReportScorer[]; cards: MatchReportCard[] } {
  const scorers: MatchReportScorer[] = []
  const cards: MatchReportCard[] = []

  for (const e of events) {
    const label = eventLabel(e)
    const player = e.player?.name
    if (!player) continue
    const team = e.homeTeam ? homeName : awayName
    const minute = e.minute ?? null

    if (label.includes('gol') || label.includes('goal')) {
      scorers.push({ player, team, minute })
    } else if (label.includes('crven') || label.includes('red')) {
      cards.push({ player, team, type: 'red', minute })
    } else if (label.includes('žut') || label.includes('zut') || label.includes('yellow')) {
      cards.push({ player, team, type: 'yellow', minute })
    }
  }

  return { scorers, cards }
}

async function getNotifiedRecord(
  payload: Payload,
  tenantId: number,
  hnsMatchId: number,
  label: string,
): Promise<NotifiedRow> {
  const found = await payload.find({
    collection: 'notified-matches',
    where: {
      and: [{ tenant: { equals: tenantId } }, { hnsMatchId: { equals: hnsMatchId } }],
    },
    limit: 1,
    overrideAccess: true,
  })
  if (found.docs[0]) return found.docs[0] as unknown as NotifiedRow
  return (await payload.create({
    collection: 'notified-matches',
    data: {
      tenant: tenantId,
      hnsMatchId,
      matchLabel: label,
      reminderSent: false,
      resultPushSent: false,
      aiDraftCreated: false,
    },
    overrideAccess: true,
  })) as unknown as NotifiedRow
}

async function setFlag(
  payload: Payload,
  id: number,
  flag: 'reminderSent' | 'resultPushSent' | 'aiDraftCreated',
): Promise<void> {
  await payload.update({
    collection: 'notified-matches',
    id,
    data: { [flag]: true },
    overrideAccess: true,
  })
}

async function createAiDraft(
  payload: Payload,
  tenant: TenantRow,
  match: HnsMatch,
  competitionName: string,
): Promise<boolean> {
  const homeName = teamName(match, 'home')
  const awayName = teamName(match, 'away')

  const [events, standings] = await Promise.all([
    match.id != null ? fetchMatchEvents({ matchId: match.id }) : Promise.resolve([]),
    match.competition?.id != null
      ? fetchTeamStandings({ competitionId: match.competition.id })
      : Promise.resolve([]),
  ])

  const { scorers, cards } = extractScorersAndCards(events, homeName, awayName)
  const ownRow = standings.find((r) => r.highlight)
  const ownName =
    ownRow?.team?.name ??
    (match.homeTeam?.id === Number(tenant.hns?.teamId) ? homeName : awayName)

  const draft = await generateMatchReportDraft({
    ownTeam: ownName,
    homeTeam: homeName,
    awayTeam: awayName,
    homeScore: score(match, 'home'),
    awayScore: score(match, 'away'),
    competitionName,
    round: match.round,
    scorers,
    cards,
    standing:
      ownRow?.position != null && ownRow?.points != null
        ? { position: ownRow.position, points: ownRow.points }
        : null,
  })

  if (!draft) return false

  // `draft: true` makes Payload set _status: 'draft'; the report stays hidden
  // from the public site until an admin publishes it.
  await payload.create({
    collection: 'news',
    data: {
      title: draft.title,
      excerpt: draft.paragraphs[0] ?? '',
      content: paragraphsToLexical(draft.paragraphs),
      tenant: tenant.id,
    },
    draft: true,
    overrideAccess: true,
  })

  return true
}

async function processTenant(
  payload: Payload,
  tenant: TenantRow,
  summary: CronSummary,
): Promise<void> {
  const apiKey = tenant.hns?.apiKey
  const teamId = tenant.hns?.teamId
  const seniorCompetitionFilter = tenant.hns?.seniorCompetitionFilter
  if (!apiKey || !teamId || !seniorCompetitionFilter) return

  await runWithHnsContext(
    { apiKey, teamId, seniorCompetitionFilter, dispatcher: hnsDispatcher },
    async () => {
      const senior = await fetchSeniorCompetition()
      if (!senior?.id) return

      const matches = await fetchAllCompetitionMatches({ competitionId: senior.id })
      const now = Date.now()

      for (const match of matches) {
        if (match.id == null) continue
        const homeName = teamName(match, 'home')
        const awayName = teamName(match, 'away')
        const label = `${homeName} – ${awayName}`
        const finished = isFinished(match)
        const kickoff = match.dateTimeUTC

        const needsReminder =
          !finished &&
          kickoff != null &&
          kickoff - now >= REMINDER_MIN_MS &&
          kickoff - now <= REMINDER_MAX_MS

        // Skip matches we have nothing to do for (avoids creating empty records).
        if (!needsReminder && !finished) continue

        const record = await getNotifiedRecord(payload, tenant.id, match.id, label)

        if (needsReminder && !record.reminderSent) {
          await sendPushForTenant(payload, tenant.id, {
            title: 'Utakmica uskoro!',
            body: `${label} — početak za sat vremena.`,
            url: '/utakmice',
            tag: `reminder-${match.id}`,
          })
          await setFlag(payload, record.id, 'reminderSent')
          summary.remindersSent++
        }

        if (finished && !record.resultPushSent) {
          await sendPushForTenant(payload, tenant.id, {
            title: 'Kraj utakmice',
            body: `${homeName} ${score(match, 'home')} : ${score(match, 'away')} ${awayName}`,
            url: '/utakmice',
            tag: `result-${match.id}`,
          })
          await setFlag(payload, record.id, 'resultPushSent')
          summary.resultsSent++
        }

        if (finished && !record.aiDraftCreated) {
          const created = await createAiDraft(payload, tenant, match, senior.name ?? '')
          if (created) {
            await setFlag(payload, record.id, 'aiDraftCreated')
            summary.draftsCreated++
          }
        }
      }
    },
  )
}

/** Iterira sve aktivne tenante i obrađuje najave / rezultate / AI nацrte. */
export async function runMatchNotifications(payload: Payload): Promise<CronSummary> {
  const summary: CronSummary = {
    tenants: 0,
    remindersSent: 0,
    resultsSent: 0,
    draftsCreated: 0,
  }

  const tenants = await payload.find({
    collection: 'tenants',
    where: { active: { equals: true } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  for (const doc of tenants.docs) {
    const tenant = doc as unknown as TenantRow
    summary.tenants++
    try {
      await processTenant(payload, tenant, summary)
    } catch (err) {
      payload.logger.error(`[cron] tenant ${tenant.slug} failed: ${String(err)}`)
    }
  }

  return summary
}

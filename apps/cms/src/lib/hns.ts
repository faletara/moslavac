import type { HnsTeamPlayer, PlayerSearchResult } from '@/types/hns'
import { adaptPlayerSearchResult } from '@/lib/hns/adapters'
import { z } from 'zod'
import { hnsDispatcher } from './hnsDispatcher'

/**
 * Node-ov `fetch` (undici ispod haube) prima `dispatcher`, ali ga standardni
 * `RequestInit` ne opisuje. Imenovani ugovor je ovdje umjesto `as object`.
 */
interface UndiciRequestInit extends RequestInit {
  dispatcher?: typeof hnsDispatcher
}

/** Straničena ovojnica HNS-ove pretrage; stavke ostaju neraščlanjene. */
const searchEnvelope = z.object({
  result: z
    .array(z.unknown())
    .nullish()
    .transform((rows) => rows ?? []),
})

const HNS_API_BASE = process.env.HNS_API_BASE ?? 'https://api-hns.analyticom.de'

interface HnsPaginated<T> {
  result: T[]
  size: number
}

export async function searchHnsPlayers(args: {
  apiKey: string
  teamId: string
  keyword: string
  pageSize?: number
}): Promise<PlayerSearchResult[]> {
  const { apiKey, teamId, keyword, pageSize = 20 } = args
  const trimmed = keyword.trim()

  if (!trimmed) return []

  const url =
    `${HNS_API_BASE}/api/live/player/search` +
    `?keyword=${encodeURIComponent(trimmed)}` +
    `&page=0&pageSize=${pageSize}` +
    `&teamIdFilter=${encodeURIComponent(teamId)}`

  const init: UndiciRequestInit = {
    headers: {
      API_KEY: apiKey,
      'Accept-Language': 'hr',
      Accept: 'application/json',
      'User-Agent': 'moslavac-cms/1.0',
    },
    dispatcher: hnsDispatcher,
  }

  const response = await fetch(url, init)

  if (!response.ok) {
    throw new Error(
      `HNS player search failed (${response.status} ${response.statusText})`,
    )
  }

  // Ovojnica je jedino o čemu ovaj kod odlučuje; oblik igrača propisuje
  // HNS-ova OpenAPI specifikacija iz koje je generiran `hns.openapi.ts`.
  const body = searchEnvelope.parse(await response.json())

  return body.result.flatMap((player) => {
    // SAFETY: redak dolazi iz HNS-ove `player/search` rute, čiji oblik opisuje
    // `HnsTeamPlayer` u generiranoj specifikaciji.
    const adapted = adaptPlayerSearchResult(player as HnsTeamPlayer)

    return adapted === null ? [] : [adapted]
  })
}

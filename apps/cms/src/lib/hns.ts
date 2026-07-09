import type { HnsTeamPlayer, PlayerSearchResult } from '@/types/hns'
import { adaptPlayerSearchResult } from '@/lib/hns/adapters'
import { hnsDispatcher } from './hnsDispatcher'

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

  const response = await fetch(url, {
    headers: {
      API_KEY: apiKey,
      'Accept-Language': 'hr',
      Accept: 'application/json',
      'User-Agent': 'moslavac-cms/1.0',
    },
    // dispatcher is supported by Node's native fetch (undici under the hood)
    // but missing from RequestInit types
    ...({ dispatcher: hnsDispatcher } as object),
  })

  if (!response.ok) {
    throw new Error(
      `HNS player search failed (${response.status} ${response.statusText})`,
    )
  }

  const data = (await response.json()) as HnsPaginated<HnsTeamPlayer>

  return (data.result ?? [])
    .map((player) => adaptPlayerSearchResult(player))
    .filter((player): player is PlayerSearchResult => player !== null)
}

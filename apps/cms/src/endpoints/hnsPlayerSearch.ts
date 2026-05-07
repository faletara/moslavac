import type { Endpoint, PayloadRequest } from 'payload'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { searchHnsPlayers } from '../lib/hns'

interface TenantHnsConfig {
  hns?: {
    apiKey?: string | null
    teamId?: string | null
  } | null
}

async function handler(req: PayloadRequest): Promise<Response> {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const keyword = (req.searchParams.get('keyword') ?? '').trim()
  if (keyword.length < 2) {
    return Response.json([])
  }

  const idType = req.payload.db.defaultIDType
  const tenantId = getTenantFromCookie(req.headers, idType)
  if (!tenantId) {
    return Response.json(
      { error: 'No tenant selected. Pick a tenant in the admin top bar.' },
      { status: 400 },
    )
  }

  const tenant = (await req.payload.findByID({
    collection: 'tenants',
    id: tenantId,
    depth: 0,
    overrideAccess: false,
    user: req.user,
  })) as TenantHnsConfig | null

  const apiKey = tenant?.hns?.apiKey
  const teamId = tenant?.hns?.teamId
  if (!apiKey || !teamId) {
    return Response.json(
      { error: 'Tenant missing HNS apiKey or teamId' },
      { status: 400 },
    )
  }

  try {
    const players = await searchHnsPlayers({ apiKey, teamId, keyword })
    return Response.json(players)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'HNS search failed'
    const cause =
      err instanceof Error && err.cause instanceof Error
        ? `${err.cause.name}: ${err.cause.message}`
        : err instanceof Error && err.cause
          ? String(err.cause)
          : null
    req.payload.logger.error(
      { err, cause },
      `HNS player search failed for keyword=${keyword}`,
    )
    return Response.json(
      { error: message, cause: cause ?? undefined },
      { status: 502 },
    )
  }
}

export const hnsPlayerSearchEndpoint: Endpoint = {
  path: '/hns-players/search',
  method: 'get',
  handler,
}

import { isProduction } from './isProduction'

/** Lokalni CMS (`pnpm dev` sluša na 43102). */
const DEV_ORIGIN = 'http://localhost:43102'

/** `NEXT_PHASE` dok `next build` učitava config; env tada još nije runtime. */
const BUILD_PHASE = 'phase-production-build'

export type AdminOriginEnv = Partial<
  Record<
    | 'PAYLOAD_SERVER_URL'
    | 'VERCEL_BRANCH_URL'
    | 'VERCEL_URL'
    | 'VERCEL_PROJECT_PRODUCTION_URL'
    | 'NODE_ENV'
    | 'NEXT_PHASE',
    string
  >
>

export type AdminOrigins = {
  /** Payload `serverURL`: prvi pronađeni origin. */
  serverURL: string
  /** Payload `csrf`: svi originsi s kojih admin smije slati auth cookie. */
  csrf: string[]
}

const DEV_ORIGINS: AdminOrigins = { serverURL: DEV_ORIGIN, csrf: [DEV_ORIGIN] }

/** Vercel postavlja samo host, bez sheme. */
const vercelHost = (host: string | undefined) =>
  host?.trim() ? `https://${host.trim()}` : undefined

function parseOrigin(name: string, raw: string, production: boolean): string {
  let url: URL

  try {
    url = new URL(raw)
  } catch {
    throw new Error(`${name} is not a valid URL: ${raw}`)
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`${name} must be http(s): ${raw}`)
  }

  if (production && url.protocol !== 'https:') {
    throw new Error(`${name} must be https in production: ${raw}`)
  }

  return url.origin
}

/**
 * Originsi admina, redom: `PAYLOAD_SERVER_URL`, pa Vercelovi `VERCEL_BRANCH_URL`,
 * `VERCEL_URL` i `VERCEL_PROJECT_PRODUCTION_URL` (preview ih dobije sam).
 * Payload prihvaća auth cookie samo sa zahtjeva s nekog od njih.
 *
 * Bez ijednog origina produkcijski runtime pada odmah: tihi fallback na
 * localhost ostavio bi admin bez prijave. `next build` nikad ne pada — tada
 * env još nije onaj s kojim će se aplikacija pokrenuti.
 */
export function resolveAdminOrigins(env: AdminOriginEnv): AdminOrigins {
  const production = isProduction(env)
  const building = env.NEXT_PHASE === BUILD_PHASE

  const candidates: [string, string | undefined][] = [
    ['PAYLOAD_SERVER_URL', env.PAYLOAD_SERVER_URL?.trim()],
    ['VERCEL_BRANCH_URL', vercelHost(env.VERCEL_BRANCH_URL)],
    ['VERCEL_URL', vercelHost(env.VERCEL_URL)],
    ['VERCEL_PROJECT_PRODUCTION_URL', vercelHost(env.VERCEL_PROJECT_PRODUCTION_URL)],
  ]

  let origins: string[]

  try {
    origins = candidates.flatMap(([name, raw]) =>
      raw ? [parseOrigin(name, raw, production)] : [],
    )
  } catch (error) {
    if (building) return DEV_ORIGINS

    throw error
  }

  const csrf = [...new Set(origins)]

  if (csrf.length === 0) {
    if (production && !building) {
      throw new Error(
        'PAYLOAD_SERVER_URL (or a Vercel URL) env var is required in production',
      )
    }

    return DEV_ORIGINS
  }

  return { serverURL: csrf[0], csrf }
}

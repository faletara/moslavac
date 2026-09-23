/** Lokalni CMS (`pnpm dev` sluša na 43102). */
const DEV_ORIGIN = 'http://localhost:43102'

type Env = Partial<Record<'PAYLOAD_SERVER_URL' | 'NODE_ENV', string>>

/**
 * Origin admina iz `PAYLOAD_SERVER_URL`. Payload ga koristi kao `serverURL` i
 * kao jedini `csrf` origin: auth cookie vrijedi samo za zahtjeve s tog origina.
 *
 * U produkciji je varijabla obavezna i mora biti https. Tihi fallback na
 * localhost bi admin ostavio bez prijave (cookie s pravog origina bi se
 * odbijao), pa je bolje da deploy padne odmah.
 */
export function resolveAdminOrigin(env: Env): string {
  const isProduction = env.NODE_ENV === 'production'
  const raw = env.PAYLOAD_SERVER_URL?.trim()

  if (!raw) {
    if (isProduction) {
      throw new Error('PAYLOAD_SERVER_URL env var is required in production')
    }

    return DEV_ORIGIN
  }

  let url: URL

  try {
    url = new URL(raw)
  } catch {
    throw new Error(`PAYLOAD_SERVER_URL is not a valid URL: ${raw}`)
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`PAYLOAD_SERVER_URL must be http(s): ${raw}`)
  }

  if (isProduction && url.protocol !== 'https:') {
    throw new Error(`PAYLOAD_SERVER_URL must be https in production: ${raw}`)
  }

  return url.origin
}

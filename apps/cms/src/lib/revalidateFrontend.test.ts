import type { Payload } from 'payload'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Tenant } from '../payload-types'
import { type RevalidatePayload, revalidateFrontend } from './revalidateFrontend'

/**
 * Tajna kluba `club-a` uz glavnu tajnu `dummy-master`, izračunata izvan koda:
 * `printf %s club-a | openssl dgst -sha256 -hmac dummy-master`
 */
const CLUB_A_SECRET = 'a7b646824599f1f14793c8deb7546f1f4086e6789b1f3fbe8024722ae6cd0897'

type SentRequest = { url: string; init: RequestInit | undefined }

let sent: SentRequest[] = []

const tenantDoc = (siteUrl: string | null): Tenant => ({
  id: 1,
  displayName: 'Club A',
  slug: 'club-a',
  siteUrl,
  hns: { apiKey: 'dummy', teamId: '1' },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

const fakePayload = (doc: Tenant): RevalidatePayload => ({
  // SAFETY: revalidateFrontend traži samo tenant po ID-ju, a ovo je taj tenant.
  findByID: (async () => doc) as Payload['findByID'],
  logger: { error: () => undefined, warn: () => undefined },
})

const revalidate = (siteUrl: string | null) =>
  revalidateFrontend({
    payload: fakePayload(tenantDoc(siteUrl)),
    collectionSlug: 'news',
    tenant: 1,
  })

beforeEach(() => {
  sent = []
  vi.stubEnv('REVALIDATE_SECRET', 'dummy-master')
  vi.stubEnv('REVALIDATE_ALLOWED_HOSTS', 'club-a.example, www.club-b.example')
  vi.stubGlobal('fetch', async (url: string | URL, init?: RequestInit) => {
    sent.push({ url: String(url), init })

    return new Response('{}', { status: 200 })
  })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('revalidateFrontend', () => {
  it('posts once to the allowlisted club origin, without following redirects', async () => {
    await revalidate('https://club-a.example')

    expect(sent).toHaveLength(1)
    expect(sent[0].url).toBe('https://club-a.example/api/revalidate')
    expect(sent[0].init?.method).toBe('POST')
    expect(sent[0].init?.redirect).toBe('manual')
    expect(sent[0].init?.body).toBe(JSON.stringify({ tags: ['news-club-a'] }))
  })

  it("sends the club's own secret, not the CMS secret", async () => {
    await revalidate('https://club-a.example')

    expect(new Headers(sent[0].init?.headers).get('authorization')).toBe(
      `Bearer ${CLUB_A_SECRET}`,
    )
  })

  it('accepts a trailing slash on the stored origin', async () => {
    await revalidate('https://www.club-b.example/')

    expect(sent.map((request) => request.url)).toEqual([
      'https://www.club-b.example/api/revalidate',
    ])
  })

  it.each([
    ['loopback', 'http://127.0.0.1:8080'],
    ['loopback over https', 'https://localhost'],
    ['loopback with a trailing dot', 'https://localhost.'],
    ['a host outside the allowlist', 'https://attacker.example'],
    ['plain http', 'http://club-a.example'],
    ['a path', 'https://club-a.example/direct'],
    ['a fragment hiding the path', 'https://club-a.example/direct#'],
    ['a query', 'https://club-a.example?x=1'],
    ['credentials', 'https://user:pass@club-a.example'],
    ['a port', 'https://club-a.example:8443'],
    ['garbage', 'not a url'],
  ])('sends nothing for %s', async (_case, siteUrl) => {
    await revalidate(siteUrl)

    expect(sent).toEqual([])
  })

  it('sends nothing when the allowlist is not configured', async () => {
    vi.stubEnv('REVALIDATE_ALLOWED_HOSTS', '')

    await revalidate('https://club-a.example')

    expect(sent).toEqual([])
  })
})

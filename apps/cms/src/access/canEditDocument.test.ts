import type { Access, PayloadRequest, Where } from 'payload'
import { describe, expect, it } from 'vitest'
import { canEditDocument } from './canEditDocument'

type FakeUser = { id: number; collection: string; tenantIds: number[] }

type TenantWhere = { tenant?: { in: number[] } }

type LogEntry = { err: unknown }

// Vijest kluba B (tenant 2), jedini dokument u "bazi".
const clubBNews = { id: 7, tenant: 2 }

/**
 * Lažni Payload s kolekcijom `news`. Uz `req` vraća i što je provjera
 * dotaknula: upite nad bazom i zapisane greške.
 */
const fakePayload = (
  user: FakeUser,
  // Update access kakav multi-tenant plugin daje tenant kolekciji.
  update: Access = () => ({ tenant: { in: user.tenantIds } }),
) => {
  const counts: Where[] = []

  const loggedErrors: LogEntry[] = []

  // SAFETY: lažni req nosi samo ono što `canEditDocument` čita: korisnika,
  // update access kolekcije, `count` i logger.
  // oxlint-disable-next-line anti-slop/no-chained-type-assertions -- vidi SAFETY
  const req = {
    user,
    payload: {
      collections: { news: { config: { access: { update } } } },
      logger: { error: (entry: LogEntry, _msg: string) => loggedErrors.push(entry) },
      // Evaluira `{ and: [{ id }, tenant upit] }` nad jedinim dokumentom.
      count: async ({ where }: { where: { and: [{ id: { equals: unknown } }, TenantWhere] } }) => {
        counts.push(where)

        const [{ id }, { tenant }] = where.and

        const matches = id.equals === clubBNews.id && Boolean(tenant?.in.includes(clubBNews.tenant))

        return { totalDocs: matches ? 1 : 0 }
      },
    },
  } as unknown as PayloadRequest

  return { req, counts, loggedErrors }
}

const adminA: FakeUser = { id: 2, collection: 'users', tenantIds: [1] }

const adminB: FakeUser = { id: 3, collection: 'users', tenantIds: [2] }

describe('canEditDocument', () => {
  it("denies a tenant-admin another club's document", async () => {
    const { req } = fakePayload(adminA)

    expect(await canEditDocument({ collectionSlug: 'news', id: clubBNews.id, req })).toBe(false)
  })

  it("allows the club's own tenant-admin to edit its document", async () => {
    const { req } = fakePayload(adminB)

    expect(await canEditDocument({ collectionSlug: 'news', id: clubBNews.id, req })).toBe(true)
  })

  it('denies a document that does not exist', async () => {
    const { req } = fakePayload(adminB)

    expect(await canEditDocument({ collectionSlug: 'news', id: 999, req })).toBe(false)
  })

  it('denies a collection that does not exist, including inherited keys', async () => {
    const { req } = fakePayload(adminB)

    expect(await canEditDocument({ collectionSlug: 'events', id: clubBNews.id, req })).toBe(false)

    expect(await canEditDocument({ collectionSlug: 'constructor', id: clubBNews.id, req })).toBe(
      false,
    )
  })

  it('denies malformed input without querying', async () => {
    const { req, counts } = fakePayload(adminB)

    expect(await canEditDocument({ collectionSlug: 'news', id: { in: [7] }, req })).toBe(false)

    expect(await canEditDocument({ collectionSlug: ['news'], id: clubBNews.id, req })).toBe(false)

    expect(await canEditDocument({ collectionSlug: 'news', id: '7 or 1', req })).toBe(false)

    expect(counts).toEqual([])
  })

  it('accepts a numeric string ID', async () => {
    const { req } = fakePayload(adminB)

    expect(await canEditDocument({ collectionSlug: 'news', id: '7', req })).toBe(true)
  })

  it('answers a boolean access result without querying', async () => {
    const allowed = fakePayload(adminA, () => true)

    const denied = fakePayload(adminB, () => false)

    expect(await canEditDocument({ collectionSlug: 'news', id: 999, req: allowed.req })).toBe(true)

    expect(
      await canEditDocument({ collectionSlug: 'news', id: clubBNews.id, req: denied.req }),
    ).toBe(false)

    expect([...allowed.counts, ...denied.counts]).toEqual([])
  })

  it('denies and logs when the check itself fails', async () => {
    const { req, loggedErrors } = fakePayload(adminB, () => {
      throw new Error('db down')
    })

    expect(await canEditDocument({ collectionSlug: 'news', id: clubBNews.id, req })).toBe(false)

    expect(loggedErrors).toHaveLength(1)
  })
})

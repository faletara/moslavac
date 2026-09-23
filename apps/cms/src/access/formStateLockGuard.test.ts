import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'
import { guardFormStateLocking } from './formStateLockGuard'

type FakeUser = { id: number; collection: string; tenantIds: number[] }

type TenantWhere = { tenant?: { in: number[] } }

// Vijest kluba B (tenant 2), jedini dokument u "bazi".
const clubBNews = { id: 7, tenant: 2 }

/**
 * Lažni Payload s kolekcijom `news` čiji update access vraća tenant upit, kao
 * multi-tenant plugin. Uz `req` vraća i koliko je puta provjera pitala bazu.
 */
const fakePayload = (user: FakeUser) => {
  const lookups: number[] = []

  // SAFETY: lažni req nosi samo ono što `canAccessAdmin` i `canEditDocument`
  // čitaju: korisnika, admin kolekciju, update access kolekcije i `count`.
  // oxlint-disable-next-line anti-slop/no-chained-type-assertions -- vidi SAFETY
  const req = {
    user,
    payload: {
      config: { admin: { user: 'users' } },
      collections: {
        news: { config: { access: { update: () => ({ tenant: { in: user.tenantIds } }) } } },
      },
      count: async ({ where }: { where: { and: [{ id: { equals: number } }, TenantWhere] } }) => {
        const [{ id }, { tenant }] = where.and

        lookups.push(id.equals)

        const matches = id.equals === clubBNews.id && Boolean(tenant?.in.includes(clubBNews.tenant))

        return { totalDocs: matches ? 1 : 0 }
      },
    },
  } as unknown as PayloadRequest

  return { req, lookups }
}

const adminA: FakeUser = { id: 2, collection: 'users', tenantIds: [1] }

const adminB: FakeUser = { id: 3, collection: 'users', tenantIds: [2] }

// Korisnik iz kolekcije koja nije admin kolekcija; `canAccessAdmin` ga odbija.
const outsider: FakeUser = { id: 4, collection: 'members', tenantIds: [2] }

describe('guardFormStateLocking', () => {
  const formStateArgs = (req: PayloadRequest) => ({
    collectionSlug: 'news',
    id: clubBNews.id,
    operation: 'update',
    req,
    returnLockStatus: true,
    updateLastEdited: true,
  })

  /** Payloadov handler u malom: bilježi argumente s kojima ga je omotač pozvao. */
  const recordingHandler = () => {
    const calls: Array<ReturnType<typeof formStateArgs>> = []

    const handler = async (args: ReturnType<typeof formStateArgs>) => {
      calls.push(args)

      return 'state'
    }

    return { calls, handler }
  }

  it("builds another club's form state without creating or renewing a lock", async () => {
    const { calls, handler } = recordingHandler()

    const args = formStateArgs(fakePayload(adminA).req)

    expect(await guardFormStateLocking(handler)(args)).toBe('state')

    expect(calls).toEqual([{ ...args, returnLockStatus: false, updateLastEdited: false }])
  })

  it('leaves locking on for a user who may edit the document', async () => {
    const { calls, handler } = recordingHandler()

    const args = formStateArgs(fakePayload(adminB).req)

    await guardFormStateLocking(handler)(args)

    expect(calls).toEqual([args])
  })

  it('leaves a caller without admin access to the handler without reading the document', async () => {
    const { calls, handler } = recordingHandler()

    const { req, lookups } = fakePayload(outsider)

    const args = formStateArgs(req)

    await guardFormStateLocking(handler)(args)

    expect(lookups).toEqual([])

    expect(calls).toEqual([args])
  })
})

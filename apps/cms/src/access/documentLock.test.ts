import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'
import { canLockDocument, guardFormStateLocking } from './documentLock'

type FakeUser = { id: number; tenantIds: number[] }

// Vijest kluba B (tenant 2). Update access vraća tenant upit, kao multi-tenant plugin.
const clubBNews = { id: 7, tenant: 2 }

type TenantWhere = { tenant?: { in: number[] } }

const fakeReq = (user: FakeUser): PayloadRequest => {
  const news = {
    config: {
      slug: 'news',
      fields: [],
      access: {
        update: ({ req }: { req: { user: FakeUser } }): TenantWhere => ({
          tenant: { in: req.user.tenantIds },
        }),
      },
    },
  }

  // SAFETY: lažni req nosi samo ono što `docAccessOperation` čita za kolekciju
  // bez polja: korisnika, kolekciju, `findByID` i `db.count`. Pravi
  // `PayloadRequest` traži inicijaliziran Payload s bazom, a test namjerno
  // pušta pravi `docAccessOperation` da evaluira tenant upit.
  // oxlint-disable-next-line anti-slop/no-chained-type-assertions -- vidi SAFETY
  return {
    user,
    payload: {
      collections: { news },
      findByID: async ({ id }: { id: number }) => {
        if (id !== clubBNews.id) throw new Error('Not Found')

        return clubBNews
      },
      db: {
        // Evaluira tenant upit nad jedinim dokumentom u "bazi".
        count: async ({ where }: { where: { and: TenantWhere[] } }) => {
          const allowed = where.and.find((w) => w.tenant)?.tenant?.in ?? []

          return { totalDocs: allowed.includes(clubBNews.tenant) ? 1 : 0 }
        },
      },
    },
  } as unknown as PayloadRequest
}

const adminA: FakeUser = { id: 2, tenantIds: [1] }

const adminB: FakeUser = { id: 3, tenantIds: [2] }

describe('canLockDocument', () => {
  it("denies a tenant-admin a lock on another club's document", async () => {
    const req = fakeReq(adminA)

    expect(await canLockDocument({ collectionSlug: 'news', id: clubBNews.id, req })).toBe(false)
  })

  it("allows the club's own tenant-admin to lock its document", async () => {
    const req = fakeReq(adminB)

    expect(await canLockDocument({ collectionSlug: 'news', id: clubBNews.id, req })).toBe(true)
  })

  it('denies a lock on a document that does not exist', async () => {
    const req = fakeReq(adminB)

    expect(await canLockDocument({ collectionSlug: 'news', id: 999, req })).toBe(false)
  })

  it('denies a lock on a collection that does not exist', async () => {
    const req = fakeReq(adminB)

    expect(await canLockDocument({ collectionSlug: 'constructor', id: clubBNews.id, req })).toBe(
      false,
    )
  })
})

describe('guardFormStateLocking', () => {
  const lockRequest = (req: PayloadRequest) => ({
    collectionSlug: 'news',
    id: clubBNews.id,
    operation: 'update',
    req,
    returnLockStatus: true,
    updateLastEdited: true,
  })

  /** Payloadov handler u malom: bilježi argumente s kojima ga je omotač pozvao. */
  const recordingHandler = () => {
    const calls: Array<ReturnType<typeof lockRequest>> = []

    const handler = async (args: ReturnType<typeof lockRequest>) => {
      calls.push(args)

      return 'state'
    }

    return { calls, handler }
  }

  it("builds another club's form state without creating or renewing a lock", async () => {
    const { calls, handler } = recordingHandler()

    const args = lockRequest(fakeReq(adminA))

    expect(await guardFormStateLocking(handler)(args)).toBe('state')

    expect(calls).toEqual([{ ...args, returnLockStatus: false, updateLastEdited: false }])
  })

  it('leaves locking on for a user who may edit the document', async () => {
    const { calls, handler } = recordingHandler()

    const args = lockRequest(fakeReq(adminB))

    await guardFormStateLocking(handler)(args)

    expect(calls).toEqual([args])
  })
})

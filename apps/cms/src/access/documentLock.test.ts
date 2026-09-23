import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'
import { canLockDocument, guardFormStateLocking } from './documentLock'

type FakeUser = { id: number; collection: string; tenantIds: number[] }

type TenantWhere = { tenant?: { in: number[] } }

type LogEntry = { err: Error }

// Vijest kluba B (tenant 2). Update access vraća tenant upit, kao multi-tenant plugin.
const clubBNews = { id: 7, tenant: 2 }

/**
 * Lažni Payload za jednu kolekciju bez polja. Uz `req` vraća i što je
 * provjera dotaknula: dohvaćene dokumente i zapisane greške.
 */
const fakePayload = (user: FakeUser) => {
  const lookups: number[] = []

  const loggedErrors: LogEntry[] = []

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

  // SAFETY: lažni req nosi samo ono što `canAccessAdmin` i `docAccessOperation`
  // čitaju za kolekciju bez polja: korisnika, admin kolekciju, kolekciju,
  // `findByID`, `db.count` i logger. Pravi `PayloadRequest` traži inicijaliziran
  // Payload s bazom, a test namjerno pušta pravi `docAccessOperation` da
  // evaluira tenant upit.
  // oxlint-disable-next-line anti-slop/no-chained-type-assertions -- vidi SAFETY
  const req = {
    user,
    payload: {
      config: { admin: { user: 'users' } },
      collections: { news },
      logger: { error: (entry: LogEntry, _msg: string) => loggedErrors.push(entry) },
      findByID: async ({ id }: { id: number }) => {
        lookups.push(id)

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

  return { req, lookups, loggedErrors }
}

const adminA: FakeUser = { id: 2, collection: 'users', tenantIds: [1] }

const adminB: FakeUser = { id: 3, collection: 'users', tenantIds: [2] }

// Korisnik iz kolekcije koja nije admin kolekcija; `canAccessAdmin` ga odbija.
const outsider: FakeUser = { id: 4, collection: 'members', tenantIds: [2] }

describe('canLockDocument', () => {
  it("denies a tenant-admin a lock on another club's document", async () => {
    const { req } = fakePayload(adminA)

    expect(await canLockDocument({ collectionSlug: 'news', id: clubBNews.id, req })).toBe(false)
  })

  it("allows the club's own tenant-admin to lock its document", async () => {
    const { req } = fakePayload(adminB)

    expect(await canLockDocument({ collectionSlug: 'news', id: clubBNews.id, req })).toBe(true)
  })

  it('denies and logs a lock on a document that does not exist', async () => {
    const { req, loggedErrors } = fakePayload(adminB)

    expect(await canLockDocument({ collectionSlug: 'news', id: 999, req })).toBe(false)

    expect(loggedErrors).toHaveLength(1)
  })

  it('denies a lock on a collection that does not exist', async () => {
    const { req } = fakePayload(adminB)

    expect(await canLockDocument({ collectionSlug: 'constructor', id: clubBNews.id, req })).toBe(
      false,
    )
  })
})

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

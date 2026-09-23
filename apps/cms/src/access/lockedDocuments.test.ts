import { isDeepStrictEqual } from 'node:util'
import {
  type Access,
  Forbidden,
  type Payload,
  type PayloadRequest,
  type Where,
} from 'payload'
import { describe, expect, it } from 'vitest'
import type { User } from '../payload-types'
import {
  bindLockToEditor,
  ownLocksOnly,
  withBoundDocumentLocks,
} from './lockedDocuments'

/** Korisnik iz baze; access i hook čitaju samo `id`, `collection` i `roles`. */
const asUser = (id: number, roles: User['roles']): User => ({
  id,
  collection: 'users',
  roles,
  email: `user${id}@moslavac.hr`,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

const superAdmin = asUser(1, ['super-admin'])

const clubAdmin = asUser(7, ['tenant-admin'])

/** Vijest 10 pripada klubu admina (tenant 3), vijest 20 tuđem klubu. */
const CLUB_NEWS_IDS = [10]

/**
 * Update access kakav multi-tenant plugin daje tenant kolekciji: Where koji
 * sužava na dokumente korisnikova kluba.
 */
const tenantScopedUpdate: Access = () => ({ tenant: { in: [3] } })

/** Upit kojim provjera traži vijest `id` unutar kluba iz `tenantScopedUpdate`. */
const clubNewsQuery = (id: number): Where => ({
  and: [{ id: { equals: id } }, { tenant: { in: [3] } }],
})

const fakeReq = (user: User | null, update: Access = tenantScopedUpdate) =>
  // SAFETY: dvojnik nosi samo `user`, `payload.collections` i `payload.count`,
  // jedino što access i hook čitaju sa zahtjeva.
  ({
    user,
    payload: {
      collections: { news: { config: { access: { update } } } },
      count: async ({ where }: Parameters<Payload['count']>[0]) => ({
        totalDocs: CLUB_NEWS_IDS.some((id) =>
          isDeepStrictEqual(where, clubNewsQuery(id)),
        )
          ? 1
          : 0,
      }),
    },
  }) as PayloadRequest

/** Ulaz hooka kakav stiže iz zahtjeva, prije validacije polja. */
type LockData = Parameters<typeof bindLockToEditor>[0]['data']

const lockOn = (value: number): LockData => ({
  document: { relationTo: 'news', value },
})

const runHook = (data: LockData, req: PayloadRequest, originalDoc?: LockData) =>
  bindLockToEditor(
    // SAFETY: hook čita samo `data`, `originalDoc` i `req`; ostali argumenti
    // Payloadovog poziva ga ne zanimaju.
    {
      data,
      originalDoc,
      req,
      operation: originalDoc ? 'update' : 'create',
    } as Parameters<typeof bindLockToEditor>[0],
  )

describe('ownLocksOnly', () => {
  it('lets the platform see every lock', () => {
    expect(ownLocksOnly({ req: fakeReq(superAdmin) })).toBe(true)
  })

  it('narrows a club admin to the locks they hold', () => {
    expect(ownLocksOnly({ req: fakeReq(clubAdmin) })).toEqual({
      'user.relationTo': { equals: 'users' },
      'user.value': { equals: 7 },
    })
  })

  it('refuses anonymous requests', () => {
    expect(ownLocksOnly({ req: fakeReq(null) })).toBe(false)
  })
})

describe('bindLockToEditor', () => {
  it('locks a document of the admin’s own club in their name', async () => {
    const data = await runHook(lockOn(10), fakeReq(clubAdmin))

    expect(data.user).toEqual({ relationTo: 'users', value: 7 })
  })

  it('never attributes a lock to someone else', async () => {
    const data = await runHook(
      { ...lockOn(10), user: { relationTo: 'users', value: 99 } },
      fakeReq(clubAdmin),
    )

    expect(data.user).toEqual({ relationTo: 'users', value: 7 })
  })

  it('accepts a populated document relation', async () => {
    const news = { relationTo: 'news', value: { id: 10 } }
    const data = await runHook({ document: news }, fakeReq(clubAdmin))

    expect(data.user).toEqual({ relationTo: 'users', value: 7 })
  })

  it('refuses a lock on another club’s document', async () => {
    await expect(runHook(lockOn(20), fakeReq(clubAdmin))).rejects.toBeInstanceOf(
      Forbidden,
    )
  })

  it('refuses moving an own lock onto another club’s document', async () => {
    await expect(
      runHook(lockOn(20), fakeReq(clubAdmin), lockOn(10)),
    ).rejects.toBeInstanceOf(Forbidden)
  })

  it('checks the stored document when an update does not name one', async () => {
    await expect(
      runHook({}, fakeReq(clubAdmin), lockOn(20)),
    ).rejects.toBeInstanceOf(Forbidden)
  })

  it('refuses a lock that names no document', async () => {
    await expect(
      runHook({ globalSlug: 'settings' }, fakeReq(clubAdmin)),
    ).rejects.toBeInstanceOf(Forbidden)
  })

  it('refuses a lock on a collection the admin cannot update', async () => {
    const req = fakeReq(clubAdmin, () => false)

    await expect(runHook(lockOn(10), req)).rejects.toBeInstanceOf(Forbidden)
  })

  it('lets the platform lock any document', async () => {
    const data = await runHook(lockOn(20), fakeReq(superAdmin, () => true))

    expect(data.user).toEqual({ relationTo: 'users', value: 1 })
  })

  it('refuses a lock without a signed-in user', async () => {
    await expect(runHook(lockOn(10), fakeReq(null))).rejects.toBeInstanceOf(
      Forbidden,
    )
  })
})

describe('withBoundDocumentLocks', () => {
  const anyUser: Access = ({ req: { user } }) => Boolean(user)

  const payloadHook = () => undefined

  /** Oblik koji `buildConfig` daje: Payload doda kolekciju tek u sanitizaciji. */
  const sanitizedConfig = () => ({
    collections: [
      { slug: 'news', access: { read: anyUser }, hooks: { beforeChange: [] } },
      {
        slug: 'payload-locked-documents',
        access: {
          create: anyUser,
          read: anyUser,
          update: anyUser,
          delete: anyUser,
        },
        hooks: { beforeChange: [payloadHook] },
      },
    ],
  })

  it('binds the lock collection to the lock holder', () => {
    const [, locks] = withBoundDocumentLocks(sanitizedConfig()).collections

    expect(locks?.access).toEqual({
      create: anyUser,
      read: ownLocksOnly,
      update: ownLocksOnly,
      delete: ownLocksOnly,
    })
    expect(locks?.hooks.beforeChange).toEqual([payloadHook, bindLockToEditor])
  })

  it('leaves other collections alone', () => {
    const [news] = withBoundDocumentLocks(sanitizedConfig()).collections

    expect(news?.access).toEqual({ read: anyUser })
    expect(news?.hooks.beforeChange).toEqual([])
  })

  it('fails loudly if Payload stops adding the lock collection', () => {
    expect(() => withBoundDocumentLocks({ collections: [] })).toThrow(
      'payload-locked-documents',
    )
  })
})

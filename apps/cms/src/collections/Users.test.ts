import type { Field, FieldAccess, PayloadRequest } from 'payload'
import { sanitizeConfig } from 'payload'
import { describe, expect, it } from 'vitest'
import { Users } from './Users'

/**
 * Payload auth polja (`apiKey`, `apiKeyIndex`) nastaju tek pri sanitizaciji
 * configa, pa test provjerava access kakav Payload stvarno izvršava, a ne
 * samo deklaraciju u `Users.ts`.
 */
const config = await sanitizeConfig({
  collections: [Users, { slug: 'tenants', fields: [] }],
  secret: 'test-secret',
  // Sanitizacija ne pokreće adapter; postoji samo da config bude potpun.
  db: {
    defaultIDType: 'number',
    init: () => {
      throw new Error('test ne otvara bazu')
    },
  },
})

const users = config.collections.find((c) => c.slug === 'users')

const fieldAccess = (name: string, operation: 'create' | 'update'): FieldAccess => {
  const field = users?.fields.find(
    (f): f is Field & { name: string } => 'name' in f && f.name === name,
  )

  const access = field && 'access' in field ? field.access?.[operation] : undefined

  if (!access) throw new Error(`${name}.access.${operation} missing`)

  return access
}

/**
 * Lažni `req` s prijavljenim korisnikom. `payload` treba Payloadovom zadanom
 * `canCreateOrUpdateAPIKey`, koji provjerava admin pristup.
 */
const allows = async (name: string, operation: 'create' | 'update', roles: string[]) => {
  // SAFETY: access funkcije iz ovog configa čitaju samo `req.user` i, kroz
  // `canAccessAdmin`, `req.payload.config` i `req.payload.collections`.
  const req = {
    user: { id: 1, collection: 'users', roles },
    payload: { config, collections: { users: { config: users } } },
  } as PayloadRequest

  return Boolean(await fieldAccess(name, operation)({ req }))
}

const operations = ['create', 'update'] as const

describe('Users API key', () => {
  it.each(['apiKey', 'apiKeyIndex'])('tenant-admin cannot write %s', async (name) => {
    for (const operation of operations) {
      expect(await allows(name, operation, ['tenant-admin'])).toBe(false)
    }
  })

  it.each(['apiKey', 'apiKeyIndex'])('super-admin can still issue %s', async (name) => {
    for (const operation of operations) {
      expect(await allows(name, operation, ['super-admin'])).toBe(true)
    }
  })
})

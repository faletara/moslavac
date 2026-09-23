import { createHmac } from 'node:crypto'
import type { Field, FieldAccess, JsonObject, PayloadRequest } from 'payload'
import { beforeValidateTraverseFields, sanitizeConfig } from 'payload'
import { describe, expect, it } from 'vitest'
import { Users } from './Users'

/**
 * Payload auth polja (`apiKey`, `apiKeyIndex`) nastaju tek pri sanitizaciji
 * configa, pa test provjerava polja kakva Payload stvarno izvršava, a ne samo
 * deklaraciju u `Users.ts`.
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

const usersConfig = config.collections.find((c) => c.slug === 'users')

if (!usersConfig) throw new Error('nema kolekcije users')

const operations = ['create', 'update'] as const

type Operation = (typeof operations)[number]

const API_KEY_FIELDS = ['apiKey', 'apiKeyIndex'] as const

/** Tajna kojom Payload potpisuje `apiKeyIndex`; u testu je proizvoljna. */
const PAYLOAD_SECRET = 'test-payload-secret'

const apiKeyFields = usersConfig.fields.filter(
  (f): f is Field & { name: string } =>
    'name' in f && API_KEY_FIELDS.some((name) => name === f.name),
)

const fieldAccess = (name: string, operation: Operation): FieldAccess => {
  const field = apiKeyFields.find((f) => f.name === name)

  const access = field && 'access' in field ? field.access?.[operation] : undefined

  if (!access) throw new Error(`nema ${name}.access.${operation}`)

  return access
}

/**
 * Lažni `req` s prijavljenim korisnikom. `payload` treba Payloadovom zadanom
 * `canCreateOrUpdateAPIKey` (provjera admin pristupa) i `setAPIKeyIndex` hooku.
 */
const requestAs = (roles: string[]): PayloadRequest =>
  // SAFETY: polja iz ovog configa čitaju samo `req.user`, `req.payload.secret`
  // i, kroz `canAccessAdmin`, `req.payload.config` i `req.payload.collections`.
  ({
    user: { id: 1, collection: 'users', roles },
    payload: {
      config,
      collections: { users: { config: usersConfig } },
      secret: PAYLOAD_SECRET,
    },
  }) as PayloadRequest

/**
 * Update vlastitog računa s `{ apiKey }` kroz Payloadov beforeValidate korak
 * (hookovi pa field access), bez baze. Vraća podatke koji bi se spremili.
 */
const updateApiKey = async (roles: string[], apiKey: string) => {
  const data: JsonObject = { apiKey }

  await beforeValidateTraverseFields({
    collection: usersConfig,
    context: {},
    data,
    doc: {},
    fields: apiKeyFields,
    global: null,
    id: 1,
    operation: 'update',
    overrideAccess: false,
    parentIndexPath: '',
    parentPath: '',
    parentSchemaPath: '',
    req: requestAs(roles),
    siblingData: data,
    siblingDoc: {},
  })

  return data
}

const cases = [
  { role: 'tenant-admin', expected: false },
  { role: 'super-admin', expected: true },
]

describe('Users API key', () => {
  describe.each(cases)('$role', ({ role, expected }) => {
    it.each(API_KEY_FIELDS.flatMap((name) => operations.map((operation) => ({ name, operation }))))(
      `$name $operation dopušten: ${expected}`,
      async ({ name, operation }) => {
        expect(Boolean(await fieldAccess(name, operation)({ req: requestAs([role]) }))).toBe(
          expected,
        )
      },
    )
  })

  it('tenant-admin update s apiKey ne sprema ni ključ ni apiKeyIndex', async () => {
    const saved = await updateApiKey(['tenant-admin'], 'tenant-self-key')

    expect(saved.apiKey).toBeUndefined()
    expect(saved.apiKeyIndex).toBeUndefined()
  })

  it('super-admin update sprema apiKeyIndex po kojem se ključ prijavljuje', async () => {
    const saved = await updateApiKey(['super-admin'], 'platform-key')

    // API-key strategija traži korisnika po HMAC-SHA256(secret, ključ).
    expect(saved.apiKeyIndex).toBe(
      createHmac('sha256', PAYLOAD_SECRET).update('platform-key').digest('hex'),
    )
  })
})

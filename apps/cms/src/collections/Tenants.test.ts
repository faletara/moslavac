import type { Field, FieldAccess, PayloadRequest, TextFieldSingleValidation } from 'payload'
import { describe, expect, it } from 'vitest'
import type { User } from '../payload-types'
import { Tenants } from './Tenants'

/** Korisnik iz baze; access funkcije čitaju samo `roles`, ostalo je ispuna. */
const asUser = (roles: User['roles']): User => ({
  id: 1,
  collection: 'users',
  roles,
  email: 'test@moslavac.hr',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

const superAdmin = asUser(['super-admin'])

const tenantAdmin = asUser(['tenant-admin'])

/** Polja unutar `tabs` nemaju ime, pa put `contact.mapEmbedUrl` preskače tab. */
const childFields = (field: Field): Field[] => {
  if (field.type === 'tabs') return field.tabs.flatMap((tab) => tab.fields)

  if (field.type === 'group' || field.type === 'row' || field.type === 'collapsible') {
    return field.fields
  }

  return []
}

const findField = (fields: Field[], path: string[]): Field | undefined => {
  const [head, ...rest] = path

  for (const field of fields) {
    if ('name' in field && field.name === head) {
      return rest.length === 0 ? field : findField(childFields(field), rest)
    }

    if (!('name' in field)) {
      const nested = findField(childFields(field), path)

      if (nested) return nested
    }
  }

  return undefined
}

const fieldAt = (path: string): Field => {
  const field = findField(Tenants.fields, path.split('.'))

  if (!field) throw new Error(`Tenants nema polje ${path}`)

  return field
}

/** Access funkcije ovdje čitaju samo `req.user`; ostatak argumenata je ispuna. */
const accessArgs = (user: User | null): Parameters<FieldAccess>[0] => ({
  // SAFETY: access funkcije Tenanta čitaju samo `req.user`.
  req: { user } as PayloadRequest,
})

const accessOf = (path: string) => {
  const field = fieldAt(path)

  return 'access' in field ? field.access : undefined
}

const canUpdate = (path: string, user: User | null): boolean => {
  const update = accessOf(path)?.update

  if (!update) return true

  return Boolean(update(accessArgs(user)))
}

const PLATFORM_FIELDS = ['slug', 'siteUrl', 'active', 'features', 'hns', 'contact.mapEmbedUrl']

describe('Tenants platform fields', () => {
  it.each(PLATFORM_FIELDS)('drops a club owner write to %s', (path) => {
    expect(canUpdate(path, tenantAdmin)).toBe(false)
  })

  it.each(PLATFORM_FIELDS)('lets the platform write %s', (path) => {
    expect(canUpdate(path, superAdmin)).toBe(true)
  })

  it('leaves club-owned settings writable by the club owner', () => {
    expect(canUpdate('displayName', tenantAdmin)).toBe(true)
    expect(canUpdate('branding', tenantAdmin)).toBe(true)
    expect(canUpdate('contact.email', tenantAdmin)).toBe(true)
  })

  it('keeps the HNS key readable only by logged-in users', () => {
    const read = accessOf('hns.apiKey')?.read

    expect(read && read(accessArgs(tenantAdmin))).toBe(true)
    expect(read && read(accessArgs(null))).toBe(false)
  })
})

/** Validator polja; ovdje čita samo vrijednost, pa su opcije ispuna. */
const validate = (path: string, value: string | null): true | string => {
  const field = fieldAt(path)

  if (field.type !== 'text' || field.hasMany || !field.validate) return true

  // SAFETY: validatori Tenanta ne čitaju opcije (req, data, operation).
  const result = field.validate(value, {} as Parameters<TextFieldSingleValidation>[1])

  if (result instanceof Promise) throw new Error(`${path} validator je async`)

  return result
}

describe('Tenants hns.matchPagePath', () => {
  it.each(['/raspored-i-rezultati', '/utakmice', 'raspored/2025-26'])('accepts %s', (value) => {
    expect(validate('hns.matchPagePath', value)).toBe(true)
  })

  it('accepts an empty value, which falls back to the default path', () => {
    expect(validate('hns.matchPagePath', null)).toBe(true)
    expect(validate('hns.matchPagePath', '')).toBe(true)
  })

  it.each([
    '/Raspored',
    '/raspored?x=1',
    '/raspored#top',
    'https://evil.example/x',
    '//evil.example',
    '/raspored i rezultati',
    '/rašpored',
    '/../admin',
  ])('rejects %s', (value) => {
    expect(validate('hns.matchPagePath', value)).toEqual(expect.any(String))
  })
})

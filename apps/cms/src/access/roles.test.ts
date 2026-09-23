import type { ClientUser, Condition } from 'payload'
import { describe, expect, it } from 'vitest'
import type { User } from '../payload-types'
import { hiddenFromNonSuperAdmin, isSuperAdmin, superAdminUI } from './roles'

/** Korisnik iz baze; ove tri funkcije čitaju samo `roles`, ostalo je ispuna. */
const asUser = (roles: User['roles']): User => ({
  id: 1,
  collection: 'users',
  roles,
  email: 'test@moslavac.hr',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})

/** Isti korisnik kakvog admin-UI dobije s `/api/users/me`. */
const asClientUser = (roles: User['roles']): ClientUser => ({
  ...asUser(roles),
  // `User['sessions']` dopušta null, `ClientUser` ne; test ih ne koristi.
  sessions: undefined,
})

const superAdmin = asUser(['super-admin'])

const tenantAdmin = asUser(['tenant-admin'])

/** Treći argument `Condition`-a; samo `user` utječe na rezultat. */
const uiArgs = (user: User | null): Parameters<Condition>[2] => ({
  blockData: {},
  operation: 'update',
  path: [],
  user,
})

describe('isSuperAdmin', () => {
  it('reads the role off the user', () => {
    expect(isSuperAdmin(superAdmin)).toBe(true)
    expect(isSuperAdmin(tenantAdmin)).toBe(false)
  })

  it('treats a missing user as not privileged', () => {
    expect(isSuperAdmin(null)).toBe(false)
    expect(isSuperAdmin(undefined)).toBe(false)
    expect(isSuperAdmin({})).toBe(false)
  })
})

describe('hiddenFromNonSuperAdmin', () => {
  it('keeps platform collections out of the club owner navigation', () => {
    expect(
      hiddenFromNonSuperAdmin({ user: asClientUser(['tenant-admin']) }),
    ).toBe(true)
  })

  it('leaves them visible to the platform', () => {
    expect(
      hiddenFromNonSuperAdmin({ user: asClientUser(['super-admin']) }),
    ).toBe(false)
  })

  it('hides them when there is no user', () => {
    expect(hiddenFromNonSuperAdmin({})).toBe(true)
  })
})

describe('superAdminUI', () => {
  it('renders the field only for the platform', () => {
    expect(superAdminUI({}, {}, uiArgs(superAdmin))).toBe(true)
    expect(superAdminUI({}, {}, uiArgs(tenantAdmin))).toBe(false)
    expect(superAdminUI({}, {}, uiArgs(null))).toBe(false)
  })
})

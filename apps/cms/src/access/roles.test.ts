import { describe, expect, it } from 'vitest'
import { hiddenFromNonSuperAdmin, isSuperAdmin, superAdminUI } from './roles'

const superAdmin = { roles: ['super-admin'] }
const tenantAdmin = { roles: ['tenant-admin'] }

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
    expect(hiddenFromNonSuperAdmin({ user: tenantAdmin })).toBe(true)
  })

  it('leaves them visible to the platform', () => {
    expect(hiddenFromNonSuperAdmin({ user: superAdmin })).toBe(false)
  })

  it('hides them when there is no user', () => {
    expect(hiddenFromNonSuperAdmin({})).toBe(true)
  })
})

describe('superAdminUI', () => {
  it('renders the field only for the platform', () => {
    expect(superAdminUI(undefined, undefined, { user: superAdmin })).toBe(true)
    expect(superAdminUI(undefined, undefined, { user: tenantAdmin })).toBe(false)
    expect(superAdminUI(undefined, undefined, {})).toBe(false)
  })
})

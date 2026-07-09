import { describe, expect, it } from 'vitest'
import { canSeeFeature } from './tenantScopedAdmin'

describe('canSeeFeature', () => {
  it('allows super-admins to see every feature', () => {
    expect(canSeeFeature({ roles: ['super-admin'] }, 'gallery')).toBe(true)
  })

  it('allows tenant users to see enabled features', () => {
    const user = {
      roles: ['tenant-admin'],
      tenants: [{ tenant: { features: ['board' as const] } }],
    }

    expect(canSeeFeature(user, 'board')).toBe(true)
  })

  it('hides features missing from the tenant', () => {
    const user = {
      roles: ['tenant-admin'],
      tenants: [{ tenant: { features: ['board' as const] } }],
    }

    expect(canSeeFeature(user, 'gallery')).toBe(false)
  })

  it('does not grant access from an unpopulated tenant relation', () => {
    const user = {
      roles: ['tenant-admin'],
      tenants: [{ tenant: 1 }],
    }

    expect(canSeeFeature(user, 'board')).toBe(false)
  })
})

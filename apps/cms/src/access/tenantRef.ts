import type { ClubFeature } from '@/lib/payload/clubFeatures'

/**
 * Tenant relacija kako je admin daje na korisniku: multi-tenant plugin je vraća
 * ili kao goli ID (nepopuliran `depth: 0`) ili kao objekt (populiran). Više
 * mjesta u adminu čita `user.tenants[].tenant` i projicira različita polja
 * (`id`, `features`, `displayName`) — ovaj modul drži oblik i odmatanje na
 * jednom mjestu da promjena relacije ne traži izmjenu na tri.
 */

export type TenantRef =
  | number
  | string
  | {
      id?: number | string
      slug?: string
      displayName?: string | null
      features?: ClubFeature[] | null
    }
  | null

export type UserTenantRow = { tenant?: TenantRef }

export type MaybeTenantUser =
  | { roles?: string[] | null; tenants?: UserTenantRow[] | null }
  | null
  | undefined

/** Redovi `user.tenants`, uvijek kao niz. */
export const tenantRows = (user: MaybeTenantUser): UserTenantRow[] =>
  Array.isArray(user?.tenants) ? user!.tenants! : []

/** ID iz tenant relacije, bez obzira je li populirana. `null` ako ga nema. */
export const tenantRefId = (ref: TenantRef): number | string | null => {
  if (ref === null || ref === undefined) return null
  if (typeof ref === 'object') return ref.id ?? null
  return ref
}

import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from './roles'

/**
 * Vidljivost kolekcije u admin sučelju po tenantu.
 *
 * CMS je jedan dijeljeni Payload za sve klubove. Neke kolekcije su specifične za
 * pojedini klub (npr. Vrapče: Pages, Documents, BoardMembers, SchoolPrograms,
 * GalleryAlbums) i nemaju smisla za ostale. Ovaj helper skriva takvu kolekciju iz
 * admin navigacije svima OSIM:
 *   - super-adminu (uvijek vidi sve), i
 *   - tenant-adminima klubova navedenih u `allowedTenantSlugs`.
 *
 * Podaci su ionako izolirani preko multi-tenant plugina (filtriranje po tenantu),
 * pa ovo rješava samo čistoću navigacije — drugi klub ne vidi tuđe rubrike.
 *
 * Tenant korisnika čitamo iz `user.tenants` (polje koje dodaje multi-tenant plugin).
 * Primarno uspoređujemo po `slug`-u (kad je relacija populirana), uz determinističku
 * rezervu preko ID-jeva iz env varijable (`<SLUG_UPPERCASE>_TENANT_ID`,
 * npr. `NK_VRAPCE_TENANT_ID`), jer je `admin.hidden` sinkrona funkcija.
 */

type UserTenantRow = { tenant?: number | string | { id?: number | string; slug?: string } | null }

type MaybeUser =
  | {
      roles?: string[] | null
      tenants?: UserTenantRow[] | null
    }
  | null
  | undefined

const userTenantSlugs = (user: MaybeUser): string[] => {
  const rows = Array.isArray(user?.tenants) ? user!.tenants! : []
  return rows
    .map((row) =>
      typeof row?.tenant === 'object' && row.tenant ? row.tenant.slug : undefined,
    )
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
}

const userTenantIds = (user: MaybeUser): string[] => {
  const rows = Array.isArray(user?.tenants) ? user!.tenants! : []
  return rows
    .map((row) => {
      const t = row?.tenant
      if (t == null) return undefined
      return typeof t === 'object' ? t.id : t
    })
    .filter((id): id is number | string => id != null)
    .map(String)
}

/** Determinističke rezerve: ID-jevi dopuštenih tenanta iz env varijabli. */
const allowedTenantIdsFromEnv = (allowedTenantSlugs: string[]): string[] =>
  allowedTenantSlugs
    .map((slug) => process.env[`${slug.toUpperCase().replace(/-/g, '_')}_TENANT_ID`])
    .filter((id): id is string => typeof id === 'string' && id.length > 0)

export function tenantScopedAdmin(
  allowedTenantSlugs: string[],
): NonNullable<CollectionConfig['admin']> {
  const hidden: NonNullable<NonNullable<CollectionConfig['admin']>['hidden']> = ({
    user,
  }) => {
    const u = user as MaybeUser
    if (isSuperAdmin(u)) return false

    const slugs = userTenantSlugs(u)
    if (slugs.some((slug) => allowedTenantSlugs.includes(slug))) return false

    const allowedIds = allowedTenantIdsFromEnv(allowedTenantSlugs)
    if (allowedIds.length > 0) {
      const ids = userTenantIds(u)
      if (ids.some((id) => allowedIds.includes(id))) return false
    }

    // Ne pripada nijednom dopuštenom klubu → skrij iz navigacije.
    return true
  }

  return { hidden }
}

import type { CollectionConfig } from 'payload'
import type { ClubFeature } from '@/lib/payload/clubFeatures'
import { isSuperAdmin } from './roles'

/**
 * Vidljivost klub-specifične kolekcije u admin sučelju, vođena podacima.
 *
 * CMS je jedan dijeljeni Payload za sve klubove. Neke kolekcije postoje samo za
 * klubove koji koriste tu rubriku (Stranice, Dokumenti, Uprava, Škola nogometa,
 * Galerija). Umjesto da svaka kolekcija nabraja klubove (`['nk-vrapce']`),
 * kolekcija deklarira FEATURE koji pruža, a svaki tenant u svom zapisu ima popis
 * uključenih featurea (`tenant.features`). Kolekcija je vidljiva kad tenant
 * korisnika ima taj feature.
 *
 * Posljedica: onboarding kluba s galerijom = uključi `gallery` u njegovom Tenant
 * zapisu. Bez izmjena koda — identitet kluba više ne curi u konfiguraciju
 * kolekcija. Podaci su ionako izolirani multi-tenant pluginom; ovo čisti samo
 * navigaciju.
 *
 * `admin.hidden` je sinkrona, pa čitamo feature s populiranog
 * `user.tenants[].tenant` (isti put kojim plugin već daje tenant relaciju u
 * adminu). Super-admin uvijek vidi sve.
 */

type TenantRef =
  | number
  | string
  | { id?: number | string; slug?: string; features?: ClubFeature[] | null }
  | null
type UserTenantRow = { tenant?: TenantRef }
type MaybeUser =
  | { roles?: string[] | null; tenants?: UserTenantRow[] | null }
  | null
  | undefined

const userTenantFeatures = (user: MaybeUser): ClubFeature[] => {
  const rows = Array.isArray(user?.tenants) ? user!.tenants! : []
  return rows.flatMap((row) =>
    typeof row?.tenant === 'object' && row.tenant?.features
      ? row.tenant.features
      : [],
  )
}

export function canSeeFeature(user: MaybeUser, feature: ClubFeature): boolean {
  if (isSuperAdmin(user)) return true
  return userTenantFeatures(user).includes(feature)
}

export function tenantScopedAdmin(
  feature: ClubFeature,
): NonNullable<CollectionConfig['admin']> {
  const hidden: NonNullable<NonNullable<CollectionConfig['admin']>['hidden']> = ({
    user,
  }) => {
    return !canSeeFeature(user as MaybeUser, feature)
  }

  return { hidden }
}

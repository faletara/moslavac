import type { CollectionConfig } from 'payload'
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

export type ClubFeature = 'pages' | 'documents' | 'board' | 'school' | 'gallery'

export const CLUB_FEATURES: { label: string; value: ClubFeature }[] = [
  { label: 'Stranice (povijest, statut…)', value: 'pages' },
  { label: 'Dokumenti', value: 'documents' },
  { label: 'Uprava', value: 'board' },
  { label: 'Škola nogometa', value: 'school' },
  { label: 'Galerija', value: 'gallery' },
]

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

export function tenantScopedAdmin(
  feature: ClubFeature,
): NonNullable<CollectionConfig['admin']> {
  const hidden: NonNullable<NonNullable<CollectionConfig['admin']>['hidden']> = ({
    user,
  }) => {
    const u = user as MaybeUser
    if (isSuperAdmin(u)) return false
    return !userTenantFeatures(u).includes(feature)
  }

  return { hidden }
}

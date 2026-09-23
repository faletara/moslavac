import type { ClientUser, TypedUser } from 'payload'
import { z } from 'zod'
import {
  CLUB_FEATURE_OPTIONS,
  type ClubFeature,
} from '@/lib/payload/clubFeatures'

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

/**
 * Korisnik kakvog admin preda. `ClientUser` i `TypedUser` su u uniji jer ih
 * Payload daje na različitim mjestima, a nijedan nije strukturno zamjenjiv s
 * ručno opisanim oblikom — bez njih bi svako pozivno mjesto trebalo tvrdnju.
 */
export type MaybeTenantUser =
  | ClientUser
  | TypedUser
  | { roles?: string[] | null; tenants?: UserTenantRow[] | null }
  | null
  | undefined

/** Redovi `user.tenants`, uvijek kao niz. */
export const tenantRows = (user: MaybeTenantUser): UserTenantRow[] =>
  Array.isArray(user?.tenants) ? user!.tenants! : []

/** Ono što admin čita s tenant relacije, bez obzira je li populirana. */
export interface TenantRefInfo {
  id: number | string | null
  displayName: string | null
  features: ClubFeature[]
}

const EMPTY: TenantRefInfo = { id: null, displayName: null, features: [] }

// SAFETY: `z.enum` traži neprazan tuple, a `CLUB_FEATURE_OPTIONS` je izveden iz
// `CLUB_FEATURES` koji nikad nije prazan — isti izvor iz kojeg dolazi i tip.
const clubFeature = z.enum(
  CLUB_FEATURE_OPTIONS.map((option) => option.value) as [
    ClubFeature,
    ...ClubFeature[],
  ],
)

const populated = z.object({
  id: z.union([z.number(), z.string()]).nullish(),
  slug: z.string().nullish(),
  displayName: z.string().nullish(),
  features: z.array(clubFeature).nullish(),
})

/**
 * Raščlani relaciju u jedan oblik. Zod bira granu (populiran objekt ili goli
 * id), pa pozivna mjesta više ne pitaju `typeof` kako je relacija predstavljena.
 */
export const tenantRefInfo = z
  .union([
    populated.transform(
      (tenant): TenantRefInfo => ({
        id: tenant.id ?? null,
        displayName: tenant.displayName ?? null,
        features: tenant.features ?? [],
      }),
    ),
    z
      .union([z.number(), z.string()])
      .transform((id): TenantRefInfo => ({ ...EMPTY, id })),
  ])
  .nullish()
  .transform((info) => info ?? EMPTY)

/** ID iz tenant relacije, bez obzira je li populirana. `null` ako ga nema. */
export const tenantRefId = (ref: TenantRef): number | string | null =>
  tenantRefInfo.parse(ref).id

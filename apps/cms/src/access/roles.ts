import type { Access, FieldAccess } from 'payload'

type MaybeUser = { roles?: string[] | null } | null | undefined

export const isSuperAdmin = (user: MaybeUser): boolean =>
  Boolean(user?.roles?.includes('super-admin'))

/** Collection-level access: dopušteno samo super-adminu. */
export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

/** Field-level access: dopušteno samo super-adminu. */
export const superAdminOnlyField: FieldAccess = ({ req: { user } }) =>
  isSuperAdmin(user)

/**
 * Admin-UI uvjet: polje/tab se renderira samo super-adminu.
 *
 * Čisti ekran, ne štiti podatak — vrijednost i dalje dolazi kroz API. Zaštita
 * pripada `superAdminOnlyField` na create/update. Namjerno je UI-only: uvjet se
 * izvršava u browseru nad korisnikom iz `/api/users/me`, pa polja od kojih
 * ovisi admin (`roles`, `tenants`) moraju ostati u tom odgovoru.
 */
export const superAdminUI = (
  _data: unknown,
  _sibling: unknown,
  { user }: { user?: unknown },
): boolean => isSuperAdmin(user as MaybeUser)

/**
 * `admin.hidden` za kolekcije koje su posao platforme, ne kluba. Skriva samo
 * navigaciju — pristup je i dalje na `access`.
 */
export const hiddenFromNonSuperAdmin = ({ user }: { user?: unknown }): boolean =>
  !isSuperAdmin(user as MaybeUser)

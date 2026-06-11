import type { Access, FieldAccess } from 'payload'

type MaybeUser = { roles?: string[] | null } | null | undefined

export const isSuperAdmin = (user: MaybeUser): boolean =>
  Boolean(user?.roles?.includes('super-admin'))

/** Collection-level access: dopušteno samo super-adminu. */
export const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

/** Field-level access: dopušteno samo super-adminu. */
export const superAdminOnlyField: FieldAccess = ({ req: { user } }) =>
  isSuperAdmin(user)

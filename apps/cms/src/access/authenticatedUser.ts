import type { Access } from 'payload'

/**
 * Collection-level access: svaki prijavljeni korisnik smije pisati. Multi-tenant
 * plugin sužava rezultate na korisnikov tenant. Zamjenjuje ponovljeni inline
 * blok `({ req: { user } }) => Boolean(user)` u 9 kolekcija.
 */
export const authenticatedUserAccess: Access = ({ req: { user } }) =>
  Boolean(user)

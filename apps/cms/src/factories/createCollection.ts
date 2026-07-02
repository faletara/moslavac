import type { CollectionConfig } from 'payload'
import { authenticatedUserAccess } from '../access/authenticatedUser'

type CreateCollectionInput = Omit<CollectionConfig, 'access'> & {
  access?: CollectionConfig['access']
}

/**
 * Collection factory: primjenjuje standardni access (javno čitanje +
 * prijavljeni korisnik piše) ako kolekcija ne navede vlastiti. Sve ostalo
 * (admin, fields, upload, versions, hooks…) prolazi nepromijenjeno.
 * Usp. sintronics2026site `factories/pageFactory.ts`.
 */
export const createCollection = ({
  access,
  ...rest
}: CreateCollectionInput): CollectionConfig => ({
  ...rest,
  access: access ?? {
    read: () => true,
    create: authenticatedUserAccess,
    update: authenticatedUserAccess,
    delete: authenticatedUserAccess,
  },
})

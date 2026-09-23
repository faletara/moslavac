import type { CollectionConfig } from 'payload'
import { authenticatedUserAccess } from '../access/authenticatedUser'
import { revalidateFrontend, type TenantRelation } from '../lib/revalidateFrontend'

type CreateCollectionInput = Omit<CollectionConfig, 'access'> & {
  access?: CollectionConfig['access']
}

/**
 * Collection factory: primjenjuje standardni access (javno čitanje +
 * prijavljeni korisnik piše) ako kolekcija ne navede vlastiti, i javlja
 * klupskoj stranici da je sadržaj promijenjen. Sve ostalo (admin, fields,
 * upload, versions, vlastiti hooks…) prolazi nepromijenjeno.
 * Usp. sintronics2026site `factories/pageFactory.ts`.
 *
 * Revalidacija stoji ovdje, a ne po kolekciji, da je nova kolekcija dobije bez
 * da se itko sjeti dodati hook — inače njezin sadržaj tiho čeka istek TTL-a.
 */
export const createCollection = ({
  access,
  hooks,
  ...rest
}: CreateCollectionInput): CollectionConfig => {
  const notifyFrontend = (
    doc: { tenant?: TenantRelation },
    payload: Parameters<typeof revalidateFrontend>[0]['payload'],
  ) => revalidateFrontend({ payload, collectionSlug: rest.slug, tenant: doc?.tenant })

  return {
    ...rest,
    access: access ?? {
      read: () => true,
      create: authenticatedUserAccess,
      update: authenticatedUserAccess,
      delete: authenticatedUserAccess,
    },
    hooks: {
      ...hooks,
      afterChange: [
        ...(hooks?.afterChange ?? []),
        async ({ doc, req }) => {
          await notifyFrontend(doc, req.payload)

          return doc
        },
      ],
      afterDelete: [
        ...(hooks?.afterDelete ?? []),
        async ({ doc, req }) => {
          await notifyFrontend(doc, req.payload)

          return doc
        },
      ],
    },
  }
}

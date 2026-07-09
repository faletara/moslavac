import type { CollectionConfig } from 'payload'
import { getClubFeature, type ClubFeature } from '@/lib/payload/clubFeatures'
import { tenantScopedAdmin } from '../access/tenantScopedAdmin'
import { createCollection } from './createCollection'

type CollectionAdmin = NonNullable<CollectionConfig['admin']>
type AdminHidden = NonNullable<CollectionAdmin['hidden']>
type AdminHiddenFunction = Extract<AdminHidden, (args: never) => unknown>
type AdminHiddenArgs = Parameters<AdminHiddenFunction>[0]

type ClubFeatureCollectionInput = Omit<CollectionConfig, 'slug' | 'admin'> & {
  admin?: CollectionConfig['admin']
}

const asHidden = (hidden: CollectionAdmin['hidden']): AdminHiddenFunction => {
  if (typeof hidden === 'function') return hidden as AdminHiddenFunction
  return (() => Boolean(hidden)) as AdminHiddenFunction
}

export const clubFeatureCollection = (
  feature: ClubFeature,
  { admin, ...config }: ClubFeatureCollectionInput,
): CollectionConfig => {
  const scopedAdmin = tenantScopedAdmin(feature)
  const scopedHidden = asHidden(scopedAdmin.hidden)
  const configHidden = asHidden(admin?.hidden)

  return createCollection({
    ...config,
    slug: getClubFeature(feature).slug,
    admin: {
      ...scopedAdmin,
      ...admin,
      hidden: (args: AdminHiddenArgs) => scopedHidden(args) || configHidden(args),
    },
  })
}

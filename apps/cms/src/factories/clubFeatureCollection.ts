import type { CollectionConfig } from 'payload'
import { getClubFeature, type ClubFeature } from '@/lib/payload/clubFeatures'
import { tenantScopedAdmin } from '../access/tenantScopedAdmin'
import { createCollection } from './createCollection'

type CollectionAdmin = NonNullable<CollectionConfig['admin']>

type AdminHidden = NonNullable<CollectionAdmin['hidden']>

type AdminHiddenFunction = Extract<AdminHidden, (args: never) => boolean>

type AdminHiddenArgs = Parameters<AdminHiddenFunction>[0]

type ClubFeatureCollectionInput = Omit<CollectionConfig, 'slug' | 'admin'> & {
  admin?: CollectionConfig['admin']
}

/**
 * `anti-slop/no-runtime-typeof` prijavljuje provjeru ispod. Payload tipizira
 * `admin.hidden` kao `((args) => boolean) | boolean` i ne nudi diskriminator, pa
 * se grane razlikuju jedino po tome je li vrijednost funkcija.
 */
const asHidden = (hidden: CollectionAdmin['hidden']): AdminHiddenFunction => {
  if (typeof hidden === 'function') {
    // SAFETY: `admin.hidden` je `((args) => boolean) | boolean`; u ovoj grani je
    // već funkcija traženog potpisa, `Extract` je samo ne sužava sam.
    return hidden as AdminHiddenFunction
  }

  // SAFETY: preostaje boolean; omotan u funkciju koja ga vraća, što je točno
  // potpis koji `admin.hidden` prihvaća.
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

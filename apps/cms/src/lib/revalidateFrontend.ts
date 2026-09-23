import type { Payload } from 'payload'
import { collectionCacheTag } from '@/lib/payload/cacheTags'
import { tenantRefInfo } from '../access/tenantRef'

/**
 * Javi klupskoj stranici da je sadržaj promijenjen.
 *
 * Bez ovoga frontend čeka istek TTL-a, a Next dotad servira staru stranicu
 * (stale-while-revalidate): nova novost se ne vidi dok je netko ne hard-refresha.
 *
 * URL stranice stoji na tenantu (`Tenants.siteUrl`), ne u env varijabli, pa novi
 * klub ne traži redeploy CMS-a. Klub bez upisanog URL-a se tiho preskače.
 */

export type TenantRelation = number | string | { id?: number | string } | null | undefined

const tenantIdOf = (ref: TenantRelation): number | string | null =>
  tenantRefInfo.parse(ref).id

export async function revalidateFrontend(args: {
  payload: Payload
  collectionSlug: string
  tenant: TenantRelation
}): Promise<void> {
  const { payload, collectionSlug, tenant } = args

  // Revalidacija je nuspojava spremanja: njezin pad ne smije srušiti spremanje
  // u adminu. Najgori ishod bez nje je sadržaj star do isteka TTL-a.
  try {
    const secret = process.env.REVALIDATE_SECRET

    if (!secret) return

    const id = tenantIdOf(tenant)

    if (id === null) return

    const doc = await payload.findByID({
      collection: 'tenants',
      id,
      depth: 0,
    })

    const siteUrl = doc.siteUrl?.trim().replace(/\/+$/, '')

    if (!siteUrl || !doc.slug) return

    const response = await fetch(`${siteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ tags: [collectionCacheTag(collectionSlug, doc.slug)] }),
      // Spremanje u adminu čeka ovaj poziv; nedostupna klupska stranica ga ne
      // smije držati otvorenim.
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      payload.logger.error(
        `Revalidacija nije uspjela (${response.status}) za ${collectionSlug} @ ${siteUrl}`,
      )
    }
  } catch (err) {
    payload.logger.error({ err }, `Revalidacija pukla za kolekciju ${collectionSlug}`)
  }
}

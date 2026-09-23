import { createHmac } from 'node:crypto'
import type { Payload } from 'payload'
import { collectionCacheTag } from '@/lib/payload/cacheTags'
import { tenantRefInfo } from '../access/tenantRef'
import { parseClubOrigin } from './clubOrigin'

/**
 * Javi klupskoj stranici da je sadržaj promijenjen.
 *
 * Bez ovoga frontend čeka istek TTL-a, a Next dotad servira staru stranicu
 * (stale-while-revalidate): nova novost se ne vidi dok je netko ne hard-refresha.
 *
 * URL stranice stoji na tenantu (`Tenants.siteUrl`), ne u env varijabli, pa novi
 * klub ne traži redeploy CMS-a. Klub bez upisanog URL-a se tiho preskače.
 *
 * Poziv ide samo na https origin čiji je host u `REVALIDATE_ALLOWED_HOSTS`
 * (zarezom odvojen popis), uvijek na `/api/revalidate` i bez praćenja
 * preusmjeravanja. Bez popisa se ništa ne šalje.
 *
 * Svaki klub dobiva vlastitu tajnu, izvedenu iz `REVALIDATE_SECRET` CMS-a i
 * sluga Tenanta (`clubRevalidateSecret`). Klupska stranica drži samo svoju, pa
 * tajna koja procuri s jednog kluba ne otvara revalidaciju drugog.
 */

/** Dio Payloada koji revalidacija koristi: dohvat tenanta i log. */
export type RevalidatePayload = {
  findByID: Payload['findByID']
  logger: Pick<Payload['logger'], 'error' | 'warn'>
}

export type TenantRelation = number | string | { id?: number | string } | null | undefined

const tenantIdOf = (ref: TenantRelation): number | string | null =>
  tenantRefInfo.parse(ref).id

/**
 * Tajna s kojom klub `slug` prima revalidaciju: HMAC-SHA256(REVALIDATE_SECRET, slug)
 * u hexu. Istu vrijednost daje
 * `printf %s <slug> | openssl dgst -sha256 -hmac "$REVALIDATE_SECRET"` (docs/NEW-CLUB.md).
 */
const clubRevalidateSecret = (cmsSecret: string, tenantSlug: string): string =>
  createHmac('sha256', cmsSecret).update(tenantSlug).digest('hex')

const allowedClubHosts = (): string[] =>
  (process.env.REVALIDATE_ALLOWED_HOSTS ?? '').split(',').flatMap((host) => {
    const trimmed = host.trim().toLowerCase()

    return trimmed ? [trimmed] : []
  })

export async function revalidateFrontend(args: {
  payload: RevalidatePayload
  collectionSlug: string
  tenant: TenantRelation
}): Promise<void> {
  const { payload, collectionSlug, tenant } = args

  // Revalidacija je nuspojava spremanja: njezin pad ne smije srušiti spremanje
  // u adminu. Najgori ishod bez nje je sadržaj star do isteka TTL-a.
  try {
    const masterSecret = process.env.REVALIDATE_SECRET

    if (!masterSecret) return

    const id = tenantIdOf(tenant)

    if (id === null) return

    const doc = await payload.findByID({
      collection: 'tenants',
      id,
      depth: 0,
    })

    if (!doc.siteUrl || !doc.slug) return

    const parsed = parseClubOrigin(doc.siteUrl)

    if (!parsed.ok || !allowedClubHosts().includes(parsed.url.hostname)) {
      payload.logger.warn(
        `Revalidacija preskočena: ${doc.siteUrl} nije dozvoljena adresa kluba ${doc.slug}`,
      )

      return
    }

    const siteUrl = parsed.url.origin

    const response = await fetch(new URL('/api/revalidate', siteUrl), {
      method: 'POST',
      // Preusmjeravanje bi poslalo isti POST na adresu koju CMS nije provjerio.
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${clubRevalidateSecret(masterSecret, doc.slug)}`,
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

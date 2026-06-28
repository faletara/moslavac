import type { CollectionAfterChangeHook } from 'payload'

/**
 * Na prijelaz draft → published šalje "Nova vijest" push pretplatnicima kluba.
 * Hvata i ručno objavljen AI nацrt i običnu vijest; ne okida na svaki spremanje
 * već objavljene vijesti (usporedba s previousDoc._status).
 */
export const sendNewsPublishedPush: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const status = (doc as { _status?: string })._status
  const prevStatus = (previousDoc as { _status?: string } | undefined)?._status
  if (status !== 'published' || prevStatus === 'published') return doc

  const tenant = (doc as { tenant?: number | { id?: number } | null }).tenant
  const tenantId =
    typeof tenant === 'object' && tenant ? tenant.id : tenant
  if (typeof tenantId !== 'number') return doc

  const id = (doc as { id?: number | string }).id
  const title = (doc as { title?: string }).title
  const slugVal = (doc as { slug?: string }).slug
  const slug = typeof slugVal === 'string' && slugVal ? slugVal : String(id)

  try {
    // Dynamic import keeps the `server-only` push graph out of the static
    // config (tsx-based payload generate:types / migrate would otherwise choke).
    const { sendPushForTenant } = await import('@/lib/notify/push')
    await sendPushForTenant(req.payload, tenantId, {
      title: 'Nova vijest',
      body: typeof title === 'string' ? title : 'Objavljena je nova vijest',
      url: `/novosti/${slug}`,
      tag: `news-${id}`,
    })
  } catch (err) {
    req.payload.logger.error(`[push] news publish push failed: ${String(err)}`)
  }

  return doc
}

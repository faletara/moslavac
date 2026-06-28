import 'server-only'
import type { Payload } from 'payload'
import { sendPushToSubscriptions } from '@/lib/push/send'
import type { PushNotificationPayload, WebPushSubscription } from '@/lib/push/types'

/**
 * Pošalji jednu push obavijest svim pretplatnicima tenanta i automatski očisti
 * mrtve pretplate (404/410). Dijele je News afterChange hook i cron.
 */
export async function sendPushForTenant(
  payload: Payload,
  tenantId: number,
  notification: PushNotificationPayload,
): Promise<void> {
  const subs = await payload.find({
    collection: 'push-subscriptions',
    where: { tenant: { equals: tenantId } },
    limit: 1000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })

  const list: WebPushSubscription[] = subs.docs
    .map((d) => {
      const doc = d as {
        endpoint?: string
        keys?: { p256dh?: string; auth?: string }
      }
      if (!doc.endpoint || !doc.keys?.p256dh || !doc.keys?.auth) return null
      return {
        endpoint: doc.endpoint,
        keys: { p256dh: doc.keys.p256dh, auth: doc.keys.auth },
      }
    })
    .filter((s): s is WebPushSubscription => s !== null)

  if (!list.length) return

  const result = await sendPushToSubscriptions(list, notification)
  payload.logger.info(
    `[push] tenant=${tenantId} sent=${result.sent} failed=${result.failed} dead=${result.deadEndpoints.length}`,
  )

  if (result.deadEndpoints.length) {
    await payload.delete({
      collection: 'push-subscriptions',
      where: { endpoint: { in: result.deadEndpoints } },
      overrideAccess: true,
    })
  }
}

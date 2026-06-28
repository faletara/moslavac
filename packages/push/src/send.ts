import "server-only";
import { ensureVapidConfigured, webpush } from "./vapid";
import type { PushNotificationPayload, WebPushSubscription } from "./types";

export interface PushSendResult {
  sent: number;
  failed: number;
  // Endpoints that returned 404/410 (gone) — caller should delete them.
  deadEndpoints: string[];
}

/**
 * Send one notification to many subscriptions concurrently. Never throws —
 * collects per-subscription failures and flags dead endpoints for cleanup.
 */
export async function sendPushToSubscriptions(
  subscriptions: WebPushSubscription[],
  payload: PushNotificationPayload,
): Promise<PushSendResult> {
  if (!ensureVapidConfigured()) {
    console.error("[push] VAPID keys not configured; skipping send");
    return { sent: 0, failed: subscriptions.length, deadEndpoints: [] };
  }

  const body = JSON.stringify(payload);
  const deadEndpoints: string[] = [];
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          body,
        );
        sent++;
      } catch (err) {
        failed++;
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          deadEndpoints.push(sub.endpoint);
        } else {
          console.error(
            `[push] send failed (${statusCode ?? "?"}) for ${sub.endpoint}`,
          );
        }
      }
    }),
  );

  return { sent, failed, deadEndpoints };
}

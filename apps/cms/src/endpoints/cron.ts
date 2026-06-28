import type { Endpoint, PayloadRequest } from 'payload'

// Served at /api/cron (Payload prefixes endpoint paths with /api).
// Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
async function handler(req: PayloadRequest): Promise<Response> {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Dynamic import keeps the `server-only` HNS/AI graph out of the static
    // config so tsx-based `payload generate:types` / `migrate` don't load it.
    const { runMatchNotifications } = await import('@/lib/cron/matchNotifications')
    const summary = await runMatchNotifications(req.payload)
    req.payload.logger.info(
      `[cron] done — tenants=${summary.tenants} reminders=${summary.remindersSent} results=${summary.resultsSent} drafts=${summary.draftsCreated}`,
    )
    return Response.json({ ok: true, ...summary })
  } catch (err) {
    req.payload.logger.error(`[cron] failed: ${String(err)}`)
    return Response.json({ error: 'Cron failed' }, { status: 500 })
  }
}

export const cronEndpoint: Endpoint = {
  path: '/cron',
  method: 'get',
  handler,
}

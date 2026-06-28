import type { Endpoint, PayloadRequest } from 'payload'
import { addDataAndFileToRequest } from 'payload'

// Public endpoint served at /api/push/subscribe. The browser posts its push
// subscription + tenant slug; we resolve the tenant and upsert the record with
// overrideAccess (collection create is otherwise closed). CORS is handled by
// the global `cors` config in payload.config.ts.
interface SubscribeBody {
  tenantSlug?: string
  subscription?: {
    endpoint?: string
    keys?: { p256dh?: string; auth?: string }
  }
}

async function handler(req: PayloadRequest): Promise<Response> {
  await addDataAndFileToRequest(req)
  const body = (req.data ?? {}) as SubscribeBody

  const tenantSlug = body.tenantSlug
  const sub = body.subscription
  if (
    !tenantSlug ||
    !sub?.endpoint ||
    !sub.keys?.p256dh ||
    !sub.keys?.auth
  ) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const tenants = await req.payload.find({
    collection: 'tenants',
    where: { slug: { equals: tenantSlug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const tenant = tenants.docs[0]
  if (!tenant) {
    return Response.json({ error: 'Unknown tenant' }, { status: 404 })
  }

  const userAgent = req.headers.get('user-agent') ?? undefined
  const keys = { p256dh: sub.keys.p256dh, auth: sub.keys.auth }

  const existing = await req.payload.find({
    collection: 'push-subscriptions',
    where: {
      and: [
        { tenant: { equals: tenant.id } },
        { endpoint: { equals: sub.endpoint } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    await req.payload.update({
      collection: 'push-subscriptions',
      id: existing.docs[0].id,
      data: { keys, userAgent },
      overrideAccess: true,
    })
  } else {
    await req.payload.create({
      collection: 'push-subscriptions',
      data: { tenant: tenant.id, endpoint: sub.endpoint, keys, userAgent },
      overrideAccess: true,
    })
  }

  return Response.json({ ok: true })
}

export const pushSubscribeEndpoint: Endpoint = {
  path: '/push/subscribe',
  method: 'post',
  handler,
}

import type { CollectionConfig } from 'payload'

/**
 * Web Push pretplate, tenant-scoped (multiTenantPlugin). Zapise kreira isključivo
 * serverski subscribe endpoint (`/api/push/subscribe`, overrideAccess) — javni
 * REST create je zatvoren da se ne podmeću tuđe pretplate.
 */
export const PushSubscriptions: CollectionConfig = {
  slug: 'push-subscriptions',
  admin: {
    useAsTitle: 'endpoint',
    defaultColumns: ['endpoint', 'createdAt', 'tenant'],
    description: 'Web Push pretplatnici (popunjava frontend automatski).',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'endpoint',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Push service endpoint URL (jedinstven po pretplati).' },
    },
    {
      name: 'keys',
      type: 'group',
      fields: [
        { name: 'p256dh', type: 'text', required: true },
        { name: 'auth', type: 'text', required: true },
      ],
    },
    { name: 'userAgent', type: 'text' },
  ],
}

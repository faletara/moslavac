import type { CollectionConfig } from 'payload'
import { isSuperAdmin, superAdminOnly, superAdminOnlyField } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles'],
  },
  auth: {
    useAPIKey: true,
    maxLoginAttempts: 5,
    lockTime: 600_000, // 10 min
  },
  access: {
    create: superAdminOnly,
    delete: superAdminOnly,
    // Super-admin mijenja sve; ostali samo vlastiti račun (profil/lozinku).
    // Multi-tenant plugin dodatno sužava rezultat na korisnikov tenant.
    update: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['tenant-admin'],
      access: {
        create: superAdminOnlyField,
        update: superAdminOnlyField,
      },
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Tenant Admin', value: 'tenant-admin' },
      ],
    },
  ],
}

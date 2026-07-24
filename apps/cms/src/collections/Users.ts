import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import type { CollectionConfig } from 'payload'
import {
  hiddenFromNonSuperAdmin,
  isSuperAdmin,
  superAdminOnly,
  superAdminOnlyField,
  superAdminUI,
} from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles'],
    /**
     * Klub ima jedan račun, ne smije stvarati druge (`create`/`delete` su
     * super-admin only) i može uređivati samo sebe — lista mu ne nudi ništa.
     * Vlastitu lozinku mijenja preko `/admin/account`, koji radi i kad je
     * kolekcija skrivena iz navigacije.
     */
    hidden: hiddenFromNonSuperAdmin,
  },
  auth: {
    useAPIKey: true,
    maxLoginAttempts: 5,
    lockTime: 600_000, // 10 min
  },
  access: {
    create: superAdminOnly,
    delete: superAdminOnly,
    // Otključavanje računa nakon 5 promašaja je platformin posao; ujedno gasi
    // gumb "Force Unlock" na Account ekranu (UI ga veže na `unlock` permission).
    unlock: superAdminOnly,
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
      admin: {
        condition: superAdminUI,
      },
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Tenant Admin', value: 'tenant-admin' },
      ],
    },
    /**
     * Override Payloadovog auth polja: admin renderira cijeli "API Key" blok
     * samo ako korisnik ima `read` na `enableAPIKey`. Ključ služi frontendima
     * klubova (server-to-server), ne ljudima iz kluba — stoga samo platforma.
     * Strip je siguran jer API-key prijava ide preko `apiKeyIndex`, mimo
     * access controla.
     */
    {
      name: 'enableAPIKey',
      type: 'checkbox',
      access: {
        read: superAdminOnlyField,
        create: superAdminOnlyField,
        update: superAdminOnlyField,
      },
    },
    /**
     * Polje inače dodaje multi-tenant plugin (`includeDefaultField`), no tada
     * mu ne možemo dati `admin.condition`. Deklariramo ga ručno da tenant-admin
     * ne gleda dodjelu klubova koju ionako ne smije mijenjati.
     */
    {
      ...tenantsArrayField({
        arrayFieldAccess: {
          create: superAdminOnlyField,
          update: superAdminOnlyField,
        },
        tenantFieldAccess: {
          create: superAdminOnlyField,
          update: superAdminOnlyField,
        },
      }),
      admin: {
        condition: superAdminUI,
      },
    },
  ],
}

import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { isSuperAdmin } from '../access/roles'
import { type MaybeTenantUser, tenantRefId, tenantRows } from '../access/tenantRef'

/**
 * Vlasnika kluba s liste klubova šalje ravno na njegove postavke.
 *
 * Namjerno se izvršava na ulazu u admin rutu, a ne kroz
 * `admin.components.views.list`: taj se override renderira tek unutar list
 * viewa, pa bi korisnik prvo vidio prazan okvir liste i tek onda skok — vidljiv
 * flicker. Ovdje Next vrati redirect prije nego se išta počne renderirati.
 *
 * Kolekcija `tenants` zato ostaje vidljiva (nije `admin.hidden`) — skrivenoj
 * kolekciji Payload ruši i edit rutu na Not Found.
 */

const firstTenantId = (user: MaybeTenantUser): number | string | null =>
  tenantRefId(tenantRows(user)[0]?.tenant ?? null)

export async function redirectClubOwnerToOwnTenant(
  segments: string[] | undefined,
): Promise<void> {
  if (!segments || segments.length !== 2) return
  if (segments[0] !== 'collections' || segments[1] !== 'tenants') return

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (!user || isSuperAdmin(user)) return

  const tenantId = firstTenantId(user as MaybeTenantUser)
  if (tenantId === null) return

  redirect(`${payload.config.routes.admin}/collections/tenants/${tenantId}`)
}

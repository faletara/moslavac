import Link from 'next/link'
import type { ServerProps } from 'payload'
import { isSuperAdmin } from '../access/roles'
import { type MaybeTenantUser, type TenantRef, tenantRefId, tenantRows } from '../access/tenantRef'

/**
 * Prvi link u navigaciji vlasnika kluba — vodi ravno na njegov tenant zapis.
 *
 * Zamjenjuje kolekciju "Klubovi", koju mu `ClubNav` miče iz izbornika. Href je
 * odmah dokument (bez međurute na listu), pa nema bljeska pri prelasku.
 *
 * Server komponenta: `user` stiže kroz `beforeNavLinks` serverProps s
 * populiranim `tenants[].tenant`, pa nema klijentskog dohvata.
 */

type ClubLink = { id: number | string; displayName: string | null }

const tenantLink = (tenant: TenantRef): ClubLink | null => {
  const id = tenantRefId(tenant)
  if (id === null) return null
  const displayName = typeof tenant === 'object' && tenant ? tenant.displayName ?? null : null
  return { id, displayName }
}

export const ClubSettingsLink = ({ payload, user }: ServerProps) => {
  if (!user || isSuperAdmin(user)) return null

  const clubs = tenantRows(user as MaybeTenantUser)
    .map((row) => tenantLink(row?.tenant ?? null))
    .filter(Boolean) as ClubLink[]

  if (clubs.length === 0) return null

  const adminRoute = payload?.config?.routes?.admin ?? '/admin'
  // Uz više klubova ime razlikuje linkove; uz jedan je ime suvišno.
  const labelFor = (displayName: string | null): string =>
    clubs.length > 1 && displayName ? `Postavke — ${displayName}` : 'Postavke kluba'

  return (
    <>
      {clubs.map(({ id, displayName }) => (
        <Link className="nav__link" href={`${adminRoute}/collections/tenants/${id}`} key={id}>
          <span className="nav__link-label">{labelFor(displayName)}</span>
        </Link>
      ))}
    </>
  )
}

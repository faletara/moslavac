import { DefaultNav } from '@payloadcms/next/rsc'
import type { PayloadRequest, ServerProps } from 'payload'
import { isSuperAdmin } from '../access/roles'

/**
 * Navigacija bez kolekcije "Klubovi" za vlasnika kluba.
 *
 * Njemu tu kolekciju zamjenjuje link "Postavke kluba" (`ClubSettingsLink` u
 * `beforeNavLinks`) koji vodi ravno na njegov dokument. Rutanje preko liste bi
 * značilo vidljiv skok: Payload prvo renderira okvir liste, pa tek onda dođe
 * preusmjeravanje.
 *
 * Filtrira se samo `visibleEntities` koji DefaultNav koristi za izbornik —
 * `admin.hidden` se namjerno NE koristi jer bi srušio i edit rutu na Not Found.
 */

type ClubNavProps = { req?: PayloadRequest } & ServerProps

export const ClubNav = (props: ClubNavProps) => {
  const { user, visibleEntities } = props

  if (isSuperAdmin(user) || !visibleEntities) {
    return <DefaultNav {...props} />
  }

  return (
    <DefaultNav
      {...props}
      visibleEntities={{
        ...visibleEntities,
        collections: visibleEntities.collections.filter((slug) => slug !== 'tenants'),
      }}
    />
  )
}

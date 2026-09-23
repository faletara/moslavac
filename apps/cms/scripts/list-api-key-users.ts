/**
 * Ispisuje korisnike koji imaju postavljen API ključ (`apiKeyIndex`), da
 * super-admin ukloni ključeve koje nije izdala platforma. Samo čita bazu.
 *
 * Pokretanje: cd apps/cms && pnpm payload run scripts/list-api-key-users.ts
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { tenantRefInfo } from '../src/access/tenantRef'

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'users',
  where: { apiKeyIndex: { exists: true } },
  pagination: false,
  depth: 0,
  overrideAccess: true,
})

for (const user of docs) {
  const tenantIds = (user.tenants ?? []).map((t) => tenantRefInfo.parse(t.tenant).id)

  console.log(
    `id=${user.id}  ${user.email}  roles=${JSON.stringify(user.roles)}  tenants=${JSON.stringify(tenantIds)}  enableAPIKey=${String(user.enableAPIKey)}`,
  )
}

console.log(`\n${docs.length} korisnik(a) s API ključem`)

process.exit(0)

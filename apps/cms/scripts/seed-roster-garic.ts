/**
 * Seed Roster kolekcije za NK Garić Garešnica.
 *
 * Podaci scrapeani s HNS semafora, utakmica 100972798
 * (NK Garić G – NK Slatina 4:2). HNS lineup razlikuje samo vratar vs igrač —
 * detaljna pozicija (obrambeni/vezni/napadač) NIJE dostupna, pa su svi
 * terenski igrači postavljeni na `vezni`. Ispravi ručno u adminu.
 * Slike se NE seedaju.
 *
 * Pokretanje:
 *   cd apps/cms && pnpm payload run scripts/seed-roster-garic.ts
 *
 * Idempotentno: po (tenant + personId) preskače već kreirane igrače.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const TENANT_SLUG = process.env.SEED_TENANT_SLUG ?? 'garicgaresnica'

type Position = 'vratar' | 'obrambeni' | 'vezni' | 'napadac' | 'trener'

interface RosterSeed {
  displayName: string
  personId: number
  position: Position
  jerseyNumber: number | null
  captain?: boolean
}

const roster: RosterSeed[] = [
  // Početnih 11
  { displayName: 'Luka Rijetković', personId: 437283, position: 'vratar', jerseyNumber: 12 },
  { displayName: 'Matej Kraljević', personId: 72540, position: 'vezni', jerseyNumber: 4 },
  { displayName: 'Vedran Peleš', personId: 326074, position: 'vezni', jerseyNumber: 5 },
  { displayName: 'Denis Kudlač', personId: 76954, position: 'vezni', jerseyNumber: 7 },
  { displayName: 'Tomislav Golubić', personId: 77859, position: 'vezni', jerseyNumber: 8, captain: true },
  { displayName: 'Mateo Pešić', personId: 328219, position: 'vezni', jerseyNumber: 9 },
  { displayName: 'Dino Makaj', personId: 415025, position: 'vezni', jerseyNumber: 11 },
  { displayName: 'Diego Santana da Silva', personId: 470926, position: 'vezni', jerseyNumber: 14 },
  { displayName: 'Mirko Kelava', personId: 131232, position: 'vezni', jerseyNumber: 16 },
  { displayName: 'Ante Starčević', personId: 72539, position: 'vezni', jerseyNumber: 18 },
  { displayName: 'Ivan Sabljić', personId: 106643, position: 'vezni', jerseyNumber: 27 },
  // Pričuvni igrači
  { displayName: 'Tomislav Dubravac', personId: 72577, position: 'vratar', jerseyNumber: 1 },
  { displayName: 'Tomislav Kolar', personId: 72536, position: 'vezni', jerseyNumber: 2 },
  { displayName: 'Igor Galogaža', personId: 168915, position: 'vezni', jerseyNumber: 6 },
  { displayName: 'Filip Kožuhar', personId: 72572, position: 'vezni', jerseyNumber: 10 },
  { displayName: 'Josip Fadljević', personId: 343761, position: 'vezni', jerseyNumber: 15 },
  { displayName: 'Diogo Santana da Silva', personId: 472609, position: 'vezni', jerseyNumber: 21 },
  { displayName: 'Leon Tomac', personId: 326072, position: 'vezni', jerseyNumber: 22 },
  // Stožer
  { displayName: 'Tihomir Pokopac', personId: 76889, position: 'trener', jerseyNumber: null },
]

console.log('seed-roster-garic: starting')

const payloadConfig = await config

const payload = await getPayload({ config: payloadConfig })

const tenants = await payload.find({
  collection: 'tenants',
  where: { slug: { equals: TENANT_SLUG } },
  limit: 1,
})

const tenant = tenants.docs[0]

if (!tenant) {
  console.error(`Tenant with slug "${TENANT_SLUG}" not found`)
  process.exit(1)
}

console.log(`seed-roster-garic: tenant "${tenant.slug}" (id=${tenant.id})`)

let created = 0

let skipped = 0

for (const player of roster) {
  const existing = await payload.find({
    collection: 'roster',
    where: {
      and: [{ tenant: { equals: tenant.id } }, { personId: { equals: player.personId } }],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`  skip (already exists): ${player.displayName}`)
    skipped++
    continue
  }

  await payload.create({
    collection: 'roster',
    data: {
      displayName: player.displayName,
      personId: player.personId,
      position: player.position,
      jerseyNumber: player.jerseyNumber,
      captain: player.captain ?? false,
      tenant: tenant.id,
    },
  })
  console.log(`  created: ${player.displayName}`)
  created++
}

console.log(`seed-roster-garic: done. created=${created} skipped=${skipped}`)

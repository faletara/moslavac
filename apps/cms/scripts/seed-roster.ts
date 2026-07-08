/**
 * Seed Roster kolekcije za HNK Sloga Mravince.
 *
 * Podaci scrapeani iz HNS semafor utakmice 100790674
 * (NK Junak S – HNK Sloga Mravince). HNS lineup razlikuje samo vratar vs
 * igrač — detaljna pozicija (obrambeni/vezni/napadač) NIJE dostupna, pa su
 * svi terenski igrači postavljeni na `vezni`. Ispravi ručno u adminu.
 * Slike se NE seedaju.
 *
 * Pokretanje:
 *   cd cms && pnpm payload run scripts/seed-roster.ts
 *
 * Idempotentno: po (tenant + personId) preskače već kreirane igrače.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const TENANT_SLUG = process.env.SEED_TENANT_SLUG ?? 'sloga-mravince'

type Position = 'vratar' | 'obrambeni' | 'vezni' | 'napadac' | 'trener'

interface RosterSeed {
  displayName: string
  personId: number
  position: Position
  jerseyNumber: number | null
  captain?: boolean
}

const roster: RosterSeed[] = [
  { displayName: 'Marko Grgur Pelivan', personId: 323931, position: 'vratar', jerseyNumber: 1 },
  { displayName: 'Jakov Miše', personId: 386359, position: 'vratar', jerseyNumber: 12 },
  { displayName: 'Marin Frleta', personId: 354468, position: 'vezni', jerseyNumber: 2 },
  { displayName: 'Kristijan Rubić', personId: 236803, position: 'vezni', jerseyNumber: 3 },
  { displayName: 'Tonći Karabatić', personId: 398643, position: 'vezni', jerseyNumber: 4 },
  { displayName: 'Mirko Tokić', personId: 236438, position: 'vezni', jerseyNumber: 5 },
  { displayName: 'Toni Varnica', personId: 209055, position: 'vezni', jerseyNumber: 6 },
  { displayName: 'Antonio Ćaleta', personId: 438648, position: 'vezni', jerseyNumber: 7 },
  { displayName: 'Luka Pažanin', personId: 197235, position: 'vezni', jerseyNumber: 8 },
  { displayName: 'Luka Božić', personId: 155527, position: 'napadac', jerseyNumber: 9 },
  { displayName: 'Nikola Kušeta', personId: 176606, position: 'vezni', jerseyNumber: 10, captain: true },
  { displayName: 'Petar Ćubelić', personId: 151938, position: 'vezni', jerseyNumber: 16 },
  { displayName: 'Josip Glavović', personId: 192095, position: 'vezni', jerseyNumber: 17 },
  { displayName: 'Neno Danolić', personId: 172975, position: 'vezni', jerseyNumber: 18 },
  { displayName: 'Luka Petrović', personId: 204626, position: 'napadac', jerseyNumber: 19 },
  { displayName: 'Domagoj Topić', personId: 192103, position: 'napadac', jerseyNumber: 20 },
  { displayName: 'Daniel Brajković', personId: 386360, position: 'vezni', jerseyNumber: 21 },
  { displayName: 'David Iličić', personId: 176770, position: 'napadac', jerseyNumber: 23 },
  { displayName: 'Ivica Žuljević', personId: 31375, position: 'trener', jerseyNumber: null },
]

console.log('seed-roster: starting')
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
console.log(`seed-roster: tenant "${tenant.slug}" (id=${tenant.id})`)

let created = 0
let skipped = 0

for (const player of roster) {
  const existing = await payload.find({
    collection: 'roster',
    where: {
      and: [
        { tenant: { equals: tenant.id } },
        { personId: { equals: player.personId } },
      ],
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
      displayOrder: player.jerseyNumber ?? 99,
      tenant: tenant.id,
    },
  })
  console.log(`  created: ${player.displayName}`)
  created++
}

console.log(`seed-roster: done. created=${created} skipped=${skipped}`)

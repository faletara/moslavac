/**
 * Rasporedi pozicije igrača NK Garić Garešnica po linijama.
 *
 * HNS semafor ne daje detaljnu poziciju (samo vratar vs igrač), pa su nakon
 * seeda svi terenski igrači bili `vezni`. Ova skripta ih raspoređuje na
 * obranu / vezni red / napad po broju dresa. Raspored je pretpostavka —
 * ispravi u adminu ako klub javi točno.
 *
 * Pokretanje:
 *   cd apps/cms && pnpm payload run scripts/fix-roster-positions-garic.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const TENANT_SLUG = process.env.SEED_TENANT_SLUG ?? 'garicgaresnica'

type Position = 'vratar' | 'obrambeni' | 'vezni' | 'napadac' | 'trener'

const positionByPersonId = {
  437283: 'vratar', // Luka Rijetković
  72577: 'vratar', // Tomislav Dubravac

  72540: 'obrambeni', // Matej Kraljević
  326074: 'obrambeni', // Vedran Peleš
  72536: 'obrambeni', // Tomislav Kolar
  72539: 'obrambeni', // Ante Starčević
  168915: 'obrambeni', // Igor Galogaža

  76954: 'vezni', // Denis Kudlač
  77859: 'vezni', // Tomislav Golubić (kapetan)
  415025: 'vezni', // Dino Makaj
  131232: 'vezni', // Mirko Kelava
  343761: 'vezni', // Josip Fadljević
  326072: 'vezni', // Leon Tomac

  328219: 'napadac', // Mateo Pešić
  470926: 'napadac', // Diego Santana da Silva
  106643: 'napadac', // Ivan Sabljić
  72572: 'napadac', // Filip Kožuhar
  472609: 'napadac', // Diogo Santana da Silva

  76889: 'trener', // Tihomir Pokopac
} satisfies Record<number, Position>

console.log('fix-roster-positions-garic: starting')

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

let updated = 0

let unchanged = 0

let missing = 0

for (const [personIdRaw, position] of Object.entries(positionByPersonId)) {
  const personId = Number(personIdRaw)

  const found = await payload.find({
    collection: 'roster',
    where: {
      and: [{ tenant: { equals: tenant.id } }, { personId: { equals: personId } }],
    },
    limit: 1,
  })

  const doc = found.docs[0]

  if (!doc) {
    console.warn(`  missing (personId=${personId})`)
    missing++
    continue
  }

  if (doc.position === position) {
    unchanged++
    continue
  }

  await payload.update({
    collection: 'roster',
    id: doc.id,
    data: { position },
  })
  console.log(`  ${doc.displayName}: ${doc.position} -> ${position}`)
  updated++
}

console.log(
  `fix-roster-positions-garic: done. updated=${updated} unchanged=${unchanged} missing=${missing}`,
)

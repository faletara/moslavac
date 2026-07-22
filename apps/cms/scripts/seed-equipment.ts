/**
 * Seed Equipment collection iz alpas.hr/snk-moslavac-popovaca kataloga.
 *
 * Slike se NE seedaju — uploadaj ih ručno u admin UI po proizvodu nakon
 * što skripta kreira zapise.
 *
 * Pokretanje:
 *   cd cms && pnpm payload run scripts/seed-equipment.ts
 *
 * Idempotentno: po imenu (`name`) preskače već kreirane proizvode.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const TENANT_SLUG = process.env.SEED_TENANT_SLUG ?? 'moslavac'
const ALPAS_BASE = 'https://www.alpashrvatska.hr/snk-moslavac-popovaca'

type Category = 'paketi' | 'dresovi' | 'trenirke' | 'jakne' | 'dodaci'

interface EquipmentSeed {
  name: string
  displayName: string
  category: Category
  price: number
  externalUrl: string
  displayOrder: number
  featured?: boolean
}

const equipment: EquipmentSeed[] = [
  // Paketi
  {
    name: 'SNK Moslavac Popovača — paket',
    displayName: 'Paket',
    category: 'paketi',
    price: 65,
    externalUrl: `${ALPAS_BASE}/paket`,
    displayOrder: 10,
    featured: true,
  },
  {
    name: 'SNK Moslavac Popovača — paket #2',
    displayName: 'Paket #2',
    category: 'paketi',
    price: 82,
    externalUrl: `${ALPAS_BASE}/paket-2`,
    displayOrder: 20,
  },
  {
    name: 'SNK Moslavac Popovača — trening set',
    displayName: 'Trening set',
    category: 'paketi',
    price: 26,
    externalUrl: `${ALPAS_BASE}/trening-set`,
    displayOrder: 30,
  },

  // Dresovi
  {
    name: 'SNK Moslavac Popovača — custom design dres + hlačice + plavi',
    displayName: 'Custom dres plavi',
    category: 'dresovi',
    price: 35,
    externalUrl: `${ALPAS_BASE}/custom-dres-plavi`,
    displayOrder: 10,
    featured: true,
  },
  {
    name: 'SNK Moslavac Popovača — custom design dres + hlačice + štucne rozi',
    displayName: 'Custom dres rozi',
    category: 'dresovi',
    price: 35,
    externalUrl: `${ALPAS_BASE}/custom-dres-rozi`,
    displayOrder: 20,
  },
  {
    name: 'SNK Moslavac Popovača — custom design dres + hlačice + štucne bijeli',
    displayName: 'Custom dres bijeli',
    category: 'dresovi',
    price: 35,
    externalUrl: `${ALPAS_BASE}/custom-dres-bijeli`,
    displayOrder: 30,
  },
  {
    name: 'SNK Moslavac Popovača — gornji dres plavi',
    displayName: 'Gornji dres plavi',
    category: 'dresovi',
    price: 20,
    externalUrl: `${ALPAS_BASE}/gornji-dres-plavi`,
    displayOrder: 40,
  },
  {
    name: 'SNK Moslavac Popovača — gornji dres rozi',
    displayName: 'Gornji dres rozi',
    category: 'dresovi',
    price: 20,
    externalUrl: `${ALPAS_BASE}/gornji-dres-rozi`,
    displayOrder: 50,
  },
  {
    name: 'SNK Moslavac Popovača — gornji dres bijeli',
    displayName: 'Gornji dres bijeli',
    category: 'dresovi',
    price: 20,
    externalUrl: `${ALPAS_BASE}/gornji-dres-bijeli`,
    displayOrder: 60,
  },

  // Trenirke
  {
    name: 'SNK Moslavac Popovača — Premium svečana trenirka',
    displayName: 'Premium svečana trenirka',
    category: 'trenirke',
    price: 35,
    externalUrl: `${ALPAS_BASE}/premium-svecana-trenirka`,
    displayOrder: 10,
    featured: true,
  },
  {
    name: 'SNK Moslavac Popovača — Premium radna trenirka',
    displayName: 'Premium radna trenirka',
    category: 'trenirke',
    price: 35,
    externalUrl: `${ALPAS_BASE}/premium-radna-trenirka`,
    displayOrder: 20,
  },

  // Jakne
  {
    name: 'SNK Moslavac Popovača — Polaris jakna 2.0',
    displayName: 'Polaris jakna 2.0',
    category: 'jakne',
    price: 59,
    externalUrl: `${ALPAS_BASE}/polaris-jakna-2-0`,
    displayOrder: 10,
    featured: true,
  },

  // Dodaci
  {
    name: 'SNK Moslavac Popovača — ruksak',
    displayName: 'Ruksak',
    category: 'dodaci',
    price: 19.5,
    externalUrl: `${ALPAS_BASE}/ruksak`,
    displayOrder: 10,
  },
  {
    name: 'SNK Moslavac Popovača — Dry Fit majica',
    displayName: 'Dry Fit majica',
    category: 'dodaci',
    price: 6.9,
    externalUrl: `${ALPAS_BASE}/dry-fit-majica`,
    displayOrder: 20,
  },
  {
    name: 'SNK Moslavac Popovača — sportske hlačice',
    displayName: 'Sportske hlačice',
    category: 'dodaci',
    price: 6.5,
    externalUrl: `${ALPAS_BASE}/sportske-hlacice`,
    displayOrder: 30,
  },
  {
    name: 'SNK Moslavac Popovača — hoody siva/plava',
    displayName: 'Hoody siva/plava',
    category: 'dodaci',
    price: 25,
    externalUrl: `${ALPAS_BASE}/hoody`,
    displayOrder: 40,
  },
  {
    name: 'SNK Moslavac Popovača — polo majica',
    displayName: 'Polo majica',
    category: 'dodaci',
    price: 13.5,
    externalUrl: `${ALPAS_BASE}/polo-majica`,
    displayOrder: 50,
  },
  {
    name: 'SNK Moslavac Popovača — štucne',
    displayName: 'Štucne',
    category: 'dodaci',
    price: 6.5,
    externalUrl: `${ALPAS_BASE}/stucne`,
    displayOrder: 60,
  },
]

console.log('seed-equipment: starting')
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
console.log(`seed-equipment: tenant "${tenant.slug}" (id=${tenant.id})`)

let created = 0
let skipped = 0

for (const item of equipment) {
  const existing = await payload.find({
    collection: 'equipment',
    where: {
      and: [
        { tenant: { equals: tenant.id } },
        { displayName: { equals: item.displayName } },
      ],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`  skip (already exists): ${item.name}`)
    skipped++
    continue
  }

  await payload.create({
    collection: 'equipment',
    data: {
      displayName: item.displayName,
      category: item.category,
      price: item.price,
      externalUrl: item.externalUrl,
      displayOrder: item.displayOrder,
      featured: item.featured ?? false,
      active: true,
      tenant: tenant.id,
    },
  })
  console.log(`  created: ${item.name}`)
  created++
}

console.log(`seed-equipment: done. created=${created} skipped=${skipped}`)

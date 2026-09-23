import config from '@payload-config'
import { getPayload } from 'payload'

/** Uključuje automatske izvještaje s utakmica jednom klubu (po slugu). */
const slug = process.argv[2]

if (!slug) throw new Error('Usage: tsx scripts/enable-match-reports.ts <tenant-slug>')

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'tenants',
  where: { slug: { equals: slug } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
})

const tenant = docs[0]

if (!tenant) throw new Error(`Nema tenanta sa slugom "${slug}"`)

await payload.update({
  collection: 'tenants',
  id: tenant.id,
  overrideAccess: true,
  data: { hns: { ...tenant.hns, matchReports: true } },
})

console.log(`matchReports uključen za ${slug} (id ${tenant.id})`)

process.exit(0)

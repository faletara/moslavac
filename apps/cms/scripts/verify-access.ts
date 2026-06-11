/**
 * Verifikacija access controla nakon sigurnosnih zakrpa.
 *
 * Kreira privremeni tenant + tenant-admin usera, pokuša zabranjene operacije
 * s overrideAccess: false, ispiše PASS/FAIL po testu, pa sve počisti.
 *
 * Pokretanje: cd apps/cms && pnpm payload run scripts/verify-access.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

let pass = 0
let fail = 0
const check = (name: string, ok: boolean, detail?: string) => {
  if (ok) {
    pass++
    console.log(`PASS  ${name}`)
  } else {
    fail++
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

// --- setup (kao sustav) ---
const testTenant = await payload.create({
  collection: 'tenants',
  data: {
    slug: 'test-security-tmp',
    displayName: 'TEST security tmp',
    active: false,
    hns: { apiKey: 'dummy', teamId: '0' },
  },
})

const testUser = await payload.create({
  collection: 'users',
  data: {
    email: 'testsec-tmp@example.com',
    password: 'Xk29!pQz#tmp-Verify',
    roles: ['tenant-admin'],
    tenants: [{ tenant: testTenant.id }],
  },
})

const otherTenant = (
  await payload.find({ collection: 'tenants', where: { slug: { not_equals: 'test-security-tmp' } }, limit: 1 })
).docs[0]

const asUser = { overrideAccess: false, user: testUser } as const

try {
  // 1. Eskalacija: update vlastitog roles polja
  const r1 = await payload.update({
    collection: 'users',
    id: testUser.id,
    data: { roles: ['super-admin'] },
    ...asUser,
  })
  check(
    'tenant-admin NE može sebi postaviti super-admin',
    JSON.stringify(r1.roles) === JSON.stringify(['tenant-admin']),
    `roles=${JSON.stringify(r1.roles)}`,
  )

  // 2. Eskalacija: dodavanje tuđeg tenanta u vlastiti tenants array
  if (otherTenant) {
    const r2 = await payload
      .update({
        collection: 'users',
        id: testUser.id,
        data: { tenants: [{ tenant: testTenant.id }, { tenant: otherTenant.id }] },
        ...asUser,
      })
      .catch(() => null)
    const tenantIds = (r2?.tenants ?? []).map((t) =>
      typeof t.tenant === 'object' ? t.tenant?.id : t.tenant,
    )
    check(
      'tenant-admin NE može sebi dodati tuđi tenant',
      !tenantIds.includes(otherTenant.id),
      `tenants=${JSON.stringify(tenantIds)}`,
    )
  }

  // 3. Kreiranje usera
  const r3 = await payload
    .create({
      collection: 'users',
      data: { email: 'evil-tmp@example.com', password: 'Xk29!pQz#tmp2', roles: ['super-admin'] },
      ...asUser,
    })
    .then(() => false)
    .catch(() => true)
  check('tenant-admin NE može kreirati usere', r3)

  // 4. Kreiranje tenanta
  const r4 = await payload
    .create({
      collection: 'tenants',
      data: { slug: 'evil-tmp', displayName: 'evil', hns: { apiKey: 'x', teamId: '0' } },
      ...asUser,
    })
    .then(() => false)
    .catch(() => true)
  check('tenant-admin NE može kreirati tenante', r4)

  // 5. Brisanje (vlastitog) tenanta
  const r5 = await payload
    .delete({ collection: 'tenants', id: testTenant.id, ...asUser })
    .then(() => false)
    .catch(() => true)
  check('tenant-admin NE može brisati tenante', r5)

  // 6. Update vlastitog tenanta (mora i dalje raditi)
  const r6 = await payload
    .update({
      collection: 'tenants',
      id: testTenant.id,
      data: { displayName: 'TEST security tmp 2' },
      ...asUser,
    })
    .then((d) => d.displayName === 'TEST security tmp 2')
    .catch(() => false)
  check('tenant-admin MOŽE uređivati vlastiti tenant', r6)

  // 7. Update tuđeg tenanta (ista vrijednost — bezopasno ako prođe)
  if (otherTenant) {
    const r7 = await payload
      .update({
        collection: 'tenants',
        id: otherTenant.id,
        data: { displayName: otherTenant.displayName },
        ...asUser,
      })
      .then(() => false)
      .catch(() => true)
    check('tenant-admin NE može uređivati tuđi tenant', r7)
  }

  // 8. Čitanje tuđeg tenanta kao tenant-admin (hns.apiKey ne smije procuriti)
  if (otherTenant) {
    const r8 = await payload
      .findByID({ collection: 'tenants', id: otherTenant.id, ...asUser })
      .then(() => false)
      .catch(() => true)
    check('tenant-admin NE može čitati tuđi tenant', r8)
  }

  // 9. Anonimno čitanje tenanta — apiKey polje mora biti skriveno
  if (otherTenant) {
    const r9 = await payload.findByID({
      collection: 'tenants',
      id: otherTenant.id,
      overrideAccess: false,
    })
    check('anonimni read ne vraća hns.apiKey', r9.hns?.apiKey === undefined, `apiKey=${String(r9.hns?.apiKey)}`)
  }
} finally {
  // --- cleanup ---
  await payload.delete({ collection: 'users', id: testUser.id }).catch((e) => console.error('cleanup user:', e.message))
  await payload.delete({ collection: 'tenants', id: testTenant.id }).catch((e) => console.error('cleanup tenant:', e.message))
}

console.log(`\n${pass} PASS / ${fail} FAIL`)
process.exit(fail > 0 ? 1 : 0)

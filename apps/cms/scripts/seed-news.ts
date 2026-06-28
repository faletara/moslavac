import { getPayload } from 'payload'
import config from '@payload-config'
import { paragraphsToLexical } from '@/lib/ai/lexical'

const TENANT_SLUG = process.env.SEED_TENANT_SLUG ?? 'moslavac'

type Paragraph = string
type NewsSeed = {
  title: string
  excerpt: string
  publishedAt: string
  paragraphs: Paragraph[]
}

const news: NewsSeed[] = [
  {
    title: 'Moslavac slavio na gostovanju u Sisku rezultatom 2:1',
    excerpt:
      'Naši seniori upisali su važna tri boda u borbi za vrh tablice nakon dramatične utakmice u kojoj je pobjednički gol pao u sudačkoj nadoknadi.',
    publishedAt: '2026-05-03T18:30:00.000Z',
    paragraphs: [
      'U 28. kolu naši su seniori gostovali u Sisku gdje su nakon dramatične utakmice slavili rezultatom 2:1. Domaćin je do izjednačenja došao u 67. minuti, no naša momčad nije posustala.',
      'Strijelci za Moslavac bili su Marko Horvat u 41. minuti i Luka Kovačević koji je pogodak za pobjedu zabio u 92. minuti, neposredno prije završnog zvižduka.',
      'Trener nakon utakmice: „Pokazali smo karakter i vjeru u sebe do zadnjih sekundi. Ovo je pobjeda koja nam puno znači u nastavku sezone.”',
    ],
  },
  {
    title: 'Pretsezonske pripreme počinju 15. lipnja u Velikoj',
    excerpt:
      'Stručni stožer objavio je termin i lokaciju pretsezonskih priprema. Igrači se okupljaju na obaveznim liječničkim pregledima tjedan ranije.',
    publishedAt: '2026-05-01T09:00:00.000Z',
    paragraphs: [
      'Pretsezonske pripreme za novu natjecateljsku sezonu krenut će 15. lipnja 2026. u Velikoj, gdje će momčad provesti deset dana intenzivnog rada na bazi izdržljivosti i taktike.',
      'Liječnički pregledi za sve igrače zakazani su za 8. lipnja u prostorijama kluba. Prvi službeni trening na našem stadionu održat će se 27. lipnja.',
      'U planu su tri kontrolne utakmice s klubovima iz regije, o čemu će klub naknadno objaviti detalje.',
    ],
  },
  {
    title: 'Mladi Moslavčani osvojili turnir u Bjelovaru',
    excerpt:
      'Naša U-13 generacija nadigrala je sve protivnike i bez izgubljene utakmice osvojila prestižni proljetni turnir u organizaciji NK Bjelovar.',
    publishedAt: '2026-04-27T14:00:00.000Z',
    paragraphs: [
      'Tijekom vikenda naša U-13 selekcija sudjelovala je na proljetnom turniru u Bjelovaru gdje je nastupilo osam klubova iz središnje Hrvatske.',
      'Naši mladići odigrali su pet utakmica, sve pobijedili i u finalu svladali domaćina rezultatom 3:0. Najboljim igračem turnira proglašen je naš vezni igrač Filip Tomić.',
      'Čestitke igračima, treneru Ivanu Babiću i svim roditeljima koji su podržali ekipu na ovom uspjehu.',
    ],
  },
  {
    title: 'Ulaznice za derbi protiv Kutine u prodaji od ponedjeljka',
    excerpt:
      'Cijena ulaznice je 7 eura, a vlasnici sezonskih ulaznica imaju osiguran ulaz. Očekuje se rasprodan stadion.',
    publishedAt: '2026-04-25T08:00:00.000Z',
    paragraphs: [
      'Ulaznice za derbi 30. kola protiv Kutine, koji se igra u subotu 16. svibnja na našem stadionu, u prodaji su od ponedjeljka 28. travnja.',
      'Cijena ulaznice u pretprodaji je 7 eura, dok će na dan utakmice na blagajni stadiona iznositi 9 eura. Vlasnici sezonskih ulaznica imaju osiguran ulaz bez dodatnih troškova.',
      'Pretprodajna mjesta: klupski ured (radnim danom 9-15h) i Kafić Stadion. Pozivamo navijače da podrže momčad u jednoj od najvažnijih utakmica sezone.',
    ],
  },
  {
    title: 'Završeni radovi na novoj rasvjeti glavnog terena',
    excerpt:
      'Stadion je dobio modernu LED rasvjetu prema UEFA standardima, čime su stvoreni uvjeti za održavanje večernjih utakmica i televizijskih prijenosa.',
    publishedAt: '2026-04-20T11:30:00.000Z',
    paragraphs: [
      'Nakon dva mjeseca radova završena je ugradnja nove LED rasvjete na glavnom terenu. Novi sustav osigurava ravnomjernu osvijetljenost od 800 luksa, što odgovara UEFA standardima za televizijske prijenose.',
      'Investiciju vrijednu 95 tisuća eura zajednički su sufinancirali Grad Popovača, Hrvatski nogometni savez i sponzori kluba.',
      'Prva utakmica pod novom rasvjetom igrat će se u sklopu derbija s Kutinom 16. svibnja. Pozivamo sve navijače da uvečer dođu uživati u novom ambijentu našeg stadiona.',
    ],
  },
]

// Top-level await is required: `payload run` calls process.exit(0) immediately
// after the module's synchronous evaluation finishes, so we must block module
// evaluation until the seeding work completes.
console.log('seed-news: starting')
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
console.log(`seed-news: tenant "${tenant.slug}" (id=${tenant.id})`)

let created = 0
let skipped = 0
for (const item of news) {
  const existing = await payload.find({
    collection: 'news',
    where: {
      and: [
        { tenant: { equals: tenant.id } },
        { title: { equals: item.title } },
      ],
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`  skip (already exists): ${item.title}`)
    skipped++
    continue
  }

  await payload.create({
    collection: 'news',
    data: {
      title: item.title,
      excerpt: item.excerpt,
      publishedAt: item.publishedAt,
      content: paragraphsToLexical(item.paragraphs),
      tenant: tenant.id,
    },
  })
  console.log(`  created: ${item.title}`)
  created++
}

console.log(`seed-news: done. created=${created} skipped=${skipped}`)

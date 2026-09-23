import type { CollectionSlug, PayloadRequest } from 'payload'
import { z } from 'zod'

type EditTarget = {
  collectionSlug?: unknown
  id?: unknown
  req: PayloadRequest
}

// `collectionSlug` i `id` dolaze od klijenta neprovjereni (form-state argumenti
// ili relacija zaključavanja prije validacije polja). ID-jevi su brojevi
// (Postgres); ID kao niz znamenki se pretvara u broj.
const editTargetSchema = z.object({
  collectionSlug: z.string(),
  id: z.union([z.number().int(), z.string().regex(/^\d+$/).transform(Number)]),
})

/**
 * Smije li korisnik iz `req` uređivati dokument `id` u kolekciji
 * `collectionSlug`. Jedina provjera iza zaključavanja dokumenata: i
 * `form-state` (`formStateLockGuard`) i kolekcija `payload-locked-documents`
 * (`lockCollectionAccess`) pitaju ovo.
 *
 * Radi isto što i Payloadova update operacija: izvrši update access kolekcije
 * (s omotačem multi-tenant plugina), a kad access vrati Where, provjeri da ga
 * dokument zadovoljava. Tenant-admin kluba A tako ne prolazi za vijest ili
 * Tenant kluba B. Nepostojeći dokument ne zadovoljava upit, pa daje `false`.
 *
 * Greška pri provjeri se zapiše i odbija (fail closed).
 */
export async function canEditDocument({ req, ...args }: EditTarget): Promise<boolean> {
  const target = editTargetSchema.safeParse(args)

  if (!target.success || !Object.hasOwn(req.payload.collections, target.data.collectionSlug)) {
    return false
  }

  // SAFETY: `Object.hasOwn` iznad potvrđuje da je slug vlastiti ključ `payload.collections`.
  const slug = target.data.collectionSlug as CollectionSlug
  const { id } = target.data

  try {
    const access = await req.payload.collections[slug].config.access.update({ id, req })

    if (typeof access === 'boolean') return access

    const { totalDocs } = await req.payload.count({
      collection: slug,
      overrideAccess: true,
      req,
      where: { and: [{ id: { equals: id } }, access] },
    })

    return totalDocs > 0
  } catch (err) {
    req.payload.logger.error({ err }, 'Provjera prava uređivanja dokumenta nije uspjela')

    return false
  }
}

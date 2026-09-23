import {
  type Access,
  type CollectionBeforeChangeHook,
  type CollectionSlug,
  Forbidden,
  type PayloadRequest,
} from 'payload'
import { z } from 'zod'
import { isSuperAdmin } from './roles'

/**
 * Payloadova ugrađena kolekcija `payload-locked-documents` (zaključavanja
 * dokumenata u adminu) ima zadani access "svaki prijavljeni korisnik" i ne
 * prolazi kroz multi-tenant plugin. Admin kluba A bi tako kroz REST vidio,
 * brisao i stvarao zaključavanja na dokumentima kluba B i blokirao im spremanje
 * (423 Locked). Ovdje je zaključavanje vezano uz korisnika i uz dokument koji
 * taj korisnik smije uređivati.
 */

const LOCKED_DOCUMENTS_SLUG = 'payload-locked-documents'

/**
 * Read/update/delete: korisnik vidi i mijenja samo zaključavanja koja sam drži;
 * super-admin (platforma) sva. Kompromis: dva urednika istog kluba više ne
 * vide tuđe zaključavanje u adminu (nema "dokument uređuje X" upozorenja).
 */
export const ownLocksOnly: Access = ({ req: { user } }) => {
  if (!user) return false

  if (isSuperAdmin(user)) return true

  return {
    'user.relationTo': { equals: user.collection },
    'user.value': { equals: user.id },
  }
}

/**
 * `document` relacija zaključavanja iz zahtjeva: populirana ili kao goli ID.
 * Collection `beforeChange` se izvršava prije validacije polja, pa je ovo još
 * neprovjeren ulaz.
 */
const lockedDocumentRef = z.object({
  relationTo: z.string(),
  value: z.union([
    z.number(),
    z.object({ id: z.number() }).transform(({ id }) => id),
  ]),
})

type LockedDocumentRef = z.infer<typeof lockedDocumentRef>

/**
 * Smije li korisnik iz `req` uređivati dokument. Izvršava update access
 * kolekcije (s omotačem multi-tenant plugina), a kad access vrati Where,
 * provjeri da ga dokument zadovoljava — isto kao Payloadova update operacija.
 */
const canUpdateDocument = async (
  req: PayloadRequest,
  { relationTo, value: id }: LockedDocumentRef,
): Promise<boolean> => {
  // SAFETY: slug dolazi iz zahtjeva; nepoznat slug daje `undefined` i odbija
  // se odmah ispod.
  const slug = relationTo as CollectionSlug
  const collection = req.payload.collections[slug]

  if (!collection) return false

  const access = await collection.config.access.update({ id, req })

  if (access === true || access === false) return access

  const { totalDocs } = await req.payload.count({
    collection: slug,
    overrideAccess: true,
    req,
    where: { and: [{ id: { equals: id } }, access] },
  })

  return totalDocs > 0
}

/**
 * beforeChange na create i update: zaključavanje uvijek glasi na trenutnog
 * korisnika i smije pokazivati samo na dokument koji on smije uređivati.
 * Zaključavanja globala se odbijaju — CMS nema globala.
 */
export const bindLockToEditor: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const { user } = req

  const document = lockedDocumentRef.safeParse(
    data.document ?? originalDoc?.document,
  )

  const allowed =
    user && document.success && (await canUpdateDocument(req, document.data))

  if (!allowed) throw new Forbidden(req.t)

  return { ...data, user: { relationTo: user.collection, value: user.id } }
}

/** Dio sanitizirane kolekcije koji `withBoundDocumentLocks` čita i mijenja. */
interface SanitizedCollectionPart {
  slug: string
  access: Partial<Record<'read' | 'update' | 'delete', Access>>
  hooks: { beforeChange: CollectionBeforeChangeHook[] }
}

/**
 * Payload dodaje kolekciju zaključavanja tek u sanitizaciji, nakon pluginova,
 * pa je ne možemo navesti u `collections` ni omotati pluginom. Zato se access i
 * hook postavljaju na već sanitiziranu konfiguraciju iz `buildConfig`.
 */
export const withBoundDocumentLocks = <
  Config extends { collections: SanitizedCollectionPart[] },
>(
  config: Config,
): Config => {
  const locks = config.collections.find(
    ({ slug }) => slug === LOCKED_DOCUMENTS_SLUG,
  )

  // Bez kolekcije bi ova zaštita tiho nestala (npr. nakon nadogradnje Payloada).
  if (!locks) {
    throw new Error(`Payload više ne dodaje kolekciju ${LOCKED_DOCUMENTS_SLUG}`)
  }

  locks.access.read = ownLocksOnly
  locks.access.update = ownLocksOnly
  locks.access.delete = ownLocksOnly
  locks.hooks.beforeChange.push(bindLockToEditor)

  return config
}

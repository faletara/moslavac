import {
  canAccessAdmin,
  type CollectionSlug,
  docAccessOperation,
  type PayloadRequest,
} from 'payload'
import { z } from 'zod'

type LockTarget = {
  collectionSlug?: unknown
  id?: unknown
  req: PayloadRequest
}

const lockTargetSchema = z.object({
  collectionSlug: z.string(),
  id: z.union([z.number(), z.string()]),
})

/**
 * Smije li korisnik zaključati dokument (admin "netko drugi uređuje").
 *
 * Payloadov `form-state` piše zaključavanje izravno u bazu
 * (`handleFormStateLocking` → `db.create`), mimo access-a kolekcije i
 * multi-tenant plugina, za bilo koji `collectionSlug`/`id` koji pošalje klijent.
 * Zato zaključavanje dopuštamo samo onome tko smije uređivati taj dokument:
 * update access se evaluira nad stvarnim dokumentom, pa tenant-admin kluba A
 * ne može zaključati vijest ili Tenant kluba B.
 */
export async function canLockDocument({ req, ...args }: LockTarget): Promise<boolean> {
  // `collectionSlug` i `id` dolaze od klijenta neprovjereni.
  const target = lockTargetSchema.safeParse(args)

  if (!target.success || !Object.hasOwn(req.payload.collections, target.data.collectionSlug)) {
    return false
  }

  // SAFETY: `Object.hasOwn` iznad potvrđuje da je slug vlastiti ključ `payload.collections`.
  const collection = req.payload.collections[target.data.collectionSlug as CollectionSlug]

  try {
    // Nepostojeći dokument baca NotFound; tada nema što zaključati.
    const permissions = await docAccessOperation({ collection, id: target.data.id, req })

    // Odbijeni update Payload briše iz rezultata; dopušten je `true` ili
    // `{ permission: true, where }` kad je access vratio upit koji dokument zadovoljava.
    return Boolean(permissions.update)
  } catch (err) {
    req.payload.logger.error({ err }, 'Provjera prava za zaključavanje dokumenta nije uspjela')

    return false
  }
}

const hasAdminAccess = async (req: PayloadRequest): Promise<boolean> => {
  try {
    await canAccessAdmin({ req })

    return true
  } catch {
    return false
  }
}

type FormStateArgs = LockTarget & {
  returnLockStatus?: boolean
  updateLastEdited?: boolean
}

/**
 * Omotava Payloadov `form-state` handler: kad korisnik ne smije uređivati
 * dokument, form state se i dalje gradi (pregled radi), ali bez stvaranja ili
 * obnavljanja zaključavanja.
 *
 * Pozivatelj bez pristupa adminu ide ravno u handler, koji ga sam odbije s
 * Unauthorized, pa za njega ne radimo nikakav upit nad dokumentom.
 *
 * Globali uvijek gube zaključavanje: `canLockDocument` provjerava samo
 * kolekcije, a CMS globala nema. Tko doda global, mora doraditi ovaj guard
 * (update access globala), inače mu admin neće zaključavati taj global.
 */
export function guardFormStateLocking<TArgs extends FormStateArgs, TResult>(
  handler: (args: TArgs) => Promise<TResult>,
): (args: TArgs) => Promise<TResult> {
  return async (args) => {
    if (!args.returnLockStatus || !(await hasAdminAccess(args.req))) return handler(args)

    if (await canLockDocument(args)) return handler(args)

    return handler({ ...args, returnLockStatus: false, updateLastEdited: false })
  }
}

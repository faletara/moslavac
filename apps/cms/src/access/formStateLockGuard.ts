import { canAccessAdmin, type PayloadRequest } from 'payload'
import { canEditDocument } from './canEditDocument'

const hasAdminAccess = async (req: PayloadRequest): Promise<boolean> => {
  try {
    await canAccessAdmin({ req })

    return true
  } catch {
    return false
  }
}

type FormStateArgs = {
  collectionSlug?: unknown
  id?: unknown
  req: PayloadRequest
  returnLockStatus?: boolean
  updateLastEdited?: boolean
}

/**
 * Omotava Payloadov `form-state` handler. On piše zaključavanje izravno u bazu
 * (`handleFormStateLocking` → `db.create`), mimo access-a kolekcije i
 * multi-tenant plugina, za bilo koji `collectionSlug`/`id` koji pošalje klijent.
 * Kad korisnik ne smije uređivati dokument (`canEditDocument`), form state se i
 * dalje gradi (pregled radi), ali bez stvaranja ili obnavljanja zaključavanja.
 *
 * Pozivatelj bez pristupa adminu ide ravno u handler, koji ga sam odbije s
 * Unauthorized, pa za njega ne radimo nikakav upit nad dokumentom.
 *
 * Globali uvijek gube zaključavanje: `canEditDocument` provjerava samo
 * kolekcije, a CMS globala nema. Tko doda global, mora doraditi ovaj guard
 * (update access globala), inače mu admin neće zaključavati taj global.
 */
export function guardFormStateLocking<TArgs extends FormStateArgs, TResult>(
  handler: (args: TArgs) => Promise<TResult>,
): (args: TArgs) => Promise<TResult> {
  return async (args) => {
    if (!args.returnLockStatus || !(await hasAdminAccess(args.req))) return handler(args)

    if (await canEditDocument(args)) return handler(args)

    return handler({ ...args, returnLockStatus: false, updateLastEdited: false })
  }
}

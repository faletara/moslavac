import type { Field } from 'payload'

interface DisplayOrderOptions {
  description?: string
  /** Smjesti u sidebar (default true). Roster ga drži u glavnom stupcu. */
  sidebar?: boolean
}

/** `displayOrder` number polje (default 0). Koristi 6 kolekcija. */
export const displayOrderField = (opts: DisplayOrderOptions = {}): Field => ({
  name: 'displayOrder',
  type: 'number',
  defaultValue: 0,
  admin: {
    ...(opts.sidebar === false ? {} : { position: 'sidebar' }),
    description: opts.description ?? 'Redoslijed prikaza (manji broj prvi).',
  },
})

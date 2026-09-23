import type { Field, NumberField } from 'payload'

interface DisplayOrderOptions {
  label?: string
  description?: string
  /** Smjesti u sidebar (default true). Roster ga drži u glavnom stupcu. */
  sidebar?: boolean
}

/** `displayOrder` number polje (default 0). Koristi 6 kolekcija. */
export const displayOrderField = (opts: DisplayOrderOptions = {}): Field => {
  const admin: NumberField['admin'] = {
    description: opts.description ?? 'Redoslijed prikaza (manji broj prvi).',
  }

  if (opts.sidebar !== false) admin.position = 'sidebar'

  return {
    name: 'displayOrder',
    label: opts.label ?? 'Redoslijed',
    type: 'number',
    defaultValue: 0,
    admin,
  }
}

import type { Field } from 'payload'

/** `active` checkbox (default true) u sidebaru — sakrij zapis bez brisanja. */
export const activeField = (description: string, label = 'Prikaži na stranici'): Field => ({
  name: 'active',
  label,
  type: 'checkbox',
  defaultValue: true,
  admin: {
    position: 'sidebar',
    description,
  },
})

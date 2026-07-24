/**
 * Hrvatska sklonidba uz broj. Hrvatski ima tri oblika, ne dva:
 *
 * - `one` — 1, 21, 101 … (1 puna utakmica)
 * - `few` — 2–4, 22–24 … (2 pune utakmice)
 * - `many` — 0, 5–20, 11–14 … (5 punih utakmica)
 *
 * Brojevi 11–14 idu u `many` iako završavaju na 1–4, pa se pravilo ne smije
 * svesti na „gleda se zadnja znamenka”.
 */

export type PluralForms = {
  one: string;
  few: string;
  many: string;
};

/** Oblik imenice koji ide uz zadani broj, bez samog broja. */
export function pluralForm(count: number, forms: PluralForms): string {
  const n = Math.abs(Math.trunc(count));
  const lastDigit = n % 10;
  const lastTwo = n % 100;

  if (lastTwo >= 11 && lastTwo <= 14) return forms.many;
  if (lastDigit === 1) return forms.one;
  if (lastDigit >= 2 && lastDigit <= 4) return forms.few;
  return forms.many;
}

/** Broj i pripadni oblik imenice, npr. `2 pune utakmice`. */
export function pluralize(count: number, forms: PluralForms): string {
  return `${count} ${pluralForm(count, forms)}`;
}

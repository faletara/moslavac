import { currentSeasonTag } from "@/lib/hns/client";

/**
 * Oznaka i naziv tekuće sezone, izvedeni iz datuma umjesto da stoje zakucani
 * u JSX-u. Zakucan niz („Sezona 2025/26") tiho zastari svakog kolovoza: HNS
 * podaci se prebace na novu sezonu, a naslov stranice još mjesecima tvrdi
 * staru. `currentSeasonTag` je isti izvor po kojem se filtriraju natjecanja,
 * pa se naslov i podaci ne mogu razići.
 *
 * Oboje su `server-only` (dolaze iz `@/lib/hns/client`) — u client komponentu
 * proslijedi rezultat kao prop.
 */
export function seasonTag(): string {
  return currentSeasonTag();
}

/** Puni naziv za eyebrow, npr. „Sezona 2026/27". */
export function seasonLabel(): string {
  const tag = currentSeasonTag();
  return `Sezona 20${tag}`;
}

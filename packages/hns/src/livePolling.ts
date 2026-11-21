import type { HnsLiveStatus } from "@/types/hns";

// Bez `server-only`: odluku koristi klijentski hook `useLiveMatch`.

const MINUTE = 60 * 1000;

/** HNS objavljuje postave otprilike sat prije početka — tada počinje dohvaćanje. */
export const LIVE_WINDOW_BEFORE_MS = 60 * MINUTE;

/** Pokriva produžetke i kasni kraj; HNS koji zaboravi "PLAYED" ne vrti zauvijek. */
const LIVE_WINDOW_AFTER_MS = 180 * MINUTE;

export interface LiveFetchPlan {
  /** Dohvaćaj rutu uživo svakih 30 s. */
  poll: boolean;
  /** Dohvati je jednom pri otvaranju — HTML iz keša možda prethodi rezultatu. */
  fetchOnce: boolean;
}

/**
 * Treba li preglednik dohvaćati `LiveMatch` za utakmicu, s obzirom na status
 * koji trenutno prikazuje (iz HTML-a ili zadnjeg dohvata):
 *
 * - od 60 min prije početka do 3 h nakon → `poll`, dok status nije "PLAYED";
 * - prozor je istekao, a status nije "PLAYED" → `fetchOnce`, jer stranica je
 *   statična i HTML je možda renderiran prije utakmice;
 * - odigrana, otkazana ili odgođena utakmica, ili nepoznat početak → ništa.
 *
 * Status `null` znači da HNS ne prati utakmicu uživo (polje izostaje). Takav
 * status nikad ne postane "PLAYED", pa bi `fetchOnce` dohvaćao pri svakom
 * otvaranju zauvijek — zato nakon prozora nema dohvata. U prozoru se ipak
 * dohvaća: HNS upisuje događaje i postave i kad ne vodi status (mlađe
 * kategorije Sloge za vrijeme utakmice imaju golove uz status "SCHEDULED").
 */
export function liveFetchPlan(
  kickoffAtUtcMs: number | null,
  liveStatus: HnsLiveStatus | null,
  now: number,
): LiveFetchPlan {
  if (
    kickoffAtUtcMs == null ||
    liveStatus === "PLAYED" ||
    liveStatus === "CANCELED" ||
    liveStatus === "POSTPONED"
  ) {
    return { poll: false, fetchOnce: false };
  }

  if (now < kickoffAtUtcMs - LIVE_WINDOW_BEFORE_MS) {
    return { poll: false, fetchOnce: false };
  }

  if (now <= kickoffAtUtcMs + LIVE_WINDOW_AFTER_MS) {
    return { poll: true, fetchOnce: false };
  }

  return { poll: false, fetchOnce: liveStatus != null };
}

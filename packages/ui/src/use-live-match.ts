"use client";

import { useEffect, useRef, useState } from "react";
import { LIVE_WINDOW_BEFORE_MS, liveFetchPlan } from "@/lib/hns/livePolling";
import type { LiveMatch } from "@/types/hns";

const POLL_INTERVAL_MS = 30_000;

/** `setTimeout` prelijeva iznad ~24,8 dana; dalja utakmica ionako ne čeka otvoren tab. */
const MAX_TIMEOUT_MS = 2 ** 31 - 1;

/**
 * Trenutno stanje utakmice na statičnoj stranici. Kreće od `LiveMatch`-a iz
 * serverskog renderiranja i, dok `liveFetchPlan` kaže `poll`, svakih 30 s
 * dohvaća `/api/utakmice/[id]/uzivo` (CDN ga dijeli među svim posjetiteljima).
 * Kad plan kaže `fetchOnce` (HTML iz keša stariji od rezultata), dohvati jednom.
 *
 * - Stranica otvorena prije prozora počne dohvaćati kad se prozor otvori.
 * - Na skrivenom tabu ne dohvaća; kad se tab vrati, odmah dohvati.
 * - Neuspio dohvat zadržava posljednje stanje — nikad greška umjesto rezultata.
 */
export function useLiveMatch(
  initial: LiveMatch,
  kickoffAtUtcMs: number | null,
): LiveMatch {
  const [live, setLive] = useState(initial);
  // Status koji se trenutno prikazuje odlučuje o idućem dohvatu; ref da promjena
  // statusa ne ruši i ponovno diže timere (i ne okine dodatni dohvat).
  const statusRef = useRef(initial.liveStatus);
  const { matchId } = initial;

  useEffect(() => {
    const url = `/api/utakmice/${matchId}/uzivo`;
    const controller = new AbortController();
    let interval: ReturnType<typeof setInterval> | undefined;
    let windowTimer: ReturnType<typeof setTimeout> | undefined;

    const plan = () =>
      liveFetchPlan(kickoffAtUtcMs, statusRef.current, Date.now());

    const stopPolling = () => {
      if (interval !== undefined) clearInterval(interval);
      interval = undefined;
    };

    const load = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) return;

        // SAFETY: the route serialises `fetchLiveMatch`'s `LiveMatch` on 200,
        // and `res.ok` was checked above; errors (400/404/502) never get here.
        const next = (await res.json()) as LiveMatch;

        statusRef.current = next.liveStatus;
        setLive(next);
      } catch {
        // Mreža ili ruta zakazala: ostaje posljednje poznato stanje.
      }
    };

    const tick = async () => {
      if (!plan().poll) {
        stopPolling();

        return;
      }

      await load();

      if (!plan().poll) stopPolling();
    };

    const startPolling = () => {
      if (interval !== undefined || document.visibilityState !== "visible") {
        return;
      }

      if (!plan().poll) return;

      void tick();
      interval = setInterval(() => void tick(), POLL_INTERVAL_MS);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") startPolling();
      else stopPolling();
    };

    const initialPlan = plan();

    if (initialPlan.fetchOnce) {
      void load();
    } else if (initialPlan.poll) {
      startPolling();
    } else if (kickoffAtUtcMs != null) {
      const untilWindow = kickoffAtUtcMs - LIVE_WINDOW_BEFORE_MS - Date.now();

      if (untilWindow > 0 && untilWindow <= MAX_TIMEOUT_MS) {
        windowTimer = setTimeout(startPolling, untilWindow);
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      controller.abort();
      stopPolling();

      if (windowTimer !== undefined) clearTimeout(windowTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [matchId, kickoffAtUtcMs]);

  return live;
}

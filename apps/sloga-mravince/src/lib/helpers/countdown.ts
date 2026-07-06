"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isPast: boolean;
}

function compute(targetUtc: number, now: number): CountdownState {
  const totalMs = Math.max(0, targetUtc - now);
  const isPast = targetUtc <= now;

  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { days, hours, minutes, seconds, totalMs, isPast };
}

/**
 * Odbrojavanje do targeta (epoch ms). Hydration-safe: do prvog (asinkronog)
 * ticka vraća null, zatim otkucava svake sekunde (uz reduced-motion jednom u
 * minuti). Stanje drži samo "now", a dijelovi se izvode tijekom rendera.
 */
export function useCountdown(targetUtc: number | null): CountdownState | null {
  const reduced = useReducedMotion();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const first = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), reduced ? 60_000 : 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [reduced]);

  return targetUtc != null && now != null ? compute(targetUtc, now) : null;
}

"use client";

import { useEffect, useState } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isPast: boolean;
}

function compute(targetUtc: number): CountdownState {
  const now = Date.now();
  const totalMs = Math.max(0, targetUtc - now);
  const isPast = targetUtc <= now;

  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return { days, hours, minutes, seconds, totalMs, isPast };
}

export function useCountdown(targetUtc: number | null): CountdownState | null {
  const [state, setState] = useState<CountdownState | null>(null);

  useEffect(() => {
    if (targetUtc == null) {
      setState(null);
      return;
    }
    const update = () => setState(compute(targetUtc));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetUtc]);

  return state;
}

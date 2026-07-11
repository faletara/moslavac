"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RefreshWhileProps {
  /** Poll only while this holds. Flipping it to false tears the timer down. */
  active: boolean;
  intervalMs?: number;
}

/**
 * Re-fetches the current route on an interval while `active`, so a server-
 * rendered page that goes stale (a live match score) updates without the user
 * hitting reload. Renders nothing.
 *
 * Polling pauses while the tab is hidden — a backgrounded phone on the terrace
 * would otherwise keep refetching for 90 minutes — and fires once immediately
 * on becoming visible again, so returning to the tab shows the current score
 * rather than whatever was on screen when it was backgrounded.
 */
export function RefreshWhile({ active, intervalMs = 30_000 }: RefreshWhileProps) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      if (timer !== undefined) return;
      timer = setInterval(() => router.refresh(), intervalMs);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [active, intervalMs, router]);

  return null;
}

"use client";
import { track } from "@vercel/analytics";
import { useEffect } from "react";

export function TrackEvent({
  event,
  props,
}: {
  event: string;
  props?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

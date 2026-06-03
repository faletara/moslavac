"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function PlayerStatsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Greška pri učitavanju statistike"
      description="Nismo uspjeli dohvatiti statistiku igrača."
      reset={reset}
    />
  );
}

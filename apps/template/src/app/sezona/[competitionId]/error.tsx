"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function SeasonError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Greška pri učitavanju sezone"
      description="Nismo uspjeli dohvatiti podatke o ovoj sezoni."
      reset={reset}
    />
  );
}

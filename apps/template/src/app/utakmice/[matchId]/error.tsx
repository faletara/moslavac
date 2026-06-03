"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function MatchError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Greška pri učitavanju utakmice"
      description="Nismo uspjeli dohvatiti podatke o utakmici."
      reset={reset}
    />
  );
}

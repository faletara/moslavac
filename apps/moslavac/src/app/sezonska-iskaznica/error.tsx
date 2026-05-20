"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function SeasonTicketError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Greška pri učitavanju"
      description="Nismo uspjeli dohvatiti podatke o sezonskoj iskaznici."
      reset={reset}
    />
  );
}

"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function FirstTeamError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Greška pri učitavanju igrača"
      description="Nismo uspjeli dohvatiti popis igrača prve momčadi."
      reset={reset}
    />
  );
}

"use client";

import { ErrorState } from "@/components/feedback/ErrorState";

export default function NewsArticleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Greška pri učitavanju vijesti"
      description="Nismo uspjeli dohvatiti ovu vijest. Pokušajte ponovno ili se vratite na popis vijesti."
      reset={reset}
    />
  );
}

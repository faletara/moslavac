"use client";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  reset?: () => void;
}

export function ErrorState({
  title = "Nešto je pošlo po krivu",
  description = "Došlo je do neočekivane greške. Pokušajte ponovno za nekoliko trenutaka.",
  reset,
}: ErrorStateProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <span>Greška</span>
      <h1>{title}</h1>
      <p className="max-w-md">{description}</p>
      {reset && (
        <Button onClick={reset} variant="outline" className="px-7 py-3">
          Pokušaj ponovno
        </Button>
      )}
    </section>
  );
}

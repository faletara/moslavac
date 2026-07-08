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
      <span className="text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground">
        Greška
      </span>
      <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tighter sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
      {reset && (
        <Button
          onClick={reset}
          variant="outline"
          className="rounded-full px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.35em]"
        >
          Pokušaj ponovno
        </Button>
      )}
    </section>
  );
}

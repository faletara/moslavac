"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">Greška</h1>
      <p className="text-muted-foreground">
        Došlo je do neočekivane greške. Pokušajte ponovno.
      </p>
      <Button onClick={reset}>Pokušaj ponovno</Button>
    </div>
  );
}

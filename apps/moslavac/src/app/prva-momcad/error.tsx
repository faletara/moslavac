"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FirstTeamError() {
  return (
    <Alert variant="destructive" className="container mx-auto mt-8 max-w-4xl">
      <AlertDescription>Greška pri učitavanju igrača.</AlertDescription>
    </Alert>
  );
}

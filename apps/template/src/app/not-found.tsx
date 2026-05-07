import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold">Stranica nije pronađena</h2>
      <p className="text-muted-foreground">
        Stranica koju tražite ne postoji ili je premještena.
      </p>
      <Button asChild>
        <Link href="/">Natrag na početnu</Link>
      </Button>
    </div>
  );
}

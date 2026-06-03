import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NotFoundStateProps {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export function NotFoundState({
  title = "Stranica nije pronađena",
  description = "Stranica koju tražite ne postoji ili je premještena.",
  backHref = "/",
  backLabel = "Natrag na početnu",
}: NotFoundStateProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-6 px-4">
      <span>404</span>
      <h1>{title}</h1>
      <p className="max-w-md">{description}</p>
      <Button asChild variant="outline" className="px-7 py-3">
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </section>
  );
}

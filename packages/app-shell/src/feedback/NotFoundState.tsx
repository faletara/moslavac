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
    <section className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="font-display text-7xl font-black leading-none tracking-tighter text-muted-foreground/30 sm:text-8xl">
        404
      </span>
      <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tighter sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
      <Button
        asChild
        variant="outline"
        className="rounded-full px-7 py-3 text-[0.7rem] font-bold uppercase tracking-[0.35em]"
      >
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </section>
  );
}

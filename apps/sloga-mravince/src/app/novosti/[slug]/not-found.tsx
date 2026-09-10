import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewsNotFound() {
  return (
    <section className="mx-auto flex min-h-[50dvh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-club-red">
        Greška 404
      </p>
      <h1 className="mt-5 pt-[0.1em] font-display text-4xl uppercase leading-[1.14] md:text-5xl">
        Vijest nije pronađena
      </h1>
      <p className="mt-5 max-w-md text-muted-foreground">
        Tražena vijest ne postoji ili je uklonjena.
      </p>
      {/* Natrag na popis vijesti, ne na naslovnicu: posjetitelj je došao
          tražeći vijest, pa mu popis daje najbliži sljedeći korak. */}
      <Link
        href="/novosti"
        className="group mt-9 inline-flex items-center gap-3 bg-ink-deep px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-chalk transition-colors duration-300 hover:bg-club-red"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Sve vijesti
      </Link>
    </section>
  );
}

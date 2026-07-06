import Link from "next/link";

export default function NewsNotFound() {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
        Vijest nije pronađena
      </h1>
      <p className="mt-4 text-muted-foreground">
        Tražena vijest ne postoji ili je uklonjena.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full bg-club-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-chalk"
      >
        Natrag na naslovnicu
      </Link>
    </section>
  );
}

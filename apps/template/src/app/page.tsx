import type { Metadata } from "next";
import { getTenant } from "@/lib/payload/getTenant";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const description = `Službena stranica ${name} – raspored utakmica, rezultati, tablica, vijesti i sve o klubu.`;

  return {
    description,
    alternates: { canonical: "/" },
    openGraph: { description },
    twitter: { description },
  };
}

export default async function HomePage() {
  const tenant = await getTenant();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
        {tenant.displayName}
      </p>
      <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter">
        Naslovnica
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        Prazan predložak. Podatkovni sloj (Payload + HNS) i API rute su spremni —
        gradi stranice od nule.
      </p>
    </div>
  );
}

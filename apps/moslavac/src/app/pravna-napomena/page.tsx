import type { Metadata } from "next";
import { getTenant } from "@/lib/payload/getTenant";

export const metadata: Metadata = {
  title: "Pravna napomena",
  description:
    "Pravna napomena i podaci o pružatelju usluga sukladno Zakonu o elektroničkoj trgovini.",
  alternates: { canonical: "/pravna-napomena" },
};

export default async function LegalNoticePage() {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const email = tenant.contact?.email ?? "[email kluba]";
  const phone = tenant.contact?.phone ?? null;
  const address = tenant.contact?.address ?? "[adresa kluba]";
  const oib = tenant.legal?.oib ?? "[OIB nije postavljen]";
  const registryNumber =
    tenant.legal?.registryNumber ?? "[broj nije postavljen]";
  const registryAuthority =
    tenant.legal?.registryAuthority ?? "Ured državne uprave (prema sjedištu)";

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
      <header className="mb-12 space-y-4">
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
          Pravne informacije
        </p>
        <h1 className="text-3xl font-black uppercase leading-none tracking-tighter sm:text-4xl">
          Pravna napomena
        </h1>
      </header>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90 sm:text-base [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-tight [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        <section>
          <h2>Podaci o pružatelju usluga</h2>
          <p>
            Sukladno članku 6. Zakona o elektroničkoj trgovini (NN 173/03, s
            izmjenama), objavljujemo sljedeće podatke:
          </p>
          <ul>
            <li>
              <strong>Puni naziv:</strong> {name}
            </li>
            <li>
              <strong>Sjedište:</strong> {address}
            </li>
            <li>
              <strong>OIB:</strong> {oib}
            </li>
            <li>
              <strong>Pravni oblik:</strong> Udruga
            </li>
            <li>
              <strong>Registar:</strong> Registar udruga Republike Hrvatske
            </li>
            <li>
              <strong>Registarski broj:</strong> {registryNumber}
            </li>
            <li>
              <strong>Nadležno tijelo upisa:</strong> {registryAuthority}
            </li>
            <li>
              <strong>E-pošta:</strong>{" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
            </li>
            {phone && (
              <li>
                <strong>Telefon:</strong>{" "}
                <a href={`tel:${phone}`} className="underline">
                  {phone}
                </a>
              </li>
            )}
          </ul>
        </section>

        <section>
          <h2>Autorska prava</h2>
          <p>
            Sav sadržaj objavljen na ovoj web stranici (tekstovi, fotografije,
            grb, logotipi, dizajn) zaštićen je autorskim pravom i pripada Klubu
            odnosno njegovim nositeljima prava. Sadržaj se može preuzimati
            isključivo za osobnu, nekomercijalnu uporabu, uz navođenje izvora.
          </p>
          <p>
            Podaci o natjecanjima (raspored, rezultati, tablica, strijelci)
            preuzimaju se iz javnih sustava Hrvatskog nogometnog saveza i
            prikazuju se isključivo u informativne svrhe.
          </p>
        </section>

        <section>
          <h2>Odgovornost za sadržaj</h2>
          <p>
            Klub se trudi održavati sadržaj točnim i ažurnim, ali ne jamči
            potpunost ili pravovremenost prikazanih podataka. Klub ne odgovara
            za eventualnu štetu nastalu korištenjem ove web stranice ili
            povezivanjem na vanjske stranice.
          </p>
        </section>

        <section>
          <h2>Vanjske poveznice</h2>
          <p>
            Stranica može sadržavati poveznice na vanjske web stranice. Klub
            nema kontrolu nad sadržajem tih stranica i ne odgovara za njihov
            sadržaj, dostupnost ili politiku privatnosti.
          </p>
        </section>

        <section>
          <h2>Mjerodavno pravo</h2>
          <p>
            Na sve odnose koji proizlaze iz korištenja ove web stranice
            primjenjuje se pravo Republike Hrvatske. Za sve sporove nadležan je
            stvarno nadležan sud prema sjedištu Kluba.
          </p>
        </section>
      </div>
    </article>
  );
}

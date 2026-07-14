import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getTenant } from "@/lib/payload/getTenant";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description:
    "Politika privatnosti i obrade osobnih podataka u skladu s GDPR-om.",
  alternates: { canonical: "/politika-privatnosti" },
};

export default async function PrivacyPolicyPage() {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const email = tenant.contact?.email ?? "[email kluba]";
  const address = tenant.contact?.address ?? "[adresa kluba]";
  const oib = tenant.legal?.oib ?? "[OIB nije postavljen]";
  const registryNumber =
    tenant.legal?.registryNumber ?? "[broj nije postavljen]";
  const lastUpdated = "28. svibnja 2026.";

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
      <PageHero
        eyebrow="Pravne informacije"
        title="Politika privatnosti"
        align="left"
        lineClassName="text-4xl sm:text-5xl md:text-6xl"
        className="mb-12"
      >
        <p className="text-sm text-muted-foreground">
          Zadnja izmjena: {lastUpdated}
        </p>
      </PageHero>

      <div className="prose prose-sm sm:prose-base max-w-none space-y-8 text-foreground/90 [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:font-semibold [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        <section>
          <p>
            Ova Politika privatnosti opisuje na koji način {name} (dalje:
            &bdquo;Klub&ldquo;) prikuplja, koristi i štiti osobne podatke
            posjetitelja web stranice, u skladu s Općom uredbom o zaštiti
            podataka (EU) 2016/679 (&bdquo;GDPR&ldquo;) i Zakonom o provedbi Opće
            uredbe o zaštiti podataka (NN 42/2018).
          </p>
        </section>

        <section>
          <h2>1. Voditelj obrade</h2>
          <p>Voditelj obrade osobnih podataka je:</p>
          <ul>
            <li>
              <strong>Naziv:</strong> {name}
            </li>
            <li>
              <strong>Sjedište:</strong> {address}
            </li>
            <li>
              <strong>OIB:</strong> {oib}
            </li>
            <li>
              <strong>Registar:</strong> Registar udruga Republike Hrvatske, br.{" "}
              {registryNumber}
            </li>
            <li>
              <strong>Kontakt e-pošta:</strong>{" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Koji se podaci prikupljaju</h2>
          <p>
            Web stranica Kluba ne traži unos osobnih podataka putem obrazaca.
            Prilikom posjete stranici automatski se prikupljaju samo tehnički
            podaci nužni za rad i analizu pristupa:
          </p>
          <ul>
            <li>
              <strong>Server logovi:</strong> IP adresa, vrijeme pristupa,
              posjećeni URL, korisnički agent (browser i OS), HTTP referer.
            </li>
            <li>
              <strong>Analitika posjeta</strong> (Vercel Analytics): anonimizirani
              podaci o broju posjeta i osnovnim metrikama. Ne koriste se
              kolačići. Podaci se obrađuju bez identifikacije pojedinca.
            </li>
            <li>
              <strong>Performance mjerenja</strong> (Vercel Speed Insights):
              tehničke metrike o brzini učitavanja stranice. Bez kolačića.
            </li>
          </ul>
          <p>
            Klub <strong>ne koristi</strong> Google Analytics, Meta Pixel niti
            druge oglasne ili marketinške alate koji prate korisnike.
          </p>
        </section>

        <section>
          <h2>3. Svrhe i pravne osnove obrade</h2>
          <ul>
            <li>
              <strong>Pružanje sadržaja i rad web stranice</strong>. Pravna
              osnova: legitimni interes Kluba (čl. 6. st. 1. t. f) GDPR-a).
            </li>
            <li>
              <strong>Sigurnost i sprječavanje zlouporabe</strong> (server
              logovi). Pravna osnova: legitimni interes.
            </li>
            <li>
              <strong>Statistika posjeta</strong>. Pravna osnova: legitimni
              interes Kluba za razumijevanje korištenja stranice. Obrada je
              ograničena na agregirane, anonimizirane podatke.
            </li>
            <li>
              <strong>Odgovor na upite</strong> putem objavljenog e-mail
              kontakta. Pravna osnova: legitimni interes / poduzimanje radnji
              prije sklapanja ugovora.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Kolačići</h2>
          <p>
            Web stranica Kluba <strong>ne postavlja vlastite kolačiće</strong>{" "}
            koji prate korisnika. Tehnologije trećih strana koje se koriste
            (Vercel Analytics, Speed Insights) ne koriste kolačiće za
            identifikaciju korisnika.
          </p>
          <p>
            Stranice koje uključuju ugrađene karte (OpenStreetMap) mogu od
            strane pružatelja postavljati osnovne tehničke kolačiće potrebne za
            prikaz karte. Ti kolačići ne služe profiliranju.
          </p>
        </section>

        <section>
          <h2>5. Sub-procesori i primatelji podataka</h2>
          <p>
            Klub koristi sljedeće pružatelje usluga koji u ime Kluba mogu
            obrađivati tehničke podatke posjetitelja:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (SAD): hosting stranice, analitika,
              speed insights. Obrada u skladu s Vercel DPA i standardnim
              ugovornim klauzulama EU.
            </li>
            <li>
              <strong>Cloudflare, Inc.</strong> (SAD): CDN i osnovna sigurnost.
            </li>
            <li>
              <strong>Cloudinary Ltd.</strong>: isporuka slika.
            </li>
            <li>
              <strong>Cloudflare R2</strong>: pohrana slika i medijskih
              datoteka.
            </li>
            <li>
              <strong>OpenStreetMap Foundation</strong>: prikaz karte lokacije.
            </li>
            <li>
              <strong>Hrvatski nogometni savez (HNS)</strong>: javni podaci o
              natjecanjima preuzimaju se iz HNS sustava radi prikaza rasporeda i
              rezultata.
            </li>
          </ul>
          <p>
            Klub <strong>ne prodaje</strong> osobne podatke trećim stranama i ne
            koristi ih u marketinške svrhe.
          </p>
        </section>

        <section>
          <h2>6. Razdoblje čuvanja</h2>
          <ul>
            <li>
              <strong>Server logovi:</strong> do 30 dana, nakon čega se brišu
              ili anonimiziraju.
            </li>
            <li>
              <strong>Analitički podaci:</strong> agregirani podaci čuvaju se do
              godinu dana.
            </li>
            <li>
              <strong>E-mail korespondencija:</strong> dok je potrebna za svrhu
              radi koje je upit poslan, najduže do 2 godine od posljednje
              komunikacije.
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Vaša prava</h2>
          <p>
            U skladu s GDPR-om imate sljedeća prava u odnosu na obradu vaših
            osobnih podataka:
          </p>
          <ul>
            <li>
              <strong>Pravo na pristup</strong>: saznati obrađuju li se vaši
              podaci i koji.
            </li>
            <li>
              <strong>Pravo na ispravak</strong> netočnih ili nepotpunih
              podataka.
            </li>
            <li>
              <strong>Pravo na brisanje</strong> (&bdquo;zaborav&ldquo;), kada
              za obradu više nema pravne osnove.
            </li>
            <li>
              <strong>Pravo na ograničenje obrade</strong>.
            </li>
            <li>
              <strong>Pravo na prigovor</strong> obradi koja se temelji na
              legitimnom interesu.
            </li>
            <li>
              <strong>Pravo na prenosivost podataka</strong>.
            </li>
            <li>
              <strong>Pravo na pritužbu</strong> Agenciji za zaštitu osobnih
              podataka (AZOP), Selska cesta 136, 10000 Zagreb (
              <a
                href="https://azop.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                azop.hr
              </a>
              ).
            </li>
          </ul>
          <p>
            Za ostvarivanje prava obratite se na{" "}
            <a href={`mailto:${email}`} className="underline">
              {email}
            </a>
            . Na zahtjev ćemo odgovoriti u roku od najviše 30 dana.
          </p>
        </section>

        <section>
          <h2>8. Sigurnost podataka</h2>
          <p>
            Klub primjenjuje razumne tehničke i organizacijske mjere za zaštitu
            podataka od neovlaštenog pristupa, gubitka ili promjene. Sva
            komunikacija s web stranicom odvija se preko HTTPS-a.
          </p>
        </section>

        <section>
          <h2>9. Maloljetnici</h2>
          <p>
            Web stranica nije namijenjena prikupljanju osobnih podataka osoba
            mlađih od 16 godina. Ako saznamo da smo nenamjerno prikupili takve
            podatke, izbrisat ćemo ih bez odgode.
          </p>
        </section>

        <section>
          <h2>10. Izmjene Politike privatnosti</h2>
          <p>
            Klub zadržava pravo izmjene ove Politike. Datum posljednje izmjene
            naveden je na vrhu stranice. Bitne izmjene bit će istaknute na
            naslovnici.
          </p>
        </section>
      </div>
    </article>
  );
}

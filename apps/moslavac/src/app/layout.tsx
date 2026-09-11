import { Archivo, Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ClubRootShell from "@/lib/app-shell/shell/ClubRootShell";
import { clubMetadataRoute } from "@/lib/app-shell/shell/clubRoutes";
import { fetchCurrentSeasonCompetitions } from "@/lib/hns/competitions";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/**
 * Display pismo. Naslovi su prije bili Geist Black — isto pismo kao tekst, pa
 * su se od njega razlikovali samo debljinom. Archivo je zbijeniji grotesk s
 * pravom težinom 900, pa `font-display font-black uppercase` po komponentama
 * ostaje nepromijenjen i ne izaziva sintetičko podebljanje.
 *
 * `latin-ext` nosi č, ć, š, ž, đ.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const generateMetadata = clubMetadataRoute(BASE_URL);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tenant, competitions] = await Promise.all([
    getTenant(),
    fetchCurrentSeasonCompetitions(),
  ]);

  return (
    <ClubRootShell
      fontVariables={`${geistSans.variable} ${archivo.variable}`}
      baseUrl={BASE_URL}
    >
      {/* Tipkovnicom se glavni sadržaj dohvaća bez prolaska kroz navigaciju
          i izbornik natjecanja. Vidljiv je tek kad primi fokus. */}
      <a
        href="#glavni-sadrzaj"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-club focus:px-6 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.2em] focus:text-chalk"
      >
        Preskoči na sadržaj
      </a>
      <Header tenant={tenant} competitions={competitions} />
      <main id="glavni-sadrzaj" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer tenant={tenant} />
    </ClubRootShell>
  );
}

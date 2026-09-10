import { Anton, Archivo } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ClubRootShell from "@/lib/app-shell/shell/ClubRootShell";
import { clubMetadataRoute } from "@/lib/app-shell/shell/clubRoutes";
import { fetchClubDetails } from "@/lib/hns/team";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

async function getClubDetailsForLayout() {
  try {
    return await fetchClubDetails();
  } catch (error) {
    console.error("Failed to fetch HNS club details for layout", error);
    return null;
  }
}

export const generateMetadata = clubMetadataRoute(BASE_URL);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tenant, clubDetails] = await Promise.all([
    getTenant(),
    getClubDetailsForLayout(),
  ]);

  return (
    <ClubRootShell
      fontVariables={`${archivo.variable} ${anton.variable}`}
      baseUrl={BASE_URL}
    >
      {/* Tipkovnicom se glavni sadržaj dohvaća bez prolaska kroz cijelu
          navigaciju. Vidljiv je tek kad primi fokus. */}
      <a
        href="#glavni-sadrzaj"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-club-red focus:px-5 focus:py-3 focus:text-xs focus:font-black focus:uppercase focus:tracking-[0.18em] focus:text-white"
      >
        Preskoči na sadržaj
      </a>
      <Header tenant={tenant} />
      <main
        id="glavni-sadrzaj"
        tabIndex={-1}
        className="flex-1 overflow-x-clip"
      >
        {children}
      </main>
      <Footer tenant={tenant} clubDetails={clubDetails} />
    </ClubRootShell>
  );
}

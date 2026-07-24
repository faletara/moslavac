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
      <Header tenant={tenant} />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer tenant={tenant} clubDetails={clubDetails} />
    </ClubRootShell>
  );
}

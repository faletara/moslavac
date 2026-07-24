import { Geist } from "next/font/google";
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
    <ClubRootShell fontVariables={geistSans.variable} baseUrl={BASE_URL}>
      <Header tenant={tenant} competitions={competitions} />
      <main className="flex-1">{children}</main>
      <Footer tenant={tenant} />
    </ClubRootShell>
  );
}

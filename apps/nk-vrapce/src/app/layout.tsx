import { Geist, Saira_Condensed } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import FooterReveal from "@/components/layout/FooterReveal";
import Header from "@/components/layout/Header";
import ClubRootShell from "@/lib/app-shell/shell/ClubRootShell";
import { clubMetadataRoute } from "@/lib/app-shell/shell/clubRoutes";
import { getClubContact } from "@/lib/club/getClubContact";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const saira = Saira_Condensed({
  variable: "--font-saira",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

export const generateMetadata = clubMetadataRoute(BASE_URL);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tenant, clubContact] = await Promise.all([
    getTenant(),
    getClubContact(),
  ]);

  return (
    <ClubRootShell
      fontVariables={`${geistSans.variable} ${saira.variable}`}
      baseUrl={BASE_URL}
      // This club's content slides over a fixed footer, so the body must stay a
      // plain block — the shell's default flex column would pull the fixed
      // footer back into flow.
      bodyClassName=""
    >
      {/* Sadržaj klizi preko footera — neprozirni bijeli sloj iznad (z-10),
          s donjim razmakom jednakim visini footera da ga zadnji scroll otkrije. */}
      <div className="relative z-10 mb-[var(--footer-h,0px)] flex min-h-screen flex-col bg-canvas">
        <Header clubName={tenant.displayName} />
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer fiksiran na dnu viewporta, iza sadržaja (z-0) */}
      <div id="site-footer" className="fixed inset-x-0 bottom-0 z-0">
        <Footer tenant={tenant} contact={clubContact} />
      </div>
      <FooterReveal />
    </ClubRootShell>
  );
}

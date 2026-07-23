import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Saira_Condensed } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import FooterReveal from "@/components/layout/FooterReveal";
import Header from "@/components/layout/Header";
import Providers from "@/components/providers/Providers";
import ClubJsonLd from "@/lib/app-shell/identity/ClubJsonLd";
import { buildClubMetadata } from "@/lib/app-shell/identity/clubIdentity";
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

export async function generateMetadata(): Promise<Metadata> {
  return buildClubMetadata({ tenant: await getTenant(), baseUrl: BASE_URL });
}

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
    <html lang="hr" className={`${geistSans.variable} ${saira.variable}`}>
      <body>
        <ClubJsonLd tenant={tenant} baseUrl={BASE_URL} />
        <Providers tenant={tenant}>
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
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Providers from "@/components/providers/Providers";
import ClubJsonLd from "@/lib/app-shell/identity/ClubJsonLd";
import { buildClubMetadata } from "@/lib/app-shell/identity/clubIdentity";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return buildClubMetadata({ tenant: await getTenant(), baseUrl: BASE_URL });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenant();

  return (
    <html
      lang="hr"
      className={`${geistSans.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link
          rel="preconnect"
          href="https://pub-35bc4cccae554273b4931967f1b01ba9.r2.dev"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <ClubJsonLd tenant={tenant} baseUrl={BASE_URL} />
        <Providers tenant={tenant}>
          <Header tenant={tenant} />
          <main className="flex-1 overflow-x-clip">{children}</main>
          <Footer tenant={tenant} />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

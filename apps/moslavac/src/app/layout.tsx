import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Providers from "@/components/providers/Providers";
import { getTenant } from "@/lib/payload/getTenant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const motto = tenant.branding?.motto;
  const description = motto ?? `Službena web stranica nogometnog kluba ${name}`;

  const logo = tenant.branding?.logo;
  const logoUrl = !logo ? null : typeof logo === "string" ? logo : logo.url;
  const ogImage = logoUrl ?? "/naslovna.jpg";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
    ),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "hr_HR",
      siteName: name,
      title: name,
      description,
      images: [{ url: ogImage, alt: name }],
    },
    twitter: {
      card: "summary",
      title: name,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenant();

  const logo = tenant.branding?.logo;
  const logoUrl = !logo ? null : typeof logo === "string" ? logo : logo.url;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const sameAs = [tenant.social?.facebook, tenant.social?.youtube].filter(
    (v): v is string => Boolean(v),
  );

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: tenant.displayName,
    sport: "Football",
    url: baseUrl,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <html lang="hr" className={`${geistSans.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link
          rel="preconnect"
          href="https://pub-35bc4cccae554273b4931967f1b01ba9.r2.dev"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Providers tenant={tenant}>
          <Header tenant={tenant} />
          <main className="flex-1">{children}</main>
          <Footer tenant={tenant} />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Providers from "@/components/providers/Providers";
import { getTenant } from "@/lib/payload/getTenant";
import { BASE_URL } from "@/lib/siteUrl";

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
    metadataBase: new URL(BASE_URL),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "hr_HR",
      siteName: name,
      title: name,
      description,
      images: [{ url: ogImage, alt: name, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [ogImage],
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
  const baseUrl = BASE_URL;
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

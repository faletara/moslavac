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

/**
 * Common alternate names people actually search for, derived generically from
 * the club's display name (e.g. "NK Primjer" → "Primjer", "Primjer").
 * Feeds schema.org `alternateName` so Google links these queries to the club
 * entity. Tenant-safe: no hardcoded names.
 */
function clubNameVariants(
  displayName: string,
  shortName?: string | null,
): string[] {
  const variants = new Set<string>();
  const prefixRe = /^(SNK|ŠNK|HNK|GNK|MNK|NK|NŠ|ŠK)\s+/i;
  const bare = displayName.replace(prefixRe, "").trim();
  if (bare && bare !== displayName) {
    variants.add(bare);
    variants.add(`NK ${bare}`);
  }
  if (shortName) variants.add(shortName);
  variants.delete(displayName);
  return [...variants];
}

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
  const shortName = tenant.branding?.shortName;
  const motto = tenant.branding?.motto;
  const altNames = clubNameVariants(tenant.displayName, shortName);
  const founded = tenant.branding?.founded;
  const address = tenant.contact?.address;
  const email = tenant.contact?.email;
  const phone = tenant.contact?.phone;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: tenant.displayName,
    ...(altNames.length > 0 ? { alternateName: altNames } : {}),
    ...(motto ? { slogan: motto } : {}),
    sport: "Football",
    url: baseUrl,
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(founded ? { foundingDate: String(founded) } : {}),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address,
            addressLocality: "Popovača",
            addressRegion: "Sisačko-moslavačka županija",
            addressCountry: "HR",
          },
        }
      : {}),
    ...(email ? { email } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <html lang="hr" className={`${geistSans.variable}`}>
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

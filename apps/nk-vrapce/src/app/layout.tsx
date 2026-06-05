import type { Metadata } from "next";
import { Geist, Saira_Condensed } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Providers from "@/components/providers/Providers";
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

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "NK Vrapče",
    template: "%s | NK Vrapče",
  },
  description: "Službena web stranica nogometnog kluba NK Vrapče.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenant();

  return (
    <html lang="hr" className={`${geistSans.variable} ${saira.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header clubName={tenant.displayName} />
          <main className="flex-1">{children}</main>
          <Footer tenant={tenant} />
        </Providers>
      </body>
    </html>
  );
}

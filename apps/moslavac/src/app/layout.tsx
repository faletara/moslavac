import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getTenant } from "@/lib/payload/getTenant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const motto = tenant.branding?.motto;
  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description:
      motto ?? `Službena web stranica nogometnog kluba ${name}`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getTenant();
  return (
    <html lang="hr" className={`${geistSans.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Providers tenant={tenant}>
          <Header tenant={tenant} />
          <main className="flex-1">{children}</main>
          <Footer tenant={tenant} />
        </Providers>
      </body>
    </html>
  );
}

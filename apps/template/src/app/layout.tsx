import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { BASE_URL } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Novi klub",
  description: "Web stranica nogometnog kluba.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className={geistSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

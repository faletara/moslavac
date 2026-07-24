import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClubJsonLd from "@/lib/app-shell/identity/ClubJsonLd";
import Providers from "@/components/providers/Providers";
import { getTenant } from "@/lib/payload/getTenant";

/**
 * The frame every Club app's root layout renders into: document shell, club
 * identity, providers and analytics. What genuinely varies per club — fonts and
 * the Header/main/Footer arrangement — stays with the club, so a layout that
 * needs a different body structure (nk-vrapce's revealed footer) is not fighting
 * the shell.
 *
 * The Tenant is fetched here rather than passed in; `getTenant` is request
 * cached, so a club layout fetching it again for its own Header costs nothing.
 */

/** Hosts every club's images come from — preconnected before first paint. */
const IMAGE_ORIGINS = [
  "https://res.cloudinary.com",
  "https://pub-35bc4cccae554273b4931967f1b01ba9.r2.dev",
];

export default async function ClubRootShell({
  fontVariables,
  baseUrl,
  bodyClassName = "flex min-h-screen flex-col",
  children,
}: {
  /** Font CSS-variable class names, e.g. `${geist.variable} ${anton.variable}`. */
  fontVariables: string;
  baseUrl: string;
  /** Override only when the club's layout owns its own body flow. */
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const tenant = await getTenant();

  return (
    <html lang="hr" className={`${fontVariables} antialiased`}>
      <head>
        {IMAGE_ORIGINS.map((origin) => (
          <link key={origin} rel="preconnect" href={origin} />
        ))}
      </head>
      <body className={bodyClassName}>
        <ClubJsonLd tenant={tenant} baseUrl={baseUrl} />
        <Providers tenant={tenant}>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

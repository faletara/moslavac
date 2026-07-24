import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTenant } from "@/lib/payload/getTenant";

/**
 * Zadana OG/Twitter kartica kluba: grb u sredini na klupskoj podlozi. Koristi se
 * kad stranica nema vlastitu sliku. Grb se uzima iz Tenanta (logotip uploadan u
 * CMS-u), a ako ga tamo nema — iz lokalne datoteke koju klub navede.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type CrestCardInput = {
  /** CSS podloga kartice — klupska boja ili gradijent. */
  background: string;
  /** Pričuvni grb u `public/`, npr. `crest.png`. Koristi se bez logotipa u CMS-u. */
  crestFile?: string;
  /** Stranica kvadratnog okvira u koji grb stane. */
  crestSize?: number;
  /** Boja teksta u pričuvnom prikazu kada klub nema nikakav grb. */
  color?: string;
};

function tenantLogoUrl(logo: unknown): string | null {
  const url =
    typeof logo === "string"
      ? logo
      : typeof logo === "object" && logo !== null && "url" in logo
        ? (logo as { url?: string | null }).url
        : null;
  // Satori dohvaća samo apsolutne adrese; relativna bi se tiho izgubila.
  return url && /^https?:\/\//i.test(url) ? url : null;
}

/** Lokalni grb se ugrađuje kao data URI — Satori ne čita s diska sam. */
async function localCrestSrc(crestFile: string): Promise<string | null> {
  try {
    const bytes = await readFile(join(process.cwd(), "public", crestFile), "base64");
    return `data:image/png;base64,${bytes}`;
  } catch {
    return null;
  }
}

export async function renderClubCrestCard({
  background,
  crestFile,
  crestSize = 420,
  color = "#ffffff",
}: CrestCardInput): Promise<ImageResponse> {
  const tenant = await getTenant();
  const crestSrc =
    tenantLogoUrl(tenant.branding?.logo) ??
    (crestFile ? await localCrestSrc(crestFile) : null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          color,
        }}
      >
        {crestSrc ? (
          <img
            src={crestSrc}
            width={crestSize}
            height={crestSize}
            style={{ objectFit: "contain" }}
            alt=""
          />
        ) : (
          // Bez grba kartica ne smije ostati prazna — ime kluba je zadnja obrana.
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -1,
              textAlign: "center",
              padding: "0 96px",
            }}
          >
            {tenant.displayName}
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE },
  );
}

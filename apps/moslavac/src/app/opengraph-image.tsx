import { ImageResponse } from "next/og";
import { getTenant } from "@/lib/payload/getTenant";

// Generated default OG/Twitter card: the club name on the club's navy backdrop.
// Used whenever a page has no image of its own. A club can drop a real
// app/opengraph-image.(jpg|png) to override.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Iz `globals.css` (--navy-deep, --club) — ImageResponse ne vidi CSS varijable.
const NAVY_DEEP = "#020718";

export default async function OpengraphImage() {
  const tenant = await getTenant();
  const motto = tenant.branding?.motto;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: "0 96px",
          textAlign: "center",
          color: "#ffffff",
          // Reflektorski sjaj kao na navy sekcijama — gradijent, ne blur.
          backgroundColor: NAVY_DEEP,
          backgroundImage: `radial-gradient(circle at 20% 8%, rgba(17,76,191,0.42) 0%, rgba(17,76,191,0.12) 32%, rgba(2,7,24,0) 60%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1.05,
          }}
        >
          {tenant.displayName}
        </div>
        {motto ? (
          <div style={{ display: "flex", fontSize: 34, opacity: 0.7 }}>
            {motto}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}

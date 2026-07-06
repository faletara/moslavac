import { ImageResponse } from "next/og";
import { getTenant } from "@/lib/payload/getTenant";

// Generated default OG/Twitter card: the club name on a neutral backdrop. Used
// whenever a page (or the tenant) has no explicit image. A club can drop a real
// app/opengraph-image.(jpg|png) to override.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0f172a",
          color: "#ffffff",
          padding: "0 96px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
          {tenant.displayName}
        </div>
        {motto ? (
          <div style={{ display: "flex", fontSize: 34, opacity: 0.7 }}>{motto}</div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}

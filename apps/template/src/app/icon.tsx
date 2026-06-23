import { ImageResponse } from "next/og";
import { getTenant } from "@/lib/payload/getTenant";

// Generated favicon: a neutral monogram from the club's initial. A club can
// replace this with a real icon file (app/icon.png) to override.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const tenant = await getTenant();
  const source = tenant.branding?.shortName ?? tenant.displayName;
  const letter = source.trim().charAt(0).toUpperCase() || "•";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e293b",
          color: "#ffffff",
          fontSize: 40,
          fontWeight: 700,
          borderRadius: 12,
        }}
      >
        {letter}
      </div>
    ),
    { ...size },
  );
}

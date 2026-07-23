import { ImageResponse } from "next/og";
import { formatDateTime } from "@/lib/helpers/date";
import { loadGoogleFont } from "@/lib/helpers/googleFont";
import { fetchHnsCrestDataUri } from "@/lib/hns/images";
import { fetchMatchInfo } from "@/lib/hns/matches";
import { parseTrailingId } from "@/lib/helpers/slug";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Utakmica";

const INK = "#1b1b20";
const RED = "#de2025";

function Crest({ src }: { src: string | null }) {
  if (!src) return <div style={{ display: "flex", width: 180, height: 180 }} />;
  return (
    <img
      src={src}
      width={180}
      height={180}
      alt=""
      style={{ objectFit: "contain" }}
    />
  );
}

function TeamName({ name }: { name: string }) {
  return (
    <div
      style={{
        display: "flex",
        marginTop: 24,
        maxWidth: 340,
        fontSize: name.length > 22 ? 32 : 40,
        lineHeight: 1.05,
        textTransform: "uppercase",
        textAlign: "center",
        justifyContent: "center",
        color: "#ffffff",
      }}
    >
      {name}
    </div>
  );
}

export default async function MatchOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = await fetchMatchInfo({ matchId: parseTrailingId(slug) });

  if (!match) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: INK,
            color: "#ffffff",
            fontSize: 56,
          }}
        >
          HNK Sloga Mravince
        </div>
      ),
      { ...size },
    );
  }

  const [homeCrest, awayCrest, anton] = await Promise.all([
    fetchHnsCrestDataUri(match.homeTeam?.picture),
    fetchHnsCrestDataUri(match.awayTeam?.picture),
    loadGoogleFont("Anton", 400),
  ]);

  const home = match.homeTeam?.name ?? "Domaćin";
  const away = match.awayTeam?.name ?? "Gost";
  const homeScore = match.score.home?.current;
  const awayScore = match.score.away?.current;
  const hasScore = homeScore != null && awayScore != null;

  const { date, time } = match.kickoffAtUtcMs
    ? formatDateTime(match.kickoffAtUtcMs)
    : { date: "", time: "" };

  const meta = [match.competition?.name?.trim(), date && `${date} · ${time}`]
    .filter(Boolean)
    .join("  ·  ");

  // `fontFamily` must be OMITTED, never set to `undefined`: satori calls
  // `.split(",")` on whatever the key holds, so an explicit `undefined` crashes
  // the render — and it crashes while the response is being piped, where no
  // try/catch on the route can see it. Spread it in only when the font loaded.
  const displayFont = anton ? { fontFamily: "Anton" } : {};

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
          // Crveni sjaj kao na ink sekcijama stranice — kao radijalni gradijent,
          // NE kao krug s `blur`: satori ne podržava filtere, pa bi zamućeni krug
          // ispao kao tvrda bordo mrlja.
          backgroundColor: INK,
          backgroundImage: `radial-gradient(circle at 8% 50%, rgba(222,32,37,0.30) 0%, rgba(222,32,37,0.10) 28%, rgba(27,27,32,0) 55%)`,
          padding: "0 72px",
          ...displayFont,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 340,
            }}
          >
            <Crest src={homeCrest} />
            <TeamName name={home} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              fontSize: 132,
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            {hasScore ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                <div style={{ display: "flex" }}>{homeScore}</div>
                <div style={{ display: "flex", color: RED, fontSize: 88 }}>
                  :
                </div>
                <div style={{ display: "flex" }}>{awayScore}</div>
              </div>
            ) : (
              <div style={{ display: "flex", color: RED, fontSize: 96 }}>VS</div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 340,
            }}
          >
            <Crest src={awayCrest} />
            <TeamName name={away} />
          </div>
        </div>

        {meta && (
          <div
            style={{
              display: "flex",
              marginTop: 64,
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.14)",
              width: "100%",
              justifyContent: "center",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {meta}
          </div>
        )}
      </div>
    ),
    {
      ...size,
      ...(anton
        ? {
            fonts: [
              {
                name: "Anton",
                data: anton,
                style: "normal" as const,
                weight: 400 as const,
              },
            ],
          }
        : {}),
    },
  );
}

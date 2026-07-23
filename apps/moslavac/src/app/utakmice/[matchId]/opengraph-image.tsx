import { ImageResponse } from "next/og";
import { formatDateTime } from "@/lib/helpers/date";
import { loadGoogleFont } from "@/lib/helpers/googleFont";
import { fetchHnsCrestDataUri } from "@/lib/hns/images";
import { fetchMatchInfo } from "@/lib/hns/matches";
import { parseTrailingId } from "@/lib/helpers/slug";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Utakmica";

// Iz `globals.css` (--navy-deep, --club, --club-red) — ImageResponse ne vidi
// CSS varijable, pa su tokeni ovdje razriješeni u hex.
const NAVY_DEEP = "#020718";
const CLUB = "#114cbf";
const CLUB_RED = "#d01d21";

function Crest({ src }: { src: string | null }) {
  if (!src) return <div style={{ display: "flex", width: 170, height: 170 }} />;
  return (
    <img
      src={src}
      width={170}
      height={170}
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
        marginTop: 26,
        maxWidth: 330,
        fontSize: name.length > 22 ? 30 : 38,
        fontWeight: 700,
        letterSpacing: -0.5,
        lineHeight: 1.1,
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
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const match = await fetchMatchInfo({ matchId: parseTrailingId(matchId) });

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
            background: NAVY_DEEP,
            color: "#ffffff",
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          SNK Moslavac
        </div>
      ),
      { ...size },
    );
  }

  // Geist u obje težine koje poster koristi: satori tiho ignorira `fontWeight`
  // za koji nema učitan rez, pa bi bez ovoga sve ispalo u regularu.
  const [homeCrest, awayCrest, geistBold, geistRegular] = await Promise.all([
    fetchHnsCrestDataUri(match.homeTeam?.picture),
    fetchHnsCrestDataUri(match.awayTeam?.picture),
    loadGoogleFont("Geist", 700),
    loadGoogleFont("Geist", 400),
  ]);

  const fonts = [
    geistBold && {
      name: "Geist",
      data: geistBold,
      weight: 700 as const,
      style: "normal" as const,
    },
    geistRegular && {
      name: "Geist",
      data: geistRegular,
      weight: 400 as const,
      style: "normal" as const,
    },
  ].filter((font) => font !== null);

  // `fontFamily` mora biti IZOSTAVLJEN, nikad postavljen na `undefined`: satori
  // nad vrijednošću tog ključa zove `.split(",")`, pa eksplicitni `undefined`
  // sruši render — i to tijekom streamanja, gdje ga nijedan try/catch ne vidi.
  const displayFont = fonts.length > 0 ? { fontFamily: "Geist" } : {};

  const home = match.homeTeam?.name ?? "Domaćin";
  const away = match.awayTeam?.name ?? "Gost";
  const homeScore = match.score.home?.current;
  const awayScore = match.score.away?.current;
  const hasScore = homeScore != null && awayScore != null;

  const { date, time } = match.kickoffAtUtcMs
    ? formatDateTime(match.kickoffAtUtcMs)
    : { date: "", time: "" };

  const meta = [match.competition?.name?.trim(), date && `${date} ${time}`]
    .filter(Boolean)
    .join("  /  ");

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
          padding: "0 72px",
          // Reflektorski sjaj kluba — kao radijalni gradijent, NE kao krug s
          // `blur`: satori ne podržava filtere, pa bi zamućeni krug ispao kao
          // tvrda mrlja.
          backgroundColor: NAVY_DEEP,
          backgroundImage: `radial-gradient(circle at 20% 8%, rgba(17,76,191,0.42) 0%, rgba(17,76,191,0.12) 32%, rgba(2,7,24,0) 60%)`,
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
              width: 330,
            }}
          >
            <Crest src={homeCrest} />
            <TeamName name={home} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              fontSize: 124,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            {hasScore ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <div style={{ display: "flex" }}>{homeScore}</div>
                <div
                  style={{ display: "flex", color: CLUB_RED, fontSize: 84 }}
                >
                  :
                </div>
                <div style={{ display: "flex" }}>{awayScore}</div>
              </div>
            ) : (
              <div style={{ display: "flex", color: CLUB, fontSize: 88 }}>
                VS
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 330,
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
              marginTop: 60,
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.14)",
              width: "100%",
              justifyContent: "center",
              fontSize: 23,
              fontWeight: 400,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {meta}
          </div>
        )}
      </div>
    ),
    { ...size, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}

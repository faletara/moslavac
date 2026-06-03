import { notFound } from "next/navigation";
import { HnsCrest } from "@/components/HnsCrest";
import { Progress } from "@/components/ui/progress";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import { fetchPlayerDetails, fetchPlayerStats } from "@/lib/hns/players";
import { parseTrailingId } from "@/lib/slug";

interface Props {
  params: Promise<{ playerId: string; competitionId: string }>;
}

export const revalidate = 600;

export default async function PlayerStatsPage({ params }: Props) {
  const { playerId, competitionId } = await params;
  const personId = String(parseTrailingId(playerId));
  const cid = parseTrailingId(competitionId);

  const [playerDetails, playerStats] = await Promise.all([
    fetchPlayerDetails({ personId }),
    fetchPlayerStats({ personId, competitionId: cid }),
  ]);

  if (!playerDetails) notFound();

  const playerName = playerDetails.name ?? "";
  const position = playerDetails.position ?? "";
  const age = playerDetails.age;
  const picture = playerDetails.picture;
  const shirtNumber = playerDetails.shirtNumber;
  const isCaptain = playerDetails.captain ?? false;

  const appearances = playerStats?.matchesPlayed ?? 0;
  const goals = playerStats?.goals ?? 0;
  const yellowCards = playerStats?.yellowCards ?? 0;
  const redCards = playerStats?.redCards ?? 0;
  const minutesPlayed = playerStats?.minutesPlayed ?? 0;
  const fullMatches = playerStats?.fullMatchesPlayed ?? 0;
  const penalties = playerStats?.penalties ?? 0;
  const ownGoals = playerStats?.ownGoals ?? 0;
  const competitionName = playerStats?.competition?.name ?? "";
  const maxMinutes = appearances * 90;
  const minutesPct = maxMinutes > 0 ? (minutesPlayed / maxMinutes) * 100 : 0;

  const eyebrowParts = [
    shirtNumber != null ? `#${String(shirtNumber).padStart(2, "0")}` : null,
    position || null,
    isCaptain ? "Kapetan" : null,
  ].filter(Boolean) as string[];

  const subEyebrowParts = [
    age != null ? `Dob · ${age}` : null,
    competitionName || null,
  ].filter(Boolean) as string[];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-24">
      <TrackEvent
        event="Player Profile View"
        props={{ player: playerName, playerId }}
      />

      <header className="flex flex-col items-center gap-8">
        {eyebrowParts.length > 0 && (
          <p>{eyebrowParts.join(" · ")}</p>
        )}

        <HnsCrest
          picture={picture}
          name={playerName}
          size={160}
          className="size-32 sm:size-40"
        />

        <h1>
          <span className="block">
            {playerName}
          </span>
        </h1>

        {subEyebrowParts.length > 0 && (
          <p>{subEyebrowParts.join(" · ")}</p>
        )}
      </header>

      {playerStats ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatCell label="Nastupi" value={appearances} tier="primary" />
            <StatCell label="Golovi" value={goals} tier="primary" />
            <StatCell label="Žuti kartoni" value={yellowCards} tier="primary" />
            <StatCell label="Crveni kartoni" value={redCards} tier="primary" />
          </div>
          <div className="grid grid-cols-3">
            <StatCell label="Pune utakmice" value={fullMatches} tier="secondary" />
            <StatCell label="Penali" value={penalties} tier="secondary" />
            <StatCell label="Autogolovi" value={ownGoals} tier="secondary" />
          </div>
        </div>
      ) : (
        <p>Statistika nije dostupna za ovo natjecanje</p>
      )}

      {playerStats && maxMinutes > 0 && (
        <div>
          <div className="flex items-end justify-between gap-4 pb-4">
            <span>Odigrane minute</span>
            <span>
              <span>{minutesPlayed}</span>
              <span>
                {" / "}
                {maxMinutes}
              </span>
            </span>
          </div>
          <Progress
            value={Math.min(100, Math.max(0, minutesPct))}
            className="h-[2px]"
          />
        </div>
      )}
    </section>
  );
}

function StatCell({
  label,
  value,
  tier,
}: {
  label: string;
  value: number;
  tier: "primary" | "secondary";
}) {
  const isPrimary = tier === "primary";
  return (
    <div
      className={
        isPrimary
          ? "flex flex-col items-center justify-center gap-3 px-4 py-10 sm:py-14"
          : "flex flex-col items-center justify-center gap-3 px-4 py-6 sm:py-8"
      }
    >
      <span>{value}</span>
      <span>{label}</span>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { TrackEvent } from "@/components/analytics/TrackEvent";
import PlayerHero from "@/components/features/players/PlayerHero";
import { fetchPlayerDetails, fetchPlayerStats } from "@/lib/hns/players";
import { redirectToCanonical } from "@/lib/canonical";
import { BASE_URL } from "@/lib/siteUrl";
import {
  buildCompetitionSlug,
  buildPlayerSlug,
  parseTrailingId,
} from "@/lib/slug";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ playerId: string; competitionId: string }>;
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { playerId, competitionId } = await params;
  const personId = String(parseTrailingId(playerId));
  const cid = parseTrailingId(competitionId);

  const [details, stats] = await Promise.all([
    fetchPlayerDetails({ personId }),
    fetchPlayerStats({ personId, competitionId: cid }),
  ]);
  if (!details) return {};

  const name = details.name ?? "Igrač";
  const competitionName = stats?.competition?.name;
  const description = competitionName
    ? `Statistika igrača ${name} u natjecanju ${competitionName}: nastupi, golovi, kartoni i minute.`
    : `Profil i statistika igrača ${name}.`;

  const playerSlug = buildPlayerSlug({ personId: Number(personId), name });
  const competitionSlug = stats?.competition
    ? buildCompetitionSlug(stats.competition)
    : competitionId;
  const canonical = `${BASE_URL}/statistika/${playerSlug}/${competitionSlug}`;

  return {
    title: name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      title: name,
      description,
      images: [{ url: "/naslovna.jpg", alt: name, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: ["/naslovna.jpg"],
    },
  };
}

export default async function PlayerStatsPage({ params }: Props) {
  const { playerId, competitionId } = await params;
  const personId = String(parseTrailingId(playerId));
  const cid = parseTrailingId(competitionId);

  const [playerDetails, playerStats] = await Promise.all([
    fetchPlayerDetails({ personId }),
    fetchPlayerStats({ personId, competitionId: cid }),
  ]);

  if (!playerDetails) notFound();

  // Collapse numeric/partial-slug duplicates onto the canonical slug URL.
  const playerSlug = buildPlayerSlug({
    personId: Number(personId),
    name: playerDetails.name,
  });
  const competitionSlug = playerStats?.competition
    ? buildCompetitionSlug(playerStats.competition)
    : competitionId;
  redirectToCanonical(
    `/statistika/${playerId}/${competitionId}`,
    `/statistika/${playerSlug}/${competitionSlug}`,
  );

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
    <div className="pb-16 sm:pb-24">
      <TrackEvent
        event="Player Profile View"
        props={{ player: playerName, playerId }}
      />

      <PlayerHero
        name={playerName}
        picture={picture ?? null}
        eyebrowParts={eyebrowParts}
        subParts={subEyebrowParts}
        shirtNumber={shirtNumber ?? null}
      />

      <div className="mx-auto w-full max-w-5xl space-y-16 px-4 pt-16 sm:space-y-20 sm:pt-24">
      {playerStats ? (
        <div className="space-y-px">
          <div className="grid grid-cols-2 divide-x divide-y divide-border/40 border-y border-border/60 md:grid-cols-4 md:divide-y-0">
            <StatCell label="Nastupi" value={appearances} tier="primary" />
            <StatCell label="Golovi" value={goals} tier="primary" />
            <StatCell label="Žuti kartoni" value={yellowCards} tier="primary" />
            <StatCell label="Crveni kartoni" value={redCards} tier="primary" />
          </div>
          <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/60">
            <StatCell label="Pune utakmice" value={fullMatches} tier="secondary" />
            <StatCell label="Penali" value={penalties} tier="secondary" />
            <StatCell label="Autogolovi" value={ownGoals} tier="secondary" />
          </div>
        </div>
      ) : (
        <p className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
          Statistika nije dostupna za ovo natjecanje
        </p>
      )}

      {playerStats && maxMinutes > 0 && (
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem]">
              Odigrane minute
            </span>
            <span className="font-display font-black tabular-nums leading-none tracking-tighter text-foreground">
              <span className="text-3xl sm:text-5xl">{minutesPlayed}</span>
              <span className="text-base text-muted-foreground sm:text-lg">
                {" / "}
                {maxMinutes}
              </span>
            </span>
          </div>
          <Progress
            value={Math.min(100, Math.max(0, minutesPct))}
            className="h-[2px] rounded-none bg-border/40 *:data-[slot=progress-indicator]:bg-foreground"
          />
        </div>
      )}
      </div>
    </div>
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
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-4 text-center",
        isPrimary ? "py-10 sm:py-14" : "py-6 sm:py-8",
      )}
    >
      <span
        className={cn(
          "font-display font-black tabular-nums leading-none tracking-tighter",
          isPrimary
            ? "text-5xl text-foreground sm:text-7xl"
            : "text-2xl text-muted-foreground sm:text-3xl",
        )}
      >
        {value}
      </span>
      <span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.65rem]">
        {label}
      </span>
    </div>
  );
}

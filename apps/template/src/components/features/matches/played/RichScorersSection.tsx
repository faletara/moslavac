"use client";

import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { getScorers, type ScorerEntry } from "@/lib/helpers/events";
import { buildPlayerSlug } from "@/lib/slug";
import { cn } from "@/lib/utils";
import type { HnsMatch, HnsMatchEvent } from "@/types/hns";

interface RichScorersSectionProps {
  match: HnsMatch;
  events: HnsMatchEvent[] | undefined;
}

export default function RichScorersSection({
  match,
  events,
}: RichScorersSectionProps) {
  const ourTeamId = useOurTeamId();
  const scorers = getScorers(events);
  const hasAny = scorers.home.length > 0 || scorers.away.length > 0;
  if (!hasAny) return null;

  const homeGoals = match.homeTeamResult?.current ?? 0;
  const awayGoals = match.awayTeamResult?.current ?? 0;
  const competitionId = match.competition?.id ?? null;

  return (
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col items-center gap-6">
        <p>Tko je tresao mreže</p>
        <h2>Strijelci</h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2">
        <TeamScorersColumn
          teamName={match.homeTeam?.name ?? "Domaći"}
          teamPicture={match.homeTeam?.picture ?? null}
          scorers={scorers.home}
          totalGoals={homeGoals}
          competitionId={competitionId}
          isOurTeam={
            ourTeamId != null && match.homeTeam?.id === ourTeamId
          }
          align="right"
        />
        <TeamScorersColumn
          teamName={match.awayTeam?.name ?? "Gosti"}
          teamPicture={match.awayTeam?.picture ?? null}
          scorers={scorers.away}
          totalGoals={awayGoals}
          competitionId={competitionId}
          isOurTeam={
            ourTeamId != null && match.awayTeam?.id === ourTeamId
          }
          align="left"
        />
      </div>
    </section>
  );
}

function TeamScorersColumn({
  teamName,
  teamPicture,
  scorers,
  totalGoals,
  competitionId,
  isOurTeam,
  align,
}: {
  teamName: string;
  teamPicture: string | null;
  scorers: ScorerEntry[];
  totalGoals: number;
  competitionId: number | null;
  isOurTeam: boolean;
  align: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div
      className={cn(
        "flex flex-col gap-5 px-3 sm:gap-6 sm:px-6 lg:px-10",
        isRight ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-2 sm:gap-3",
          isRight ? "flex-row-reverse" : "flex-row",
        )}
      >
        <HnsCrest
          picture={teamPicture}
          name={teamName}
          size={40}
          className="size-9 shrink-0 sm:size-10"
        />
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-0.5",
            isRight ? "items-end" : "items-start",
          )}
        >
          <span>{isRight ? "Domaći" : "Gosti"}</span>
          <span className="line-clamp-2">{teamName}</span>
        </div>
      </div>

      <span>{totalGoals}</span>

      {scorers.length === 0 ? (
        <p>Bez strijelaca</p>
      ) : (
        <ul
          className={cn(
            "flex w-full flex-col gap-3",
            isRight && "items-end",
          )}
        >
          {scorers.map((s, idx) => (
            <ScorerRow
              key={`${s.name}-${idx}`}
              scorer={s}
              competitionId={competitionId}
              isOurTeam={isOurTeam}
              align={align}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ScorerRow({
  scorer,
  competitionId,
  isOurTeam,
  align,
}: {
  scorer: ScorerEntry;
  competitionId: number | null;
  isOurTeam: boolean;
  align: "left" | "right";
}) {
  const isRight = align === "right";
  const isLinkable =
    isOurTeam && scorer.personId != null && competitionId != null;

  const NameNode = isLinkable ? (
    <Link
      href={`/statistika/${buildPlayerSlug({ personId: scorer.personId, name: scorer.name })}/${competitionId}`}
      className="line-clamp-2"
    >
      {scorer.name}
    </Link>
  ) : (
    <span className="line-clamp-2">{scorer.name}</span>
  );

  return (
    <li
      className={cn(
        "flex w-full items-center gap-2 sm:gap-3",
        isRight && "flex-row-reverse",
      )}
    >
      <HnsCrest
        picture={scorer.picture}
        name={scorer.name}
        size={40}
        className="size-8 shrink-0 sm:size-10"
      />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-1",
          isRight && "items-end",
        )}
      >
        {NameNode}
        <div
          className={cn(
            "flex flex-wrap items-center gap-1",
            isRight && "justify-end",
          )}
        >
          {scorer.goals.map((g, i) => (
            <span
              key={`${g.minute}-${g.isMissedPenalty ? "m" : g.isPenalty ? "p" : "g"}-${i}`}
              title={
                g.isMissedPenalty
                  ? "Promašen kazneni udarac"
                  : g.isPenalty
                    ? "Pogodak iz kaznenog udarca"
                    : undefined
              }
            >
              {g.minute}&apos;{g.isMissedPenalty ? " p×" : g.isPenalty ? " p" : ""}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}

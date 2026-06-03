"use client";

import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildPlayerSlug } from "@/lib/slug";
import type { HnsLineups, HnsMatch, HnsTeamPlayer } from "@/types/hns";

interface MatchLineupsTabProps {
  match: HnsMatch;
  lineups: HnsLineups | undefined;
}

export default function MatchLineupsTab({
  match,
  lineups,
}: MatchLineupsTabProps) {
  const ourTeamId = useOurTeamId();
  const competitionId = match.competition?.id ?? null;
  const hasLineups =
    (lineups?.home?.players?.length ?? 0) > 0 ||
    (lineups?.away?.players?.length ?? 0) > 0;

  if (!hasLineups) {
    return (
      <section className="mt-20 sm:mt-28">
        <p className="text-center">
          Postave će biti objavljene neposredno prije utakmice.
        </p>
      </section>
    );
  }

  const homeName = match.homeTeam?.name ?? "Domaći";
  const awayName = match.awayTeam?.name ?? "Gosti";

  const homeColumn = (
    <LineupColumn
      teamName={homeName}
      teamPicture={match.homeTeam?.picture ?? null}
      teamLineup={lineups?.home ?? null}
      competitionId={competitionId}
      isOurTeam={
        ourTeamId != null && match.homeTeam?.id === ourTeamId
      }
    />
  );

  const awayColumn = (
    <LineupColumn
      teamName={awayName}
      teamPicture={match.awayTeam?.picture ?? null}
      teamLineup={lineups?.away ?? null}
      competitionId={competitionId}
      isOurTeam={
        ourTeamId != null && match.awayTeam?.id === ourTeamId
      }
    />
  );

  return (
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col items-center gap-6 text-center">
        <p>
          Tko je u igri
        </p>
        <h2>
          Postave
        </h2>
      </div>

      <Tabs
        defaultValue="home"
        className="mx-auto mt-12 max-w-5xl md:hidden"
      >
        <TabsList variant="line" className="mx-auto w-full justify-center">
          <TabsTrigger value="home" className="px-3">
            {homeName}
          </TabsTrigger>
          <TabsTrigger value="away" className="px-3">
            {awayName}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="mt-8">
          {homeColumn}
        </TabsContent>
        <TabsContent value="away" className="mt-8">
          {awayColumn}
        </TabsContent>
      </Tabs>

      <div className="mx-auto mt-12 hidden max-w-5xl gap-12 md:grid md:grid-cols-2 md:gap-16">
        {homeColumn}
        {awayColumn}
      </div>
    </section>
  );
}

function LineupColumn({
  teamName,
  teamPicture,
  teamLineup,
  competitionId,
  isOurTeam,
}: {
  teamName: string;
  teamPicture: string | null;
  teamLineup: HnsLineups["home"];
  competitionId: number | null;
  isOurTeam: boolean;
}) {
  if (!teamLineup) return null;

  const players = teamLineup.players ?? [];
  const starters = players.filter((p) => p.starting === true);
  const substitutes = players.filter((p) => p.starting !== true);

  return (
    <div>
      <div className="flex items-center gap-3 pb-3">
        <HnsCrest
          picture={teamPicture}
          name={teamName}
          size={36}
          className="size-9 shrink-0"
        />
        <h3 className="line-clamp-1">
          {teamName}
        </h3>
      </div>

      <ul className="mt-2">
        {starters.map((player, i) => (
          <PlayerRow
            key={`s-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
            player={player}
            competitionId={competitionId}
            isOurTeam={isOurTeam}
          />
        ))}
      </ul>

      {substitutes.length > 0 && (
        <>
          <p className="mt-8">
            Zamjene
          </p>
          <ul className="mt-2">
            {substitutes.map((player, i) => (
              <PlayerRow
                key={`sub-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
                player={player}
                competitionId={competitionId}
                isOurTeam={isOurTeam}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function PlayerRow({
  player,
  competitionId,
  isOurTeam,
}: {
  player: HnsTeamPlayer;
  competitionId: number | null;
  isOurTeam: boolean;
}) {
  const playerName = player.name ?? "";
  const isLinkable =
    isOurTeam &&
    player.personId != null &&
    competitionId != null &&
    player.hideProfile !== true;

  const inner = (
    <div className="flex items-center gap-3 py-2.5">
      <span className="w-6 text-right">
        {player.shirtNumber ?? "—"}
      </span>
      <HnsCrest
        picture={player.picture}
        name={playerName}
        size={28}
        className="size-7 shrink-0"
      />
      <span>{playerName}</span>
      {player.captain && (
        <span className="ml-auto px-1.5 py-px">
          K
        </span>
      )}
    </div>
  );

  return (
    <li>
      {isLinkable ? (
        <Link
          href={`/statistika/${buildPlayerSlug({ personId: player.personId, name: playerName })}/${competitionId}`}
          className="block"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}

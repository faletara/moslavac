"use client";

import Link from "next/link";
import { FadeInView } from "@/components/animations";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildPlayerSlug } from "@/lib/helpers/slug";
import type { Lineups, Match, LineupPlayer } from "@/types/hns";
import { MatchTabHeading } from "../shared/MatchTabHeading";

interface MatchLineupsTabProps {
  match: Match;
  lineups: Lineups | undefined;
}

export default function MatchLineupsTab({
  match,
  lineups,
}: MatchLineupsTabProps) {
  const moslavacTeamId = useOurTeamId();
  const competitionId = match.competition?.id ?? null;
  const hasLineups =
    (lineups?.home?.players?.length ?? 0) > 0 ||
    (lineups?.away?.players?.length ?? 0) > 0;

  if (!hasLineups) {
    return (
      <section className="mt-20 sm:mt-28">
        <p className="text-center text-sm text-muted-foreground">
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
      isMoslavac={
        moslavacTeamId != null && match.homeTeam?.id === moslavacTeamId
      }
    />
  );

  const awayColumn = (
    <LineupColumn
      teamName={awayName}
      teamPicture={match.awayTeam?.picture ?? null}
      teamLineup={lineups?.away ?? null}
      competitionId={competitionId}
      isMoslavac={
        moslavacTeamId != null && match.awayTeam?.id === moslavacTeamId
      }
    />
  );

  return (
    <section className="mt-12 sm:mt-16">
      <MatchTabHeading eyebrow="Tko je u igri" title="Postave" />

      <FadeInView delay={0.1}>
        <Tabs
          defaultValue="home"
          className="mx-auto mt-12 max-w-5xl md:hidden"
        >
          <TabsList variant="line" className="mx-auto w-full justify-center">
            <TabsTrigger value="home" className="px-3 text-xs uppercase tracking-tight">
              {homeName}
            </TabsTrigger>
            <TabsTrigger value="away" className="px-3 text-xs uppercase tracking-tight">
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
      </FadeInView>
    </section>
  );
}

function LineupColumn({
  teamName,
  teamPicture,
  teamLineup,
  competitionId,
  isMoslavac,
}: {
  teamName: string;
  teamPicture: string | null;
  teamLineup: Lineups["home"] | null;
  competitionId: number | null;
  isMoslavac: boolean;
}) {
  if (!teamLineup) return null;

  const players = teamLineup.players ?? [];
  const starters = players.filter((p) => p.starting === true);
  const substitutes = players.filter((p) => p.starting !== true);

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <HnsCrest
          picture={teamPicture}
          name={teamName}
          size={36}
          className="size-9 shrink-0"
        />
        <h3 className="line-clamp-1 text-sm font-black uppercase tracking-tight">
          {teamName}
        </h3>
      </div>

      <ul className="mt-2">
        {starters.map((player, i) => (
          <PlayerRow
            key={`s-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
            player={player}
            competitionId={competitionId}
            isMoslavac={isMoslavac}
          />
        ))}
      </ul>

      {substitutes.length > 0 && (
        <>
          <p className="mt-8 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Zamjene
          </p>
          <ul className="mt-2">
            {substitutes.map((player, i) => (
              <PlayerRow
                key={`sub-${player.personId ?? player.shirtNumber ?? "x"}-${player.name ?? i}`}
                player={player}
                competitionId={competitionId}
                isMoslavac={isMoslavac}
                muted
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
  isMoslavac,
  muted = false,
}: {
  player: LineupPlayer;
  competitionId: number | null;
  isMoslavac: boolean;
  muted?: boolean;
}) {
  const playerName = player.name ?? "";
  const isLinkable =
    isMoslavac &&
    player.personId != null &&
    competitionId != null &&
    player.hideProfile !== true;

  const inner = (
    <div
      className={`flex items-center gap-3 border-b border-border/40 py-2.5 text-sm ${
        muted ? "text-muted-foreground" : ""
      }`}
    >
      <span className="w-6 text-right font-medium tabular-nums text-xs text-muted-foreground">
        {player.shirtNumber ?? "-"}
      </span>
      <HnsCrest
        picture={player.picture}
        name={playerName}
        size={28}
        className="size-7 shrink-0"
      />
      <span className={muted ? "" : "font-medium"}>{playerName}</span>
      {player.captain && (
        <span className="ml-auto rounded border border-border px-1.5 py-px text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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
          className="block transition-colors hover:bg-muted/30"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </li>
  );
}

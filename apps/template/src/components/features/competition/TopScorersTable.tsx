"use client";

import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { useOurTeamId } from "@/components/providers/TenantProvider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buildPlayerSlug } from "@/lib/slug";
import type { PlayerStats } from "@/types/hns";

interface TopScorersTableProps {
  scorers: PlayerStats[] | undefined;
  isLoading: boolean;
  competitionId: number | null;
  emptyMessage?: string;
  /** Accepted for API compatibility; highlighting is not rendered in the skeleton. */
  highlightTeamIds?: number[];
}

export default function TopScorersTable({
  scorers,
  isLoading,
  competitionId,
  emptyMessage = "Statistike strijelaca nisu dostupne.",
}: TopScorersTableProps) {
  const ourTeamId = useOurTeamId();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="space-y-2">
          {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((k) => (
            <Skeleton key={k} className="h-10" />
          ))}
        </div>
      </div>
    );
  }

  if (!scorers || scorers.length === 0) {
    return (
      <p className="text-center">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center">#</TableHead>
            <TableHead>Igrač</TableHead>
            <TableHead>Klub</TableHead>
            <TableHead className="text-center">Golovi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scorers.map((s, i) => {
            const teamId = s.team?.id;
            const isOurTeam =
              ourTeamId != null && teamId === ourTeamId;
            return (
              <ScorerRow
                key={`${s.player?.personId ?? s.player?.name ?? "x"}-${i}`}
                scorer={s}
                position={i + 1}
                isOurTeam={isOurTeam}
                competitionId={competitionId}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ScorerRow({
  scorer,
  position,
  isOurTeam,
  competitionId,
}: {
  scorer: PlayerStats;
  position: number;
  isOurTeam: boolean;
  competitionId: number | null;
}) {
  const personId = scorer.player?.personId ?? null;
  const playerName = scorer.player?.name ?? "—";
  const playerPicture = scorer.player?.picture ?? null;
  const teamName = scorer.team?.name ?? "—";
  const isLinkable =
    isOurTeam &&
    personId != null &&
    competitionId != null &&
    scorer.player?.hideProfile !== true;

  const playerCell = (
    <div className="flex items-center gap-2">
      <HnsCrest
        picture={playerPicture}
        name={playerName}
        size={28}
        className="size-7 shrink-0"
      />
      <span className="truncate">
        {playerName}
      </span>
    </div>
  );

  return (
    <TableRow>
      <TableCell className="text-center">
        {position}
      </TableCell>
      <TableCell className="min-w-0">
        {isLinkable ? (
          <Link
            href={`/statistika/${buildPlayerSlug({ personId, name: playerName })}/${competitionId}`}
            className="block"
          >
            {playerCell}
          </Link>
        ) : (
          playerCell
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <HnsCrest
            picture={scorer.team?.picture}
            name={teamName}
            size={20}
            className="size-5 shrink-0"
          />
          <span className="truncate">
            {teamName}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {scorer.value ?? 0}
      </TableCell>
    </TableRow>
  );
}

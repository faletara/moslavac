"use client";

import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { useMoslavacTeamId } from "@/components/providers/TenantProvider";
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
import { cn } from "@/lib/utils";
import type { PlayerStats } from "@/types/hns";

interface TopScorersTableProps {
  scorers: PlayerStats[] | undefined;
  isLoading: boolean;
  competitionId: number | null;
  highlightTeamIds?: number[];
  emptyMessage?: string;
}

export default function TopScorersTable({
  scorers,
  isLoading,
  competitionId,
  highlightTeamIds = [],
  emptyMessage = "Statistike strijelaca nisu dostupne.",
}: TopScorersTableProps) {
  const moslavacTeamId = useMoslavacTeamId();

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
      <p className="text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  const highlightSet = new Set(highlightTeamIds);

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
            const highlight = teamId != null && highlightSet.has(teamId);
            const isMoslavac =
              moslavacTeamId != null && teamId === moslavacTeamId;
            return (
              <ScorerRow
                key={`${s.player?.personId ?? s.player?.name ?? "x"}-${i}`}
                scorer={s}
                position={i + 1}
                highlight={highlight}
                isMoslavac={isMoslavac}
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
  highlight,
  isMoslavac,
  competitionId,
}: {
  scorer: PlayerStats;
  position: number;
  highlight: boolean;
  isMoslavac: boolean;
  competitionId: number | null;
}) {
  const personId = scorer.player?.personId ?? null;
  const playerName = scorer.player?.name ?? "—";
  const playerPicture = scorer.player?.picture ?? null;
  const teamName = scorer.team?.name ?? "—";
  const isLinkable =
    isMoslavac &&
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
      <span
        className={cn(
          "truncate text-xs sm:text-sm",
          highlight && "font-semibold",
        )}
      >
        {playerName}
      </span>
    </div>
  );

  return (
    <TableRow className={cn(highlight && "bg-muted/50 hover:bg-muted/70")}>
      <TableCell className="text-center text-xs font-medium tabular-nums text-muted-foreground">
        {position}
      </TableCell>
      <TableCell className="min-w-0">
        {isLinkable ? (
          <Link
            href={`/statistika/${buildPlayerSlug({ personId, name: playerName })}/${competitionId}`}
            className="block transition-colors hover:text-foreground"
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
          <span className="truncate text-xs text-muted-foreground">
            {teamName}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center text-sm font-bold tabular-nums">
        {scorer.value ?? 0}
      </TableCell>
    </TableRow>
  );
}

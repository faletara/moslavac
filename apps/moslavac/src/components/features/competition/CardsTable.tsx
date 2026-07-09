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
import { cn } from "@/lib/utils";
import type { CompetitionPlayerStat } from "@/types/hns";

interface CardsTableProps {
  yellowCards: CompetitionPlayerStat[] | undefined;
  redCards: CompetitionPlayerStat[] | undefined;
  isLoading: boolean;
  competitionId: number | null;
  highlightTeamIds?: number[];
}

interface MergedRow {
  personId: number | null;
  playerName: string;
  playerPicture: string | null;
  hideProfile: boolean;
  teamId: number | null;
  teamName: string;
  teamPicture: string | null;
  yellow: number;
  red: number;
}

function mergeCards(
  yellow: CompetitionPlayerStat[] = [],
  red: CompetitionPlayerStat[] = [],
): MergedRow[] {
  const map = new Map<string, MergedRow>();

  const upsert = (
    s: CompetitionPlayerStat,
    field: "yellow" | "red",
    value: number,
  ): void => {
    const personId = s.player?.personId ?? null;
    const key =
      personId != null ? `p:${personId}` : `n:${s.player?.name ?? ""}`;
    const existing = map.get(key);
    if (existing) {
      existing[field] += value;
    } else {
      map.set(key, {
        personId,
        playerName: s.player?.name ?? "—",
        playerPicture: s.player?.picture ?? null,
        hideProfile: s.player?.hideProfile === true,
        teamId: s.team?.id ?? null,
        teamName: s.team?.name ?? "—",
        teamPicture: s.team?.picture ?? null,
        yellow: field === "yellow" ? value : 0,
        red: field === "red" ? value : 0,
      });
    }
  };

  yellow.forEach((s) => upsert(s, "yellow", s.value ?? 0));
  red.forEach((s) => upsert(s, "red", s.value ?? 0));

  return Array.from(map.values()).sort((a, b) => {
    if (b.red !== a.red) return b.red - a.red;
    return b.yellow - a.yellow;
  });
}

export default function CardsTable({
  yellowCards,
  redCards,
  isLoading,
  competitionId,
  highlightTeamIds = [],
}: CardsTableProps) {
  const moslavacTeamId = useOurTeamId();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-2">
        {["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].map((k) => (
          <Skeleton key={k} className="h-10" />
        ))}
      </div>
    );
  }

  const rows = mergeCards(yellowCards, redCards);

  if (rows.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Nema podataka o kartonima.
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
            <TableHead className="text-center">
              <span
                aria-label="Žuti karton"
                className="mx-auto block h-3 w-2 rounded-[1px] bg-yellow-400"
              />
            </TableHead>
            <TableHead className="text-center">
              <span
                aria-label="Crveni karton"
                className="mx-auto block h-3 w-2 rounded-[1px] bg-red-500"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => {
            const highlight =
              row.teamId != null && highlightSet.has(row.teamId);
            const isMoslavac =
              moslavacTeamId != null && row.teamId === moslavacTeamId;
            return (
              <CardRow
                key={
                  row.personId != null
                    ? `p-${row.personId}`
                    : `n-${row.playerName}-${i}`
                }
                row={row}
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

function CardRow({
  row,
  position,
  highlight,
  isMoslavac,
  competitionId,
}: {
  row: MergedRow;
  position: number;
  highlight: boolean;
  isMoslavac: boolean;
  competitionId: number | null;
}) {
  const isLinkable =
    isMoslavac &&
    row.personId != null &&
    competitionId != null &&
    !row.hideProfile;

  const playerCell = (
    <div className="flex items-center gap-2">
      <HnsCrest
        picture={row.playerPicture}
        name={row.playerName}
        size={28}
        className="size-7 shrink-0"
      />
      <span
        className={cn(
          "truncate text-xs sm:text-sm",
          highlight && "font-semibold",
        )}
      >
        {row.playerName}
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
            href={`/statistika/${buildPlayerSlug({ personId: row.personId, name: row.playerName })}/${competitionId}`}
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
            picture={row.teamPicture}
            name={row.teamName}
            size={20}
            className="size-5 shrink-0"
          />
          <span className="truncate text-xs text-muted-foreground">
            {row.teamName}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center text-sm font-bold tabular-nums">
        {row.yellow > 0 ? row.yellow : "—"}
      </TableCell>
      <TableCell className="text-center text-sm font-bold tabular-nums">
        {row.red > 0 ? row.red : "—"}
      </TableCell>
    </TableRow>
  );
}

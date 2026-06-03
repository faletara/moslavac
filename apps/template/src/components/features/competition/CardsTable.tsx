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

interface CardsTableProps {
  yellowCards: PlayerStats[] | undefined;
  redCards: PlayerStats[] | undefined;
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
  yellow: PlayerStats[] = [],
  red: PlayerStats[] = [],
): MergedRow[] {
  const map = new Map<string, MergedRow>();

  const upsert = (
    s: PlayerStats,
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
}: CardsTableProps) {
  const ourTeamId = useOurTeamId();

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
      <p className="text-center">
        Nema podataka o kartonima.
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
            <TableHead className="text-center">
              <span
                aria-label="Žuti karton"
                className="mx-auto block h-3 w-2"
              />
            </TableHead>
            <TableHead className="text-center">
              <span
                aria-label="Crveni karton"
                className="mx-auto block h-3 w-2"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => {
            const isOurTeam =
              ourTeamId != null && row.teamId === ourTeamId;
            return (
              <CardRow
                key={
                  row.personId != null
                    ? `p-${row.personId}`
                    : `n-${row.playerName}-${i}`
                }
                row={row}
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

function CardRow({
  row,
  position,
  isOurTeam,
  competitionId,
}: {
  row: MergedRow;
  position: number;
  isOurTeam: boolean;
  competitionId: number | null;
}) {
  const isLinkable =
    isOurTeam &&
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
      <span className="truncate">
        {row.playerName}
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
            href={`/statistika/${buildPlayerSlug({ personId: row.personId, name: row.playerName })}/${competitionId}`}
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
            picture={row.teamPicture}
            name={row.teamName}
            size={20}
            className="size-5 shrink-0"
          />
          <span className="truncate">
            {row.teamName}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {row.yellow > 0 ? row.yellow : "—"}
      </TableCell>
      <TableCell className="text-center">
        {row.red > 0 ? row.red : "—"}
      </TableCell>
    </TableRow>
  );
}

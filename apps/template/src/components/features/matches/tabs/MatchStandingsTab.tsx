"use client";

import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { getStandingsForm, type FormResult } from "@/lib/helpers/form";
import type { TeamRanking } from "@/types/hns";

interface MatchStandingsTabProps {
  competitionId: number | null;
  homeTeamId: number | null;
  awayTeamId: number | null;
}

export default function MatchStandingsTab({
  competitionId,
  homeTeamId,
  awayTeamId,
}: MatchStandingsTabProps) {
  const { data: standings, isLoading } = api.competitions.useGetTeamStandings({
    competitionId: competitionId ?? 0,
    enabled: competitionId != null,
  });

  if (isLoading) {
    return (
      <section className="mt-16 pt-12 sm:mt-20">
        <Skeleton className="mx-auto h-4 w-32" />
        <div className="mt-8 space-y-2">
          {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
            <Skeleton key={k} className="h-10" />
          ))}
        </div>
      </section>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <section className="mt-16 pt-12 sm:mt-20">
        <p className="text-center">
          Tablica nije dostupna.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 pt-12 sm:mt-20">
      <h2 className="text-center">
        Tablica
      </h2>

      <div className="mx-auto mt-8 max-w-3xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-center">#</TableHead>
              <TableHead>Klub</TableHead>
              <TableHead className="text-center">O</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">N</TableHead>
              <TableHead className="text-center">I</TableHead>
              <TableHead className="hidden text-center sm:table-cell">
                GD
              </TableHead>
              <TableHead className="hidden text-center sm:table-cell">
                GP
              </TableHead>
              <TableHead className="text-center">+/−</TableHead>
              <TableHead className="text-center">Bod</TableHead>
              <TableHead className="hidden text-center md:table-cell">
                Forma
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((row, i) => (
              <StandingsRow
                key={row.team?.id ?? `pos-${row.position ?? i}`}
                row={row}
                isHome={row.team?.id != null && row.team.id === homeTeamId}
                isAway={row.team?.id != null && row.team.id === awayTeamId}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function StandingsRow({
  row,
  isHome,
  isAway,
}: {
  row: TeamRanking;
  isHome: boolean;
  isAway: boolean;
}) {
  void isHome;
  void isAway;
  const goalsFor = row.goalsFor ?? 0;
  const goalsAgainst = row.goalsAgainst ?? 0;
  const diff = goalsFor - goalsAgainst;
  const diffLabel = diff > 0 ? `+${diff}` : `${diff}`;

  const form = getStandingsForm(row.m1, row.m2, row.m3, row.m4, row.m5);

  const teamName = row.team?.name ?? "—";
  const teamId = row.team?.id;
  const cellContent = (
    <div className="flex items-center gap-2">
      <HnsCrest
        picture={row.team?.picture}
        name={teamName}
        size={24}
        className="size-6 shrink-0"
      />
      <span>
        {teamName}
      </span>
    </div>
  );

  return (
    <TableRow>
      <TableCell className="text-center">
        {row.position ?? "—"}
      </TableCell>
      <TableCell className="min-w-0">
        {teamId != null && row.team?.allowDetail ? (
          <Link href={`/team/${teamId}`} className="block">
            {cellContent}
          </Link>
        ) : (
          cellContent
        )}
      </TableCell>
      <TableCell className="text-center">
        {row.played ?? 0}
      </TableCell>
      <TableCell className="text-center">
        {row.wins ?? 0}
      </TableCell>
      <TableCell className="text-center">
        {row.draws ?? 0}
      </TableCell>
      <TableCell className="text-center">
        {row.losses ?? 0}
      </TableCell>
      <TableCell className="hidden text-center sm:table-cell">
        {goalsFor}
      </TableCell>
      <TableCell className="hidden text-center sm:table-cell">
        {goalsAgainst}
      </TableCell>
      <TableCell className="text-center">
        {diffLabel}
      </TableCell>
      <TableCell className="text-center">
        {row.points ?? 0}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <FormStrip form={form} />
      </TableCell>
    </TableRow>
  );
}

function FormStrip({ form }: { form: FormResult[] }) {
  if (form.length === 0) {
    return <span>—</span>;
  }
  return (
    <div className="flex justify-center gap-1">
      {form.map((result, i) => (
        <FormDot key={`${i}-${result}`} result={result} />
      ))}
    </div>
  );
}

function FormDot({ result }: { result: FormResult }) {
  const label = result === "W" ? "P" : result === "D" ? "N" : "I";
  return (
    <span className="flex size-5 items-center justify-center">
      {label}
    </span>
  );
}

"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, getCometImageUrl } from "@/lib/api";
import { getStandingsForm, type FormResult } from "@/lib/helpers/form";
import { cn } from "@/lib/utils";
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
      <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
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
      <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
        <p className="text-center text-sm text-muted-foreground">
          Tablica nije dostupna.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
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
              <TableHead className="text-center font-bold">Bod</TableHead>
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
  const highlight = isHome || isAway;
  const goalsFor = row.goalsFor ?? 0;
  const goalsAgainst = row.goalsAgainst ?? 0;
  const diff = goalsFor - goalsAgainst;
  const diffLabel = diff > 0 ? `+${diff}` : `${diff}`;

  const form = getStandingsForm(row.m1, row.m2, row.m3, row.m4, row.m5);

  const teamName = row.team?.name ?? "—";
  const teamId = row.team?.id;
  const cellContent = (
    <div className="flex items-center gap-2">
      <Avatar className="size-6 shrink-0">
        {row.team?.picture && (
          <AvatarImage
            src={getCometImageUrl(row.team.picture)}
            alt={teamName}
          />
        )}
        <AvatarFallback className="text-[0.5rem] font-semibold uppercase">
          {teamName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "truncate text-xs sm:text-sm",
          highlight && "font-semibold",
        )}
      >
        {teamName}
      </span>
    </div>
  );

  return (
    <TableRow className={cn(highlight && "bg-muted/50 hover:bg-muted/70")}>
      <TableCell className="text-center text-xs font-medium tabular-nums text-muted-foreground">
        {row.position ?? "—"}
      </TableCell>
      <TableCell className="min-w-0">
        {teamId != null && row.team?.allowDetail ? (
          <Link
            href={`/team/${teamId}`}
            className="block transition-colors hover:text-foreground"
          >
            {cellContent}
          </Link>
        ) : (
          cellContent
        )}
      </TableCell>
      <TableCell className="text-center text-xs tabular-nums">
        {row.played ?? 0}
      </TableCell>
      <TableCell className="text-center text-xs tabular-nums">
        {row.wins ?? 0}
      </TableCell>
      <TableCell className="text-center text-xs tabular-nums">
        {row.draws ?? 0}
      </TableCell>
      <TableCell className="text-center text-xs tabular-nums">
        {row.losses ?? 0}
      </TableCell>
      <TableCell className="hidden text-center text-xs tabular-nums sm:table-cell">
        {goalsFor}
      </TableCell>
      <TableCell className="hidden text-center text-xs tabular-nums sm:table-cell">
        {goalsAgainst}
      </TableCell>
      <TableCell className="text-center text-xs tabular-nums">
        {diffLabel}
      </TableCell>
      <TableCell className="text-center text-sm font-bold tabular-nums">
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
    return <span className="text-[0.6rem] text-muted-foreground/60">—</span>;
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
  const styles: Record<FormResult, string> = {
    W: "bg-emerald-500 text-white",
    D: "bg-muted text-muted-foreground",
    L: "bg-rose-500 text-white",
  };
  const label = result === "W" ? "P" : result === "D" ? "N" : "I";
  return (
    <span
      className={cn(
        "flex size-5 items-center justify-center rounded-full text-[0.55rem] font-bold uppercase",
        styles[result],
      )}
    >
      {label}
    </span>
  );
}

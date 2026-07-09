"use client";

import Link from "next/link";
import { HnsCrest } from "@/components/HnsCrest";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStandingsForm, type FormResult } from "@/lib/helpers/form";
import { cn } from "@/lib/utils";
import type { TeamRanking } from "@/types/hns";
import { MatchTabHeading } from "../shared/MatchTabHeading";

interface MatchStandingsTabProps {
  standings: TeamRanking[];
  homeTeamId: number | null;
  awayTeamId: number | null;
}

export default function MatchStandingsTab({
  standings,
  homeTeamId,
  awayTeamId,
}: MatchStandingsTabProps) {
  if (!standings || standings.length === 0) {
    return (
      <section className="mt-12 sm:mt-16">
        <MatchTabHeading eyebrow="Poredak" title="Tablica" />
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Tablica nije dostupna.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 sm:mt-16">
      <MatchTabHeading eyebrow="Poredak" title="Tablica" />

      <div className="mx-auto mt-12 max-w-3xl">
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

  const form = getStandingsForm(row.form);

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

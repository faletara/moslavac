"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import type { PlayerCompetitionStats } from "@/types/hns";
import type { RosterEntry } from "@/types/roster";

interface PlayerCardProps {
  player: RosterEntry;
  hideNumber: boolean;
  /** ID seniorske lige za dohvat statistike. Null → kartica nije klikabilna. */
  competitionId: number | null;
}

export function PlayerCard({
  player,
  hideNumber,
  competitionId,
}: PlayerCardProps) {
  const [open, setOpen] = useState(false);

  // Stožer / bez lige → nemamo statistiku, renderiramo statičnu karticu.
  if (competitionId == null) {
    return <CardVisual player={player} hideNumber={hideNumber} />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="block w-full text-left"
          aria-label={`Statistika — ${player.displayName}`}
        >
          <CardVisual player={player} hideNumber={hideNumber} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
            {player.displayName}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <PlayerStats
            personId={String(player.personId)}
            competitionId={competitionId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PlayerStats({
  personId,
  competitionId,
}: {
  personId: string;
  competitionId: number;
}) {
  const { data, isLoading, isError } = api.players.useGetPlayerStats({
    personId,
    competitionId,
  });

  if (isLoading) {
    return (
      <p className="py-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Učitavam statistiku…
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="py-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Statistika nije dostupna.
      </p>
    );
  }

  return (
    <div className="mt-2">
      {data.competition?.name && (
        <p className="mb-4 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {data.competition.name}
        </p>
      )}
      <dl className="grid grid-cols-2 gap-3">
        <Stat label="Nastupi" value={data.matchesPlayed} />
        <Stat label="Minute" value={data.minutesPlayed} />
        <Stat label="Golovi" value={data.goals} />
        <Stat label="Žuti kartoni" value={data.yellowCards} />
        <Stat label="Crveni kartoni" value={data.redCards} />
        <Stat label="Cijele utakmice" value={data.fullMatchesPlayed} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="border border-line bg-surface/40 px-4 py-3">
      <dd className="font-display text-2xl font-extrabold tabular-nums text-ink">
        {value ?? 0}
      </dd>
      <dt className="mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </dt>
    </div>
  );
}

function CardVisual({
  player,
  hideNumber,
}: {
  player: RosterEntry;
  hideNumber: boolean;
}) {
  const photoUrl = player.photo?.sizes?.card?.url ?? player.photo?.url ?? null;
  const initial = player.displayName.charAt(0);
  const ghostMark =
    !hideNumber && player.jerseyNumber != null
      ? String(player.jerseyNumber)
      : initial;

  return (
    <div className="group">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black ring-1 ring-black/5 transition-all duration-300 group-hover:ring-brand-yellow/50 group-hover:shadow-[0_22px_45px_-20px_rgba(0,0,0,0.55)]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={player.photo?.alt || player.displayName}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black to-brand-navy-700">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,203,5,0.14), transparent 70%)",
              }}
            />
            <span
              aria-hidden
              className="absolute inset-0 flex select-none items-center justify-center text-[7rem] font-black leading-none tracking-tighter text-white/[0.07]"
            >
              {ghostMark}
            </span>
          </div>
        )}

        {/* Gradient na dnu — čitljivost imena (crni, kao Hero) */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/55 to-transparent" />

        {!hideNumber && player.jerseyNumber != null && (
          <span className="absolute left-3 top-3 text-3xl font-black leading-none tabular-nums text-brand-yellow drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
            {player.jerseyNumber}
          </span>
        )}
        {player.captain && (
          <span className="absolute right-3 top-3 bg-brand-blue px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white">
            Kapetan
          </span>
        )}

        {/* Ime preklopljeno preko slike */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4">
          <span className="h-px w-6 bg-brand-yellow transition-all duration-300 group-hover:w-12" />
          <h3 className="text-balance text-sm font-bold uppercase leading-tight tracking-tight text-white sm:text-base">
            {player.displayName}
          </h3>
        </div>
      </div>
    </div>
  );
}

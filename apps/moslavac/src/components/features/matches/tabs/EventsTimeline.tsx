import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import type { HnsMatchEvent } from "@/types/hns";

interface EventsTimelineProps {
  events: HnsMatchEvent[] | undefined;
  competitionId: number | null;
}

export default function EventsTimeline({
  events,
  competitionId,
}: EventsTimelineProps) {
  const visibleEvents =
    events?.filter(
      (e) => (e.player?.name ?? "").trim() !== "" || e.eventType?.name,
    ) ?? [];

  if (visibleEvents.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Događaji
      </h2>

      <div className="relative mx-auto mt-10 max-w-2xl">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/60"
        />
        <ol>
          {visibleEvents.map((event, i) => (
            <EventRow
              key={`${event.minuteFull ?? 0}-${event.eventType?.name ?? ""}-${event.player?.name ?? ""}-${i}`}
              event={event}
              competitionId={competitionId}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function EventRow({
  event,
  competitionId,
}: {
  event: HnsMatchEvent;
  competitionId: number | null;
}) {
  const isHome = event.homeTeam === true;
  const minute = event.minuteFull ?? event.minute ?? 0;
  const playerName = event.player?.name?.trim() ?? "";
  const eventTypeName = event.eventType?.name ?? "";
  const isPhaseMarker = playerName === "" && eventTypeName === "";
  const personId = event.player?.personId ?? null;
  const isLinkable =
    personId != null &&
    competitionId != null &&
    event.player?.hideProfile !== true;

  if (isPhaseMarker) {
    return (
      <li className="relative flex justify-center py-2">
        <span className="rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] tabular-nums text-muted-foreground">
          {minute}&apos;
        </span>
      </li>
    );
  }

  const icon = <EventIcon eventType={eventTypeName} />;

  const playerNameNode =
    playerName && isLinkable ? (
      <Link
        href={`/stats/${personId}/${competitionId}`}
        className="truncate text-sm font-semibold leading-tight transition-colors hover:underline"
      >
        {playerName}
      </Link>
    ) : playerName ? (
      <p className="truncate text-sm font-semibold leading-tight">
        {playerName}
      </p>
    ) : null;

  return (
    <li className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 sm:gap-5">
      {isHome ? (
        <div className="flex items-center justify-end gap-3 pr-1 text-right">
          <div className="min-w-0">
            {playerNameNode}
            {eventTypeName && (
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {eventTypeName}
              </p>
            )}
          </div>
          <span className="flex size-5 shrink-0 items-center justify-center">
            {icon}
          </span>
        </div>
      ) : (
        <div />
      )}

      <span className="z-10 inline-flex min-w-[2.25rem] justify-center rounded-full border border-border bg-background px-2 py-0.5 text-[0.65rem] font-medium tabular-nums text-foreground">
        {minute}&apos;
      </span>

      {!isHome ? (
        <div className="flex items-center gap-3 pl-1">
          <span className="flex size-5 shrink-0 items-center justify-center">
            {icon}
          </span>
          <div className="min-w-0">
            {playerNameNode}
            {eventTypeName && (
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {eventTypeName}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div />
      )}
    </li>
  );
}

function EventIcon({ eventType }: { eventType: string }) {
  const t = eventType.toLowerCase();

  if (t.includes("žuti") || t.includes("zuti")) {
    return (
      <span
        role="img"
        aria-label="Žuti karton"
        className="block h-3.5 w-2.5 rounded-[1px] bg-yellow-400"
      />
    );
  }
  if (t.includes("crveni")) {
    return (
      <span
        role="img"
        aria-label="Crveni karton"
        className="block h-3.5 w-2.5 rounded-[1px] bg-red-500"
      />
    );
  }
  if (t.includes("zamjena")) {
    return (
      <ArrowLeftRight
        aria-label="Zamjena"
        className="size-3.5 text-muted-foreground"
      />
    );
  }
  if (t.includes("gol") || t.includes("goal")) {
    return (
      <span
        role="img"
        aria-label="Gol"
        className="block size-2.5 rounded-full bg-foreground"
      />
    );
  }

  return <span className="block size-1.5 rounded-full bg-muted-foreground" />;
}

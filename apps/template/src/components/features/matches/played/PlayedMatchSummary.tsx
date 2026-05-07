import { getCardCounts, getScorers, type ScorerEntry } from "@/lib/helpers/events";
import { cn } from "@/lib/utils";
import type { HnsMatchEvent } from "@/types/hns";

interface PlayedMatchSummaryProps {
  events: HnsMatchEvent[] | undefined;
  homeTeamName: string;
  awayTeamName: string;
}

export default function PlayedMatchSummary({
  events,
  homeTeamName,
  awayTeamName,
}: PlayedMatchSummaryProps) {
  if (!events || events.length === 0) return null;

  const scorers = getScorers(events);
  const cards = getCardCounts(events);

  const hasScorers = scorers.home.length > 0 || scorers.away.length > 0;
  const hasCards =
    cards.homeYellow + cards.homeRed + cards.awayYellow + cards.awayRed > 0;

  if (!hasScorers && !hasCards) return null;

  return (
    <section className="mx-auto mt-12 max-w-2xl border-t border-border/40 pt-10 sm:mt-16">
      {hasScorers && (
        <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
          Strijelci
        </h2>
      )}
      <div
        className={cn(
          "grid grid-cols-2 gap-x-6 sm:gap-x-12",
          hasScorers && "mt-6",
        )}
      >
        <TeamColumn
          teamName={homeTeamName}
          scorers={scorers.home}
          yellow={cards.homeYellow}
          red={cards.homeRed}
          align="right"
          showScorers={hasScorers}
        />
        <TeamColumn
          teamName={awayTeamName}
          scorers={scorers.away}
          yellow={cards.awayYellow}
          red={cards.awayRed}
          align="left"
          showScorers={hasScorers}
        />
      </div>
    </section>
  );
}

function TeamColumn({
  teamName,
  scorers,
  yellow,
  red,
  align,
  showScorers,
}: {
  teamName: string;
  scorers: ScorerEntry[];
  yellow: number;
  red: number;
  align: "left" | "right";
  showScorers: boolean;
}) {
  const isRight = align === "right";
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isRight ? "items-end text-right" : "items-start text-left",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center gap-3 border-b border-border/40 pb-2",
          isRight ? "flex-row-reverse" : "flex-row",
        )}
      >
        <p className="line-clamp-1 flex-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {teamName}
        </p>
        <CardsInline yellow={yellow} red={red} />
      </div>

      {showScorers &&
        (scorers.length === 0 ? (
          <p className="text-xs text-muted-foreground/50">Bez strijelaca</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {scorers.map((s) => (
              <li
                key={s.name}
                className={cn(
                  "flex items-baseline gap-2 text-xs sm:text-sm",
                  isRight && "flex-row-reverse",
                )}
              >
                <span aria-hidden className="text-muted-foreground">
                  ⚽
                </span>
                <span>
                  <span className="font-semibold">{s.name}</span>{" "}
                  <span className="font-medium tabular-nums text-muted-foreground">
                    {s.goals
                      .map((g) => `${g.minute}'${g.isPenalty ? " (p)" : ""}`)
                      .join(", ")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}

function CardsInline({ yellow, red }: { yellow: number; red: number }) {
  if (yellow === 0 && red === 0) return null;
  return (
    <div className="flex items-center gap-2">
      {yellow > 0 && (
        <div className="flex items-center gap-1">
          <span
            role="img"
            aria-label="Žuti karton"
            className="block h-3 w-2 rounded-[1px] bg-yellow-400"
          />
          <span className="text-[0.7rem] font-semibold tabular-nums">
            {yellow}
          </span>
        </div>
      )}
      {red > 0 && (
        <div className="flex items-center gap-1">
          <span
            role="img"
            aria-label="Crveni karton"
            className="block h-3 w-2 rounded-[1px] bg-red-500"
          />
          <span className="text-[0.7rem] font-semibold tabular-nums">{red}</span>
        </div>
      )}
    </div>
  );
}

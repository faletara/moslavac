import { Navigation } from "lucide-react";
import { formatDateTime } from "@/lib/helpers/date";
import type { Match, MatchInfo } from "@/types/hns";

/**
 * HNS lumps the whole delegation into `matchOfficials` — referees alongside the
 * delegate and the refereeing observer. Only the officials who actually run the
 * match belong on a fan-facing page, so the administrative roles are dropped.
 */
function isReferee(role: string | null): boolean {
  const r = (role ?? "").toLowerCase();
  if (r.includes("delegat") || r.includes("kontrolor")) return false;
  return r.includes("sudac");
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-foreground/10 py-3.5">
      <dt className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-sm font-semibold uppercase">
        {value}
      </dd>
    </div>
  );
}

/**
 * Podaci o utakmici — natjecanje, kolo, termin, gledatelji; delegirani suci; i
 * stadion s vanjskim linkom na upute. Namjerno bez ugrađene karte: satelitska
 * snimka trećeligaškog igrališta nema što pokazati, a navijaču koji putuje na
 * gostovanje treba samo navigacija.
 */
export default function MatchFacts({
  match,
  info,
}: {
  match: Match;
  info: MatchInfo | null;
}) {
  const facility = match.facility;
  const officials = (info?.officials ?? []).filter(
    (official) => official.name.trim() !== "" && isReferee(official.role),
  );

  const { date, time } =
    match.kickoffAtUtcMs != null
      ? formatDateTime(match.kickoffAtUtcMs)
      : { date: "", time: "" };

  const attendance = match.attendance;

  const facts = [
    match.competition?.name?.trim()
      ? { label: "Natjecanje", value: match.competition.name.trim() }
      : null,
    match.roundOrder != null
      ? { label: "Kolo", value: String(match.roundOrder) }
      : null,
    date ? { label: "Termin", value: `${date} · ${time}` } : null,
    attendance != null && attendance > 0
      ? { label: "Gledatelja", value: String(attendance) }
      : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  const venueName = facility?.name?.trim() ?? "";
  const venueAddress = facility?.address?.trim() ?? "";
  const venuePlace = facility?.place?.trim() ?? "";
  const hasCoords = facility?.latitude != null && facility?.longitude != null;
  const hasVenue = Boolean(venueName || venueAddress || venuePlace || hasCoords);

  if (facts.length === 0 && officials.length === 0 && !hasVenue) return null;

  // Coordinates beat the address: HNS's free-text addresses for lower-league
  // grounds often don't geocode, but the lat/lng always lands on the pitch.
  const destination = hasCoords
    ? `${facility?.latitude},${facility?.longitude}`
    : encodeURIComponent(
        [venueName, venueAddress, venuePlace].filter(Boolean).join(", "),
      );
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16">
      <div className="space-y-10">
        {facts.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Podaci
            </h3>
            <dl className="mt-5">
              {facts.map((fact) => (
                <Row key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </dl>
          </section>
        )}

        {officials.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Suci
            </h3>
            <dl className="mt-5">
              {officials.map((official) => (
                <Row
                  key={`${official.personId ?? official.name}-${official.role ?? ""}`}
                  label={official.role ?? "Sudac"}
                  value={official.name}
                />
              ))}
            </dl>
          </section>
        )}
      </div>

      {hasVenue && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Stadion
          </h3>

          <div className="mt-5 border border-foreground/10 p-7 clip-corner">
            <p className="font-display text-3xl uppercase leading-none">
              {venueName || venuePlace || "Stadion"}
            </p>
            {(venueAddress || venuePlace) && (
              <p className="mt-3 text-sm text-muted-foreground">
                {[venueAddress, venuePlace].filter(Boolean).join(", ")}
              </p>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 bg-ink-deep px-6 py-3.5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-chalk transition-colors duration-300 hover:bg-club-red"
            >
              <Navigation className="size-4" />
              Upute do stadiona
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

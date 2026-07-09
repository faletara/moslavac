"use client";

import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/helpers/date";
import { cn } from "@/lib/utils";
import type { Match, MatchInfo } from "@/types/hns";
import { MatchSection } from "./MatchSection";

interface MatchInfoCardProps {
  match: Match;
  refereeData: MatchInfo | undefined;
}

/**
 * Consolidated match facts section — folds the former standalone "Suci" and
 * "Stadion" blocks plus key metadata into a single editorial section: a
 * key/value facts column with the officials list on the left, and the venue
 * with an embedded map on the right. Keeps the club's section language (accent
 * line, display heading) rather than a generic data card.
 */
export default function MatchInfoCard({
  match,
  refereeData,
}: MatchInfoCardProps) {
  const facility = match.facility;
  const officials = (refereeData?.officials ?? []).filter(
    (o) => (o.name ?? "").trim() !== "",
  );

  const hasResult =
    match.score.home.current != null && match.score.away.current != null;
  const attendance = match.attendance ?? null;

  const { date, time } =
    match.kickoffAtUtcMs != null
      ? formatDateTime(match.kickoffAtUtcMs)
      : { date: "", time: "" };

  const facts: { label: string; value: string }[] = [
    match.competition?.name?.trim()
      ? { label: "Natjecanje", value: match.competition.name.trim() }
      : null,
    match.roundOrder != null
      ? { label: "Kolo", value: String(match.roundOrder) }
      : null,
    date ? { label: "Datum", value: `${date} · ${time}` } : null,
    hasResult && attendance != null && attendance > 0
      ? { label: "Gledatelja", value: String(attendance) }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const venueName = facility?.name?.trim() ?? "";
  const venueAddress = facility?.address?.trim() ?? "";
  const venuePlace = facility?.place?.trim() ?? "";
  const hasCoords = facility?.latitude != null && facility?.longitude != null;
  const hasVenue = !!(venueName || venueAddress || venuePlace || hasCoords);

  // Nothing meaningful to show — don't render an empty section.
  if (facts.length === 0 && officials.length === 0 && !hasVenue) return null;

  const query = hasCoords
    ? `${facility?.latitude},${facility?.longitude}`
    : encodeURIComponent(
        [venueName, venueAddress, venuePlace].filter(Boolean).join(", "),
      );
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  const lat = facility?.latitude ?? 0;
  const lon = facility?.longitude ?? 0;
  const bbox = hasCoords
    ? `${lon - 0.006},${lat - 0.003},${lon + 0.006},${lat + 0.003}`
    : null;
  const mapEmbedUrl = bbox
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
    : null;

  return (
    <MatchSection
      eyebrow="Suci i lokacija"
      title="Informacije"
      contentClassName="mx-auto mt-12 grid max-w-5xl items-start gap-12 overflow-x-clip md:grid-cols-2 md:gap-16"
    >
      <div className="flex flex-col gap-10">
        {facts.length > 0 && (
          <dl className="divide-y divide-border/40">
            {facts.map((f) => (
              <FactRow key={f.label} label={f.label} value={f.value} />
            ))}
          </dl>
        )}

        {officials.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:tracking-[0.35em]">
              Sudačka ekipa
            </p>
            <dl className="divide-y divide-border/40">
              {officials.map((official, i) => (
                <FactRow
                  key={`${official.personId ?? official.name}-${i}`}
                  label={official.role ?? ""}
                  value={official.name ?? ""}
                />
              ))}
            </dl>
          </div>
        )}
      </div>

      {hasVenue && (
        <div className="flex flex-col gap-5">
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:tracking-[0.35em]">
            Stadion
          </p>
          {venueName && (
            <h3 className="font-display text-3xl font-black uppercase leading-[0.9] tracking-tighter sm:text-4xl md:text-5xl">
              {venueName}
            </h3>
          )}
          {(venueAddress || venuePlace) && (
            <div className="flex flex-col gap-0.5">
              {venueAddress && (
                <p className="text-sm text-muted-foreground sm:text-base">
                  {venueAddress}
                </p>
              )}
              {venuePlace && (
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  {venuePlace}
                </p>
              )}
            </div>
          )}

          {mapEmbedUrl && (
            <div className="group relative aspect-video w-full overflow-hidden border border-border/40">
              <iframe
                src={mapEmbedUrl}
                title={`Karta za ${venueName || "stadion"}`}
                className="size-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 bg-transparent"
              >
                <span className="sr-only">
                  Otvori kartu za {venueName || "stadion"}
                </span>
              </a>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="size-3.5" />
                Pogledaj
              </a>
            </Button>
            <Button asChild variant="default" size="sm">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="size-3.5" />
                Navigacija
              </a>
            </Button>
          </div>
        </div>
      )}
    </MatchSection>
  );
}

function FactRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-6 py-3.5 sm:gap-10",
        className,
      )}
    >
      <dt className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-xs sm:tracking-[0.3em]">
        {label}
      </dt>
      <dd className="text-right text-sm font-black uppercase tracking-tight sm:text-base">
        {value}
      </dd>
    </div>
  );
}

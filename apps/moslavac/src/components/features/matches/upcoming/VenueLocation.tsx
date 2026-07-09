import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Facility } from "@/types/hns";

interface VenueLocationProps {
  facility: Facility | null | undefined;
}

export default function VenueLocation({ facility }: VenueLocationProps) {
  if (!facility) return null;

  const name = facility.name?.trim() ?? "";
  const address = facility.address?.trim() ?? "";
  const place = facility.place?.trim() ?? "";
  const hasCoords = facility.latitude != null && facility.longitude != null;

  if (!name && !address && !place && !hasCoords) return null;

  const query = hasCoords
    ? `${facility.latitude},${facility.longitude}`
    : encodeURIComponent([name, address, place].filter(Boolean).join(", "));

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Lokacija
      </h2>

      <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 text-center">
        <MapPin className="size-5 text-muted-foreground" aria-hidden />
        <div className="flex flex-col gap-1">
          {name && <p className="text-sm font-semibold">{name}</p>}
          {address && (
            <p className="text-xs text-muted-foreground">{address}</p>
          )}
          {place && (
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {place}
            </p>
          )}
        </div>

        <div className="mt-2 flex gap-3">
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
    </section>
  );
}

import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HnsFacility } from "@/types/hns";

interface VenueLocationProps {
  facility: HnsFacility | null | undefined;
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
    <section className="mt-16 pt-12 sm:mt-20">
      <h2>Lokacija</h2>

      <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4">
        <MapPin className="size-5" aria-hidden />
        <div className="flex flex-col gap-1">
          {name && <p>{name}</p>}
          {address && <p>{address}</p>}
          {place && <p>{place}</p>}
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

"use client";

import { MapPin, Navigation } from "lucide-react";
import { AnimatedLine, FadeInView } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HnsFacility } from "@/types/hns";

interface VenueLocationHeroProps {
  facility: HnsFacility | null | undefined;
}

export default function VenueLocationHero({ facility }: VenueLocationHeroProps) {
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

  const lat = facility.latitude ?? 0;
  const lon = facility.longitude ?? 0;
  const bbox = hasCoords
    ? `${lon - 0.006},${lat - 0.003},${lon + 0.006},${lat + 0.003}`
    : null;
  const mapEmbedUrl = bbox
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`
    : null;

  return (
    <section className="mt-20 sm:mt-28">
      <FadeInView>
        <div className="flex flex-col items-center gap-6 text-center">
          <AnimatedLine className="mx-auto" />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
            Mjesto utakmice
          </p>
          <h2 className="select-none font-black uppercase leading-[0.85] tracking-tighter text-[14vw] sm:text-6xl md:text-7xl">
            Stadion
          </h2>
        </div>
      </FadeInView>

      <div
        className={cn(
          "mx-auto mt-12 grid max-w-6xl items-center gap-10 md:gap-16",
          mapEmbedUrl ? "md:grid-cols-2" : "md:grid-cols-1",
        )}
      >
        <FadeInView direction="right" className="flex flex-col gap-6">
          {name && (
            <h3 className="font-black uppercase leading-[0.85] tracking-tighter text-[12vw] sm:text-5xl md:text-6xl">
              {name}
            </h3>
          )}
          <div className="flex flex-col gap-1">
            {address && (
              <p className="text-sm text-muted-foreground sm:text-base">
                {address}
              </p>
            )}
            {place && (
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                {place}
              </p>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
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
        </FadeInView>

        {mapEmbedUrl && (
          <FadeInView direction="left" delay={0.15}>
            <div className="group relative aspect-4/3 w-full overflow-hidden border border-border/40 md:aspect-square">
              <iframe
                src={mapEmbedUrl}
                title={`Karta za ${name || "stadion"}`}
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
                  Otvori kartu za {name || "stadion"}
                </span>
              </a>
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  );
}

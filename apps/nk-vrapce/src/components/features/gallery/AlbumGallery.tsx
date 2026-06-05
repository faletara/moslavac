"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export interface AlbumPhoto {
  url: string;
  alt: string;
  caption: string | null;
}

export function AlbumGallery({ photos }: { photos: AlbumPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? i : (i - 1 + photos.length) % photos.length,
      ),
    [photos.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, prev, next]);

  const active = openIndex !== null ? photos[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.url}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-surface-2"
            aria-label={`Otvori fotografiju ${index + 1}`}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent
          showCloseButton
          className="max-w-5xl border-none bg-transparent p-0 shadow-none sm:max-w-5xl"
        >
          <DialogTitle className="sr-only">
            {active?.caption || "Fotografija"}
          </DialogTitle>
          {active && (
            <figure className="flex flex-col items-center gap-4">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={active.url}
                  alt={active.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              {active.caption && (
                <figcaption className="text-center text-sm text-white/80">
                  {active.caption}
                </figcaption>
              )}
            </figure>
          )}

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Prethodna fotografija"
                className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-brand-yellow hover:text-brand-navy"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Sljedeća fotografija"
                className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-brand-yellow hover:text-brand-navy"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

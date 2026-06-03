"use client";

import { FaYoutube } from "react-icons/fa";
import { useTenant } from "@/components/providers/TenantProvider";
import { Button } from "@/components/ui/button";

export default function YouTubePromoSection() {
  const tenant = useTenant();
  const youtube = tenant.social?.youtube ?? "#";

  return (
    <section className="w-full px-4 py-16 sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
        <p className="flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full" />
            <span className="relative inline-flex size-1.5" />
          </span>
          Uživo · YouTube
        </p>

        <div>
          <span>Gledajte naše</span>
          <span>utakmice uživo</span>
        </div>

        <p className="max-w-xl">
          Ne propustite nijednu utakmicu. Pretplatite se na naš YouTube kanal za
          prijenose uživo, najbolje trenutke i ekskluzivni sadržaj.
        </p>

        <div className="flex flex-col items-center gap-6 pt-2 sm:flex-row sm:gap-10">
          <div>
            <Button asChild size="lg">
              <a href={youtube} target="_blank" rel="noopener noreferrer">
                <FaYoutube className="size-5" />
                Pretplati se
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span>
              150+
            </span>
            <span>
              Pretplatnika
              <br />
              na kanalu
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

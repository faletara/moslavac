import type { Metadata } from "next";
import ComeToMatchSection from "@/components/features/home/ComeToMatchSection";
import FirstTeamSection from "@/components/features/home/FirstTeamSection";
import Hero from "@/components/features/home/Hero";
import LatestNewsSection from "@/components/features/home/LatestNewsSection";
import PreviousAndNextMatchSection from "@/components/features/home/PreviousAndNextMatchSection";
import SeasonDataSection from "@/components/features/home/SeasonDataSection";
import SeasonTicketPromoSection from "@/components/features/home/SeasonTicketPromoSection";
import UpcomingMatchesSection from "@/components/features/home/UpcomingMatchesSection";
import WebShopCarousel from "@/components/features/home/WebShopCarousel";
import YouTubePromoSection from "@/components/features/home/YouTubePromoSection";
import { getPromotableNextMatch } from "@/components/features/home/homeMatch";
import { fetchMatchSlots } from "@/lib/hns/competitions";
import { getTenant } from "@/lib/payload/getTenant";
import { getYouTubeChannelStats } from "@/lib/youtube/getChannelStats";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const description = `Službena stranica ${name} - raspored utakmica, rezultati, tablica, vijesti i sve o klubu.`;

  return {
    description,
    alternates: { canonical: "/" },
    openGraph: { description },
    // `card` se ponavlja jer twitter objekt stranice zamjenjuje onaj iz layouta;
    // bez njega Next padne na `summary` i grb se prikaže kao sitna sličica.
    twitter: { card: "summary_large_image", description },
  };
}

export default async function HomePage() {
  const [tenant, matchSlots] = await Promise.all([
    getTenant(),
    fetchMatchSlots(),
  ]);
  const homepageMatchSlots = {
    ...matchSlots,
    next: getPromotableNextMatch(matchSlots.next),
  };
  const youtubeStats = await getYouTubeChannelStats(tenant.social?.youtube);

  return (
    <div>
      <Hero
        tenant={tenant}
        hasNextMatch={homepageMatchSlots.next != null}
      />
      <PreviousAndNextMatchSection matchSlots={homepageMatchSlots} />
      <LatestNewsSection />
      <FirstTeamSection />
      <UpcomingMatchesSection />
      <SeasonDataSection />
      <WebShopCarousel />
      <ComeToMatchSection />
      <SeasonTicketPromoSection />
      <YouTubePromoSection
        youtubeUrl={tenant.social?.youtube}
        stats={youtubeStats}
      />
    </div>
  );
}

import type { Metadata } from "next";
import ComeToMatchSection from "@/components/features/home/ComeToMatchSection";
import Hero from "@/components/features/home/Hero";
import LatestNewsSection from "@/components/features/home/LatestNewsSection";
import LeagueStandingsSection from "@/components/features/home/LeagueStandingsSection";
import PreviousAndNextMatchSection from "@/components/features/home/PreviousAndNextMatchSection";
import SeasonTicketPromoSection from "@/components/features/home/SeasonTicketPromoSection";
import TopScorersSection from "@/components/features/home/TopScorersSection";
import UpcomingMatchesSection from "@/components/features/home/UpcomingMatchesSection";
import WebShopCarousel from "@/components/features/home/WebShopCarousel";
import YouTubePromoSection from "@/components/features/home/YouTubePromoSection";
import { getTenant } from "@/lib/payload/getTenant";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const description = `Službena stranica ${name} – raspored utakmica, rezultati, tablica, vijesti i sve o klubu.`;

  return {
    description,
    alternates: { canonical: "/" },
    openGraph: { description },
    twitter: { description },
  };
}

export default async function HomePage() {
	const tenant = await getTenant();

	return (
		<div className="space-y-12 py-8">
			<Hero tenant={tenant} />
			<PreviousAndNextMatchSection />
			<LatestNewsSection />
			<UpcomingMatchesSection />
			<ComeToMatchSection />
			<LeagueStandingsSection />
			<TopScorersSection />
			<YouTubePromoSection />
			<WebShopCarousel />
			<SeasonTicketPromoSection />
		</div>
	);
}

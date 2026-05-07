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

export default async function HomePage() {
	const tenant = await getTenant();

	return (
		<div className="space-y-12 py-8">
			<Hero tenant={tenant} />
			<PreviousAndNextMatchSection />
			<LatestNewsSection />
			<LeagueStandingsSection />
			<TopScorersSection />
			<UpcomingMatchesSection />
			<YouTubePromoSection />
			<WebShopCarousel />
			<SeasonTicketPromoSection />
		</div>
	);
}

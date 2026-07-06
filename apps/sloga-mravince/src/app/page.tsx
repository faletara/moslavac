import type { Metadata } from "next";
import CtaSection from "@/components/features/home/CtaSection";
import Hero from "@/components/features/home/Hero";
import NewsSection from "@/components/features/home/NewsSection";
import NextMatchBar from "@/components/features/home/NextMatchBar";
import PlayersSection from "@/components/features/home/PlayersSection";
import ShopSection from "@/components/features/home/ShopSection";
import StandingsSection from "@/components/features/home/StandingsSection";
import { fetchMatchSlots, fetchSeniorCompetition } from "@/lib/hns/competitions";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { fetchRoster } from "@/lib/payload/getRoster";
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
  const [tenant, newsPage, matchSlots, roster, senior] = await Promise.all([
    getTenant(),
    fetchNewsPaginated({ page: 1, size: 8 }),
    fetchMatchSlots(),
    fetchRoster(),
    fetchSeniorCompetition(),
  ]);

  const standings = senior?.id
    ? await fetchTeamStandings({ competitionId: senior.id })
    : [];

  const allNews = newsPage.content.filter((n) => n.slug);
  const heroNews = allNews.slice(0, 4);

  const logo = tenant.branding?.logo;
  const crestSrc = !logo
    ? "/crest.png"
    : typeof logo === "string"
      ? logo
      : logo.url;

  return (
    <div>
      {/* Hero puni ekran (viewport minus 5rem header); scoreboard je zasebna sekcija ispod */}
      <div className="flex h-[calc(100svh-5rem)] flex-col">
        <Hero tenant={tenant} news={heroNews} crestSrc={crestSrc} />
      </div>
      <NextMatchBar slots={matchSlots} />
      <NewsSection news={allNews} crestSrc={crestSrc} />
      <StandingsSection rows={standings} />
      <PlayersSection players={roster} />
      <ShopSection />
      <CtaSection tenant={tenant} />
    </div>
  );
}

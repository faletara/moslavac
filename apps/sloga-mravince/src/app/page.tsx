import type { Metadata } from "next";
import CtaSection from "@/components/features/home/CtaSection";
import HeritageSection from "@/components/features/home/HeritageSection";
import Hero from "@/components/features/home/Hero";
import MarqueeStrip from "@/components/features/home/MarqueeStrip";
import NewsSection from "@/components/features/home/NewsSection";
import NextMatchBar from "@/components/features/home/NextMatchBar";
import PartnersSection from "@/components/features/home/PartnersSection";
import PlayersSection from "@/components/features/home/PlayersSection";
import StadiumSection from "@/components/features/home/StadiumSection";
import StandingsSection from "@/components/features/home/StandingsSection";
import { formatDateParts } from "@/lib/helpers/date";
import {
  fetchMatchSlots,
  fetchSeniorCompetition,
} from "@/lib/hns/competitions";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { fetchRoster } from "@/lib/payload/getRoster";
import { getTenant } from "@/lib/payload/getTenant";
import type { Match, MatchSlots } from "@/types/hns";

export const revalidate = 60;

function isRealMatch(
  match: Match | null | undefined,
): match is Match & { kickoffAtUtcMs: number } {
  return (
    match != null && Object.keys(match).length > 0 && match.kickoffAtUtcMs != null
  );
}

function getNextMatchMarquee(
  slots: MatchSlots,
  clubName: string,
): { items: string[]; ariaLabel: string } {
  if (!isRealMatch(slots.next)) {
    const items = ["Sljedeća utakmica", "Raspored uskoro", clubName];
    return { items, ariaLabel: items.join(" · ") };
  }

  const match = slots.next;
  const { weekdayShort, day, monthShort, time } = formatDateParts(
    match.kickoffAtUtcMs,
  );
  const teams =
    [match.homeTeam?.name, match.awayTeam?.name].filter(Boolean).join(" - ") ||
    clubName;
  const kickoff = `${weekdayShort} ${day}. ${monthShort} · ${time}`;
  const venue = match.facility?.name ?? match.facility?.place;
  const competition = [match.competition?.name, match.round]
    .filter(Boolean)
    .join(" · ");
  const items = [
    "Sljedeća utakmica",
    teams,
    kickoff,
    venue,
    competition,
  ].filter((item): item is string => Boolean(item));

  return { items, ariaLabel: items.join(" · ") };
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const name = tenant.displayName;
  const description = `Službena stranica ${name} – raspored utakmica, rezultati, tablica, vijesti i sve o klubu.`;

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

  const marquee = getNextMatchMarquee(matchSlots, tenant.displayName);

  return (
    <div>
      {/* Hero puni ekran (viewport minus 5rem header) */}
      <div className="flex h-[calc(100svh-5rem)] flex-col">
        <Hero tenant={tenant} news={heroNews} crestSrc={crestSrc} />
      </div>
      {/* <MarqueeStrip items={marquee.items} ariaLabel={marquee.ariaLabel} /> */}
      <NewsSection news={allNews} crestSrc={crestSrc} />
      <NextMatchBar slots={matchSlots} />
      <StandingsSection rows={standings} />
      <PlayersSection players={roster} />
      <StadiumSection />
      <HeritageSection />
      <CtaSection tenant={tenant} />
      <PartnersSection />
    </div>
  );
}

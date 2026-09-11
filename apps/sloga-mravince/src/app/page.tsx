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
import WebshopSection from "@/components/features/home/WebshopSection";
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
    match != null &&
    Object.keys(match).length > 0 &&
    match.kickoffAtUtcMs != null
  );
}

/** Traka se prikazuje samo kad stvarno postoji sljedeća utakmica. */
function getNextMatchMarquee(
  slots: MatchSlots,
  clubName: string,
): { items: string[]; ariaLabel: string } | null {
  if (!isRealMatch(slots.next)) return null;

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
  const title = `${name} — službena stranica kluba`;
  // Bez imena mjesta: genitiv hrvatskog toponima se ne da izvesti iz Tenanta
  // ("Mravince" → "Mravinaca"), a adresa ionako ide u schema.org graf.
  const description = `Službena stranica nogometnog kluba ${name}. Raspored utakmica, rezultati uživo, tablica, sastav momčadi i vijesti iz kluba.`;

  return {
    // `absolute` jer bi inače predložak iz layouta dopisao " | ${name}".
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    // Objekti `openGraph` i `twitter` iz stranice ZAMJENJUJU one iz layouta, ne
    // spajaju se s njima. Zato se ovdje ponavlja i ono što layout već ima —
    // bez `siteName` Google u rezultatu ispisuje domenu umjesto imena kluba.
    openGraph: {
      type: "website",
      locale: "hr_HR",
      siteName: name,
      url: "/",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
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

  const clubName = tenant.branding?.shortName ?? tenant.displayName;

  const marquee = getNextMatchMarquee(matchSlots, tenant.displayName);
  const webshopUrl = tenant.social?.webshop ?? null;

  return (
    <div>
      {/* Hero puni ekran (viewport minus 5rem header) */}

      <div className="flex h-[calc(100svh-5rem)] flex-col">
        <Hero tenant={tenant} news={heroNews} />
      </div>
      {marquee && (
        <MarqueeStrip items={marquee.items} ariaLabel={marquee.ariaLabel} />
      )}
      <NewsSection news={allNews} clubName={clubName} />

      <NextMatchBar slots={matchSlots} />

      <PlayersSection players={roster} />

      <StandingsSection rows={standings} />
      {webshopUrl && <WebshopSection url={webshopUrl} />}
      <StadiumSection />
      <HeritageSection />
      <CtaSection tenant={tenant} />
      <PartnersSection />
    </div>
  );
}

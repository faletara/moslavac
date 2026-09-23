import type { Metadata } from "next";
import Hero from "@/components/features/home/Hero";
import HistorySection from "@/components/features/home/HistorySection";
import MatchSection from "@/components/features/home/MatchSection";
import NewsSection from "@/components/features/home/NewsSection";
import PlayersSection from "@/components/features/home/PlayersSection";
import SchoolSection from "@/components/features/home/SchoolSection";
import StandingsSection from "@/components/features/home/StandingsSection";
import { fetchAllMatches } from "@/lib/hns/matches";
import { isFinished } from "@/lib/hns/matchStatus";
import { fetchPlayerPhotos } from "@/lib/hns/players";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { fetchLatestNews } from "@/lib/payload/getNews";
import { fetchRoster } from "@/lib/payload/getRoster";
import { getTenant } from "@/lib/payload/getTenant";
import type { PayloadMedia } from "@/lib/payload/types";

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
  const [tenant, allMatches, news, players] = await Promise.all([
    getTenant(),
    fetchAllMatches(),
    fetchLatestNews(),
    fetchRoster(),
  ]);

  const logo = tenant.branding?.logo;

  const crestUrl =
    (logo?.url ?? null);

  // Senior natjecanje se rješava po IMENU (tenant filter), ne po season-tagu —
  // radi i na prijelazu sezone i generički (kad se upiše pravi Garićev teamId,
  // sve i dalje radi bez promjena u kodu).
  const seniorFilter = tenant.hns.seniorCompetitionFilter ?? "";

  const seniorMatches = seniorFilter
    ? allMatches.filter((m) => m.competition?.name?.includes(seniorFilter))
    : [];

  const competitionId =
    seniorMatches.find((m) => m.competition?.id)?.competition?.id ?? null;

  const competitionName = seniorMatches[0]?.competition?.name ?? null;

  const [liveStandings, playerPhotos] = await Promise.all([
    competitionId ? fetchTeamStandings({ competitionId }) : [],
    fetchPlayerPhotos({ personIds: players.map((p) => p.personId) }),
  ]);

  const byKickoff = (
    a: (typeof seniorMatches)[number],
    b: (typeof seniorMatches)[number],
  ) => (a.kickoffAtUtcMs ?? 0) - (b.kickoffAtUtcMs ?? 0);

  const finished = seniorMatches.filter(isFinished).sort(byKickoff);
  // "Nadolazeće" = još neodigrane (HNS future upit ionako vraća samo buduće).
  const upcoming = seniorMatches.filter((m) => !isFinished(m)).sort(byKickoff);
  const featured = upcoming[0] ?? finished.at(-1) ?? null;
  // Rezultati i termini bez istaknute utakmice — ta je već u traci istaknuta.
  // Kronološki poredak (najstarije prvo) jer traka ide s lijeva na desno.
  const results = finished.filter((m) => m.id !== featured?.id).slice(-3);
  const fixtures = upcoming.filter((m) => m.id !== featured?.id).slice(0, 3);
  const isNext = upcoming.length > 0;

  return (
    <>
      {/* Hero nosi samo identitet kluba. Istaknutu utakmicu prikazuje
          MatchSection odmah ispod, pa je hero ne duplicira. */}
      <Hero tenant={tenant} />
      {featured && (
        <MatchSection
          featured={featured}
          results={results}
          fixtures={fixtures}
          isNext={isNext}
        />
      )}
      <NewsSection news={news.slice(0, 3)} crestUrl={crestUrl} />
      <StandingsSection rows={liveStandings} competition={competitionName} />
      <PlayersSection players={players} photos={playerPhotos} />
      <HistorySection
        founded={tenant.branding?.founded ?? 1923}
        place={tenant.contact?.city ?? "Garešnica"}
        imageSrc="/photos/100.png"
      />
      <SchoolSection
        imageSrc="/photos/711532216_1506980807886798_4321050787060374494_n.jpg"
        email={tenant.contact?.email ?? null}
        facebook={tenant.social?.facebook ?? null}
      />
    </>
  );
}

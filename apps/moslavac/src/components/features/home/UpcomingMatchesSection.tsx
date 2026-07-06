import { fetchUpcomingMatches } from "@/lib/hns/matches";
import UpcomingMatchesView from "./UpcomingMatchesView";

export default async function UpcomingMatchesSection() {
  const matches = await fetchUpcomingMatches();

  if (!matches || matches.length === 0) return null;

  return <UpcomingMatchesView matches={matches} />;
}

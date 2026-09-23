import "server-only";
import { notFound } from "next/navigation";
import { parseTrailingId } from "@/lib/helpers/slug";
import { fetchClubCompetition, fetchClubMatch } from "@/lib/hns/clubScope";
import type { ClubCompetition, ClubMatch } from "@/types/hns";

// Route-side of the club scope (`@/lib/hns/clubScope`): slug → id → resolver,
// and `notFound()` for a junk slug or an id outside the club. Lives here, not
// in `hns`, because `hns` must not import `lib` or `next/navigation`.

/** The club's competition named by the route slug, or a 404. */
export async function resolveClubCompetitionOr404(
  slug: string,
): Promise<ClubCompetition> {
  const id = parseTrailingId(slug);
  const competition = id == null ? null : await fetchClubCompetition(id);

  if (!competition) notFound();

  return competition;
}

/** The in-scope match named by the route slug, or a 404. */
export async function resolveClubMatchOr404(slug: string): Promise<ClubMatch> {
  const id = parseTrailingId(slug);
  const match = id == null ? null : await fetchClubMatch(id);

  if (!match) notFound();

  return match;
}

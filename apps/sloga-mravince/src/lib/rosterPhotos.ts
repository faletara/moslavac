import "server-only";
import { getCometImageUrl } from "@/lib/hns/imageUrl";
import type { HnsCacheOptions } from "@/lib/hns/fetchResource";
import { fetchPlayerDetails } from "@/lib/hns/players";
import type { RosterEntry } from "@/types/roster";

/**
 * Dohvaća HNS ("Comet") portrete za igrače bez uploadane fotke.
 * Vraća mapu personId → gotov URL slike.
 */
export async function resolveCometPhotoUrls(
  entries: RosterEntry[],
  opts: HnsCacheOptions = {},
): Promise<Map<number, string>> {
  const needed = entries.filter(
    (entry) => !entry.photo?.url && entry.personId != null,
  );

  const results = await Promise.all(
    needed.map(async (entry) => {
      const details = await fetchPlayerDetails({
        personId: String(entry.personId),
        revalidate: opts.revalidate,
      }).catch(() => null);

      return [entry.personId, details?.picture ?? null] as const;
    }),
  );

  const map = new Map<number, string>();

  for (const [personId, picture] of results) {
    if (picture) map.set(personId, getCometImageUrl(picture));
  }

  return map;
}

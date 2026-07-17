import "server-only";
import { cache } from "react";

export interface YouTubeChannelStats {
  subscriberCount: number | null;
  videoCount: number;
  viewCount: number;
}

interface YouTubeChannelsResponse {
  items?: {
    statistics?: {
      subscriberCount?: string;
      hiddenSubscriberCount?: boolean;
      videoCount?: string;
      viewCount?: string;
    };
  }[];
}

/**
 * Turns a channel URL into the lookup param the Data API needs: `/@handle`,
 * `/channel/UC…` and the legacy `/user/name` each resolve differently.
 */
function channelLookupParam(youtubeUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(youtubeUrl);
  } catch {
    return null;
  }

  const [first, second] = url.pathname.split("/").filter(Boolean);
  if (!first) return null;

  if (first.startsWith("@")) return `forHandle=${encodeURIComponent(first)}`;
  if (first === "channel" && second) return `id=${encodeURIComponent(second)}`;
  if ((first === "user" || first === "c") && second) {
    return `forUsername=${encodeURIComponent(second)}`;
  }
  return null;
}

function toCount(value: string | undefined): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Public channel statistics. Returns null whenever the numbers can't be
 * trusted — missing key, unparseable URL, API error — so the section can fall
 * back to its plain promo instead of rendering zeros.
 */
export const getYouTubeChannelStats = cache(
  async (youtubeUrl: string | null | undefined) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey || !youtubeUrl) return null;

    const lookup = channelLookupParam(youtubeUrl);
    if (!lookup) return null;

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&${lookup}&key=${apiKey}`,
        {
          signal: AbortSignal.timeout(5000),
          next: { revalidate: 3600, tags: ["youtube-channel-stats"] },
        },
      );
      if (!response.ok) return null;

      const data = (await response.json()) as YouTubeChannelsResponse;
      const statistics = data.items?.[0]?.statistics;
      if (!statistics) return null;

      const videoCount = toCount(statistics.videoCount);
      const viewCount = toCount(statistics.viewCount);
      if (videoCount == null || viewCount == null) return null;

      return {
        subscriberCount: statistics.hiddenSubscriberCount
          ? null
          : toCount(statistics.subscriberCount),
        videoCount,
        viewCount,
      } satisfies YouTubeChannelStats;
    } catch {
      return null;
    }
  },
);

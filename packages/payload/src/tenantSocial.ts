export function normalizeYouTubeChannelUrl(
  value: string | null | undefined,
): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    const safeProtocol = url.protocol === "https:" || url.protocol === "http:";
    const youtubeHost =
      url.hostname === "youtube.com" ||
      url.hostname.endsWith(".youtube.com") ||
      url.hostname === "youtu.be" ||
      url.hostname.endsWith(".youtu.be");

    return safeProtocol && youtubeHost ? url.toString() : null;
  } catch {
    return null;
  }
}

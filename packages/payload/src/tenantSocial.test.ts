import { describe, expect, it } from "vitest";
import { normalizeYouTubeChannelUrl } from "./tenantSocial";

describe("normalizeYouTubeChannelUrl", () => {
  it("normalizira URL službenog YouTube kanala", () => {
    expect(
      normalizeYouTubeChannelUrl(
        "  https://www.youtube.com/@SNKMoslavacPopovaca  ",
      ),
    ).toBe("https://www.youtube.com/@SNKMoslavacPopovaca");
  });

  it.each([
    null,
    undefined,
    "",
    "javascript:alert('xss')",
    "https://example.com",
  ])("odbacuje vrijednost koja nije YouTube kanal: %s", (value) => {
    expect(normalizeYouTubeChannelUrl(value)).toBeNull();
  });
});

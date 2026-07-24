import { describe, expect, it } from "vitest";
import {
  CLUB_FEATURE_OPTIONS,
  CLUB_FEATURES,
  clubFeatureQuery,
  getClubFeature,
} from "./clubFeatures";

describe("club feature registry", () => {
  it("defines the board collection alias once", () => {
    expect(getClubFeature("board")).toMatchObject({
      feature: "board",
      slug: "board-members",
      label: "Uprava",
    });
    expect(clubFeatureQuery("board")).toEqual({
      collection: "board-members",
      tagPrefix: "board",
    });
  });

  it("derives tenant select options from feature labels", () => {
    expect(CLUB_FEATURE_OPTIONS).toEqual(
      CLUB_FEATURES.map(({ feature, label }) => ({ label, value: feature })),
    );
  });

  it("keeps the equipment slug pinned to its existing table", () => {
    // Slug je ime postgres tablice s 28 proizvoda Moslavca i Vrapča —
    // preimenovanje bi Payload protumačio kao novu, praznu kolekciju.
    expect(getClubFeature("equipment").slug).toBe("equipment");
  });

  it("keeps feature names and collection slugs unique", () => {
    const features = CLUB_FEATURES.map(({ feature }) => feature);
    const slugs = CLUB_FEATURES.map(({ slug }) => slug);

    expect(new Set(features).size).toBe(features.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

export const CLUB_FEATURES = [
  { feature: "pages", slug: "pages", label: "Stranice (povijest, statut…)" },
  { feature: "documents", slug: "documents", label: "Dokumenti" },
  { feature: "board", slug: "board-members", label: "Uprava" },
  { feature: "school", slug: "school-programs", label: "Škola nogometa" },
  { feature: "gallery", slug: "gallery-albums", label: "Galerija" },
] as const;

export type ClubFeatureRegistration = (typeof CLUB_FEATURES)[number];
export type ClubFeature = ClubFeatureRegistration["feature"];
export type ClubFeatureCollectionSlug = ClubFeatureRegistration["slug"];

export const CLUB_FEATURE_OPTIONS: { label: string; value: ClubFeature }[] =
  CLUB_FEATURES.map(({ feature, label }) => ({ label, value: feature }));

export function getClubFeature(feature: ClubFeature): ClubFeatureRegistration {
  const registration = CLUB_FEATURES.find((item) => item.feature === feature);
  if (!registration) {
    throw new Error(`Unknown club feature "${feature}"`);
  }
  return registration;
}

export function clubFeatureQuery(feature: ClubFeature): {
  collection: ClubFeatureCollectionSlug;
  tagPrefix: ClubFeature;
} {
  return {
    collection: getClubFeature(feature).slug,
    tagPrefix: feature,
  };
}

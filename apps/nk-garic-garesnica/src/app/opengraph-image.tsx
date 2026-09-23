import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderClubCrestCard,
} from "@/lib/app-shell/seo/clubCrestCard";

export const size = OG_SIZE;

export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  // Novi klub: logotip iz CMS-a je dovoljan. Želiš li grb iz repozitorija,
  // stavi ga u `public/` i dodaj `crestFile: "crest.png"`.
  return renderClubCrestCard({ background: "#0f172a" });
}

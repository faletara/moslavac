import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderClubCrestCard,
} from "@/lib/app-shell/seo/clubCrestCard";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderClubCrestCard({
    background: "#000000",
    crestFile: "grb-vrapce.png",
  });
}

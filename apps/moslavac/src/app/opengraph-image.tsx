import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderClubCrestCard,
} from "@/lib/app-shell/seo/clubCrestCard";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Iz `globals.css` (--navy-deep, --club) — ImageResponse ne vidi CSS varijable.
const NAVY_DEEP = "#020718";

export default function OpengraphImage() {
  return renderClubCrestCard({
    // Reflektorski sjaj kao na navy sekcijama — gradijent, ne blur.
    background: `radial-gradient(circle at 20% 8%, rgba(17,76,191,0.42) 0%, rgba(17,76,191,0.12) 32%, rgba(2,7,24,0) 60%), ${NAVY_DEEP}`,
    crestFile: "grb.png",
  });
}

import { NotFoundState } from "@/components/feedback/NotFoundState";

export default function PlayerStatsNotFound() {
  return (
    <NotFoundState
      title="Statistika nije pronađena"
      description="Igrač ili natjecanje koje tražite ne postoji."
      backHref="/prva-momcad"
      backLabel="Prva momčad"
    />
  );
}

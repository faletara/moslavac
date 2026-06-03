import { NotFoundState } from "@/components/feedback/NotFoundState";

export default function SeasonNotFound() {
  return (
    <NotFoundState
      title="Sezona nije pronađena"
      description="Sezona ili natjecanje koje tražite ne postoji."
      backHref="/"
      backLabel="Natrag na početnu"
    />
  );
}

import { NotFoundState } from "@/components/feedback/NotFoundState";

export default function MatchNotFound() {
  return (
    <NotFoundState
      title="Utakmica nije pronađena"
      description="Utakmica koju tražite ne postoji."
      backHref="/"
      backLabel="Natrag na početnu"
    />
  );
}

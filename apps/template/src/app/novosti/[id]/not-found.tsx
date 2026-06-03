import { NotFoundState } from "@/components/feedback/NotFoundState";

export default function NewsArticleNotFound() {
  return (
    <NotFoundState
      title="Vijest nije pronađena"
      description="Vijest koju tražite ne postoji ili je uklonjena."
      backHref="/novosti"
      backLabel="Sve vijesti"
    />
  );
}

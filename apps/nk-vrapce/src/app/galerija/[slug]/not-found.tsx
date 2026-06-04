import { NotFoundState } from "@/components/feedback/NotFoundState";

export default function AlbumNotFound() {
  return (
    <NotFoundState
      title="Album nije pronađen"
      description="Album koji tražite ne postoji ili je uklonjen."
      backHref="/galerija"
      backLabel="Sve galerije"
    />
  );
}

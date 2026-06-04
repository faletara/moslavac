import { Clock, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { PageHero } from "@/components/features/PageHero";
import { fetchPageByKey } from "@/lib/payload/getPages";
import { fetchSchoolPrograms } from "@/lib/payload/getSchoolPrograms";
import type { SchoolProgram } from "@/types/school";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageByKey({ key: "skola-info" });
  return {
    title: page?.title ?? "Škola nogometa",
    description:
      page?.seoDescription ??
      "Škola nogometa NK Vrapče — programi po dobnim skupinama, treneri i termini treninga.",
    alternates: { canonical: "/skola-nogometa" },
  };
}

export default async function SkolaNogometaPage() {
  const [page, programs] = await Promise.all([
    fetchPageByKey({ key: "skola-info" }),
    fetchSchoolPrograms(),
  ]);

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow="Mladi Vrapča"
        title={page?.title ?? "Škola nogometa"}
        description={
          page?.content ? undefined : "Programi po dobnim skupinama za naše najmlađe."
        }
      />

      {page?.content && (
        <article
          className="news-content mx-auto mt-12 max-w-2xl text-center sm:mt-16"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}

      {programs.length === 0 ? (
        <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Programi škole nogometa uskoro.
        </p>
      ) : (
        <StaggerContainer
          className="mt-16 grid grid-cols-1 gap-6 sm:mt-24 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          staggerChildren={0.06}
        >
          {programs.map((program) => (
            <StaggerItem key={program.id}>
              <ProgramCard program={program} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}

function ProgramCard({ program }: { program: SchoolProgram }) {
  const photoUrl = program.photo?.sizes?.card?.url ?? program.photo?.url ?? null;
  return (
    <FadeInView className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-surface transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={program.photo?.alt || program.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-navy">
            <span className="text-5xl font-black text-brand-yellow">⚽</span>
          </div>
        )}
        {program.ageRange && (
          <span className="absolute left-4 top-4 rounded-full bg-brand-yellow px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-navy">
            {program.ageRange}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-black uppercase tracking-tight">
          {program.name}
        </h3>
        {program.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {program.description}
          </p>
        )}
        <div className="mt-auto flex flex-col gap-2 pt-4 text-xs text-muted-foreground">
          {program.coach && (
            <span className="inline-flex items-center gap-2">
              <UserRound className="size-3.5 text-brand-blue" />
              {program.coach}
            </span>
          )}
          {program.schedule && (
            <span className="inline-flex items-center gap-2">
              <Clock className="size-3.5 text-brand-blue" />
              {program.schedule}
            </span>
          )}
        </div>
      </div>
    </FadeInView>
  );
}

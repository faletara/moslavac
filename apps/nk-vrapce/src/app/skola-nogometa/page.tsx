import { ArrowRight, Clock, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero } from "@/components/features/BrandedHero";
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
    <>
      <BrandedHero
        eyebrow="Mladi Vrapča"
        title={page?.title ?? "Škola nogometa"}
        description={
          page?.content
            ? null
            : "Sustavan razvoj mladih nogometaša — od prvih koraka s loptom do juniora spremnih za seniorski nogomet."
        }
      />

      <div className="mx-auto w-full max-w-screen-xl px-6 pb-24 lg:px-8">
        {page?.content && (
          <article
            className="news-content mx-auto mt-16 max-w-2xl sm:mt-20"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}

        {programs.length === 0 ? (
          <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Programi škole nogometa uskoro.
          </p>
        ) : (
          <>
            {/* Bold editorial heading */}
            <div className="mt-20 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b border-line pb-7 sm:mt-28">
              <div className="flex flex-col gap-3">
                <span className="h-[3px] w-10 rounded-full bg-brand-yellow" />
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-xs">
                  Razvojni put
                </p>
                <h2 className="text-balance font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-6xl">
                  Programi po uzrastu
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Svaka generacija ima svoj program, trenera i termine — prilagođene
                uzrastu i razini razvoja.
              </p>
            </div>

            {/* Razvojna ljestvica — okomiti niz koji prati put od U7 do juniora.
                Tanka žuta spina lijevo veže korake u jedinstvenu priču. */}
            <div className="relative mt-12 sm:mt-16">
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-10 left-[1.45rem] top-10 hidden w-px bg-gradient-to-b from-brand-yellow/70 via-line to-transparent sm:block"
              />
              <StaggerContainer
                className="flex flex-col gap-5 sm:gap-6"
                staggerChildren={0.08}
              >
                {programs.map((program, index) => (
                  <StaggerItem key={program.id}>
                    <Link
                      href={`/skola-nogometa/${program.id}`}
                      className="group block"
                    >
                      <ProgramRow
                        program={program}
                        index={index}
                        total={programs.length}
                      />
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ProgramRow({
  program,
  index,
  total,
}: {
  program: SchoolProgram;
  index: number;
  total: number;
}) {
  const photoUrl = program.photo?.sizes?.card?.url ?? program.photo?.url ?? null;
  // Naziv kategorije bez raspona uzrasta (npr. "Limači U7–U9" → "Limači")
  const category = program.ageRange
    ? program.name.replace(program.ageRange, "").trim() || program.name
    : program.name;
  const isLast = index === total - 1;

  return (
    <FadeInView className="relative sm:pl-16">
      {/* Čvor na spini — žuti prsten poravnat s lijevom linijom. */}
      <span
        aria-hidden
        className="absolute left-[1.45rem] top-9 z-10 hidden size-3 -translate-x-1/2 rounded-full border-2 border-brand-yellow bg-canvas transition-colors duration-300 group-hover:bg-brand-yellow sm:block"
      />

      <article className="relative flex flex-col overflow-hidden border border-white/10 bg-linear-to-br from-brand-navy to-brand-navy-700 shadow-[0_12px_30px_-18px_rgba(10,28,51,0.5)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-yellow/70 group-hover:shadow-[0_28px_55px_-22px_rgba(255,203,5,0.32)] sm:flex-row">
        {/* Suptilna fotka u pozadini (ako postoji) */}
        {photoUrl && (
          <div aria-hidden className="absolute inset-0 -z-10">
            <Image
              src={photoUrl}
              alt=""
              fill
              sizes="(min-width: 640px) 60vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-br from-brand-navy/92 via-brand-navy/85 to-brand-navy-700/92" />
          </div>
        )}

        {/* Lijevi rail — uzrast kao istaknuta oznaka koraka. */}
        <div className="relative flex shrink-0 items-center gap-5 border-b border-white/10 bg-black/15 px-7 py-5 sm:w-52 sm:flex-col sm:items-start sm:justify-center sm:border-b-0 sm:border-r sm:py-8">
          {program.ageRange && (
            <span className="inline-flex w-fit bg-brand-yellow px-4 py-1.5 font-display text-lg font-extrabold uppercase tracking-wide text-brand-navy shadow-[0_4px_14px_-4px_rgba(255,203,5,0.6)] sm:text-xl">
              {program.ageRange}
            </span>
          )}
          {/* Mikro-oznaka kraja puta na zadnjem koraku. */}
          {isLast && (
            <span className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.25em] text-brand-blue sm:mt-3 sm:block">
              → Seniori
            </span>
          )}
        </div>

        {/* Sadržaj */}
        <div className="relative flex flex-1 flex-col p-7 sm:p-8">
          <h3 className="text-balance font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            {category}
          </h3>

          {program.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
              {program.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-xs text-white/60">
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

          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-yellow">
            Saznaj više
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </FadeInView>
  );
}

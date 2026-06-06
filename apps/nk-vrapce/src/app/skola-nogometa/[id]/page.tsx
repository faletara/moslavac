import { ArrowLeft, ArrowRight, Clock, Trophy, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BrandedHero } from "@/components/features/BrandedHero";
import {
  fetchSchoolProgramById,
  fetchSchoolPrograms,
} from "@/lib/payload/getSchoolPrograms";
import { BASE_URL } from "@/lib/siteUrl";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const programs = await fetchSchoolPrograms();
  return programs.map((program) => ({ id: String(program.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const program = await fetchSchoolProgramById({ id });
  if (!program) return { title: "Program nije pronađen" };
  return {
    title: `${program.name} — Škola nogometa`,
    description:
      program.description ??
      `Program škole nogometa NK Vrapče${program.ageRange ? ` za uzrast ${program.ageRange}` : ""}.`,
    alternates: { canonical: `${BASE_URL}/skola-nogometa/${program.id}` },
  };
}

export default async function SchoolProgramPage({ params }: Props) {
  const { id } = await params;
  const program = await fetchSchoolProgramById({ id });
  if (!program) notFound();

  const photoUrl =
    program.photo?.sizes?.hero?.url ?? program.photo?.url ?? null;
  // Naziv kategorije bez raspona uzrasta (npr. "Limači U7–U9" → "Limači")
  const category = program.ageRange
    ? program.name.replace(program.ageRange, "").trim() || program.name
    : program.name;

  return (
    <>
      <BrandedHero
        eyebrow={
          program.ageRange ? `Uzrast ${program.ageRange}` : "Škola nogometa"
        }
        title={category}
        cta={{ label: "Upiši dijete", href: "/kontakt" }}
        backgroundImage={photoUrl}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-12 pb-24 sm:pt-16 lg:px-8">
        <Link
          href="/skola-nogometa"
          className="group inline-flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue sm:text-xs"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Svi programi
        </Link>

        {/* Brze činjenice — trener i termini (uređuju se u CMS-u) */}
        {(program.coach || program.schedule) && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {program.coach && (
              <InfoTile icon={<UserRound className="size-5" />} label="Trener">
                {program.coach}
              </InfoTile>
            )}
            {program.schedule && (
              <InfoTile icon={<Clock className="size-5" />} label="Termini">
                {program.schedule}
              </InfoTile>
            )}
          </div>
        )}

        {/* O programu */}
        <section className="mt-14 sm:mt-16">
          <SectionHeading icon={<Trophy className="size-5 text-brand-blue" />}>
            O programu
          </SectionHeading>
          <div className="news-content mt-5 max-w-2xl">
            {program.description ? (
              program.description
                .split("\n")
                .filter(Boolean)
                .map((para) => (
                  <p key={para} className="leading-[1.75] text-muted-foreground">
                    {para}
                  </p>
                ))
            ) : (
              <p className="leading-[1.75] text-muted-foreground">
                Opis programa uskoro.
              </p>
            )}
          </div>
        </section>

        {/* Upis i kontakt — brandirana CTA kartica */}
        <section className="relative isolate mt-12 overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy-700 p-8 sm:mt-16 sm:p-12">
          {/* Grb watermark u kutu */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-10 h-48 w-48 opacity-[0.07]"
          >
            <Image
              src="/grb-vrapce.png"
              alt=""
              fill
              sizes="12rem"
              className="object-contain"
            />
          </div>
          {/* Topli žuti glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[10%] -top-[30%] h-2/3 w-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,203,5,0.16), transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col gap-4">
            <span className="h-[3px] w-10 rounded-full bg-brand-yellow" />
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
              Upiši dijete
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Za sve informacije o uključivanju djeteta u program javite se na
              kontakt kluba — rado ćemo odgovoriti na sva pitanja.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/kontakt"
                className="group inline-flex items-center justify-center gap-2 bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-brand-navy shadow-[0_8px_30px_-6px_rgba(255,203,5,0.5)] transition-all hover:scale-[1.03] hover:shadow-[0_10px_40px_-6px_rgba(255,203,5,0.65)]"
              >
                Upiši dijete
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/skola-nogometa"
                className="inline-flex items-center justify-center border border-white/25 px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow"
              >
                Svi programi
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

function InfoTile({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border border-line bg-surface-2 p-5 transition-colors hover:border-brand-yellow/50">
      <span className="flex size-12 shrink-0 items-center justify-center bg-brand-navy text-brand-yellow">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
        <span className="text-balance font-bold text-foreground">
          {children}
        </span>
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-3 font-display text-xl font-extrabold uppercase tracking-tight text-ink sm:text-2xl">
      {icon}
      {children}
    </h2>
  );
}

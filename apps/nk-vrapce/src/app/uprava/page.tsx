import { Mail, Phone, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero, type HeroStat } from "@/components/features/BrandedHero";
import { fetchBoardMembers } from "@/lib/payload/getBoardMembers";
import type { BoardMember, BoardRoleGroup } from "@/types/board";

export const metadata: Metadata = {
  title: "Uprava",
  description: "Predsjedništvo, nadzorni odbor i stručni stožer NK Vrapče.",
  alternates: { canonical: "/uprava" },
};

const groupOrder: BoardRoleGroup[] = [
  "predsjednistvo",
  "nadzorni-odbor",
  "strucni-stozer",
  "ostalo",
];

const groupLabels: Record<BoardRoleGroup, string> = {
  predsjednistvo: "Predsjedništvo",
  "nadzorni-odbor": "Nadzorni odbor",
  "strucni-stozer": "Stručni stožer",
  ostalo: "Ostalo",
};

export default async function UpravaPage() {
  const members = await fetchBoardMembers();

  const grouped = groupOrder
    .map((group) => ({
      group,
      members: members
        .filter((m) => m.roleGroup === group)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }))
    .filter((section) => section.members.length > 0);

  const stats: HeroStat[] = [
    { value: String(members.length), label: "Članova" },
    ...(grouped.length > 0
      ? [{ value: String(grouped.length), label: "Tijela" }]
      : []),
  ];

  return (
    <>
      <BrandedHero
        eyebrow="Ljudi iza kluba"
        title="Uprava"
        description="Vodstvo i stručni stožer koji svakodnevno vode NK Vrapče."
        stats={stats}
      />

      <div className="mx-auto w-full max-w-screen-xl px-6 pb-24 lg:px-8">
        {grouped.length === 0 ? (
          <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Podaci o upravi uskoro.
          </p>
        ) : (
          <div className="mt-20 space-y-20 sm:mt-28 sm:space-y-24">
            {grouped.map((section) => (
              <section key={section.group} className="space-y-10">
                <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
                  <div className="flex items-center gap-3.5">
                    <span className="size-2.5 rounded-full bg-brand-yellow" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl md:text-4xl">
                      {groupLabels[section.group]}
                    </h2>
                  </div>
                  <span className="font-black tabular-nums text-sm tracking-[0.2em] text-muted-foreground sm:text-base">
                    {String(section.members.length).padStart(2, "0")}
                  </span>
                </div>
                <StaggerContainer
                  className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
                  staggerChildren={0.05}
                >
                  {section.members.map((member) => (
                    <StaggerItem key={member.id}>
                      <MemberCard member={member} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function MemberCard({ member }: { member: BoardMember }) {
  const photoUrl = member.photo?.sizes?.card?.url ?? member.photo?.url ?? null;
  return (
    <FadeInView className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:border-brand-yellow/50 hover:shadow-[0_24px_50px_-22px_rgba(10,28,51,0.4)]">
      {/* Portret */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-navy">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.photo?.alt || member.name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          // Brandirani fallback — person silueta umjesto slova
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-navy-700">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,203,5,0.14), transparent 70%)",
              }}
            />
            <UserRound
              className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-brand-yellow/70"
              strokeWidth={1.25}
            />
          </div>
        )}
        {/* Gradient za prijelaz u info */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-navy/40 to-transparent" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-blue">
          {member.role}
        </span>
        <h3 className="text-balance text-lg font-black uppercase leading-tight tracking-tight sm:text-xl">
          {member.name}
        </h3>
        {member.bio && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {member.bio}
          </p>
        )}
        {(member.email || member.phone) && (
          <div className="mt-auto flex flex-col gap-1.5 border-t border-line pt-4 text-xs text-muted-foreground">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-brand-blue"
              >
                <Mail className="size-3.5 shrink-0 text-brand-blue" />
                <span className="truncate">{member.email}</span>
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-brand-blue"
              >
                <Phone className="size-3.5 shrink-0 text-brand-blue" />
                {member.phone}
              </a>
            )}
          </div>
        )}
      </div>
    </FadeInView>
  );
}

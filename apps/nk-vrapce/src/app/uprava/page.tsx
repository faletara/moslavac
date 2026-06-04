import { Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { PageHero } from "@/components/features/PageHero";
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

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow="Ljudi iza kluba"
        title="Uprava"
        description="Vodstvo i stručni stožer koji svakodnevno vode NK Vrapče."
      />

      {grouped.length === 0 ? (
        <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Podaci o upravi uskoro.
        </p>
      ) : (
        <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-24">
          {grouped.map((section) => (
            <section key={section.group} className="space-y-10">
              <div className="flex items-baseline gap-4 border-b border-border/60 pb-5">
                <span className="h-3 w-3 rounded-full bg-brand-yellow" />
                <h2 className="text-2xl font-black uppercase tracking-tighter sm:text-3xl">
                  {groupLabels[section.group]}
                </h2>
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
  );
}

function MemberCard({ member }: { member: BoardMember }) {
  const photoUrl = member.photo?.sizes?.card?.url ?? member.photo?.url ?? null;
  return (
    <FadeInView className="group flex gap-5">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:size-28">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.photo?.alt || member.name}
            fill
            sizes="7rem"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-navy text-2xl font-black text-brand-yellow">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1.5">
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-brand-blue">
          {member.role}
        </span>
        <h3 className="text-lg font-bold uppercase leading-tight tracking-tight">
          {member.name}
        </h3>
        {member.bio && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{member.bio}</p>
        )}
        <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-brand-blue"
            >
              <Mail className="size-3.5" />
              {member.email}
            </a>
          )}
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-brand-blue"
            >
              <Phone className="size-3.5" />
              {member.phone}
            </a>
          )}
        </div>
      </div>
    </FadeInView>
  );
}

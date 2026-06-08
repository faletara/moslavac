import { Mail, Phone, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero } from "@/components/features/BrandedHero";
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
    <>
      <BrandedHero
        eyebrow="Ljudi iza kluba"
        title="Uprava"
        description="Vodstvo i stručni stožer koji svakodnevno vode NK Vrapče."
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
                <div className="flex items-center gap-3.5 border-b border-line pb-5">
                  <span className="size-2.5 rounded-full bg-brand-yellow" />
                  <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl md:text-4xl">
                    {groupLabels[section.group]}
                  </h2>
                </div>
                <StaggerContainer
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
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
    <FadeInView className="group">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-navy ring-1 ring-black/5 transition-all duration-300 group-hover:ring-brand-yellow/50 group-hover:shadow-[0_22px_45px_-20px_rgba(10,28,51,0.5)]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={member.photo?.alt || member.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          // Brandirani fallback — person silueta
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-navy-700">
            <div
              aria-hidden
              className="absolute left-1/2 top-[38%] h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,203,5,0.13), transparent 70%)",
              }}
            />
            <UserRound
              className="absolute left-1/2 top-[38%] size-16 -translate-x-1/2 -translate-y-1/2 text-brand-yellow/60"
              strokeWidth={1.25}
            />
          </div>
        )}

        {/* Gradient za čitljivost */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-brand-navy via-brand-navy/85 to-transparent" />

        {/* Ime + funkcija preko slike */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
          <span className="text-[0.58rem] font-semibold uppercase leading-tight tracking-[0.28em] text-brand-yellow">
            {member.role}
          </span>
          <h3 className="text-balance text-base font-bold uppercase leading-[1.1] tracking-tight text-white sm:text-lg">
            {member.name}
          </h3>
          {(member.email || member.phone) && (
            <div className="flex items-center gap-2.5 pt-1">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  title={member.email}
                  aria-label={`Email — ${member.name}`}
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-brand-yellow hover:text-brand-navy"
                >
                  <Mail className="size-3.5" />
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  title={member.phone}
                  aria-label={`Telefon — ${member.name}`}
                  className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur transition-colors hover:bg-brand-yellow hover:text-brand-navy"
                >
                  <Phone className="size-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeInView>
  );
}

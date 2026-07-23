import { Shield } from "lucide-react";
import type { Metadata } from "next";
import { RosterCategorySections } from "@/components/features/team/RosterCategorySections";
import { InkPageHero } from "@/components/layout/InkPageHero";
import { fetchSeniorCompetition } from "@/lib/hns/competitions";
import { fetchRoster } from "@/lib/payload/getRoster";
import { getTenant } from "@/lib/payload/getTenant";
import { resolveCometPhotoUrls } from "@/lib/rosterPhotos";
import { BASE_URL } from "@/lib/siteUrl";
import { buildCompetitionSlug } from "@/lib/helpers/slug";
import type { PayloadMedia } from "@/lib/payload/types";
import type { RosterEntry, RosterPosition } from "@/types/roster";

export const revalidate = 300;

const POSITION_ORDER: RosterPosition[] = [
  "vratar",
  "obrambeni",
  "vezni",
  "napadac",
  "trener",
];

const POSITION_GROUP_LABEL: Record<RosterPosition, string> = {
  vratar: "Vratari",
  obrambeni: "Braniči",
  vezni: "Vezni",
  napadac: "Napadači",
  trener: "Stožer",
};

function getCrestSrc(logo: string | PayloadMedia | null | undefined): string {
  if (!logo) return "/crest.png";
  return typeof logo === "string" ? logo : (logo.url ?? "/crest.png");
}

function groupRoster(roster: RosterEntry[]): Record<RosterPosition, RosterEntry[]> {
  return POSITION_ORDER.reduce<Record<RosterPosition, RosterEntry[]>>(
    (acc, position) => {
      acc[position] = roster
        .filter((player) => player.position === position)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      return acc;
    },
    {
      vratar: [],
      obrambeni: [],
      vezni: [],
      napadac: [],
      trener: [],
    },
  );
}

/**
 * SportsTeam (roster as `athlete` / `coach` Person nodes) + BreadcrumbList.
 * `crestSrc` may be the local `/crest.png`, so it is absolutised for the schema.
 */
function buildTeamJsonLd({
  tenantName,
  roster,
  crestSrc,
}: {
  tenantName: string;
  roster: RosterEntry[];
  crestSrc: string;
}): Record<string, unknown>[] {
  const url = `${BASE_URL}/momcad`;
  const logo = crestSrc.startsWith("http") ? crestSrc : `${BASE_URL}${crestSrc}`;
  const toPerson = (player: RosterEntry) => ({
    "@type": "Person" as const,
    name: player.displayName,
  });
  const athletes = roster
    .filter((player) => player.position !== "trener")
    .map(toPerson);
  const coaches = roster
    .filter((player) => player.position === "trener")
    .map(toPerson);

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Početna", item: `${BASE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Momčad", item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: tenantName,
      sport: "Football",
      url,
      logo,
      ...(athletes.length > 0 ? { athlete: athletes } : {}),
      ...(coaches.length > 0 ? { coach: coaches } : {}),
    },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const description = `Igrači i stručni stožer prve momčadi ${tenant.displayName}.`;

  return {
    title: "Momčad",
    description,
    alternates: { canonical: "/momcad" },
    openGraph: {
      title: `Momčad | ${tenant.displayName}`,
      description,
    },
    twitter: {
      title: `Momčad | ${tenant.displayName}`,
      description,
    },
  };
}

export default async function TeamPage() {
  const [tenant, roster, senior] = await Promise.all([
    getTenant(),
    fetchRoster(),
    fetchSeniorCompetition(),
  ]);
  const crestSrc = getCrestSrc(tenant.branding?.logo);
  const cometPhotos = await resolveCometPhotoUrls(roster);
  const competitionSlug = senior ? buildCompetitionSlug(senior) : null;
  const grouped = groupRoster(roster);
  const groups = POSITION_ORDER.map((position) => ({
    position,
    label: POSITION_GROUP_LABEL[position],
    players: grouped[position],
  })).filter((group) => group.players.length > 0);

  const jsonLd = buildTeamJsonLd({
    tenantName: tenant.displayName,
    roster,
    crestSrc,
  });

  return (
    <div className="bg-background">
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <InkPageHero title="Momčad" watermark="Momčad" />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        {roster.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-foreground/10 px-6 py-20 text-center clip-corner">
            <Shield className="size-10 text-club-red" />
            <h2 className="mt-5 font-display text-4xl uppercase leading-none text-foreground">
              Popis uskoro
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Popis prve momčadi trenutno nije dostupan.
            </p>
          </div>
        ) : (
          <RosterCategorySections
            groups={groups}
            crestSrc={crestSrc}
            cometPhotos={cometPhotos}
            competitionSlug={competitionSlug}
          />
        )}
      </section>
    </div>
  );
}

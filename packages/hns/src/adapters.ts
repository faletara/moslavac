import type {
  Competition,
  CompetitionPlayerStat,
  Facility,
  HnsCompetition,
  HnsFacility,
  HnsLineups,
  HnsMatch,
  HnsMatchAndTeamOfficial,
  HnsMatchEvent,
  HnsMatchEventType,
  HnsMatchInfo,
  HnsMatchPhase,
  HnsPastMatch,
  HnsPlayerCompetitionStats,
  HnsPlayerStats,
  HnsResult,
  HnsTeam,
  HnsTeamLineup,
  HnsTeamPlayer,
  HnsTeamRanking,
  LineupPlayer,
  Lineups,
  Match,
  MatchEvent,
  MatchEventType,
  MatchInfo,
  MatchOfficial,
  MatchOutcome,
  MatchPhase,
  MatchScore,
  MatchScoreSide,
  MatchSide,
  Player,
  PlayerCompetitionStats,
  PlayerSearchResult,
  Team,
  TeamLineup,
  TeamRanking,
} from "@/types/hns";

function text(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function nullableText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function nullableNumber(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function numberOrZero(value: number | null | undefined): number {
  return nullableNumber(value) ?? 0;
}

function bool(value: boolean | null | undefined): boolean {
  return value === true;
}

export function adaptMatchOutcome(
  value: string | null | undefined,
): MatchOutcome | null {
  const s = value?.trim().toUpperCase();
  if (!s) return null;

  if (s.startsWith("WIN") || s.startsWith("POB")) return "W";
  if (s.startsWith("LOS") || s.startsWith("POR")) return "L";
  if (s.startsWith("DRAW") || s.startsWith("TIE") || s.startsWith("NER"))
    return "D";

  const first = s[0];
  if (first === "W" || first === "P") return "W";
  if (first === "L" || first === "I") return "L";
  if (first === "D" || first === "N" || first === "T") return "D";
  return null;
}

function adaptMatchSide(value: HnsMatch["team"]): MatchSide | null {
  if (value === "H") return "home";
  if (value === "A") return "away";
  return null;
}

function adaptEventSide(value: boolean | null | undefined): MatchSide | null {
  if (value === true) return "home";
  if (value === false) return "away";
  return null;
}

export function adaptFacility(raw: HnsFacility | null | undefined): Facility | null {
  if (!raw) return null;
  return {
    id: nullableNumber(raw.id),
    fifaId: nullableText(raw.fifaId),
    name: text(raw.name),
    address: nullableText(raw.address),
    place: nullableText(raw.place),
    latitude: nullableNumber(raw.latitude),
    longitude: nullableNumber(raw.longitude),
    field: raw.field
      ? {
          id: nullableNumber(raw.field.id),
          name: text(raw.field.name),
        }
      : null,
  };
}

export function adaptTeam(
  raw: HnsTeam | null | undefined,
  parentDepth = 0,
): Team | null {
  if (!raw) return null;
  return {
    id: nullableNumber(raw.id),
    fifaId: nullableText(raw.fifaId),
    name: text(raw.name),
    picture: nullableText(raw.picture),
    country: nullableText(raw.country),
    place: nullableText(raw.place),
    website: nullableText(raw.website),
    email: nullableText(raw.email),
    phone: nullableText(raw.phone),
    mobilePhone: nullableText(raw.mobilePhone),
    facebook: nullableText(raw.facebook),
    twitter: nullableText(raw.twitter),
    instagram: nullableText(raw.instagram),
    youtube: nullableText(raw.youtube),
    tikTok: nullableText(raw.tikTok),
    address: nullableText(raw.address),
    latitude: nullableNumber(raw.latitude),
    longitude: nullableNumber(raw.longitude),
    hasTeams: bool(raw.hasTeams),
    allowDetail: bool(raw.allowDetail),
    parent:
      parentDepth < 1 ? adaptTeam(raw.parent, parentDepth + 1) : null,
    facility: adaptFacility(raw.facility),
  };
}

export function adaptCompetition(
  raw: HnsCompetition | null | undefined,
): Competition | null {
  if (!raw) return null;
  return {
    id: nullableNumber(raw.id),
    name: text(raw.name),
    parentId: nullableNumber(raw.parentId),
    parentName: nullableText(raw.parentName),
    picture: nullableText(raw.picture),
    showStandings: bool(raw.showStandings),
    showGoalDifference: bool(raw.showGoalDifference),
    showStats: bool(raw.showStats),
    hasChildren: bool(raw.hasChildren),
    active: raw.active !== false,
    competitionElements:
      raw.competitionElements?.map((item) => adaptCompetition(item)).filter(isPresent) ??
      [],
  };
}

function adaptMatchPhase(
  raw: HnsMatchPhase | null | undefined,
): MatchPhase | null {
  if (!raw) return null;
  return {
    id: nullableNumber(raw.phaseTypeId),
    name: text(raw.name),
    code: nullableText(raw.fcdName),
  };
}

function adaptMatchScoreSide(
  raw: HnsResult | null | undefined,
): MatchScoreSide {
  return {
    current: nullableNumber(raw?.current),
    regular: nullableNumber(raw?.regular),
    half: nullableNumber(raw?.half),
    extra: nullableNumber(raw?.extra),
    penalties: nullableNumber(raw?.penalties),
    penaltyWin: bool(raw?.penaltyWin),
  };
}

function adaptMatchScore(raw: HnsMatch): MatchScore {
  return {
    home: adaptMatchScoreSide(raw.homeTeamResult),
    away: adaptMatchScoreSide(raw.awayTeamResult),
  };
}

export function adaptMatch(raw: HnsMatch): Match {
  return {
    id: nullableNumber(raw.id),
    homeTeam: adaptTeam(raw.homeTeam),
    awayTeam: adaptTeam(raw.awayTeam),
    score: adaptMatchScore(raw),
    homeRedCards: nullableNumber(raw.homeTeamRedCards),
    awayRedCards: nullableNumber(raw.awayTeamRedCards),
    liveStatus: raw.liveStatus ?? null,
    minute: nullableNumber(raw.minute),
    kickoffAtUtcMs: nullableNumber(raw.dateTimeUTC),
    matchDay: nullableNumber(raw.matchDay),
    matchOrderNumber: nullableNumber(raw.matchOrderNumber),
    round: nullableText(raw.round),
    roundOrder: nullableNumber(raw.roundOrder),
    matchNumber: nullableNumber(raw.matchNumber),
    matchDayDescription: nullableText(raw.matchDayDesc),
    status: nullableText(raw.status),
    statusDescription: nullableText(raw.statusDescription),
    resultSupplement: nullableText(raw.resultSupplement),
    currentMinute: nullableText(raw.currentMinute),
    resultString: nullableText(raw.resultString),
    currentPhase: adaptMatchPhase(raw.currentMatchPhase),
    competition: adaptCompetition(raw.competition),
    facility: adaptFacility(raw.facility),
    teamResult: adaptMatchOutcome(raw.result),
    teamSide: adaptMatchSide(raw.team),
    attendance: nullableNumber(raw.attendance),
    showEvents: bool(raw.showEvents),
    allowDetail: raw.allowDetail !== false,
  };
}

function adaptPastMatch(raw: HnsPastMatch | null | undefined): MatchOutcome | null {
  return adaptMatchOutcome(raw?.result);
}

export function adaptTeamRanking(
  raw: HnsTeamRanking,
  ownTeamId?: number | null,
): TeamRanking {
  const team = adaptTeam(raw.team);
  return {
    team,
    played: numberOrZero(raw.played),
    wins: numberOrZero(raw.wins),
    draws: numberOrZero(raw.draws),
    losses: numberOrZero(raw.losses),
    winsAfterExtraTime: numberOrZero(raw.winsAET),
    winsAfterPenalties: numberOrZero(raw.winsAP),
    lossesAfterPenalties: numberOrZero(raw.lossesAP),
    goalsFor: numberOrZero(raw.goalsFor),
    goalsAgainst: numberOrZero(raw.goalsAgainst),
    points: numberOrZero(raw.points),
    negativePoints: numberOrZero(raw.negativePoints),
    position: nullableNumber(raw.position),
    liveResult: adaptMatchOutcome(raw.liveResult),
    highlight:
      raw.highlight === true ||
      (ownTeamId != null && team?.id != null && team.id === ownTeamId),
    form: [raw.m1, raw.m2, raw.m3, raw.m4, raw.m5]
      .map(adaptPastMatch)
      .filter(isPresent),
  };
}

export function adaptMatchOfficial(
  raw: HnsMatchAndTeamOfficial | null | undefined,
): MatchOfficial | null {
  if (!raw) return null;
  return {
    roleId: nullableNumber(raw.roleId),
    personId: nullableNumber(raw.personId),
    fifaId: nullableText(raw.fifaId),
    name: text(raw.name),
    shortName: nullableText(raw.shortName),
    role: nullableText(raw.role),
    picture: nullableText(raw.picture),
    flag: nullableText(raw.flag),
    orderNumber: nullableNumber(raw.orderNumber),
  };
}

function adaptMatchEventType(
  raw: HnsMatchEventType | null | undefined,
): MatchEventType {
  return {
    id: nullableNumber(raw?.eventTypeId),
    name: text(raw?.name),
    code: nullableText(raw?.fcdName),
  };
}

interface AdaptPlayerOptions {
  includeEvents?: boolean;
}

export function adaptPlayer(
  raw: HnsTeamPlayer | null | undefined,
  options: AdaptPlayerOptions = {},
): Player | null {
  if (!raw) return null;
  return {
    roleId: nullableNumber(raw.roleId),
    personId: nullableNumber(raw.personId),
    fifaId: nullableText(raw.fifaId),
    name: text(raw.name),
    shortName: nullableText(raw.shortName),
    formationShortName: nullableText(raw.formationShortName),
    shirtNumber: nullableNumber(raw.shirtNumber),
    starting: bool(raw.starting),
    captain: bool(raw.captain),
    position: nullableText(raw.position),
    formationPositionId: nullableNumber(raw.formationPositionId),
    formationPositionDisplayName: nullableText(raw.formationPositionDisplayName),
    picture: nullableText(raw.picture),
    orderNumber: nullableNumber(raw.orderNumber),
    countryOfBirth: nullableText(raw.countryOfBirth),
    nationality: nullableText(raw.nationality),
    gender: nullableText(raw.gender),
    age: nullableNumber(raw.age),
    flag: nullableText(raw.flag),
    club: adaptTeam(raw.club),
    events: options.includeEvents
      ? (raw.events?.map((event) => adaptMatchEvent(event)) ?? [])
      : [],
    hideProfile: bool(raw.hideProfile),
  };
}

export function adaptLineupPlayer(
  raw: HnsTeamPlayer | null | undefined,
): LineupPlayer | null {
  return adaptPlayer(raw, { includeEvents: true });
}

export function adaptPlayerSearchResult(
  raw: HnsTeamPlayer | null | undefined,
): PlayerSearchResult | null {
  const name = text(raw?.name);
  if (!raw || raw.personId == null || !name) return null;
  return {
    personId: raw.personId,
    name,
    shortName: nullableText(raw.shortName),
    picture: nullableText(raw.picture),
    position: nullableText(raw.position),
    shirtNumber: nullableNumber(raw.shirtNumber),
  };
}

export function adaptMatchEvent(raw: HnsMatchEvent): MatchEvent {
  return {
    id: nullableNumber(raw.eventId),
    type: adaptMatchEventType(raw.eventType),
    phase: adaptMatchPhase(raw.matchPhase),
    phaseMinute: nullableNumber(raw.minute),
    minute: nullableNumber(raw.minuteFull ?? raw.minute),
    stoppageTime: nullableNumber(raw.stoppageTime),
    displayMinute: nullableText(raw.displayMinute),
    player: adaptPlayer(raw.player),
    secondaryPlayer: adaptPlayer(raw.player2),
    teamOfficial: adaptMatchOfficial(raw.teamOfficial),
    club: adaptTeam(raw.club),
    side: adaptEventSide(raw.homeTeam),
    orderNumber: nullableNumber(raw.orderNumber),
    commentary: nullableText(raw.commentary),
    image: nullableText(raw.image),
    link: nullableText(raw.link),
  };
}

export function adaptTeamLineup(
  raw: HnsTeamLineup | null | undefined,
): TeamLineup | null {
  if (!raw) return null;
  return {
    formation: nullableText(raw.formation),
    playerKitColor: nullableText(raw.playerKitColor),
    playerKitContrastColor: nullableText(raw.playerKitContrastColor),
    goalKeeperKitColor: nullableText(raw.goalKeeperKitColor),
    goalKeeperKitContrastColor: nullableText(raw.goalKeeperKitContrastColor),
    players:
      raw.players?.map((player) => adaptLineupPlayer(player)).filter(isPresent) ??
      [],
    officials:
      raw.officials?.map((official) => adaptMatchOfficial(official)).filter(isPresent) ??
      [],
  };
}

export function adaptLineups(raw: HnsLineups | null | undefined): Lineups | null {
  if (!raw) return null;
  return {
    home: adaptTeamLineup(raw.home),
    away: adaptTeamLineup(raw.away),
  };
}

export function adaptMatchInfo(
  raw: HnsMatchInfo | null | undefined,
): MatchInfo | null {
  if (!raw) return null;
  return {
    refereeKit: nullableText(raw.refereeKit),
    refereeKitPng: nullableText(raw.refereeKitPng),
    homeKit: nullableText(raw.homeKit),
    homeKitPng: nullableText(raw.homeKitPng),
    homeGKKit: nullableText(raw.homeGKKit),
    homeGKKitPng: nullableText(raw.homeGKKitPng),
    homeSubstituteBib: nullableText(raw.homeSubstituteBib),
    homeSubstituteBibPng: nullableText(raw.homeSubstituteBibPng),
    awayKit: nullableText(raw.awayKit),
    awayKitPng: nullableText(raw.awayKitPng),
    awayGKKit: nullableText(raw.awayGKKit),
    awayGKKitPng: nullableText(raw.awayGKKitPng),
    awaySubstituteBib: nullableText(raw.awaySubstituteBib),
    awaySubstituteBibPng: nullableText(raw.awaySubstituteBibPng),
    officials:
      raw.matchOfficials
        ?.map((official) => adaptMatchOfficial(official))
        .filter(isPresent) ?? [],
  };
}

export function adaptPlayerCompetitionStats(
  raw: HnsPlayerCompetitionStats,
): PlayerCompetitionStats {
  return {
    competition: adaptCompetition(raw.competition),
    minutesPlayed: numberOrZero(raw.minutesPlayed),
    matchesPlayed: numberOrZero(raw.matchesPlayed),
    fullMatchesPlayed: numberOrZero(raw.fullMatchesPlayed),
    goals: numberOrZero(raw.goals),
    assists: numberOrZero(raw.assists),
    penalties: numberOrZero(raw.penalties),
    ownGoals: numberOrZero(raw.ownGoals),
    yellowCards: numberOrZero(raw.yellowCards),
    redCards: numberOrZero(raw.redCards),
    captain: numberOrZero(raw.captain),
    allowDetail: raw.allowDetail !== false,
  };
}

export function adaptCompetitionPlayerStat(
  raw: HnsPlayerStats,
): CompetitionPlayerStat {
  return {
    player: adaptPlayer(raw.player),
    value: numberOrZero(raw.value),
    team: adaptTeam(raw.team),
  };
}

function isPresent<T>(value: T | null | undefined): value is T {
  return value != null;
}

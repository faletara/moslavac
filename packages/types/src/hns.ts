// Public HNS domain types. The generated OpenAPI contract stays isolated in
// hns.openapi.ts; adapter code may import the Hns* aliases below, while app code
// should consume the domain shapes exported from this file.
import type {
  Competition as OpenApiCompetition,
  Facility as OpenApiFacility,
  Lineups as OpenApiLineups,
  Match as OpenApiMatch,
  MatchAndTeamOfficial as OpenApiMatchAndTeamOfficial,
  MatchEvent as OpenApiMatchEvent,
  MatchEventType as OpenApiMatchEventType,
  MatchInfo as OpenApiMatchInfo,
  MatchPhase as OpenApiMatchPhase,
  PaginatedResultsTeamPlayer as OpenApiPaginatedResultsTeamPlayer,
  PastMatch as OpenApiPastMatch,
  PlayerCompetitionStats as OpenApiPlayerCompetitionStats,
  PlayerStats as OpenApiPlayerStats,
  Result as OpenApiResult,
  Team as OpenApiTeam,
  TeamLineup as OpenApiTeamLineup,
  TeamPlayer as OpenApiTeamPlayer,
  TeamRanking as OpenApiTeamRanking,
} from "./hns.openapi";

export type HnsCompetition = OpenApiCompetition;
export type HnsFacility = OpenApiFacility;
export type HnsLineups = OpenApiLineups;
export type HnsMatch = OpenApiMatch;
export type HnsMatchAndTeamOfficial = OpenApiMatchAndTeamOfficial;
export type HnsMatchEvent = OpenApiMatchEvent;
export type HnsMatchEventType = OpenApiMatchEventType;
export type HnsMatchInfo = OpenApiMatchInfo;
export type HnsMatchPhase = OpenApiMatchPhase;
export type HnsPaginatedResultsTeamPlayer = OpenApiPaginatedResultsTeamPlayer;
export type HnsPastMatch = OpenApiPastMatch;
export type HnsPlayerCompetitionStats = OpenApiPlayerCompetitionStats;
export type HnsPlayerStats = OpenApiPlayerStats;
export type HnsResult = OpenApiResult;
export type HnsTeam = OpenApiTeam;
export type HnsTeamLineup = OpenApiTeamLineup;
export type HnsTeamPlayer = OpenApiTeamPlayer;
export type HnsTeamRanking = OpenApiTeamRanking;

export type MatchOutcome = "W" | "D" | "L";
export type MatchSide = "home" | "away";
export type HnsLiveStatus = NonNullable<HnsMatch["liveStatus"]>;

export interface Facility {
  id: number | null;
  fifaId: string | null;
  name: string;
  address: string | null;
  place: string | null;
  latitude: number | null;
  longitude: number | null;
  field: {
    id: number | null;
    name: string;
  } | null;
}

export interface Team {
  id: number | null;
  fifaId: string | null;
  name: string;
  picture: string | null;
  country: string | null;
  place: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  mobilePhone: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  tikTok: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  hasTeams: boolean;
  allowDetail: boolean;
  parent: Team | null;
  facility: Facility | null;
}

export interface Competition {
  id: number | null;
  name: string;
  parentId: number | null;
  parentName: string | null;
  picture: string | null;
  showStandings: boolean;
  showGoalDifference: boolean;
  showStats: boolean;
  hasChildren: boolean;
  active: boolean;
  competitionElements: Competition[];
}

export interface MatchPhase {
  id: number | null;
  name: string;
  code: string | null;
}

export interface MatchScoreSide {
  current: number | null;
  regular: number | null;
  half: number | null;
  extra: number | null;
  penalties: number | null;
  penaltyWin: boolean;
}

export interface MatchScore {
  home: MatchScoreSide;
  away: MatchScoreSide;
}

export interface Match {
  id: number | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  score: MatchScore;
  homeRedCards: number | null;
  awayRedCards: number | null;
  liveStatus: HnsLiveStatus | null;
  minute: number | null;
  kickoffAtUtcMs: number | null;
  matchDay: number | null;
  matchOrderNumber: number | null;
  round: string | null;
  roundOrder: number | null;
  matchNumber: number | null;
  matchDayDescription: string | null;
  status: string | null;
  statusDescription: string | null;
  resultSupplement: string | null;
  currentMinute: string | null;
  resultString: string | null;
  currentPhase: MatchPhase | null;
  competition: Competition | null;
  facility: Facility | null;
  teamResult: MatchOutcome | null;
  teamSide: MatchSide | null;
  attendance: number | null;
  showEvents: boolean;
  allowDetail: boolean;
}

export interface MatchSlots {
  next: Match | null;
  previous: Match | null;
}

export interface TeamRanking {
  team: Team | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  winsAfterExtraTime: number;
  winsAfterPenalties: number;
  lossesAfterPenalties: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  negativePoints: number;
  position: number | null;
  liveResult: MatchOutcome | null;
  highlight: boolean;
  form: MatchOutcome[];
}

export interface MatchOfficial {
  roleId: number | null;
  personId: number | null;
  fifaId: string | null;
  name: string;
  shortName: string | null;
  role: string | null;
  picture: string | null;
  flag: string | null;
  orderNumber: number | null;
}

export interface MatchEventType {
  id: number | null;
  name: string;
  code: string | null;
}

export interface Player {
  roleId: number | null;
  personId: number | null;
  fifaId: string | null;
  name: string;
  shortName: string | null;
  formationShortName: string | null;
  shirtNumber: number | null;
  starting: boolean;
  captain: boolean;
  position: string | null;
  formationPositionId: number | null;
  formationPositionDisplayName: string | null;
  picture: string | null;
  orderNumber: number | null;
  countryOfBirth: string | null;
  nationality: string | null;
  gender: string | null;
  age: number | null;
  flag: string | null;
  club: Team | null;
  events: MatchEvent[];
  hideProfile: boolean;
}

export type LineupPlayer = Player;

export interface PlayerSearchResult {
  personId: number;
  name: string;
  shortName: string | null;
  picture: string | null;
  position: string | null;
  shirtNumber: number | null;
}

/**
 * Semantic classification of a match event, derived from the free-text HNS
 * type name so components never parse that text themselves.
 */
export type MatchEventKind =
  | "goal"
  | "own-goal"
  | "yellow"
  | "red"
  | "sub"
  | "other";

export interface MatchEvent {
  id: number | null;
  type: MatchEventType;
  kind: MatchEventKind;
  phase: MatchPhase | null;
  phaseMinute: number | null;
  minute: number | null;
  stoppageTime: number | null;
  displayMinute: string | null;
  player: Player | null;
  secondaryPlayer: Player | null;
  teamOfficial: MatchOfficial | null;
  club: Team | null;
  side: MatchSide | null;
  orderNumber: number | null;
  commentary: string | null;
  image: string | null;
  link: string | null;
}

export interface TeamLineup {
  formation: string | null;
  playerKitColor: string | null;
  playerKitContrastColor: string | null;
  goalKeeperKitColor: string | null;
  goalKeeperKitContrastColor: string | null;
  players: LineupPlayer[];
  officials: MatchOfficial[];
}

export interface Lineups {
  home: TeamLineup | null;
  away: TeamLineup | null;
}

export interface MatchInfo {
  refereeKit: string | null;
  refereeKitPng: string | null;
  homeKit: string | null;
  homeKitPng: string | null;
  homeGKKit: string | null;
  homeGKKitPng: string | null;
  homeSubstituteBib: string | null;
  homeSubstituteBibPng: string | null;
  awayKit: string | null;
  awayKitPng: string | null;
  awayGKKit: string | null;
  awayGKKitPng: string | null;
  awaySubstituteBib: string | null;
  awaySubstituteBibPng: string | null;
  officials: MatchOfficial[];
}

export interface PlayerCompetitionStats {
  competition: Competition | null;
  minutesPlayed: number;
  matchesPlayed: number;
  fullMatchesPlayed: number;
  goals: number;
  assists: number;
  penalties: number;
  ownGoals: number;
  yellowCards: number;
  redCards: number;
  captain: number;
  allowDetail: boolean;
}

export interface CompetitionPlayerStat {
  player: Player | null;
  value: number;
  team: Team | null;
}

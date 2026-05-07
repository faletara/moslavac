// Types matching backend DTOs in com.af.moslavac.dtos.hns
// Updated to match actual HNS API responses

export interface PaginatedResult<T> {
  result: T[];
  size: number;
}

export interface HnsCompetition {
  id: number | null;
  name: string | null;
  picture: string | null;
  showStandings: boolean | null;
  showGoalDifference: boolean | null;
  showStats: boolean | null;
  hasChildren: boolean | null;
  active: boolean | null;
}

export interface HnsTeam {
  id: number | null;
  fifaId: string | null;
  name: string | null;
  picture: string | null;
  place: string | null;
  allowDetail: boolean | null;
}

export interface HnsTeamDetails {
  id: number | null;
  fifaId: string | null;
  name: string | null;
  picture: string | null;
  country: string | null;
  place: string | null;
  email: string | null;
  mobilePhone: string | null;
  address: string | null;
  hasTeams: boolean | null;
  facility: HnsFacility | null;
}

export interface HnsMatchResult {
  current: number | null;
  regular: number | null;
  half: number | null;
}

export interface MatchPhase {
  phaseTypeId: number | null;
  name: string | null;
  fcdName: string | null;
}

export interface HnsFacility {
  id: number | null;
  fifaId: string | null;
  name: string | null;
  address: string | null;
  place: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface HnsEventType {
  eventTypeId: number | null;
  name: string | null;
  fcdName: string | null;
}

export interface HnsEventPlayer {
  roleId: number | null;
  personId: number | null;
  fifaId: string | null;
  name: string | null;
  shortName: string | null;
  shirtNumber: number | null;
  picture: string | null;
  hideProfile: boolean | null;
}

export interface HnsMatch {
  id: number | null;
  homeTeam: HnsTeam | null;
  awayTeam: HnsTeam | null;
  homeTeamResult: HnsMatchResult | null;
  awayTeamResult: HnsMatchResult | null;
  liveStatus: string | null;
  dateTimeUTC: number | null;
  round: string | null;
  roundOrder: number | null;
  matchNumber: number | null;
  currentMinute: string | null;
  currentMatchPhase: MatchPhase | null;
  competition: HnsCompetition | null;
  facility: HnsFacility | null;
  attendance: number | null;
  result: string | null;
  team: string | null;
  showEvents: boolean | null;
  allowDetail: boolean | null;
}

export interface HnsMatchEvent {
  eventId: number | null;
  eventType: HnsEventType | null;
  matchPhase: MatchPhase | null;
  minute: number | null;
  minuteFull: number | null;
  stoppageTime: number | null;
  displayMinute: string | null;
  player: HnsEventPlayer | null;
  player2: HnsEventPlayer | null;
  homeTeam: boolean | null;
  orderNumber: number | null;
}

export interface HnsTeamPlayer {
  roleId: number | null;
  personId: number | null;
  fifaId: string | null;
  name: string | null;
  shortName: string | null;
  shirtNumber: number | null;
  starting: boolean | null;
  captain: boolean | null;
  position: string | null;
  orderNumber: number | null;
  picture: string | null;
  flag: string | null;
  hideProfile: boolean | null;
  countryOfBirth: string | null;
  nationality: string | null;
  gender: string | null;
  age: number | null;
  club: HnsTeam | null;
  events: HnsMatchEvent[] | null;
}

export interface HnsTeamLineup {
  players: HnsTeamPlayer[] | null;
}

export interface HnsLineups {
  home: HnsTeamLineup | null;
  away: HnsTeamLineup | null;
}

export interface MatchOfficial {
  roleId: number | null;
  personId: number | null;
  fifaId: string | null;
  name: string | null;
  shortName: string | null;
  role: string | null;
  picture: string | null;
  flag: string | null;
  orderNumber: number | null;
}

export interface HnsMatchInfo {
  matchOfficials: MatchOfficial[] | null;
}

export interface PastMatch {
  matchId: number | null;
  result: string | null;
}

export interface TeamRanking {
  team: HnsTeam | null;
  played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  winsAET: number | null;
  winsAP: number | null;
  lossesAP: number | null;
  goalsFor: number | null;
  goalsAgainst: number | null;
  points: number | null;
  negativePoints: number | null;
  position: number | null;
  highlight: boolean | null;
  m1: PastMatch | null;
  m2: PastMatch | null;
  m3: PastMatch | null;
  m4: PastMatch | null;
  m5: PastMatch | null;
}

export interface HnsPicture {
  contentType: string | null;
  pictureLink: string | null;
  value: string | null;
}

export interface PlayerCompetitionStats {
  minutesPlayed: number | null;
  matchesPlayed: number | null;
  fullMatchesPlayed: number | null;
  goals: number | null;
  penalties: number | null;
  ownGoals: number | null;
  yellowCards: number | null;
  redCards: number | null;
  captain: number | null;
  competition: HnsCompetition | null;
  allowDetail: boolean | null;
}

export interface PlayerStats {
  player: HnsEventPlayer | null;
  value: number | null;
  team: HnsTeam | null;
}

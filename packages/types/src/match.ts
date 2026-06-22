export interface Match {
  id: number;
  dateTimeUTC: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  competition: Competition;
  status: string;
  round?: string;
  venue?: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  logo?: string;
}

export interface Competition {
  id: number;
  name: string;
}

export interface MatchEvent {
  id: number;
  type: string;
  minute: number;
  player: string;
  team: string;
  additionalInfo?: string;
}

export interface MatchLineup {
  homeTeam: LineupTeam;
  awayTeam: LineupTeam;
}

export interface LineupTeam {
  teamName: string;
  startingEleven: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface LineupPlayer {
  id: number;
  name: string;
  shirtNumber: number;
  position: string;
}

export interface MatchReferee {
  name: string;
  role: string;
}

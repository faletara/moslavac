export interface CompetitionInfo {
  id: number;
  name: string;
  season?: string;
}

export interface StandingsEntry {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

export interface PlayerStat {
  player: {
    id: number;
    name: string;
    shortName: string;
  };
  value: number;
}

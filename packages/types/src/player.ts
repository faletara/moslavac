export interface Player {
  id: number;
  personId: number;
  fifaId: string | null;
  name: string;
  shortName: string;
  picture: string | null;
  position: string;
  tenantId: string;
}

export interface PlayerDetails {
  id: number;
  name: string;
  shortName: string;
  dateOfBirth: string;
  nationality: string;
  height: number;
  weight: number;
  position: string;
  photo: string;
}

export interface PlayerStats {
  competition: {
    id: number;
    name: string;
  };
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  startingEleven: number;
  substituteIn: number;
  substituteOut: number;
}

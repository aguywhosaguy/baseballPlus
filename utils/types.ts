export type Player = [string, string, string]

export enum PlayerID {
  MLB,
  FanGraphs,
  BRef,
}

export enum Site {
  Savant = "sv",
  FanGraphs = "fg",
  BRef = "br"
}

export type Regexes = {
  playerurl: RegExp
  playerid: RegExp
}

export type SiteData = {
  idtype: PlayerID
  icon: string
  player: (id: string, name: string) => string
  search: (name: string) => string
  hotkey: string
  regex: Regexes
}


export interface DataFile {
  schemaVersion: number;
  generatedAt: string;
  upstreamCommit: string;
  players: Player[];
}

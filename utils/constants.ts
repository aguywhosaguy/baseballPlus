import { Site, PlayerID, type SiteData } from "./types"
import breficon from '@/assets/buttons/bref.png?inline'
import fgicon from '@/assets/buttons/fangraphs.png?inline'
import savanticon from '@/assets/buttons/savant.png?inline'

const BREF = "https://www.baseball-reference.com/"
const FG = "https://www.fangraphs.com/"
const SAVANT = "https://baseballsavant.mlb.com/"

export const SITES: Record<Site, SiteData> = {
  [Site.BRef]: {
    idtype: PlayerID.BRef,
    icon: breficon,
    player: (id: string, name: string) => `${BREF}players/${id[0]}/${id}.shtml`,
    search: (name: string) => `${BREF}search/search.fcgi?hint=&search=${encodeURIComponent(name)}`,
    hotkey: 'b',
    regex: {
      playerurl: /^\/players\//,
      playerid: /^\/players\/[^/]+\/([^/]+)\./
    }
  },
  [Site.FanGraphs]: {
    idtype: PlayerID.FanGraphs,
    icon: fgicon,
    player: (id: string, name: string) => `${FG}players/${name.replaceAll(" ", "-").toLowerCase()}/${id}`,
    search: (name: string) => `${FG}search?q=${encodeURIComponent(name)}`,
    hotkey: 'f',
    regex: {
      playerurl: /^\/players\//,
      playerid: /^\/players\/[^/]+\/([^/]+)/
    }
  },
  [Site.Savant]: {
    idtype: PlayerID.MLB,
    icon: savanticon,
    player: (id: string, name: string) => `${SAVANT}savant-player/${name.replaceAll(" ", "-").toLowerCase()}-${id}`,
    search: (name: string) => SAVANT,
    hotkey: 's',
    regex: {
      playerurl: /^\/savant-player\//,
      playerid: /-(\d*)$/
    }
  }
}

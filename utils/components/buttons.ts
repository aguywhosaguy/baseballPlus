import { findPlayer, PlayerID, Site } from "@/utils/data"
import breficon from '@/assets/buttons/bref.png?inline'
import fgicon from '@/assets/buttons/fangraphs.png?inline'
import savanticon from '@/assets/buttons/savant.png?inline'

const BREF = "https://www.baseball-reference.com/"
const FG = "https://www.fangraphs.com/"
const SAVANT = "https://baseballsavant.mlb.com/"

type Button = {
  site: Site
  idtype: PlayerID
  icon: string
  player: (id: string, name: string) => string
  search: (name: string) => string
}

const BUTTONS: Button[] = [
  {
    site: Site.BRef,
    idtype: PlayerID.BRef,
    icon: breficon,
    player: (id: string, name: string) => `${BREF}players/${id[0]}/${id}.shtml`,
    search: (name: string) => `${BREF}search/search.fcgi?hint=&search=${encodeURIComponent(name)}`,
  },
  {
    site: Site.FanGraphs,
    idtype: PlayerID.FanGraphs,
    icon: fgicon,
    player: (id: string, name: string) => `https://www.fangraphs.com/players/${name.replaceAll(" ", "-").toLowerCase()}/${id}`,
    search: (name: string) => `https://www.fangraphs.com/search?q=${encodeURIComponent(name)}`,
  },
  {
    site: Site.Savant,
    idtype: PlayerID.MLB,
    icon: savanticon,
    player: (id: string, name: string) => `${SAVANT}savant-player/${name.replaceAll(" ", "-").toLowerCase()}-${id}`,
    search: (name: string) => SAVANT
  }
]

const button = (href: string, img: string): HTMLAnchorElement => {
  const link = document.createElement('a')
  link.href = href
  link.style.display = 'inline-flex'

  const icon = document.createElement('img')
  icon.src = img
  icon.style.height = '24px'
  icon.style.borderRadius = '4px'

  link.append(icon)
  return link
}

export const buttons = async (name: string, id: string | undefined, idtype: PlayerID, site: Site): Promise<HTMLDivElement> =>  {
  const player = id ? await findPlayer(id, idtype) : undefined

  const container = document.createElement('div')
  container.style.display = 'inline-flex'
  container.style.gap = '4px'

  BUTTONS
    .filter((s) => s.site !== site)
    .forEach((s) => {
      const siteID = player?.[s.idtype]
      container.append(button(siteID ? s.player(siteID, name) : s.search(name), s.icon))
    })

  return container
}

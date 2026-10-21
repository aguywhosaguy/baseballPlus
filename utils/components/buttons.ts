import { findPlayer, PlayerID } from "@/utils/data"
import breficon from '@/assets/buttons/bref.png?inline'
import fgicon from '@/assets/buttons/fangraphs.png?inline'

const BREF = "https://www.baseball-reference.com/"
const FG = "https://www.fangraphs.com/"

type Site = {
  site: PlayerID
  icon: string
  player: (id: string, name: string) => string
  search: (name: string) => string
}

const SITES: Site[] = [
  {
    site: PlayerID.BRef,
    icon: breficon,
    player: (id: string, name: string) => `https://www.baseball-reference.com/players/${id[0]}/${id}.shtml`,
    search: (name: string) => `https://www.baseball-reference.com/search/search.fcgi?hint=&search=${encodeURIComponent(name)}`,
  },
  {
    site: PlayerID.FanGraphs,
    icon: fgicon,
    player: (id: string, name: string) => `https://www.fangraphs.com/players/${name.replaceAll(" ", "-").toLowerCase()}/${id}`,
    search: (name: string) => `https://www.fangraphs.com/search?q=${encodeURIComponent(name)}`,
  },
]

const button = (href: string, img: string) => {
  const link = document.createElement('a')
  link.href = href

  const icon = document.createElement('img')
  icon.src = img
  icon.style.height = '24px'
  icon.style.background = '#fff'
  icon.style.borderRadius = '4px'

  link.append(icon)
  return link
}

export const buttons = async (name: string, id: string, site: PlayerID) => {
  const player = id ? await findPlayer(id, site) : undefined

  return SITES
    .filter((s) => s.site !== site)
    .map((s) => {
      const siteID = player?.[s.site]
      return button(siteID ? s.player(siteID, name) : s.search(name), s.icon)
    })
}

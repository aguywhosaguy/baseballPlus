import { findPlayer } from "@/utils/data"
import type { Site } from "../types"
import { SITES } from "../constants"

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

export const buttons = async (name: string, id: string | undefined, site: Site): Promise<HTMLDivElement> =>  {
  const sitedata = SITES[site]

  const player = id ? await findPlayer(id, sitedata.idtype) : undefined

  const container = document.createElement('div')
  container.style.display = 'inline-flex'
  container.style.gap = '4px'

  Object.entries(SITES)
    .filter(([key]) => key !== site)
    .forEach((s) => {
      const siteID = player?.[s[1].idtype]
      container.append(button(siteID ? s[1].player(siteID, name) : s[1].search(name), s[1].icon))
    })

  return container
}

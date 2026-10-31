import type { ContentScriptContext } from "wxt/utils/content-script-context";
import { SITES } from "../constants";
import { Site } from "../types";

type StoredLink = {
  link: HTMLAnchorElement
  href: string
}

export const link = (ctx: ContentScriptContext, site: Site) => {
  let links: Record<string, StoredLink> = {}

  ctx.addEventListener(window, 'keydown', async (e) => {
    const key = e.key

    if (!key) return

    const hovered = document.querySelectorAll('a:hover')

    const a = hovered[hovered.length - 1] as HTMLAnchorElement

    if (!a) return

    const csite = SITES[site]

    const id = new URL(a.href).pathname.match(csite.regex.playerid)

    if (!id || !id[1]) return

    links[key] = {
      link: a,
      href: a.href
    }

    for (const hsite of Object.entries(SITES)) {
      if (key === (hsite[1].hotkey)) {
        a.classList.add('BP_modified')

        const player = await findPlayer(id[1], csite.idtype)

        if (!player) {
          a.href = hsite[1].search(a.innerText)
          return
        }

        a.href = hsite[1].player(player[hsite[1].idtype], a.innerText)
      }
    }
  }, true)
  ctx.addEventListener(window, 'keyup', (e) => {
    const key = e.key

    if (!key) return

    const unlink = links[key]

    if (!unlink) return

    unlink.link.href = unlink.href
    unlink.link.classList.remove('BP_modified')

    delete links[key]
  }, true)
  ctx.addEventListener(window, 'blur', () => { links = {} })
  ctx.addEventListener(window, 'click', (e) => {
    if (!document.querySelector('.BP_modified')) return

    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    e.preventDefault()
    e.stopImmediatePropagation()
    window.location.assign(a.href)
  }, true)
}

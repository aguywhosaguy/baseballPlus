import type { ContentScriptContext } from "wxt/utils/content-script-context";
import { SITES } from "../constants";
import { Site } from "../types";

export const link = (ctx: ContentScriptContext, site: Site) => {
  const held = new Set<string>()

  ctx.addEventListener(window, 'keydown', (e) => held.add(e.key), true)
  ctx.addEventListener(window, 'keyup', (e) => held.delete(e.key), true)
  ctx.addEventListener(window, 'blur', () => held.clear())

  ctx.addEventListener(document, 'click', async (e) => {
    const link = (e.target as Element).closest?.('a')
    if (!link) return

    const csite = SITES[site]

    const id = new URL(link.href).pathname.match(csite.regex.playerid)

    if (!id || !id[1]) return

    for (const hsite of Object.entries(SITES)) {
      if (held.has(hsite[1].hotkey)) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const player = await findPlayer(id[1], csite.idtype)

        if (!player) {
          location.href = hsite[1].search(link.innerText)
          return
        }

        location.href = hsite[1].player(player[hsite[1].idtype], link.innerText)
      }
    }
  }, true)
}

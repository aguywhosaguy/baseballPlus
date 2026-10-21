import { PlayerID, Site } from "@/utils/data"
import type { ContentScriptContext } from '#imports';
import { buttons } from "@/utils/components/buttons";

let timer: number | undefined;

const TIMEOUT = 300

export const fgButtons = (ctx: ContentScriptContext) => {
  if (!location.pathname.match(/^\/players\//)) return

  let name = document.querySelector('[class*="header_player-name"]')?.querySelector('h1')?.textContent.trim()

  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: '[class*="header_player-name"] > h1',
    append: (anchor, root) => anchor.after(root),
    onMount: async (container) => {
      try {
        const id = location.pathname.match(/^\/players\/[^/]+\/([^/]+)/)?.[1]

        if (!name || !id) return;

        console.log(name)

        container.append(await buttons(name, id, PlayerID.FanGraphs, Site.FanGraphs))
      } catch (e) {
        console.error(e)
      }
    }
  })

  ui.autoMount()

  ctx.addEventListener(window, 'wxt:locationchange', async () => {
    ui.remove();
    while (document.querySelector('[class*="header_player-name"]')?.querySelector('h1')?.textContent.trim() === name) {
      await new Promise((r) => setTimeout(r, 50))
    }
    name = document.querySelector('[class*="header_player-name"]')?.querySelector('h1')?.textContent?.trim() || ''
    ui.mount()
  });
}

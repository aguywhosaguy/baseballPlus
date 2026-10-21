import { PlayerID } from "@/utils/data"
import type { ContentScriptContext } from '#imports';
import { buttons } from "@/utils/components/buttons";

let timer: number | undefined;

const TIMEOUT = 300

export const fgButtons = (ctx: ContentScriptContext) => {
  if (!location.pathname.match(/^\/players\//)) return

  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: '[class*="header_player-name"] > h1',
    append: (anchor, root) => anchor.after(root),
    onMount: async (container) => {
      try {
        const id = location.pathname.match(/^\/players\/[^/]+\/([^/]+)/)?.[1]

        const name = document.querySelector('[class*="header_player-name"]')?.querySelector('h1')?.innerHTML

        if (!name || !id) return;

        container.append(...(await buttons(name, id, PlayerID.FanGraphs)))
      } catch (e) {
        console.error(e)
      }
    }
  })

  ui.autoMount()

  ctx.addEventListener(window, 'wxt:locationchange', () => {
    ui.remove();
    clearTimeout(timer)
    timer = ctx.setTimeout(() => ui.mount(), TIMEOUT);
  });
}

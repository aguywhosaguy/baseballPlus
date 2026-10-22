import { PlayerID, Site } from "@/utils/types"
import { type ContentScriptContext } from '#imports';
import { buttons } from "@/utils/components/buttons";

export const brefButtons = (ctx: ContentScriptContext) => {
  if (!location.pathname.match(/^\/players\//)) return

  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: '#meta > div > h1',
    onMount: async (container) => {
      try {
        const id = location.pathname.match(/^\/players\/[^/]+\/([^/]+)\./)?.[1]

        const name = document.querySelector('#meta > div > h1 > span')?.innerHTML

        if (!name || !id) return;

        container.append(await buttons(name, id, Site.BRef))
      } catch (e) {
        console.error(e)
      }
    }
  })

  ui.autoMount()
}

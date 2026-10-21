import { PlayerID } from "@/utils/data"
import type { ContentScriptContext } from '#imports';
import { buttons } from "@/utils/components/buttons";

export const savantButtons = (ctx: ContentScriptContext) => {

  if (!location.pathname.match(/^\/savant-player\//)) return

  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: '.bio-player-name > div:first-of-type',
    append: 'after',
    onMount: async (container) => {
      try {
        const id = location.pathname.match(/-(\d*)$/)?.[1]

        const name = document.querySelector('.bio-player-name > div:first-of-type > a')?.innerHTML

        if (!name) return;

        container.append(await buttons(name, id, PlayerID.MLB))
      } catch (e) {
        console.error(e)
      }
    }
  })

  ui.autoMount()
}

import { PlayerID, Site } from "@/utils/data"
import type { ContentScriptContext } from '#imports';
import { buttons } from "@/utils/components/buttons";

let timer: number | undefined;

const TIMEOUT = 300

const getName = () =>
  document.querySelector('[class*="header_player-name"] > h1')?.textContent?.trim()

const getId = () =>
  location.pathname.match(/^\/players\/[^/]+\/([^/]+)/)?.[1]

export const fgButtons = (ctx: ContentScriptContext) => {
  let mounted: { id: string; name: string } | undefined

  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: '[class*="header_player-name"] > h1',
    append: (anchor, root) => anchor.after(root),
    onMount: async (container) => {
      try {
        const name = getName()
        const id = getId()

        if (!name || !id) return;

        mounted = { id, name }
        container.append(await buttons(name, id, PlayerID.FanGraphs, Site.FanGraphs))
      } catch (e) {
        console.error(e)
      }
    },
    onRemove: () => { mounted = undefined }
  })

  ctx.setInterval(() => {
    const id = getId()
    const name = getName()

    if (!id) {
      if (ui.mounted) ui.remove()
      return
    }

    if (!name) return

    if (mounted?.id === id && ui.mounted && ui.wrapper.isConnected) return

    if (mounted && mounted.id !== id && mounted.name === name) return

    if (ui.mounted) ui.remove()

    ui.mount()
  }, 400);
}

import { getMaps } from "@/utils/data"
import fgicon from "@/assets/fangraphs.png?inline"
import type { ContentScriptContext } from '#imports';

const FG = "https://www.fangraphs.com/"

export const fangraphsButton = (ctx: ContentScriptContext) => {
  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: '#meta > div > h1',
    onMount: (container) => {
      const id = location.pathname.match(/^\/players\/[^/]+\/([^/]+)\./)?.[1]

      const name = document.querySelector('#meta > div > h1 > span')?.innerHTML
      if (!name) return;

      const link = document.createElement('a')
      link.href = FG + "search?q=" + encodeURIComponent(name)

      const icon = document.createElement('img')
      icon.src = fgicon
      icon.style.height = '24px'
      icon.style.background = '#fff'
      icon.style.borderRadius = '4px'

      link.append(icon)
      container.append(link)

      if (id) {
        getMaps().then(({ bbToFg }) => {
          const fg = bbToFg.get(id)
          if (fg) {
            link.href = FG + "players/" + name.replace(" ", "-") + "/" + fg
          }
        })
      }
    }
  })

  ui.autoMount()
}

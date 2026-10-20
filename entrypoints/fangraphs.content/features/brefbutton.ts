import { getMaps } from "@/utils/data"
import breficon from '@/assets/bref.png?inline'
import type { ContentScriptContext } from '#imports';

let timer: number | undefined;

const BREF = "https://www.baseball-reference.com/"
const TIMEOUT = 300

export const brefButton = (ctx: ContentScriptContext) => {
  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: '[class*="header_player-name"] > h1',
    append: (anchor, root) => anchor.after(root),
    onMount: (container) => {
      console.log(container)
      const id = location.pathname.match(/^\/players\/[^/]+\/([^/]+)/)?.[1]

      const name = document.querySelector('[class*="header_player-name"]')?.querySelector('h1')?.innerHTML

      if (!name || !id) return;

      const link = document.createElement('a')
      link.href = BREF + "search/search.fcgi?hint=&search=" + encodeURIComponent(name)

      const icon = document.createElement('img')
      icon.src = breficon
      icon.style.height = '24px'
      icon.style.background = '#fff'
      icon.style.borderRadius = '4px'

      link.append(icon)
      container.append(link)

      if (id) {
        getMaps().then(({ fgToBb }) => {
          const bb = fgToBb.get(id)
          if (bb) {
            link.href = BREF + "players/" + bb[0] + "/" + bb + ".shtml"
          }
        })
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

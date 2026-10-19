import { getMaps } from "@/utils/data"

let timer: number | undefined;

const BREF = "https://www.baseball-reference.com/"
const TIMEOUT = 300

export default defineContentScript({
  matches: ['*://*.fangraphs.com/*'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: '[class*="header_player-name"]',
      onMount: (container) => {
        console.log("remount")
        const id = location.pathname.match(/^\/players\/[^/]+\/([^/]+)/)?.[1]

        const name = document.querySelector('[class*="header_player-name"]')?.querySelector('h1')?.innerHTML

        if (!name || !id) return;

        const link = document.createElement('a')
        link.text = "BRef Page"
        link.href = BREF + "search/search.fcgi?hint=&search=" + encodeURIComponent(name)
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
});

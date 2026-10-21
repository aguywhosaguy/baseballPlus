import { fgButtons } from "./features/fgbuttons";

 export default defineContentScript({
  matches: ['*://*.fangraphs.com/*'],
  main(ctx) {
    fgButtons(ctx)
  }
});

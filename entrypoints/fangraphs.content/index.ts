import { fgButtons } from "./features/fgbuttons";

 export default defineContentScript({
   matches: ['*://*.fangraphs.com/*'],
   runAt: 'document_start',
  main(ctx) {
    fgButtons(ctx)
  }
});

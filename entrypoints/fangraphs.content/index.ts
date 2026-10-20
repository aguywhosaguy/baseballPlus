import { brefButton } from "./features/brefbutton";

 export default defineContentScript({
  matches: ['*://*.fangraphs.com/*'],
  main(ctx) {
    brefButton(ctx)
  }
});

import { fangraphsButton } from "./features/fgbutton";

export default defineContentScript({
  matches: ['*://*.baseball-reference.com/*'],
  main(ctx) {
    fangraphsButton(ctx)
  }
});

import { brefButtons } from "./features/brefbuttons";

export default defineContentScript({
  matches: ['*://*.baseball-reference.com/*'],
  main(ctx) {
    brefButtons(ctx)
  }
});

import { savantButtons } from "./features/savantButtons";

export default defineContentScript({
  matches: ['*://baseballsavant.mlb.com/*'],
  main(ctx) {
    savantButtons(ctx)
  }
});

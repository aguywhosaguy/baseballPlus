import { Site } from "@/utils/types";
import { savantButtons } from "./features/savantButtons";
import { link } from "@/utils/components/link";

export default defineContentScript({
  matches: ['*://baseballsavant.mlb.com/*'],
  main(ctx) {
    savantButtons(ctx)
    link(ctx, Site.Savant)
  }
});

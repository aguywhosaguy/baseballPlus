import { link } from "@/utils/components/link";
import { brefButtons } from "./features/brefbuttons";
import { Site } from "@/utils/types";

export default defineContentScript({
  matches: ['*://*.baseball-reference.com/*'],
  main(ctx) {
    brefButtons(ctx)
    link(ctx, Site.BRef)
  }
});

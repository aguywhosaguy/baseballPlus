import { link } from "@/utils/components/link";
import { fgButtons } from "./features/fgbuttons";
import { Site } from "@/utils/types";

 export default defineContentScript({
   matches: ['*://*.fangraphs.com/*'],
   runAt: 'document_start',
  main(ctx) {
    fgButtons(ctx)
    link(ctx, Site.FanGraphs)
  }
});

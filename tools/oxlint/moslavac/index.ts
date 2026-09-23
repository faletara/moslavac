import { eslintCompatPlugin } from "@oxlint/plugins";

import { noRawJsonInHtmlRule } from "./rules/no-raw-json-in-html.ts";

/** Pravila specifična za ovaj repo; generička su u vendoriranom `anti-slop`. */
const moslavacPlugin = eslintCompatPlugin({
  meta: { name: "moslavac" },
  rules: {
    "no-raw-json-in-html": noRawJsonInHtmlRule,
  },
});

export default moslavacPlugin;

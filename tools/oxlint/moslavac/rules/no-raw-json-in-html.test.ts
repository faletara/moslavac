import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import { noRawJsonInHtmlRule } from "./no-raw-json-in-html.ts";

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: "tsx" } },
});

tester.run("no-raw-json-in-html", noRawJsonInHtmlRule, {
  valid: [
    `<script dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />`,
    `<div dangerouslySetInnerHTML={{ __html: page.content }} />`,
    `const body = JSON.stringify(data);`,
    `<pre title={JSON.stringify(data)} />`,
  ],
  invalid: [
    {
      code: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`,
      errors: [{ messageId: "rawJson" }],
    },
    {
      code: `createElement("script", { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } });`,
      errors: [{ messageId: "rawJson" }],
    },
    {
      code: `<script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(a, b) }} />`,
      errors: [{ messageId: "rawJson" }],
    },
  ],
});

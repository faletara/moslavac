import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import { noRawJsonInHtmlRule } from "./no-raw-json-in-html.ts";

RuleTester.describe = describe;

RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: { parserOptions: { lang: "tsx" } },
});

const JSON_LD_SCRIPT_FILE = "/repo/packages/app-shell/src/seo/JsonLdScript.tsx";

tester.run("no-raw-json-in-html", noRawJsonInHtmlRule, {
  valid: [
    `<JsonLdScript data={data} />`,
    `<div dangerouslySetInnerHTML={{ __html: page.content }} />`,
    `const body = JSON.stringify(data);`,
    `<pre title={JSON.stringify(data)} />`,
    `<script src="/analytics.js" />`,
    {
      code: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />`,
      filename: JSON_LD_SCRIPT_FILE,
    },
    {
      name: "a shadowed JSON binding is not the global serializer",
      code: `const JSON = { stringify: escape }; <div dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`,
    },
  ],
  invalid: [
    {
      code: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />`,
      filename: "/repo/apps/moslavac/src/app/page.tsx",
      errors: [{ messageId: "jsonLdScript" }],
    },
    {
      name: "a stringified variable bypasses the call check but not the script check",
      code: `const s = JSON.stringify(d); <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: s }} />`,
      errors: [{ messageId: "jsonLdScript" }],
    },
    {
      code: `<script type={"application/ld+json"} />`,
      errors: [{ messageId: "jsonLdScript" }],
    },
    {
      code: `<div dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`,
      errors: [{ messageId: "rawJson" }],
    },
    {
      code: `createElement("script", { dangerouslySetInnerHTML: { __html: JSON.stringify(data) } });`,
      errors: [{ messageId: "rawJson" }],
    },
    {
      code: `<div dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(a, b) }} />`,
      errors: [{ messageId: "rawJson" }],
    },
    {
      code: `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`,
      errors: [{ messageId: "jsonLdScript" }, { messageId: "rawJson" }],
    },
  ],
});

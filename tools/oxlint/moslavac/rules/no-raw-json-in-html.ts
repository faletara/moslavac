import { defineRule } from "@oxlint/plugins";

import type { ESTree } from "@oxlint/plugins";

const SINK = "dangerouslySetInnerHTML";

function isJsonStringify(callee: ESTree.Node): boolean {
  return (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.object.type === "Identifier" &&
    callee.object.name === "JSON" &&
    callee.property.type === "Identifier" &&
    callee.property.name === "stringify"
  );
}

/** JSX atribut ili ključ objekta (`createElement`) koji HTML ubacuje bez escapea. */
function isHtmlSink(node: ESTree.Node): boolean {
  if (node.type === "JSXAttribute") {
    return node.name.type === "JSXIdentifier" && node.name.name === SINK;
  }

  if (node.type === "Property") {
    return (
      (node.key.type === "Identifier" && node.key.name === SINK) ||
      (node.key.type === "Literal" && node.key.value === SINK)
    );
  }

  return false;
}

function isInsideHtmlSink(node: ESTree.Node): boolean {
  let current: ESTree.Node | null = node.parent;

  while (current !== null && current.type !== "Program") {
    if (isHtmlSink(current)) return true;
    current = current.parent;
  }

  return false;
}

/**
 * Goli `JSON.stringify` u `dangerouslySetInnerHTML` ne escapea `<`, pa tekst iz
 * CMS-a ili HNS-a sa `</script>` izlazi iz JSON-LD skripte (ticket 08).
 */
export const noRawJsonInHtmlRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow JSON.stringify inside dangerouslySetInnerHTML; use serializeJsonLd, which escapes <, >, &, U+2028 and U+2029.",
    },
    messages: {
      rawJson:
        "`JSON.stringify` ne escapea `</script>`. Koristi `serializeJsonLd` iz `@/lib/helpers/jsonLd`.",
    },
  },
  createOnce(context) {
    return {
      CallExpression(node) {
        if (isJsonStringify(node.callee) && isInsideHtmlSink(node)) {
          context.report({ node, messageId: "rawJson" });
        }
      },
    };
  },
});

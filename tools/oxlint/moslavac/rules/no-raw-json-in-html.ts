import { defineRule } from "@oxlint/plugins";

import type { ESTree, SourceCode } from "@oxlint/plugins";

import { resolveVariable } from "../../anti-slop/shared/scope.ts";

const HTML_SINK_PROP = "dangerouslySetInnerHTML";

const JSON_LD_TYPE = "application/ld+json";

/** The one file allowed to render a JSON-LD script; everything else renders `<JsonLdScript>`. */
const JSON_LD_SCRIPT_FILE = /[\\/]packages[\\/]app-shell[\\/]src[\\/]seo[\\/]JsonLdScript\.tsx$/;

function isGlobalJson(sourceCode: SourceCode, expression: ESTree.Node): boolean {
  if (expression.type !== "Identifier" || expression.name !== "JSON") return false;

  if (sourceCode.isGlobalReference(expression)) return true;

  const variable = resolveVariable(sourceCode, expression);

  return variable === null || variable.defs.length === 0;
}

function isJsonStringify(sourceCode: SourceCode, callee: ESTree.Node): boolean {
  if (callee.type !== "MemberExpression") return false;

  if (!isGlobalJson(sourceCode, callee.object)) return false;

  const property = callee.property;

  return callee.computed
    ? property.type === "Literal" && property.value === "stringify"
    : property.type === "Identifier" && property.name === "stringify";
}

/** A JSX attribute or object key (`createElement` props) that injects HTML unescaped. */
function isHtmlSink(node: ESTree.Node): boolean {
  if (node.type === "JSXAttribute") {
    return node.name.type === "JSXIdentifier" && node.name.name === HTML_SINK_PROP;
  }

  if (node.type === "Property") {
    return (
      (node.key.type === "Identifier" && node.key.name === HTML_SINK_PROP) ||
      (node.key.type === "Literal" && node.key.value === HTML_SINK_PROP)
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

function isJsonLdTypeValue(value: ESTree.JSXAttribute["value"]): boolean {
  if (value === null) return false;

  if (value.type === "Literal") return value.value === JSON_LD_TYPE;

  return (
    value.type === "JSXExpressionContainer" &&
    value.expression.type === "Literal" &&
    value.expression.value === JSON_LD_TYPE
  );
}

function isJsonLdScript(node: ESTree.JSXOpeningElement): boolean {
  if (node.name.type !== "JSXIdentifier" || node.name.name !== "script") return false;

  return node.attributes.some(
    (attribute) =>
      attribute.type === "JSXAttribute" &&
      attribute.name.type === "JSXIdentifier" &&
      attribute.name.name === "type" &&
      isJsonLdTypeValue(attribute.value),
  );
}

/**
 * JSON.stringify does not escape `<`, so CMS or HNS text containing `</script>`
 * breaks out of an inline JSON-LD script. JSON-LD goes through `<JsonLdScript>`.
 */
export const noRawJsonInHtmlRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow JSON.stringify inside dangerouslySetInnerHTML and JSON-LD scripts outside JsonLdScript.",
    },
    messages: {
      rawJson:
        "`JSON.stringify` does not escape `</script>` in HTML. Render JSON-LD with `<JsonLdScript>` or serialize with `serializeJsonLd`.",
      jsonLdScript:
        "Render JSON-LD with `<JsonLdScript data={...} />` from `@/lib/app-shell/seo/JsonLdScript`, which escapes `</script>`.",
    },
  },
  createOnce(context) {
    return {
      JSXOpeningElement(node) {
        if (JSON_LD_SCRIPT_FILE.test(context.filename)) return;

        if (isJsonLdScript(node)) context.report({ node, messageId: "jsonLdScript" });
      },
      CallExpression(node) {
        if (isJsonStringify(context.sourceCode, node.callee) && isInsideHtmlSink(node)) {
          context.report({ node, messageId: "rawJson" });
        }
      },
    };
  },
});

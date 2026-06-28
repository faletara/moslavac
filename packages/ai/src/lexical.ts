// Minimal Lexical editor-state builder shared by AI drafts and seed scripts.
// Produces the same shape Payload's richText (`content`) field expects.

// Index signatures keep these structurally assignable to Payload's richText
// (SerializedEditorState) field type, which carries `[k: string]: unknown`.
interface LexicalTextNode {
  [k: string]: unknown;
  type: "text";
  detail: 0;
  format: 0;
  mode: "normal";
  style: "";
  text: string;
  version: 1;
}

interface LexicalParagraphNode {
  [k: string]: unknown;
  type: "paragraph";
  format: "";
  indent: 0;
  version: 1;
  direction: "ltr";
  textFormat: 0;
  textStyle: "";
  children: LexicalTextNode[];
}

export interface LexicalState {
  [k: string]: unknown;
  root: {
    [k: string]: unknown;
    type: "root";
    format: "";
    indent: 0;
    version: 1;
    direction: "ltr";
    children: LexicalParagraphNode[];
  };
}

/** Build a Lexical rich-text value from plain paragraph strings. */
export const paragraphsToLexical = (paragraphs: string[]): LexicalState => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: paragraphs.map((text) => ({
      type: "paragraph",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      textFormat: 0,
      textStyle: "",
      children: [
        {
          type: "text",
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
          text,
          version: 1,
        },
      ],
    })),
  },
});

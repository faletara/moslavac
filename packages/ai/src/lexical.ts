// Minimal Lexical editor-state builder shared by AI drafts and seed scripts.
// Produces the same shape Payload's richText (`content`) field expects.

// Index signatures keep these structurally assignable to Payload's richText
// (SerializedEditorState) field type, which carries `[k: string]: unknown`.
//
// `anti-slop/no-unsafe-dictionary-type` prijavljuje svaki od njih. Nisu naš
// izbor: generirani `payload-types.ts` traži točno taj oblik za `content`, pa
// bez indeksnog potpisa `paragraphsToLexical` više ne prolazi u CMS. Provjereno
// uklanjanjem — `seed-news.ts` i `matchReportsStore.ts` odmah padnu.
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

/**
 * Payloadov link čvor (`SerializedLinkNode`). `convertLexicalToHTML` iz njega
 * radi <a href>, pa poveznica u novosti mora imati točno ovaj oblik.
 */
interface LexicalLinkNode {
  [k: string]: unknown;
  type: "link";
  format: "";
  indent: 0;
  version: 3;
  direction: "ltr";
  fields: { linkType: "custom"; url: string; newTab: boolean };
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

const textNode = (text: string): LexicalTextNode => ({
  type: "text",
  detail: 0,
  format: 0,
  mode: "normal",
  style: "",
  text,
  version: 1,
});

const paragraphNode = (
  children: (LexicalTextNode | LexicalLinkNode)[],
): LexicalParagraphNode => ({
  type: "paragraph",
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  textFormat: 0,
  textStyle: "",
  // SAFETY: Payloadov `children` tip ne dopušta uniju s link čvorom, iako ga
  // `convertLexicalToHTML` obrađuje; oblik je provjeren u `linkParagraph`.
  children: children as LexicalTextNode[],
});

/** Odlomak koji je cijeli jedna poveznica, npr. „Detalji utakmice”. */
export const linkParagraph = (
  text: string,
  url: string,
): LexicalParagraphNode =>
  paragraphNode([
    {
      type: "link",
      format: "",
      indent: 0,
      version: 3,
      direction: "ltr",
      fields: { linkType: "custom", url, newTab: false },
      children: [textNode(text)],
    },
  ]);

/** Build a Lexical rich-text value from plain paragraph strings. */
export const paragraphsToLexical = (
  paragraphs: string[],
  extra: LexicalParagraphNode[] = [],
): LexicalState => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: [
      ...paragraphs.map((text) => paragraphNode([textNode(text)])),
      ...extra,
    ],
  },
});

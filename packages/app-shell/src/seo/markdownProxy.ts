import { NextResponse, type NextRequest } from "next/server";
import { htmlToMarkdown } from "./htmlToMarkdown";
import {
  MARKDOWN_SOURCE_HEADER,
  markdownResponse,
  wantsMarkdown,
} from "./markdownNegotiation";

/**
 * Next-ov `proxy` koji istom URL-u daje dva oblika: HTML za preglednike, Markdown za
 * agente koji pošalju `Accept: text/markdown`. Stranicu ne renderira sam — s
 * vlastitog izvora dohvati gotov HTML i pretvori ga, pa se sadržaj ne može
 * razići od onoga što vidi čovjek.
 *
 * Vlastiti dohvat nosi `x-markdown-source`, po čemu ga ovaj proxy
 * prepozna i propusti; bez toga bi se pozivao u krug.
 */
export async function markdownProxy(
  request: NextRequest,
): Promise<NextResponse | Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  if (request.headers.get(MARKDOWN_SOURCE_HEADER)) {
    return NextResponse.next();
  }

  if (!wantsMarkdown(request.headers.get("accept"))) {
    return NextResponse.next();
  }

  try {
    const upstream = await fetch(request.nextUrl, {
      headers: {
        accept: "text/html",
        [MARKDOWN_SOURCE_HEADER]: "1",
      },
    });

    const contentType = upstream.headers.get("content-type") ?? "";

    if (!upstream.ok || !contentType.includes("text/html")) {
      return NextResponse.next();
    }

    const markdown = htmlToMarkdown(await upstream.text(), {
      baseUrl: request.nextUrl.origin,
    });

    return markdownResponse(markdown);
  } catch {
    // Pretvorba je dodatak, ne uvjet: ako zakaže, posjetitelj dobiva HTML.
    return NextResponse.next();
  }
}

import type { NextRequest } from "next/server";
import { markdownProxy } from "@/lib/app-shell/seo/markdownProxy";
import { suspensionGate } from "@/lib/app-shell/suspension/suspensionGate";

/**
 * Prekidač ide prvi: kad je stranica zaustavljena, ni pretvorba u Markdown ne
 * smije izvući sadržaj.
 */
export default async function proxy(request: NextRequest) {
  const suspended = suspensionGate(request);
  if (suspended) return suspended;

  return markdownProxy(request);
}

// Samo stranice: preskačemo /api, Next-ove interne rute i sve s nastavkom
// (robots.txt, llms.txt, sitemap.xml, slike) — to su već strojno čitljivi oblici.
export const config = {
  matcher: ["/((?!api|_next|.*\\.).*)"],
};

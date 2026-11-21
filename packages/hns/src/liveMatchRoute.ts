import "server-only";

import { parsePositiveInt } from "@/lib/helpers/validate";
import { HnsUnavailableError } from "./context";
import { fetchLiveMatch } from "./matches";

/**
 * `GET /api/utakmice/[id]/uzivo` — trenutno stanje utakmice (`LiveMatch`) za
 * preglednik. Stranica utakmice je statična, a samo dio koji se mijenja uživo
 * preglednik dohvaća odavde, i to samo u prozoru oko utakmice.
 *
 * Ovo je druga ruta koja služi pregledniku i svjesna iznimka od pravila "One
 * data path" (vidi `docs/adr/0003-ruta-za-utakmicu-uzivo.md`). CDN dijeli jedan
 * odgovor među svim posjetiteljima 30 s, pa CPU ne raste s brojem gledatelja.
 * Klupski app je uključuje tankim pozivom; mapiranje ostaje u `fetchLiveMatch`.
 */

/** Jedan odgovor po utakmici na 30 s za sve posjetitelje, kao i TTL fetcheva. */
const LIVE_CACHE_CONTROL = "public, s-maxage=30, stale-while-revalidate=30";

/** Grešku CDN ne kešira, pa idući dohvat odmah pokuša ponovno. */
const NO_STORE = "no-store";

interface LiveMatchRouteContext {
  params: Promise<{ id: string }>;
}

function errorResponse(status: number, error: string): Response {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": NO_STORE } },
  );
}

export function createLiveMatchRoute() {
  return async function GET(
    _request: Request,
    ctx: LiveMatchRouteContext,
  ): Promise<Response> {
    // Id se provjerava prije bilo kakvog poziva HNS-u — ruta se ne smije moći
    // iskoristiti za proizvoljne HNS putanje.
    const matchId = parsePositiveInt((await ctx.params).id);

    if (matchId == null) return errorResponse(400, "invalid match id");

    try {
      const live = await fetchLiveMatch({ matchId });

      if (!live) return errorResponse(404, "match not found");

      return Response.json(live, {
        headers: { "Cache-Control": LIVE_CACHE_CONTROL },
      });
    } catch (err) {
      if (err instanceof HnsUnavailableError) {
        return errorResponse(502, "HNS unavailable");
      }

      throw err;
    }
  };
}

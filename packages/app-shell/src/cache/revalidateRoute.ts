import { revalidatePath, revalidateTag } from "next/cache";

/**
 * `POST /api/revalidate` — jedini ulazni webhook klupske stranice.
 *
 * Bez njega sadržaj se osvježava samo istekom TTL-a, a Next dotad servira staru
 * stranicu (stale-while-revalidate): prvi posjetitelj nakon isteka dobije staro i
 * tek okine obnovu u pozadini. Zato nova novost nije bila vidljiva dok je netko
 * ne bi hard-refreshao. CMS ovdje javi koji su tagovi pali čim urednik spremi.
 *
 * Ovo NIJE server→vlastiti-API round-trip koji zabranjuje `api-architecture.md`:
 * poziv dolazi izvana, iz CMS-a.
 */

interface RevalidateRequest {
  tags?: unknown;
}

function parseTags(body: RevalidateRequest): string[] {
  if (!Array.isArray(body.tags)) return [];
  return body.tags.filter(
    (tag): tag is string => typeof tag === "string" && tag.length > 0,
  );
}

export function createRevalidateRoute() {
  return async function POST(request: Request): Promise<Response> {
    const secret = process.env.REVALIDATE_SECRET;

    // Bez konfiguriranog secreta ruta je zatvorena, a ne otvorena.
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
      return Response.json({ revalidated: false }, { status: 401 });
    }

    let tags: string[];
    try {
      tags = parseTags((await request.json()) as RevalidateRequest);
    } catch {
      return Response.json(
        { revalidated: false, error: "invalid JSON body" },
        { status: 400 },
      );
    }

    if (tags.length === 0) {
      return Response.json(
        { revalidated: false, error: "no tags" },
        { status: 400 },
      );
    }

    // `{ expire: 0 }` = istekni odmah, bez serviranja stale sadržaja; poziv bez
    // drugog argumenta je u Next 16 deprecated.
    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 });
    }

    // Tag pokriva Data Cache fetcha, ali prerenderirane HTML/RSC zapise ruta
    // poništavamo i eksplicitno. Klupske stranice su male i sadržaj se mijenja
    // nekoliko puta tjedno, pa je cijena zanemariva u odnosu na rizik da neka
    // ruta ostane stara. `"layout"` hvata sve rute ispod root layouta, pa se
    // popis putanja ne mora održavati po klubu (rute se razlikuju).
    revalidatePath("/", "layout");

    return Response.json({ revalidated: true, tags, now: Date.now() });
  };
}

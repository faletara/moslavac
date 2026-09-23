import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
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
 *
 * `REVALIDATE_SECRET` kluba je tajna samo tog kluba: CMS je izvodi iz svoje
 * tajne i sluga Tenanta (vidi `apps/cms/src/lib/revalidateFrontend.ts`), pa
 * vjerodajnica drugog kluba ovdje ne prolazi.
 */

/**
 * Tijelo zahtjeva. Zod odbacuje sve što nije neprazan string, pa poziv nikad ne
 * grana po `typeof` i tijelo ne treba tvrditi.
 */
const revalidateBody = z
  .object({
    tags: z
      .array(z.unknown())
      .nullish()
      .transform((tags) =>
        (tags ?? []).flatMap((tag) => {
          const parsed = z.string().min(1).safeParse(tag);

          return parsed.success ? [parsed.data] : [];
        }),
      ),
  })
  .transform((body) => body.tags);

/** Next cache API koji ruta poziva; test ga zamjenjuje jer bez Next runtimea baca. */
export type RevalidateCache = {
  revalidateTag: typeof revalidateTag;
  revalidatePath: typeof revalidatePath;
};

const sha256 = (value: string): Buffer => createHash("sha256").update(value).digest();

/**
 * Usporedba u konstantnom vremenu. Hash izjednači duljine, jer
 * `timingSafeEqual` baca na različitim duljinama.
 */
const isAuthorized = (header: string | null, secret: string): boolean =>
  timingSafeEqual(sha256(header ?? ""), sha256(`Bearer ${secret}`));

export function createRevalidateRoute(
  cache: RevalidateCache = { revalidateTag, revalidatePath },
) {
  return async function POST(request: Request): Promise<Response> {
    const secret = process.env.REVALIDATE_SECRET;

    // Bez konfiguriranog secreta ruta je zatvorena, a ne otvorena.
    if (!secret || !isAuthorized(request.headers.get("authorization"), secret)) {
      return Response.json({ revalidated: false }, { status: 401 });
    }

    let tags: string[];

    try {
      tags = revalidateBody.parse(await request.json());
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
      cache.revalidateTag(tag, { expire: 0 });
    }

    // Tag pokriva Data Cache fetcha, ali prerenderirane HTML/RSC zapise ruta
    // poništavamo i eksplicitno. Klupske stranice su male i sadržaj se mijenja
    // nekoliko puta tjedno, pa je cijena zanemariva u odnosu na rizik da neka
    // ruta ostane stara. `"layout"` hvata sve rute ispod root layouta, pa se
    // popis putanja ne mora održavati po klubu (rute se razlikuju).
    cache.revalidatePath("/", "layout");

    return Response.json({ revalidated: true, tags, now: Date.now() });
  };
}

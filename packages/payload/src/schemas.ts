import { z } from "zod";

/**
 * Granica na kojoj Payloadov odgovor prestaje biti neraščlanjeni JSON.
 *
 * Sve provjere oblika žive ovdje. Zod bira granu unije umjesto `typeof`
 * provjere na pozivnom mjestu, pa kod nizvodno dobiva domenski tip i nikad ne
 * pita kako je vrijednost predstavljena.
 */

/**
 * Slika spremna za prikaz. `cardUrl` i `heroUrl` su izvedene varijante s padom
 * na original, pa pozivno mjesto više ne slaganje `sizes?.card?.url ?? url`.
 */
export interface MediaImage {
  id: number;
  url: string;
  cardUrl: string;
  heroUrl: string;
  alt: string;
  width: number | null;
  height: number | null;
}

// Payload popunjava tek one varijante koje je stvarno izrezao; ostale vraća
// kao `{ url: null, width: null, height: null }`. Shema zato ne smije tražiti
// nijedno polje — strožom shemom pada cijeli dohvat kolekcije.
const sizeSchema = z
  .object({
    url: z.string().nullish(),
    width: z.number().nullish(),
    height: z.number().nullish(),
  })
  .nullish();

const populatedMedia = z.object({
  id: z.number(),
  url: z.string().nullish(),
  alt: z.string().nullish(),
  width: z.number().nullish(),
  height: z.number().nullish(),
  filename: z.string().nullish(),
  sizes: z
    .object({
      thumbnail: sizeSchema,
      card: sizeSchema,
      hero: sizeSchema,
    })
    .nullish(),
});

/**
 * Upload relacija. Payload je vraća populiranu (objekt) ili kao goli id kada
 * `depth` ne doseže do nje; id nam ne služi ničemu, pa postaje `null`.
 */
export const mediaRef = z
  .union([
    populatedMedia.transform((media): MediaImage => {
      const url = media.url ?? "";

      return {
        id: media.id,
        url,
        cardUrl: media.sizes?.card?.url ?? url,
        heroUrl: media.sizes?.hero?.url ?? url,
        alt: media.alt ?? "",
        width: media.width ?? null,
        height: media.height ?? null,
      };
    }),
    z.union([z.number(), z.string()]).transform((): MediaImage | null => null),
  ])
  .nullish()
  .transform((media): MediaImage | null => media ?? null);

/** Relacija na tenanta: populirani objekt sa slugom ili goli id. */
export const tenantRef = z
  .union([
    z.object({ id: z.number(), slug: z.string().nullish().default(null) }),
    z.union([z.number(), z.string()]).transform(() => null),
  ])
  .nullish()
  .transform((tenant) => tenant ?? null);

/**
 * Ovojnica Payloadove liste; ista je za svaku kolekciju.
 *
 * Dokumenti se raščlanjuju pojedinačno: jedan zapis neočekivanog oblika ispada
 * iz liste umjesto da sruši cijeli dohvat. Prije zoda takav je zapis prolazio
 * neprovjeren, pa bi stroža ovojnica bila korak unatrag — stranica bi ostala
 * prazna zbog jednog retka.
 */
export const payloadPage = <Doc extends z.ZodType>(doc: Doc) =>
  z.object({
    docs: z
      .array(z.unknown())
      .nullish()
      .transform((rows): z.output<Doc>[] =>
        (rows ?? []).flatMap((row) => {
          const parsed = doc.safeParse(row);

          if (parsed.success) {
            // SAFETY: `safeParse` vraća izlaz upravo te sheme; TS to ne zaključi
            // kroz generik `Doc`, ali runtime vrijednost je već raščlanjena.
            return [parsed.data as z.output<Doc>];
          }

          console.error(
            "payload: dokument ne odgovara shemi, preskačem",
            parsed.error.issues,
          );

          return [];
        }),
      ),
    // Brojači se koriste samo za straničenje; ako ih Payload ikad izostavi,
    // bolje je prikazati jednu stranicu nego srušiti dohvat.
    totalDocs: z.number().nullish().transform((count) => count ?? 0),
    totalPages: z.number().nullish().transform((count) => count ?? 1),
    page: z.number().nullish().transform((page) => page ?? 1),
    limit: z.number().nullish().transform((limit) => limit ?? 0),
    // Zastavice stranicačenja nitko ne čita; tražiti ih značilo bi pasti na
    // odgovoru koji je za nas potpun.
    hasNextPage: z.boolean().nullish().transform((flag) => flag ?? false),
    hasPrevPage: z.boolean().nullish().transform((flag) => flag ?? false),
    nextPage: z.number().nullish().default(null),
    prevPage: z.number().nullish().default(null),
  });

export type PayloadPageOf<Doc> = {
  docs: Doc[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

/** Kategorije klupskih dokumenata; iste vrijednosti kao `DocumentCategory`. */
export const documentCategorySchema = z.enum([
  "statut",
  "pravilnik",
  "obrazac",
  "izvjesce",
  "ostalo",
]);

/** Ključevi statičnih stranica; iste vrijednosti kao `PageKey`. */
export const pageKeySchema = z.enum([
  "povijest",
  "navijaci",
  "statut",
  "skola-info",
  "seniori-info",
]);

/**
 * Tenant kakav frontend koristi. `branding.logo` izlazi kao `MediaImage | null`,
 * pa nijedna komponenta više ne pita je li relacija populirana.
 */
export const tenantSchema = z.object({
  id: z.number(),
  slug: z.string(),
  displayName: z.string().nullish().transform((name) => name ?? ""),
  active: z.boolean().nullish().transform((active) => active ?? true),
  // Nepotpun `hns` blok daje prazne vrijednosti umjesto iznimke: HNS dohvat
  // tada zakaže sam za sebe, a ostatak stranice se i dalje prikaže.
  hns: z
    .object({
      apiKey: z.string().nullish().transform((key) => key ?? ""),
      teamId: z.string().nullish().transform((id) => id ?? ""),
      seniorCompetitionFilter: z.string().nullish().default(null),
    })
    .nullish()
    .transform(
      (hns) => hns ?? { apiKey: "", teamId: "", seniorCompetitionFilter: null },
    ),
  branding: z
    .object({
      shortName: z.string().nullish().default(null),
      motto: z.string().nullish().default(null),
      founded: z.number().nullish().default(null),
      logo: mediaRef,
    })
    .nullish()
    .default(null),
  contact: z
    .object({
      email: z.string().nullish().default(null),
      phone: z.string().nullish().default(null),
      address: z.string().nullish().default(null),
      city: z.string().nullish().default(null),
      region: z.string().nullish().default(null),
      mapEmbedUrl: z.string().nullish().default(null),
    })
    .nullish()
    .default(null),
  social: z
    .object({
      facebook: z.string().nullish().default(null),
      instagram: z.string().nullish().default(null),
      youtube: z.string().nullish().default(null),
      webshop: z.string().nullish().default(null),
    })
    .nullish()
    .default(null),
  payment: z
    .object({
      iban: z.string().nullish().default(null),
      recipient: z.string().nullish().default(null),
      seasonTicketPrice: z.number().nullish().default(null),
    })
    .nullish()
    .default(null),
  legal: z
    .object({
      oib: z.string().nullish().default(null),
      registryNumber: z.string().nullish().default(null),
      registryAuthority: z.string().nullish().default(null),
    })
    .nullish()
    .default(null),
});

export type FrontendTenant = z.output<typeof tenantSchema>;

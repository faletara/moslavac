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

const sizeSchema = z
  .object({ url: z.string(), width: z.number(), height: z.number() })
  .nullish();

const populatedMedia = z.object({
  id: z.number(),
  url: z.string(),
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
    populatedMedia.transform(
      (media): MediaImage => ({
        id: media.id,
        url: media.url,
        cardUrl: media.sizes?.card?.url ?? media.url,
        heroUrl: media.sizes?.hero?.url ?? media.url,
        alt: media.alt ?? "",
        width: media.width ?? null,
        height: media.height ?? null,
      }),
    ),
    z.union([z.number(), z.string()]).transform((): MediaImage | null => null),
  ])
  .nullish()
  .transform((media): MediaImage | null => media ?? null);

/** Relacija na tenanta: populirani objekt sa slugom ili goli id. */
export const tenantRef = z
  .union([
    z.object({ id: z.number(), slug: z.string() }),
    z.union([z.number(), z.string()]).transform(() => null),
  ])
  .nullish()
  .transform((tenant) => tenant ?? null);

/** Ovojnica Payloadove liste; ista je za svaku kolekciju. */
export const payloadPage = <Doc extends z.ZodType>(doc: Doc) =>
  z.object({
    docs: z.array(doc),
    totalDocs: z.number(),
    totalPages: z.number(),
    page: z.number(),
    limit: z.number(),
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
  displayName: z.string(),
  active: z.boolean(),
  hns: z.object({
    apiKey: z.string(),
    teamId: z.string(),
    seniorCompetitionFilter: z.string().nullish().default(null),
  }),
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

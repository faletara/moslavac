import { postgresAdapter } from "@payloadcms/db-postgres";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { isSuperAdmin } from "./access/roles";
import { CLUB_FEATURES } from "@/lib/payload/clubFeatures";
import { BoardMembers } from "./collections/BoardMembers";
import { Documents } from "./collections/Documents";
import { Equipment } from "./collections/Equipment";
import { GalleryAlbums } from "./collections/GalleryAlbums";
import { Media } from "./collections/Media";
import { News } from "./collections/News";
import { Pages } from "./collections/Pages";
import { Roster } from "./collections/Roster";
import { SchoolPrograms } from "./collections/SchoolPrograms";
import { Tenants } from "./collections/Tenants";
import { Users } from "./collections/Users";
import { hnsPlayerSearchEndpoint } from "./endpoints/hnsPlayerSearch";
import type { Config } from "./payload-types";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.PAYLOAD_SECRET) {
	throw new Error("PAYLOAD_SECRET env var is required");
}

const TENANT_COLLECTION_SLUGS = [
	"news",
	"media",
	"roster",
	...CLUB_FEATURES.map(({ slug }) => slug),
] as const;

const tenantCollections = Object.fromEntries(
	TENANT_COLLECTION_SLUGS.map((slug) => [slug, {}]),
);

export default buildConfig({
	admin: {
		user: Users.slug,
		components: {
			// Vlasniku kluba: izbornik bez kolekcije "Klubovi", umjesto nje link
			// ravno na njegov zapis (bez međurute na listu → bez bljeska).
			beforeNavLinks: ["@/components/ClubSettingsLink#ClubSettingsLink"],
			Nav: "@/components/ClubNav#ClubNav",
		},
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	// Redoslijed određuje navigaciju: postavke kluba idu na vrh (Users je
	// vlasniku kluba skriven).
	collections: [
		Tenants,
		Users,
		News,
		Media,
		Roster,
		Equipment,
		Pages,
		Documents,
		BoardMembers,
		SchoolPrograms,
		GalleryAlbums,
	],
	endpoints: [hnsPlayerSearchEndpoint],
	// Frontend klubova poziva CMS cross-origin.
	cors: process.env.CORS_ORIGINS
		? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
		: "*",
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET,
	graphQL: {
		disable: true,
	},
	upload: {
		limits: {
			fileSize: 15_000_000, // 15 MB
		},
	},
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		// This shared Neon database is migration-managed. Development schema push
		// can block startup on an interactive data-loss prompt and must stay off.
		push: false,
		pool: {
			connectionString: process.env.DATABASE_URL,
		},
	}),
	sharp,
	plugins: [
		multiTenantPlugin<Config>({
			collections: tenantCollections,
			tenantsSlug: "tenants",
			userHasAccessToAllTenants: (user) => isSuperAdmin(user),
			tenantsArrayField: {
				// Polje je deklarirano ručno u `Users` kolekciji da mu možemo dati
				// `admin.condition` (tenant-admin ne vidi dodjelu klubova).
				// Access — samo super-admin dodjeljuje — definiran je tamo.
				includeDefaultField: false,
			},
		}),
		s3Storage({
			collections: {
				media: {
					disablePayloadAccessControl: true,
					generateFileURL: ({ filename, prefix }) => {
						const base = process.env.R2_PUBLIC_URL ?? "";
						return prefix
							? `${base}/${prefix}/${filename}`
							: `${base}/${filename}`;
					},
				},
				documents: {
					disablePayloadAccessControl: true,
					generateFileURL: ({ filename, prefix }) => {
						const base = process.env.R2_PUBLIC_URL ?? "";
						return prefix
							? `${base}/${prefix}/${filename}`
							: `${base}/${filename}`;
					},
				},
			},
			bucket: process.env.R2_BUCKET || "",
			config: {
				endpoint: process.env.R2_ENDPOINT,
				credentials: {
					accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
					secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
				},
				region: "auto",
				forcePathStyle: true,
			},
		}),
	],
});

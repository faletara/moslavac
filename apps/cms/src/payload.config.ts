import { postgresAdapter } from "@payloadcms/db-postgres";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

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

const isSuperAdmin = (
	user: { roles?: string[] | null } | null | undefined,
): boolean => Boolean(user?.roles?.includes("super-admin"));

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [
		Users,
		Tenants,
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
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URL,
		},
	}),
	sharp,
	plugins: [
		multiTenantPlugin<Config>({
			collections: {
				news: {},
				media: {},
				roster: {},
				equipment: {},
				pages: {},
				documents: {},
				"board-members": {},
				"school-programs": {},
				"gallery-albums": {},
			},
			tenantsSlug: "tenants",
			userHasAccessToAllTenants: (user) => isSuperAdmin(user),
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

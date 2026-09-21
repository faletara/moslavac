import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Dodaje `tenants.site_url` — adresu klupske stranice na koju CMS javlja da je
 * sadržaj promijenjen (vidi `src/lib/revalidateFrontend.ts`).
 *
 * Baza je migration-managed (`push: false` u payload.config.ts), pa polje bez
 * ove migracije ne postoji u produkciji. Kolona na `tenants` koja fali ruši
 * SELECT nad cijelom tablicom, a time i svaki upit koji populira `tenant`
 * relaciju — usp. 20260825_120000_tenants_social_instagram.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "site_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tenants" DROP COLUMN IF EXISTS "site_url";
  `)
}

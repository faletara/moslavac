import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "legal_oib" varchar;
    ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "legal_registry_number" varchar;
    ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "legal_registry_authority" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tenants" DROP COLUMN IF EXISTS "legal_oib";
    ALTER TABLE "tenants" DROP COLUMN IF EXISTS "legal_registry_number";
    ALTER TABLE "tenants" DROP COLUMN IF EXISTS "legal_registry_authority";
  `)
}

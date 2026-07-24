import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_tenants_features" ADD VALUE 'equipment' BEFORE 'pages';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tenants_features" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_tenants_features";
  CREATE TYPE "public"."enum_tenants_features" AS ENUM('pages', 'documents', 'board', 'school', 'gallery');
  ALTER TABLE "tenants_features" ALTER COLUMN "value" SET DATA TYPE "public"."enum_tenants_features" USING "value"::"public"."enum_tenants_features";`)
}

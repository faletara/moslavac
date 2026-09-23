import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Dodaje stupce koje traži Payload 3.90 (`@payloadcms/storage-s3` uvodi
 * `_objectKey` na upload kolekcijama, `users` dobiva
 * `reset_password_requested_at`). Baza je migration-managed (`push: false`),
 * pa bez ovoga SELECT nad `media` i `documents` puca s
 * `column "_objectkey" does not exist` — a time i svaki upit koji populira
 * media relaciju, uključujući `/api/tenants?depth=2`.
 *
 * Isključivo `ADD COLUMN`: nijedan podatak se ne briše ni ne mijenja.
 * `IF NOT EXISTS` jer `payload migrate:create` uspoređuje shemu s posljednjim
 * `.json` snapshotom, a ručno pisane migracije ga nemaju — generirani dif zato
 * zna ponuditi stupac koji već postoji (npr. `tenants.site_url`, batch 5).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
    ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
    ALTER TABLE "documents" DROP COLUMN IF EXISTS "_objectkey";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
  `)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Čisti ostatke ranijih verzija configa koje su preživjele u bazi jer je shema
 * dugo stizala kroz dev push umjesto kroz migracije.
 *
 * Najvažniji od njih je `equipment.name`: NOT NULL kolona bez defaulta koju
 * config više ne poznaje, zbog čega je unos novog proizvoda pucao na
 * not-null constraintu.
 *
 * Podaci iz obrisanih kolona/tablica izvezeni su prije brisanja
 * (`orphan-data-backup.json`) uz puni `pg_dump` baze.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "equipment" DROP COLUMN IF EXISTS "name";
    ALTER TABLE "equipment" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "caption";
    ALTER TABLE "board_members" DROP COLUMN IF EXISTS "bio";
    ALTER TABLE "roster" DROP COLUMN IF EXISTS "display_order";

    DROP TABLE IF EXISTS "gallery_albums_photos" CASCADE;

    ALTER TABLE "news" DROP COLUMN IF EXISTS "_status";
    DROP TABLE IF EXISTS "_news_v_version_gallery" CASCADE;
    DROP TABLE IF EXISTS "_news_v" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_news_status";
    DROP TYPE IF EXISTS "public"."enum__news_v_version_status";
  `)
}

/**
 * Vraća samo strukturu kolona, ne i sadržaj — obrisani podaci se ne mogu
 * rekonstruirati iz baze. `equipment.name` se namjerno vraća kao nullable:
 * originalni NOT NULL je bio uzrok kvara.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "equipment" ADD COLUMN IF NOT EXISTS "name" varchar;
    ALTER TABLE "equipment" ADD COLUMN IF NOT EXISTS "description" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "caption" varchar;
    ALTER TABLE "board_members" ADD COLUMN IF NOT EXISTS "bio" varchar;
    ALTER TABLE "roster" ADD COLUMN IF NOT EXISTS "display_order" numeric DEFAULT 0;
  `)
}

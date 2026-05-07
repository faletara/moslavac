import pg from "pg";
import { config } from "dotenv";
config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();
  const tenants = await client.query(
    "SELECT id, slug, display_name FROM tenants ORDER BY id",
  );
  console.log("Tenants:");
  for (const t of tenants.rows)
    console.log(`  id=${t.id} slug=${t.slug} name=${t.display_name}`);

  const newsCount = await client.query("SELECT COUNT(*)::int FROM news");
  console.log(`\nNews count: ${newsCount.rows[0].count}`);

  const sample = await client.query(
    "SELECT id, title, slug, published_at, tenant_id FROM news ORDER BY published_at DESC NULLS LAST LIMIT 10",
  );
  for (const n of sample.rows)
    console.log(
      `  id=${n.id} tenant=${n.tenant_id} slug=${n.slug} title=${n.title} pub=${n.published_at}`,
    );
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

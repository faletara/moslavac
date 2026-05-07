import pg from "pg";

const SUPABASE_URL =
  "postgresql://postgres.mqxtpkvwjqplpwouldtm:TU6GEomATYTYJCJx@aws-1-eu-north-1.pooler.supabase.com:5432/postgres";

const client = new pg.Client({
  connectionString: SUPABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const tables = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`,
  );
  console.log("Tables in Supabase:", tables.rows.map((r) => r.table_name));

  const newsCount = await client.query("SELECT COUNT(*)::int FROM news");
  console.log(`\nNews count: ${newsCount.rows[0].count}`);

  if (newsCount.rows[0].count > 0) {
    const sample = await client.query(
      "SELECT id, title, date, tenant_id FROM news ORDER BY date DESC LIMIT 5",
    );
    console.log("\nLatest 5 news titles:");
    for (const r of sample.rows) {
      console.log(
        `  id=${r.id} tenant=${r.tenant_id} date=${r.date?.toISOString?.() ?? r.date} title="${r.title}"`,
      );
    }
  }

  const tenantCount = await client.query("SELECT COUNT(*)::int FROM tenants");
  console.log(`\nTenants count: ${tenantCount.rows[0].count}`);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

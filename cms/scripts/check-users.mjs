import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

const tables = await client.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'users%' ORDER BY table_name",
);
console.log("Users tables:", tables.rows.map((r) => r.table_name));

const users = await client.query(
  "SELECT id, email, created_at FROM users ORDER BY created_at",
);
console.log("\nUsers:");
for (const u of users.rows) {
  console.log(`  id=${u.id} email=${u.email} created_at=${u.created_at}`);
}

const roles = await client.query(
  "SELECT * FROM users_roles ORDER BY parent_id, _order LIMIT 50",
);
console.log("\nUsers roles (users_roles table):");
for (const r of roles.rows) {
  console.log(JSON.stringify(r));
}

await client.end();

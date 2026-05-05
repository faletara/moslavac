import "dotenv/config";
import pg from "pg";

const targetEmail = process.argv[2];
if (!targetEmail) {
  console.error("Usage: node scripts/promote-super-admin.mjs <email>");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

const userRow = await client.query(
  "SELECT id FROM users WHERE email = $1",
  [targetEmail],
);
if (userRow.rows.length === 0) {
  console.error(`No user found with email ${targetEmail}`);
  await client.end();
  process.exit(1);
}
const userId = userRow.rows[0].id;
console.log(`Found user id=${userId}`);

const currentRoles = await client.query(
  'SELECT id, "order", value FROM users_roles WHERE parent_id = $1 ORDER BY "order"',
  [userId],
);
console.log("Current roles:", currentRoles.rows);

await client.query("DELETE FROM users_roles WHERE parent_id = $1", [userId]);
await client.query(
  'INSERT INTO users_roles (parent_id, "order", value) VALUES ($1, 1, $2)',
  [userId, "super-admin"],
);

const newRoles = await client.query(
  'SELECT id, "order", value FROM users_roles WHERE parent_id = $1 ORDER BY "order"',
  [userId],
);
console.log("New roles:", newRoles.rows);

await client.end();
console.log(`✓ User ${targetEmail} promoted to super-admin.`);

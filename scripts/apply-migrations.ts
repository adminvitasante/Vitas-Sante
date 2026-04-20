#!/usr/bin/env tsx
/**
 * Applies every SQL file under supabase/migrations/ in lexical order.
 * Idempotent: each migration uses IF NOT EXISTS / ON CONFLICT guards.
 *
 * Usage:  npx tsx scripts/apply-migrations.ts
 *
 * Env required:
 *   DATABASE_URL  (Supabase direct-connection or pooler URL)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { Client } from "pg";

const MIGRATIONS_DIR = resolve(process.cwd(), "supabase/migrations");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Aborting.");
    process.exit(1);
  }

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.warn("No migrations found.");
    return;
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  try {
    for (const file of files) {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
      console.log(`\n── Applying ${file} ──`);
      try {
        await client.query(sql);
        console.log(`✓ ${file}`);
      } catch (err) {
        console.error(`✗ ${file}:`, (err as Error).message);
        throw err;
      }
    }
    console.log("\n✓ All migrations applied.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

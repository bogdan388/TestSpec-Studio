#!/usr/bin/env node

/**
 * Simple script to run SQL commands on Supabase using SQL Editor API
 * Usage: node scripts/run-sql.mjs path/to/file.sql
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error('❌ Usage: node scripts/run-sql.mjs <sql-file>');
  console.error('\nExample: node scripts/run-sql.mjs fix-auth-trigger-v2.sql');
  process.exit(1);
}

const sqlPath = resolve(sqlFile);
const sql = readFileSync(sqlPath, 'utf8');

console.log(`📄 Reading SQL from: ${sqlFile}`);
console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);
console.log(`📝 SQL length: ${sql.length} characters\n`);
console.log('─'.repeat(60));
console.log(sql.substring(0, 200) + (sql.length > 200 ? '...' : ''));
console.log('─'.repeat(60));
console.log('\n⚠️  IMPORTANT: This script cannot execute SQL directly from CLI.');
console.log('Please copy the SQL above and run it in Supabase SQL Editor:');
console.log(`\n   ${SUPABASE_URL.replace('/rest/v1', '')}/project/_/sql\n`);
console.log('Or get your Service Role Key from Supabase dashboard and add:');
console.log('   SUPABASE_SERVICE_ROLE_KEY=your_key');
console.log('to your .env file for automated execution.\n');

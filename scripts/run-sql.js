#!/usr/bin/env node

/**
 * Simple script to run SQL commands on Supabase
 * Usage: node scripts/run-sql.js path/to/file.sql
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error('❌ Usage: node scripts/run-sql.js <sql-file>');
  process.exit(1);
}

const sqlPath = path.resolve(sqlFile);

if (!fs.existsSync(sqlPath)) {
  console.error(`❌ File not found: ${sqlPath}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

console.log(`📄 Reading SQL from: ${sqlPath}`);
console.log(`🔗 Connecting to: ${SUPABASE_URL}`);
console.log(`📝 SQL length: ${sql.length} characters\n`);

// Execute SQL using Supabase REST API
async function executeSql() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ SQL Execution Failed:');
      console.error(error);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ SQL executed successfully!');
    if (result) {
      console.log('\n📊 Result:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

executeSql();

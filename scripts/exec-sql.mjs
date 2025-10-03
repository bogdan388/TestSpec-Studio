#!/usr/bin/env node

/**
 * Execute SQL on Supabase using service role key
 * Usage: node scripts/exec-sql.mjs path/to/file.sql
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error('❌ Usage: node scripts/exec-sql.mjs <sql-file>');
  console.error('\nExample: node scripts/exec-sql.mjs disable-trigger-temporarily.sql');
  process.exit(1);
}

const sqlPath = resolve(sqlFile);
const sql = readFileSync(sqlPath, 'utf8');

console.log(`📄 Reading SQL from: ${sqlFile}`);
console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);
console.log(`📝 SQL length: ${sql.length} characters\n`);

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Execute SQL using Supabase Management API
async function executeSql() {
  try {
    console.log('⚙️  Executing SQL...\n');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`📌 Statement ${i + 1}/${statements.length}:`);
      console.log(statement.substring(0, 80) + '...\n');

      // Use rpc to execute raw SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });

      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`);
        console.error(error);

        // Try alternative method using REST API directly
        console.log('\n🔄 Trying alternative method...\n');

        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`
          },
          body: JSON.stringify({ sql_query: statement })
        });

        if (!response.ok) {
          console.error('❌ Alternative method also failed');
          console.error(await response.text());
        } else {
          console.log('✅ Statement executed via alternative method');
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
        if (data) {
          console.log('Result:', data);
        }
      }
      console.log('─'.repeat(60));
    }

    console.log('\n✅ SQL execution completed!\n');
  } catch (error) {
    console.error('❌ Execution error:', error.message);
    process.exit(1);
  }
}

executeSql();

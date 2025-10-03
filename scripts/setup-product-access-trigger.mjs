#!/usr/bin/env node
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n📋 Setup Auto Product Access Trigger\n')
console.log('=' .repeat(70))

const sqlFile = join(__dirname, '..', 'setup-auto-product-access.sql')
const sql = readFileSync(sqlFile, 'utf-8')

console.log('\nCopy and run this SQL in your Supabase SQL Editor:')
console.log('=' .repeat(70))
console.log(sql)
console.log('=' .repeat(70))
console.log('\n✅ This will automatically create product_access records with has_access=false for all new signups')
console.log('\n📌 Optional: If you also want to revoke access from existing users, run:')
console.log('   node scripts/revoke-existing-access.mjs\n')

#!/usr/bin/env node
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n👑 Grant Admin Access\n')
console.log('=' .repeat(70))

const sqlFile = join(__dirname, '..', 'grant-admin-access.sql')
const sql = readFileSync(sqlFile, 'utf-8')

console.log('\nCopy and run this SQL in your Supabase SQL Editor:')
console.log('=' .repeat(70))
console.log(sql)
console.log('=' .repeat(70))
console.log('\n✅ This will grant product access to admin@admin.com\n')

#!/usr/bin/env node
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n🔒 Revoke All Existing User Access\n')
console.log('=' .repeat(70))

const sqlFile = join(__dirname, '..', 'revoke-all-existing-access.sql')
const sql = readFileSync(sqlFile, 'utf-8')

console.log('\n⚠️  WARNING: This will revoke access from ALL existing users!')
console.log('Copy and run this SQL in your Supabase SQL Editor:')
console.log('=' .repeat(70))
console.log(sql)
console.log('=' .repeat(70))
console.log('\n💡 After running this, you can grant access to specific users via the Admin Dashboard\n')

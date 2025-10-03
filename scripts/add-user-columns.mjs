#!/usr/bin/env node
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n📋 Add User Profile Columns and Sync\n')
console.log('=' .repeat(70))

const sqlFile = join(__dirname, '..', 'add-user-profile-columns.sql')
const sql = readFileSync(sqlFile, 'utf-8')

console.log('\nCopy and run this SQL in your Supabase SQL Editor:')
console.log('=' .repeat(70))
console.log(sql)
console.log('=' .repeat(70))
console.log('\n✅ This will:')
console.log('   - Add full_name and avatar_url columns to user_profiles')
console.log('   - Create safe sync triggers')
console.log('   - Sync all existing users including Google OAuth users\n')

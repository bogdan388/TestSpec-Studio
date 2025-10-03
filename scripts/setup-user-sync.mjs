#!/usr/bin/env node
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('\n👤 Setup User Profile Sync\n')
console.log('=' .repeat(70))

const sqlFile = join(__dirname, '..', 'create-user-sync-trigger.sql')
const sql = readFileSync(sqlFile, 'utf-8')

console.log('\nCopy and run this SQL in your Supabase SQL Editor:')
console.log('=' .repeat(70))
console.log(sql)
console.log('=' .repeat(70))
console.log('\n✅ This will:')
console.log('   - Create user_profiles table if it doesn\'t exist')
console.log('   - Set up safe triggers that won\'t block authentication')
console.log('   - Sync all existing users to user_profiles')
console.log('   - Auto-sync new Google/email signups\n')

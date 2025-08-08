import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('\nAlternatively, you can run migrations directly in Supabase Dashboard:');
  console.error('1. Go to your Supabase project dashboard');
  console.error('2. Navigate to SQL Editor');
  console.error('3. Copy and paste each migration file content');
  console.error('4. Run each migration in order\n');
  process.exit(1);
}

const MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');

console.log('🗄️  Supabase Migration Runner (Simple Mode)');
console.log('============================================\n');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('📁 Migrations directory:', MIGRATIONS_DIR);
console.log('\n' + '='.repeat(50) + '\n');

const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
  .filter(file => file.endsWith('.sql'))
  .sort();

console.log(`Found ${migrationFiles.length} migration files:\n`);

migrationFiles.forEach((file, index) => {
  const filePath = path.join(MIGRATIONS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').slice(0, 3).join('\n');
  
  console.log(`${index + 1}. ${file}`);
  console.log(`   ${lines.split('\n')[0]}`);
});

console.log('\n' + '='.repeat(50));
console.log('\n⚠️  IMPORTANT: Migrations need to be run manually!\n');
console.log('Since we need admin privileges to create tables and run DDL commands,');
console.log('you have two options to run these migrations:\n');

console.log('OPTION 1: Supabase Dashboard (Recommended)');
console.log('=' .repeat(40));
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to the SQL Editor tab');
console.log('3. For each migration file in order:');
console.log('   a. Copy the contents of the file');
console.log('   b. Paste into the SQL editor');
console.log('   c. Click "Run" to execute\n');

console.log('OPTION 2: Using Supabase CLI');
console.log('=' .repeat(40));
console.log('1. Install Supabase CLI: npm install -g supabase');
console.log('2. Login: supabase login');
console.log('3. Link your project: supabase link --project-ref [your-project-ref]');
console.log('4. Run migrations: supabase db push\n');

console.log('OPTION 3: Direct Database Connection (if available)');
console.log('=' .repeat(40));
console.log('If you have a direct database connection string:');
console.log('1. Set DATABASE_URL in your .env file');
console.log('2. Run: psql $DATABASE_URL -f database/migrations/[filename].sql\n');

console.log('📝 Migration files location:');
migrationFiles.forEach((file) => {
  const fullPath = path.join(MIGRATIONS_DIR, file);
  console.log(`   ${fullPath}`);
});

console.log('\n✅ After running migrations, your vouchers table will be created!');
console.log('\nNOTE: The vouchers table includes:');
console.log('  - Voucher codes and package details');
console.log('  - Purchaser and recipient information');
console.log('  - Status tracking (pending_payment, paid, redeemed, etc.)');
console.log('  - Automatic expiration after 1 year');
console.log('  - Row Level Security for data protection\n');
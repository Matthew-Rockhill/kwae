import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');
const MIGRATIONS_TABLE = 'schema_migrations';

async function ensureMigrationsTable() {
  const { error } = await supabase.rpc('query', {
    query: `
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
  }).single();

  if (error && !error.message.includes('already exists')) {
    const { error: directError } = await supabase.from(MIGRATIONS_TABLE).select('*').limit(1);
    
    if (directError) {
      console.log('📦 Creating migrations tracking table...');
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          query: createTableSQL
        })
      });

      if (!response.ok) {
        console.log('⚠️  Migrations table does not exist. Will track migrations locally.');
        return false;
      }
    }
  }
  
  return true;
}

async function getExecutedMigrations() {
  try {
    const { data, error } = await supabase
      .from(MIGRATIONS_TABLE)
      .select('filename')
      .order('filename');

    if (error) {
      console.log('⚠️  Cannot read migrations table. Assuming no migrations have been run.');
      return [];
    }

    return data.map(row => row.filename);
  } catch (err) {
    return [];
  }
}

async function runMigration(filename, sql) {
  console.log(`\n🚀 Running migration: ${filename}`);
  
  const statements = sql
    .split(/;\s*$/m)
    .filter(stmt => stmt.trim().length > 0)
    .map(stmt => stmt.trim() + ';');

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    if (statement.trim().startsWith('--') || statement.trim().length === 0) {
      continue;
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: statement
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (errorText.includes('already exists') || 
            errorText.includes('duplicate') ||
            errorText.includes('violates unique constraint')) {
          console.log(`   ⚠️  Object already exists (skipping)`);
        } else {
          console.error(`   ❌ Error in statement ${i + 1}:`, errorText);
          throw new Error(errorText);
        }
      } else {
        console.log(`   ✅ Statement ${i + 1}/${statements.length} executed`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to execute statement ${i + 1}:`, error.message);
      throw error;
    }
  }

  try {
    const { error: trackError } = await supabase
      .from(MIGRATIONS_TABLE)
      .insert({ filename });

    if (trackError && !trackError.message.includes('duplicate')) {
      console.log(`   ⚠️  Migration executed but not tracked: ${trackError.message}`);
    }
  } catch (err) {
    console.log(`   ⚠️  Migration executed but tracking failed`);
  }

  console.log(`✅ Migration completed: ${filename}`);
}

async function runAllMigrations() {
  console.log('🔄 Starting database migrations...\n');

  const hasTrackingTable = await ensureMigrationsTable();
  const executedMigrations = hasTrackingTable ? await getExecutedMigrations() : [];

  const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`📁 Found ${migrationFiles.length} migration files`);
  console.log(`✅ ${executedMigrations.length} migrations already executed\n`);

  let migrationsRun = 0;
  let migrationsSkipped = 0;
  let migrationsFailed = 0;

  for (const file of migrationFiles) {
    if (executedMigrations.includes(file)) {
      console.log(`⏭️  Skipping: ${file} (already executed)`);
      migrationsSkipped++;
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await runMigration(file, sql);
      migrationsRun++;
    } catch (error) {
      console.error(`\n❌ Migration failed: ${file}`);
      console.error(error.message);
      migrationsFailed++;
      
      const answer = await new Promise(resolve => {
        console.log('\nDo you want to continue with remaining migrations? (y/n): ');
        process.stdin.once('data', data => {
          resolve(data.toString().trim().toLowerCase());
        });
      });

      if (answer !== 'y') {
        break;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Executed: ${migrationsRun}`);
  console.log(`   ⏭️  Skipped: ${migrationsSkipped}`);
  console.log(`   ❌ Failed: ${migrationsFailed}`);
  console.log('='.repeat(50) + '\n');

  if (migrationsFailed > 0) {
    console.log('⚠️  Some migrations failed. Please check the errors above.');
    process.exit(1);
  } else if (migrationsRun === 0) {
    console.log('✨ Database is already up to date!');
  } else {
    console.log('🎉 All migrations completed successfully!');
  }
}

console.log('🗄️  Supabase Migration Runner');
console.log('================================\n');

runAllMigrations()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });
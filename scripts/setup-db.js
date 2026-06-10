/**
 * Database Setup Script for TambakAI
 * Run this with: node scripts/setup-db.js
 */

import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'tambakai_db',
  user: process.env.DB_USER || 'tambakai_user',
  password: process.env.DB_PASSWORD,
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔌 Connected to PostgreSQL');

    // Read schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Reading schema file...');

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip empty statements or comments-only
      if (!statement || statement.startsWith('--')) continue;

      try {
        await client.query(statement);
        console.log(`✅ (${i + 1}/${statements.length}) Executed`);
      } catch (err) {
        // Some errors are OK (e.g., extension already exists)
        if (err.message.includes('already exists')) {
          console.log(`⏭️  (${i + 1}/${statements.length}) Skipped (already exists)`);
        } else {
          console.error(`❌ (${i + 1}/${statements.length}) Error:`, err.message);
        }
      }
    }

    console.log('\n✨ Database setup completed successfully!');
    console.log('\n📊 Tables created:');

    // List tables
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    tables.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();

/**
 * Simple Database Setup Script for Si Tambak
 * Creates database, user, and tables automatically
 * Run: node scripts/setup-db-simple.js
 */

import pg from 'pg';

const { Pool } = pg;

// Read password from env or use default
const POSTGRES_PASSWORD = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'tambakai123';

console.log('Connecting to PostgreSQL...');

// Default connection to PostgreSQL (no database specified)
const defaultPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: 'postgres', // Default database
  user: process.env.DB_USER || 'postgres',
  password: POSTGRES_PASSWORD || '', // Use environment variable
});

async function setupDatabase() {
  const client = await defaultPool.connect();

  try {
    console.log('✅ Connected to PostgreSQL\n');

    // 1. Create database if not exists
    console.log('📦 Creating database...');
    try {
      await client.query('CREATE DATABASE tambakai_db');
      console.log('✅ Database tambakai_db created');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('⏭️  Database tambakai_db already exists');
      } else {
        throw err;
      }
    }

    // 2. Create user if not exists
    console.log('\n👤 Creating user...');
    try {
      await client.query(`CREATE USER tambakai_user WITH PASSWORD '${DB_PASSWORD}'`);
      console.log(`✅ User tambakai_user created (password: ${DB_PASSWORD})`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('⏭️  User tambakai_user already exists');
        // Update password
        try {
          await client.query(`ALTER USER tambakai_user WITH PASSWORD '${DB_PASSWORD}'`);
          console.log('✅ Password updated for tambakai_user');
        } catch (e) { /* ignore */ }
      } else {
        throw err;
      }
    }

    // Grant privileges
    await client.query('GRANT ALL PRIVILEGES ON DATABASE tambakai_db TO tambakai_user');
    console.log('✅ Privileges granted');

    // Close default connection
    client.release();

    // 3. Connect to tambakai_db and create tables
    console.log('\n📋 Creating tables...');
    const dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: 'tambakai_db',
      user: 'tambakai_user',
      password: DB_PASSWORD,
    });

    const dbClient = await dbPool.connect();

    // Create extension
    await dbClient.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension created');

    // Create ENUMs
    try {
      await dbClient.query(`DROP TYPE IF EXISTS cuaca_enum CASCADE`);
      await dbClient.query(`CREATE TYPE cuaca_enum AS ENUM ('Cerah', 'Berawan', 'Hujan', 'Badai')`);
      console.log('✅ cuaca_enum created');
    } catch (e) { console.log('  (skipped cuaca_enum)'); }

    try {
      await dbClient.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);
      await dbClient.query(`CREATE TYPE user_role_enum AS ENUM ('USER', 'ADMIN')`);
      console.log('✅ user_role_enum created');
    } catch (e) { console.log('  (skipped user_role_enum)'); }

    // Drop existing tables (for clean setup)
    console.log('\n🗑️  Dropping existing tables if any...');
    await dbClient.query(`DROP TABLE IF EXISTS recommendations CASCADE`);
    await dbClient.query(`DROP TABLE IF EXISTS species_types CASCADE`);
    await dbClient.query(`DROP TABLE IF EXISTS tambak CASCADE`);
    await dbClient.query(`DROP TABLE IF EXISTS users CASCADE`);
    console.log('✅ Old tables dropped');

    // Create users table
    await dbClient.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role user_role_enum DEFAULT 'USER',
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ users table created');

    // Create tambak table
    await dbClient.query(`
      CREATE TABLE tambak (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        volume_air DECIMAL(10,2) NOT NULL,
        location_lat DECIMAL(10, 8),
        location_long DECIMAL(11, 8),
        deleted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT tambak_volume_positive CHECK (volume_air > 0)
      )
    `);
    console.log('✅ tambak table created');

    // Create species_types table
    await dbClient.query(`
      CREATE TABLE species_types (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(50) UNIQUE NOT NULL,
        nama_ilmiah VARCHAR(100),
        fcr DECIMAL(3,2) NOT NULL,
        growth_rate DECIMAL(5,4) NOT NULL,
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ species_types table created');

    // Insert default species
    await dbClient.query(`
      INSERT INTO species_types (nama, nama_ilmiah, fcr, growth_rate, deskripsi) VALUES
      ('Vannamei', 'Litopenaeus vannamei', 1.2, 0.0015, 'Udang vanamei - spesies paling populer'),
      ('Monodon', 'Penaeus monodon', 1.5, 0.0012, 'Udang tiger windu - ukuran besar'),
      ('Lainnya', 'Other species', 1.4, 0.0013, 'Spesies udang lainnya')
    `);
    console.log('✅ Default species data inserted');

    // Create recommendations table
    await dbClient.query(`
      CREATE TABLE recommendations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tambak_id INTEGER REFERENCES tambak(id) ON DELETE SET NULL,
        ph_air DECIMAL(4,2) NOT NULL,
        suhu_air DECIMAL(5,2) NOT NULL,
        cuaca cuaca_enum NOT NULL,
        volume_air DECIMAL(10,2) NOT NULL,
        species_id INTEGER REFERENCES species_types(id),
        jumlah_udang INTEGER NOT NULL,
        usia_udang INTEGER NOT NULL,
        kuantitas_pakan DECIMAL(10,2) NOT NULL,
        jadwal_pemberian JSONB NOT NULL,
        penjelasan TEXT NOT NULL,
        faktor_koreksi DECIMAL(4,3),
        biomassa_kg DECIMAL(10,2),
        feeding_rate_persen DECIMAL(5,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT rec_ph_range CHECK (ph_air >= 0 AND ph_air <= 14),
        CONSTRAINT rec_suhu_range CHECK (suhu_air >= 0 AND suhu_air <= 50),
        CONSTRAINT rec_volume_positive CHECK (volume_air > 0),
        CONSTRAINT rec_jumlah_positive CHECK (jumlah_udang > 0),
        CONSTRAINT rec_usia_range CHECK (usia_udang >= 1 AND usia_udang <= 365)
      )
    `);
    console.log('✅ recommendations table created');

    // Create indexes
    await dbClient.query('CREATE INDEX idx_users_email ON users(email)');
    await dbClient.query('CREATE INDEX idx_tambak_user_id ON tambak(user_id)');
    await dbClient.query('CREATE INDEX idx_recommendations_user_id ON recommendations(user_id)');
    await dbClient.query('CREATE INDEX idx_recommendations_tambak_id ON recommendations(tambak_id)');
    await dbClient.query('CREATE INDEX idx_recommendations_species_id ON recommendations(species_id)');
    console.log('✅ Indexes created');

    dbClient.release();
    await dbPool.end();

    console.log('\n✨ Database setup completed successfully!');
    console.log('\n📝 Update your .env.local with:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_PORT=5432');
    console.log('   DB_NAME=tambakai_db');
    console.log('   DB_USER=tambakai_user');
    console.log('   DB_PASSWORD=' + DB_PASSWORD);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Tip: Jika postgres membutuhkan password, jalankan:');
    console.error('   set PGPASSWORD=your_postgres_password');
    console.error('   node scripts/setup-db-simple.js');
  } finally {
    try { client.release(); } catch(e) {}
    try { await defaultPool.end(); } catch(e) {}
  }
}

setupDatabase();

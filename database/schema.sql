-- ============================================
-- Si Tambak Database Schema (Optimized & Production-Ready)
-- Version: 2.0
-- ============================================

-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS for data integrity
-- ============================================
CREATE TYPE cuaca_enum AS ENUM ('Cerah', 'Berawan', 'Hujan', 'Badai');
CREATE TYPE user_role_enum AS ENUM ('USER', 'ADMIN');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = TRUE;

-- ============================================
-- TAMBAK (PONDS) TABLE
-- ============================================
CREATE TABLE tambak (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  volume_air DECIMAL(10,2) NOT NULL, -- in m³
  location_lat DECIMAL(10, 8),        -- Latitude for GPS
  location_long DECIMAL(11, 8),       -- Longitude for GPS
  deleted_at TIMESTAMP,                -- Soft delete
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT tambak_volume_positive CHECK (volume_air > 0)
);

-- Indexes for tambak
CREATE INDEX idx_tambak_user_id ON tambak(user_id);
CREATE INDEX idx_tambak_deleted_at ON tambak(deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- SPECIES/SHRIMP TYPES (Master Data)
-- ============================================
CREATE TABLE species_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(50) UNIQUE NOT NULL,
  nama_ilmiah VARCHAR(100),
  fcr DECIMAL(3,2) NOT NULL,           -- Feed Conversion Ratio
  growth_rate DECIMAL(5,4) NOT NULL,    -- Growth rate per day
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default species data (Vannamei only)
INSERT INTO species_types (nama, nama_ilmiah, fcr, growth_rate, deskripsi) VALUES
('Vannamei', 'Litopenaeus vannamei', 1.2, 0.0015, 'Udang vannamei - spesies utama untuk budidaya');

-- ============================================
-- RECOMMENDATIONS TABLE
-- ============================================
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tambak_id UUID REFERENCES tambak(id) ON DELETE SET NULL,

  -- Input Parameters (Snapshot data - intentionally stored)
  ph_air DECIMAL(4,2) NOT NULL,
  suhu_air DECIMAL(5,2) NOT NULL,
  cuaca cuaca_enum NOT NULL,
  volume_air DECIMAL(10,2) NOT NULL,
  species_id UUID REFERENCES species_types(id),  -- Normalized!
  jumlah_udang INTEGER NOT NULL,
  usia_udang INTEGER NOT NULL,

  -- Output Results
  kuantitas_pakan DECIMAL(10,2) NOT NULL,
  jadwal_pemberian JSONB NOT NULL,
  penjelasan TEXT NOT NULL,

  -- Additional fields
  faktor_koreksi DECIMAL(4,3),        -- Additional analysis
  biomassa_kg DECIMAL(10,2),
  feeding_rate_persen DECIMAL(5,2),
  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT rec_ph_range CHECK (ph_air >= 0 AND ph_air <= 14),
  CONSTRAINT rec_suhu_range CHECK (suhu_air >= 0 AND suhu_air <= 50),
  CONSTRAINT rec_volume_positive CHECK (volume_air > 0),
  CONSTRAINT rec_jumlah_positive CHECK (jumlah_udang > 0),
  CONSTRAINT rec_usia_range CHECK (usia_udang >= 1 AND usia_udang <= 365)
);

-- Indexes for recommendations
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_tambak_id ON recommendations(tambak_id);
CREATE INDEX idx_recommendations_created_at ON recommendations(created_at DESC);
CREATE INDEX idx_recommendations_species_id ON recommendations(species_id);

-- Partial index for active tambak only
CREATE INDEX idx_recommendations_active ON recommendations(user_id, created_at DESC)
WHERE tambak_id IS NOT NULL;

-- ============================================
-- FEEDING_LOGS (Optional - Track actual feeding)
-- ============================================
CREATE TABLE feeding_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recommendation_id UUID REFERENCES recommendations(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  waktu_jadwal VARCHAR(5) NOT NULL,  -- '06:00', '12:00', '18:00'
  jumlah_rekomendasi DECIMAL(10,2) NOT NULL,
  jumlah_aktual DECIMAL(10,2),        -- Actual feed given
  selisih DECIMAL(10,2),              -- Difference
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- AUDIT LOG (Optional - Track all changes)
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,        -- 'CREATE', 'UPDATE', 'DELETE'
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for audit queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tambak_updated_at
  BEFORE UPDATE ON tambak
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS (Common Queries)
-- ============================================

-- View: User summary with tambak count
CREATE VIEW user_summary AS
SELECT
  u.id,
  u.username,
  u.email,
  u.full_name,
  u.role,
  u.is_active,
  COUNT(DISTINCT t.id) FILTER (WHERE t.deleted_at IS NULL) as total_tambak,
  COUNT(r.id) as total_recommendations,
  u.created_at
FROM users u
LEFT JOIN tambak t ON u.id = t.user_id
LEFT JOIN recommendations r ON u.id = r.user_id
GROUP BY u.id;

-- View: Recommendation with full details
CREATE VIEW recommendation_details AS
SELECT
  r.id,
  r.created_at,
  u.username,
  u.email,
  t.name as tambak_name,
  r.ph_air,
  r.suhu_air,
  r.cuaca::text,
  s.nama as species_name,
  r.jumlah_udang,
  r.usia_udang,
  r.kuantitas_pakan,
  r.faktor_koreksi,
  r.biomassa_kg
FROM recommendations r
JOIN users u ON r.user_id = u.id
LEFT JOIN tambak t ON r.tambak_id = t.id
LEFT JOIN species_types s ON r.species_id = s.id;

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert test user (password: 'password123')
-- Note: In production, use bcrypt to generate proper hash
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES ('testuser', 'test@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'Test User', 'USER');

-- ============================================
-- GRANT PERMISSIONS (adjust as needed)
-- ============================================

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tambakai_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tambakai_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO tambakai_user;

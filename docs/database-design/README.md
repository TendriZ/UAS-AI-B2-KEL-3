# Database Design Documentation - TambakAI

Documentation for Conceptual Data Model (CDM) and Physical Data Model (PDM) of the TambakAI system.

## 📊 Overview

TambakAI database consists of 6 main tables:
- **users** - User authentication and profiles
- **tambak** - Shrimp pond information (with soft delete)
- **species_types** - Master data for **Vannamei** shrimp parameters
- **recommendations** - Feed calculation results and history
- **feeding_logs** - Actual feeding records (optional)
- **audit_logs** - System activity tracking (optional)

> **Note:** Sistem ini dirancang khusus untuk budidaya **Udang Vannamei** (*Litopenaeus vannamei*)

## 📁 Files

| File | Description |
|------|-------------|
| `cdm-plantuml.puml` | Conceptual Data Model (High-level entities and relationships) |
| `pdm-plantuml.puml` | Physical Data Model (Detailed tables, columns, data types) |
| `erd-simple.puml` | Simplified ERD for quick reference (4 main tables only) |
| `README.md` | This documentation file |

## 🛠️ How to Generate Diagrams

### Option 1: PlantUML CLI (Recommended)

```bash
# Install PlantUML
# Download from: https://plantuml.com/download

# Generate CDM diagram
java -jar plantuml.jar docs/database-design/cdm-plantuml.puml

# Generate PDM diagram
java -jar plantuml.jar docs/database-design/pdm-plantuml.puml
```

### Option 2: Online PlantUML Editor

1. Go to [PlantUML Online Editor](https://plantuml.com/online)
2. Copy the contents of `cdm-plantuml.puml` or `pdm-plantuml.puml`
3. Paste and click "Submit" to generate the diagram

### Option 3: VS Code Extension

1. Install [PlantUML extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
2. Open the `.puml` file
3. Press `Alt+D` to preview

### Option 4: Intellij IDEA

1. Built-in PlantUML support
2. Right-click `.puml` file → "Show PlantUML Diagram"

## 📐 Diagram Descriptions

### Conceptual Data Model (CDM)

The CDM shows:
- **High-level entities** without implementation details
- **Relationships** between entities (one-to-one, one-to-many)
- **Business concepts** in simple terms

```
User ──owns──> Tambak ──has──> Recommendation
User ──creates──> Recommendation
Species ──used in──> Recommendation
```

### Physical Data Model (PDM)

The PDM shows:
- **Table definitions** with all columns
- **Data types** (UUID, VARCHAR, DECIMAL, JSONB, etc.)
- **Constraints** (PRIMARY KEY, FOREIGN KEY, CHECK, UNIQUE)
- **Indexes** for query optimization
- **Enums** for data integrity
- **Views** for common queries
- **Triggers** for automatic timestamp updates

## 🗂️ Entity Relationships

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│   Tambak    │  │Recommendation│
└──────┬──────┘  └──────┬───────┘
       │                │
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│   (none)    │  │Feeding Logs  │
└─────────────┘  └──────────────┘

┌──────────────┐
│ Species Types│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Recommendation│
└──────────────┘
```

## 📋 Table Details

### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| full_name | VARCHAR(100) | User's full name |
| role | user_role_enum | USER or ADMIN |
| is_active | BOOLEAN | Active status |
| email_verified | BOOLEAN | Email verification status |
| last_login_at | TIMESTAMP | Last login timestamp |

### tambak
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| name | VARCHAR(100) | Pond name |
| description | TEXT | Optional description |
| volume_air | DECIMAL(10,2) | Water volume in m³ |
| location_lat | DECIMAL(10,8) | GPS latitude |
| location_long | DECIMAL(11,8) | GPS longitude |
| deleted_at | TIMESTAMP | Soft delete timestamp |

### species_types
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| nama | VARCHAR(50) | Species name (Vannamei only) |
| nama_ilmiah | VARCHAR(100) | Scientific name (Litopenaeus vannamei) |
| fcr | DECIMAL(3,2) | Feed Conversion Ratio (1.2) |
| growth_rate | DECIMAL(5,4) | Daily growth rate (0.0015) |
| deskripsi | TEXT | Description |

> **Default data:** Vannamei dengan FCR=1.2, growth_rate=0.0015

### recommendations
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| tambak_id | UUID | Foreign key to tambak (nullable) |
| species_id | UUID | Foreign key to species_types |
| ph_air | DECIMAL(4,2) | pH level input |
| suhu_air | DECIMAL(5,2) | Temperature input |
| cuaca | cuaca_enum | Weather condition |
| volume_air | DECIMAL(10,2) | Water volume |
| jumlah_udang | INTEGER | Shrimp count |
| usia_udang | INTEGER | Shrimp age in days |
| kuantitas_pakan | DECIMAL(10,2) | Calculated feed amount |
| jadwal_pemberian | JSONB | Feeding schedule |
| penjelasan | TEXT | Explanation text |
| faktor_koreksi | DECIMAL(4,3) | Correction factor |
| biomassa_kg | DECIMAL(10,2) | Calculated biomass |
| feeding_rate_persen | DECIMAL(5,2) | Feeding rate percentage |

### feeding_logs (Optional)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| recommendation_id | UUID | Reference to recommendation |
| tanggal | DATE | Feeding date |
| waktu_jadwal | VARCHAR(5) | Scheduled time (06:00, 12:00, 18:00) |
| jumlah_rekomendasi | DECIMAL(10,2) | Recommended amount |
| jumlah_aktual | DECIMAL(10,2) | Actual amount given |
| selisih | DECIMAL(10,2) | Difference |

### audit_logs (Optional)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users (nullable) |
| action | VARCHAR(50) | CREATE, UPDATE, DELETE |
| table_name | VARCHAR(50) | Table affected |
| record_id | UUID | Record affected |
| old_data | JSONB | Previous values |
| new_data | JSONB | New values |
| ip_address | VARCHAR(45) | User IP address |
| user_agent | TEXT | Browser info |

## 🔍 Constraints & Validations

### Check Constraints
- `tambak_volume_positive`: volume_air > 0
- `rec_ph_range`: ph_air BETWEEN 0 AND 14
- `rec_suhu_range`: suhu_air BETWEEN 0 AND 50
- `rec_volume_positive`: volume_air > 0
- `rec_jumlah_positive`: jumlah_udang > 0
- `rec_usia_range`: usia_udang BETWEEN 1 AND 365

### Foreign Key Actions
- **CASCADE**: users → tambak, users → recommendations
- **SET NULL**: recommendations → tambak, audit_logs → users

## 📈 Indexes

| Table | Index | Type | Notes |
|-------|-------|------|-------|
| users | idx_users_email | B-tree | On email column |
| users | idx_users_username | B-tree | On username column |
| tambak | idx_tambak_user_id | B-tree | On user_id |
| tambak | idx_tambak_deleted_at | Partial | WHERE deleted_at IS NULL |
| recommendations | idx_recommendations_user_id | B-tree | On user_id |
| recommendations | idx_recommendations_tambak_id | B-tree | On tambak_id |
| recommendations | idx_recommendations_created_at | B-tree | DESC order |

## 🔄 Triggers

### `update_updated_at_column()`
Automatically updates the `updated_at` timestamp:
- **Tables**: users, tambak
- **Event**: BEFORE UPDATE

## 📝 Views

### `user_summary`
Aggregates user statistics:
- Total tambak count
- Total recommendations count

### `recommendation_details`
Full recommendation details with:
- User information
- Tambak name
- Species name
- All calculation parameters

## 🎨 Sample Output

When rendered, the diagrams will show:

**CDM**: Clean conceptual view with:
- 5 main entities
- Relationship cardinalities
- Business-focused descriptions

**PDM**: Detailed technical view with:
- All 6 tables + 2 views
- Column data types
- Indexes and constraints
- ENUM definitions
- Trigger information

## 📚 Additional Resources

- [PlantUML Documentation](https://plantuml.com/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Database Schema File](../../database/schema.sql)

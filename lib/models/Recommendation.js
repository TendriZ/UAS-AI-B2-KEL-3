/**
 * Recommendation Model (Updated for Schema v2.0)
 * Handles shrimp feed recommendations with UUID and species_id
 */

import { query } from '@/lib/db.js';

class Recommendation {
  static async create(data) {
    const {
      user_id, tambak_id, species_id,
      ph_air, suhu_air, cuaca, volume_air,
      jumlah_udang, usia_udang,
      kuantitas_pakan, jadwal_pemberian, penjelasan,
      faktor_koreksi, biomassa_kg, feeding_rate_persen,
      notes
    } = data;

    const sql = `
      INSERT INTO recommendations (
        user_id, tambak_id, species_id,
        ph_air, suhu_air, cuaca, volume_air,
        jumlah_udang, usia_udang,
        kuantitas_pakan, jadwal_pemberian, penjelasan,
        faktor_koreksi, biomassa_kg, feeding_rate_persen,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6::cuaca_enum, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    const values = [
      user_id, tambak_id, species_id,
      ph_air, suhu_air, cuaca, volume_air,
      jumlah_udang, usia_udang,
      kuantitas_pakan, JSON.stringify(jadwal_pemberian), penjelasan,
      faktor_koreksi, biomassa_kg, feeding_rate_persen,
      notes
    ];
    const result = await query(sql, values);
    return result.rows[0];
  }

  static async findByUserId(user_id, { page = 1, limit = 10, tambak_id, species_id } = {}) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT r.*, s.nama as species_name, s.nama_ilmiah, t.name as tambak_name
      FROM recommendations r
      LEFT JOIN species_types s ON r.species_id = s.id
      LEFT JOIN tambak t ON r.tambak_id = t.id
      WHERE r.user_id = $1
    `;
    const params = [user_id];
    let paramCount = 1;

    if (tambak_id) {
      paramCount++;
      sql += ` AND r.tambak_id = $${paramCount}`;
      params.push(tambak_id);
    }

    if (species_id) {
      paramCount++;
      sql += ` AND r.species_id = $${paramCount}`;
      params.push(species_id);
    }

    sql += ` ORDER BY r.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  }

  static async findById(id, user_id) {
    const sql = `
      SELECT r.*, s.nama as species_name, s.nama_ilmiah, s.fcr, s.growth_rate,
             t.name as tambak_name, t.volume_air as tambak_volume
      FROM recommendations r
      LEFT JOIN species_types s ON r.species_id = s.id
      LEFT JOIN tambak t ON r.tambak_id = t.id
      WHERE r.id = $1 AND r.user_id = $2
    `;
    const result = await query(sql, [id, user_id]);
    return result.rows[0];
  }

  static async delete(id, user_id) {
    const sql = 'DELETE FROM recommendations WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await query(sql, [id, user_id]);
    return result.rows[0];
  }

  static async findByTambakId(tambak_id, user_id) {
    const sql = `
      SELECT r.*, s.nama as species_name
      FROM recommendations r
      LEFT JOIN species_types s ON r.species_id = s.id
      WHERE r.tambak_id = $1 AND r.user_id = $2
      ORDER BY r.created_at DESC
    `;
    const result = await query(sql, [tambak_id, user_id]);
    return result.rows;
  }

  static async getStats(user_id) {
    const sql = `
      SELECT
        COUNT(*) as total_recommendations,
        COUNT(DISTINCT tambak_id) as total_tambak_used,
        COUNT(DISTINCT species_id) as total_species_used,
        AVG(kuantitas_pakan) as avg_daily_feed,
        MAX(created_at) as last_calculation
      FROM recommendations
      WHERE user_id = $1
    `;
    const result = await query(sql, [user_id]);
    return result.rows[0];
  }

  static async getRecentFeedChart(user_id, days = 7) {
    const sql = `
      SELECT
        DATE(created_at) as feed_date,
        SUM(kuantitas_pakan) as total_feed,
        COUNT(*) as recommendation_count
      FROM recommendations
      WHERE user_id = $1
        AND created_at >= CURRENT_DATE - INTERVAL '1 day' * $2
      GROUP BY DATE(created_at)
      ORDER BY feed_date DESC
    `;
    const result = await query(sql, [user_id, days]);
    return result.rows;
  }
}

export default Recommendation;

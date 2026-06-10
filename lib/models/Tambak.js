/**
 * Tambak (Pond) Model (Updated for Schema v2.0)
 * Handles shrimp pond management with UUID support
 */

import { query } from '@/lib/db.js';

class Tambak {
  static async create({ user_id, name, description, volume_air, location_lat, location_long }) {
    const sql = `
      INSERT INTO tambak (user_id, name, description, volume_air, location_lat, location_long)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await query(sql, [user_id, name, description, volume_air, location_lat, location_long]);
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const sql = `
      SELECT * FROM tambak
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await query(sql, [user_id]);
    return result.rows;
  }

  static async findById(id, user_id) {
    const sql = `
      SELECT * FROM tambak
      WHERE id = $1 AND ($2::uuid IS NULL OR user_id = $2) AND deleted_at IS NULL
    `;
    const result = await query(sql, [id, user_id]);
    return result.rows[0];
  }

  static async update(id, user_id, updates) {
    const { name, description, volume_air, location_lat, location_long } = updates;
    const sql = `
      UPDATE tambak
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          volume_air = COALESCE($3, volume_air),
          location_lat = COALESCE($4, location_lat),
          location_long = COALESCE($5, location_long),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await query(sql, [name, description, volume_air, location_lat, location_long, id, user_id]);
    return result.rows[0];
  }

  static async softDelete(id, user_id) {
    const sql = `
      UPDATE tambak
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING *
    `;
    const result = await query(sql, [id, user_id]);
    return result.rows[0];
  }

  static async hardDelete(id, user_id) {
    // Permanently delete a tambak (admin only or with confirmation)
    const sql = `
      DELETE FROM tambak
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await query(sql, [id, user_id]);
    return result.rows[0];
  }

  static async getStats(user_id) {
    const sql = `
      SELECT
        COUNT(*) FILTER (WHERE deleted_at IS NULL) as total_active,
        SUM(volume_air) FILTER (WHERE deleted_at IS NULL) as total_volume,
        COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as total_deleted
      FROM tambak
      WHERE user_id = $1
    `;
    const result = await query(sql, [user_id]);
    return result.rows[0];
  }
}

export default Tambak;

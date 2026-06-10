/**
 * Species Types Model (New for Schema v2.0)
 * Master data management for shrimp species
 */

import { query } from '@/lib/db.js';

class SpeciesTypes {
  static async getAll() {
    const sql = 'SELECT * FROM species_types ORDER BY nama';
    const result = await query(sql);
    return result.rows;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM species_types WHERE id = $1';
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async findByName(nama) {
    const sql = 'SELECT * FROM species_types WHERE nama = $1';
    const result = await query(sql, [nama]);
    return result.rows[0];
  }

  static async create({ nama, nama_ilmiah, fcr, growth_rate, deskripsi }) {
    const sql = `
      INSERT INTO species_types (nama, nama_ilmiah, fcr, growth_rate, deskripsi)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(sql, [nama, nama_ilmiah, fcr, growth_rate, deskripsi]);
    return result.rows[0];
  }

  static async update(id, updates) {
    const { nama, nama_ilmiah, fcr, growth_rate, deskripsi } = updates;
    const sql = `
      UPDATE species_types
      SET nama = COALESCE($1, nama),
          nama_ilmiah = COALESCE($2, nama_ilmiah),
          fcr = COALESCE($3, fcr),
          growth_rate = COALESCE($4, growth_rate),
          deskripsi = COALESCE($5, deskripsi)
      WHERE id = $6
      RETURNING *
    `;
    const result = await query(sql, [nama, nama_ilmiah, fcr, growth_rate, deskripsi, id]);
    return result.rows[0];
  }

  static async delete(id) {
    // Check if referenced by recommendations
    const checkSql = 'SELECT COUNT(*) as count FROM recommendations WHERE species_id = $1';
    const checkResult = await query(checkSql, [id]);

    if (parseInt(checkResult.rows[0].count) > 0) {
      throw new Error('Cannot delete species type that is referenced by recommendations');
    }

    const sql = 'DELETE FROM species_types WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  // Initialize default species if table is empty
  static async initializeDefaults() {
    const existing = await this.getAll();
    if (existing.length > 0) {
      return existing; // Already initialized
    }

    const defaults = [
      {
        nama: 'Vannamei',
        nama_ilmiah: 'Litopenaeus vannamei',
        fcr: 1.2,
        growth_rate: 0.0015,
        deskripsi: 'Udang vanamei - spesies paling populer'
      },
      {
        nama: 'Monodon',
        nama_ilmiah: 'Penaeus monodon',
        fcr: 1.5,
        growth_rate: 0.0012,
        deskripsi: 'Udang tiger windu - ukuran besar'
      },
      {
        nama: 'Lainnya',
        nama_ilmiah: 'Other species',
        fcr: 1.4,
        growth_rate: 0.0013,
        deskripsi: 'Spesies udang lainnya'
      }
    ];

    const results = [];
    for (const species of defaults) {
      const created = await this.create(species);
      results.push(created);
    }

    return results;
  }
}

export default SpeciesTypes;

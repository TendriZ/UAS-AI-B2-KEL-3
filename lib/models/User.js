/**
 * User Model (Updated for Schema v2.0)
 * Handles user authentication and profile management with UUID
 */

import { query } from '@/lib/db.js';
import { hashPassword, comparePassword } from '@/lib/utils/password.js';

class User {
  static async create({ username, email, password, full_name, role = 'USER' }) {
    const password_hash = await hashPassword(password);
    const sql = `
      INSERT INTO users (username, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5::user_role_enum)
      RETURNING id, username, email, full_name, role, is_active, email_verified, created_at
    `;
    const result = await query(sql, [username, email, password_hash, full_name, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1 AND is_active = TRUE';
    const result = await query(sql, [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = $1 AND is_active = TRUE';
    const result = await query(sql, [username]);
    return result.rows[0];
  }

  static async findById(id) {
    const sql = `
      SELECT id, username, email, full_name, role, is_active, email_verified,
             last_login_at, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async verifyPassword(user, plainPassword) {
    return await comparePassword(plainPassword, user.password_hash);
  }

  static async updateProfile(id, updates) {
    const { full_name, email } = updates;
    const sql = `
      UPDATE users
      SET full_name = COALESCE($1, full_name),
          email = COALESCE($2, email),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, username, email, full_name, role, is_active, created_at, updated_at
    `;
    const result = await query(sql, [full_name, email, id]);
    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const password_hash = await hashPassword(newPassword);
    const sql = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    await query(sql, [password_hash, id]);
  }

  static async updateLastLogin(id) {
    const sql = `
      UPDATE users
      SET last_login_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await query(sql, [id]);
  }

  static async deactivate(id) {
    const sql = `
      UPDATE users
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, username, email
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async list({ page = 1, limit = 20, role } = {}) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT id, username, email, full_name, role, is_active, email_verified,
             last_login_at, created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (role) {
      paramCount++;
      sql += ` AND role = $${paramCount}`;
      params.push(role);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  }
}

export default User;

/**
 * PostgreSQL User Model
 * Encapsulates data storage and CRUD operations for Users using PostgreSQL database.
 */

const db = require('../db/db');

function formatUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    role: row.role,
    phone: row.phone,
    profile_image_url: row.profile_image_url,
    is_active: row.is_active,
    is_verified: row.is_verified,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

function parseName(name, fallbackFirst = '', fallbackLast = '') {
  if (!name) return { firstName: fallbackFirst, lastName: fallbackLast };
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: fallbackLast || parts[0] };
  }
  const lastName = parts.pop();
  const firstName = parts.join(' ');
  return { firstName, lastName };
}

function normalizeRole(role) {
  if (!role) return 'alumni';
  const r = role.toLowerCase().replace(/[\s-]/g, '_');
  if (['alumni', 'student', 'academic_staff', 'admin'].includes(r)) {
    return r;
  }
  return 'alumni';
}

const UserModel = {
  /**
   * Retrieve all users, optionally sorted by a specific field and order.
   */
  async getAll({ sortBy = 'id', order = 'asc' } = {}) {
    const validSortFields = {
      id: 'id',
      name: 'first_name',
      email: 'email',
      role: 'role',
      createdat: 'created_at',
      created_at: 'created_at'
    };

    const sortColumn = validSortFields[sortBy.toLowerCase()] || 'id';
    const sortDirection = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const query = `
      SELECT id, email, role, first_name, last_name, phone, profile_image_url, is_active, is_verified, created_at, updated_at
      FROM users
      ORDER BY ${sortColumn} ${sortDirection};
    `;

    const { rows } = await db.query(query);
    return rows.map(formatUserRow);
  },

  /**
   * Find a user by their unique ID.
   */
  async getById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const { rows } = await db.query(
      `SELECT id, email, role, first_name, last_name, phone, profile_image_url, is_active, is_verified, created_at, updated_at
       FROM users WHERE id = $1;`,
      [numId]
    );

    return rows.length > 0 ? formatUserRow(rows[0]) : null;
  },

  /**
   * Create and store a new user entity in PostgreSQL.
   */
  async create(payload) {
    const { firstName, lastName } = parseName(payload.name, payload.first_name, payload.last_name);
    const email = payload.email || `user${Date.now()}@alumni.edu`;
    const passwordHash = payload.password_hash || '$2b$10$w8/0k8ZgY7xV0ZgZ0ZgZ0.e7VvO2JqU5/7qY7xV0ZgZ0ZgZ0ZgZ0';
    const role = normalizeRole(payload.role);
    const phone = payload.phone || null;
    const profileImage = payload.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstName || email)}`;

    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone, profile_image_url, is_active, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, TRUE, NOW(), NOW())
       RETURNING id, email, role, first_name, last_name, phone, profile_image_url, is_active, is_verified, created_at, updated_at;`,
      [email, passwordHash, role, firstName, lastName, phone, profileImage]
    );

    return formatUserRow(rows[0]);
  },

  /**
   * Fully update (PUT) an existing user entity by ID.
   */
  async update(id, payload) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const existing = await this.getById(numId);
    if (!existing) return null;

    const { firstName, lastName } = parseName(payload.name, payload.first_name || existing.first_name, payload.last_name || existing.last_name);
    const email = payload.email || existing.email;
    const role = payload.role ? normalizeRole(payload.role) : existing.role;
    const phone = payload.phone !== undefined ? payload.phone : existing.phone;
    const profileImage = payload.profile_image_url || existing.profile_image_url;

    const { rows } = await db.query(
      `UPDATE users
       SET email = $1, role = $2, first_name = $3, last_name = $4, phone = $5, profile_image_url = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING id, email, role, first_name, last_name, phone, profile_image_url, is_active, is_verified, created_at, updated_at;`,
      [email, role, firstName, lastName, phone, profileImage, numId]
    );

    return rows.length > 0 ? formatUserRow(rows[0]) : null;
  },

  /**
   * Partially update (PATCH) specific fields of an existing user entity by ID.
   */
  async patch(id, payload) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const existing = await this.getById(numId);
    if (!existing) return null;

    let firstName = existing.first_name;
    let lastName = existing.last_name;

    if (payload.name) {
      const parsed = parseName(payload.name);
      firstName = parsed.firstName;
      lastName = parsed.lastName;
    } else {
      if (payload.first_name !== undefined) firstName = payload.first_name;
      if (payload.last_name !== undefined) lastName = payload.last_name;
    }

    const email = payload.email !== undefined ? payload.email : existing.email;
    const role = payload.role !== undefined ? normalizeRole(payload.role) : existing.role;
    const phone = payload.phone !== undefined ? payload.phone : existing.phone;
    const profileImage = payload.profile_image_url !== undefined ? payload.profile_image_url : existing.profile_image_url;

    const { rows } = await db.query(
      `UPDATE users
       SET email = $1, role = $2, first_name = $3, last_name = $4, phone = $5, profile_image_url = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING id, email, role, first_name, last_name, phone, profile_image_url, is_active, is_verified, created_at, updated_at;`,
      [email, role, firstName, lastName, phone, profileImage, numId]
    );

    return rows.length > 0 ? formatUserRow(rows[0]) : null;
  },

  /**
   * Delete a user entity by ID.
   */
  async delete(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const { rows } = await db.query(
      `DELETE FROM users WHERE id = $1
       RETURNING id, email, role, first_name, last_name, phone, profile_image_url, is_active, is_verified, created_at, updated_at;`,
      [numId]
    );

    return rows.length > 0 ? formatUserRow(rows[0]) : null;
  },

  /**
   * Get total count of users.
   */
  async count() {
    const { rows } = await db.query('SELECT count(*)::int as count FROM users;');
    return rows[0].count;
  }
};

module.exports = UserModel;

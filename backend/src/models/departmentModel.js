/**
 * PostgreSQL Department Model
 * Encapsulates data storage and CRUD operations for Department entities using PostgreSQL.
 */

const db = require('../db/db');

function formatDepartmentRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    faculty: row.faculty,
    description: row.description,
    jobPostingsCount: row.job_postings_count !== undefined ? parseInt(row.job_postings_count, 10) : undefined,
    usersCount: row.users_count !== undefined ? parseInt(row.users_count, 10) : undefined,
    createdAt: row.created_at,
    created_at: row.created_at
  };
}

const DepartmentModel = {
  /**
   * Retrieve all departments, optionally with counts of job postings and students/alumni.
   */
  async getAll({ sortBy = 'name', order = 'asc' } = {}) {
    const validSortFields = {
      id: 'd.id',
      code: 'd.code',
      name: 'd.name',
      faculty: 'd.faculty',
      created_at: 'd.created_at'
    };

    const sortColumn = validSortFields[sortBy.toLowerCase()] || 'd.name';
    const sortDirection = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const query = `
      SELECT d.id, d.code, d.name, d.faculty, d.description, d.created_at,
             (SELECT COUNT(*) FROM job_postings jp WHERE jp.department_id = d.id) AS job_postings_count
      FROM departments d
      ORDER BY ${sortColumn} ${sortDirection};
    `;

    const { rows } = await db.query(query);
    return rows.map(formatDepartmentRow);
  },

  /**
   * Find a department by its ID.
   */
  async getById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `
      SELECT d.id, d.code, d.name, d.faculty, d.description, d.created_at,
             (SELECT COUNT(*) FROM job_postings jp WHERE jp.department_id = d.id) AS job_postings_count
      FROM departments d
      WHERE d.id = $1;
    `;

    const { rows } = await db.query(query, [numId]);
    return formatDepartmentRow(rows[0]);
  },

  /**
   * Find a department by its code (e.g. 'CENG').
   */
  async getByCode(code) {
    if (!code) return null;
    const query = `SELECT * FROM departments WHERE UPPER(code) = UPPER($1);`;
    const { rows } = await db.query(query, [code.trim()]);
    return formatDepartmentRow(rows[0]);
  },

  /**
   * Create a new department.
   */
  async create({ code, name, faculty, description }) {
    const query = `
      INSERT INTO departments (code, name, faculty, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [code.trim().toUpperCase(), name.trim(), faculty.trim(), description || null]);
    return formatDepartmentRow(rows[0]);
  },

  /**
   * Update an existing department.
   */
  async update(id, { code, name, faculty, description }) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `
      UPDATE departments
      SET code = COALESCE($1, code),
          name = COALESCE($2, name),
          faculty = COALESCE($3, faculty),
          description = COALESCE($4, description)
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await db.query(query, [
      code ? code.trim().toUpperCase() : null,
      name ? name.trim() : null,
      faculty ? faculty.trim() : null,
      description !== undefined ? description : null,
      numId
    ]);
    return formatDepartmentRow(rows[0]);
  },

  /**
   * Delete a department.
   */
  async delete(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `DELETE FROM departments WHERE id = $1 RETURNING *;`;
    const { rows } = await db.query(query, [numId]);
    return formatDepartmentRow(rows[0]);
  },

  /**
   * Count total departments.
   */
  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM departments;');
    return parseInt(rows[0].count, 10);
  }
};

module.exports = DepartmentModel;

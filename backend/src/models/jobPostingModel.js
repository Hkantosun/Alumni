/**
 * PostgreSQL Job Posting Model
 * Encapsulates data storage and CRUD operations for Job Posting entities using PostgreSQL.
 * Supports direct queries as well as nested relationship filtering (by department and by user).
 */

const db = require('../db/db');

function formatJobPostingRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    posted_by_user_id: row.posted_by_user_id,
    postedBy: row.poster_name || (row.poster_first_name ? `${row.poster_first_name} ${row.poster_last_name}`.trim() : null),
    poster_email: row.poster_email,
    department_id: row.department_id,
    department_code: row.department_code,
    department_name: row.department_name,
    title: row.title,
    company: row.company,
    location: row.location,
    job_type: row.job_type,
    description: row.description,
    application_link: row.application_link,
    is_active: Boolean(row.is_active),
    created_at: row.created_at,
    expires_at: row.expires_at,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}

const JobPostingModel = {
  /**
   * Retrieve job postings, optionally filtered by departmentId, userId, job_type, is_active, and sorted.
   */
  async getAll({ departmentId, userId, jobType, isActive, sortBy = 'id', order = 'desc' } = {}) {
    const validSortFields = {
      id: 'jp.id',
      title: 'jp.title',
      company: 'jp.company',
      job_type: 'jp.job_type',
      created_at: 'jp.created_at',
      createdat: 'jp.created_at'
    };

    const sortColumn = validSortFields[sortBy.toLowerCase()] || 'jp.created_at';
    const sortDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let query = `
      SELECT jp.id, jp.posted_by_user_id, jp.department_id, jp.title, jp.company, jp.location,
             jp.job_type, jp.description, jp.application_link, jp.is_active, jp.created_at, jp.expires_at,
             u.first_name AS poster_first_name, u.last_name AS poster_last_name, u.email AS poster_email,
             d.code AS department_code, d.name AS department_name
      FROM job_postings jp
      LEFT JOIN users u ON jp.posted_by_user_id = u.id
      LEFT JOIN departments d ON jp.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (departmentId) {
      params.push(parseInt(departmentId, 10));
      query += ` AND jp.department_id = $${params.length}`;
    }

    if (userId) {
      params.push(parseInt(userId, 10));
      query += ` AND jp.posted_by_user_id = $${params.length}`;
    }

    if (jobType) {
      params.push(jobType);
      query += ` AND LOWER(jp.job_type) = LOWER($${params.length})`;
    }

    if (isActive !== undefined && isActive !== null) {
      params.push(Boolean(isActive));
      query += ` AND jp.is_active = $${params.length}`;
    }

    query += ` ORDER BY ${sortColumn} ${sortDirection};`;

    const { rows } = await db.query(query, params);
    return rows.map(formatJobPostingRow);
  },

  /**
   * Nested helper: Get all job postings for a specific department.
   */
  async getByDepartmentId(departmentId) {
    return this.getAll({ departmentId });
  },

  /**
   * Nested helper: Get all job postings posted by a specific user.
   */
  async getByUserId(userId) {
    return this.getAll({ userId });
  },

  /**
   * Retrieve a single job posting by ID.
   */
  async getById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `
      SELECT jp.id, jp.posted_by_user_id, jp.department_id, jp.title, jp.company, jp.location,
             jp.job_type, jp.description, jp.application_link, jp.is_active, jp.created_at, jp.expires_at,
             u.first_name AS poster_first_name, u.last_name AS poster_last_name, u.email AS poster_email,
             d.code AS department_code, d.name AS department_name
      FROM job_postings jp
      LEFT JOIN users u ON jp.posted_by_user_id = u.id
      LEFT JOIN departments d ON jp.department_id = d.id
      WHERE jp.id = $1;
    `;

    const { rows } = await db.query(query, [numId]);
    return formatJobPostingRow(rows[0]);
  },

  /**
   * Create a new job posting.
   */
  async create({ posted_by_user_id, department_id, title, company, location, job_type, description, application_link, is_active = true, expires_at }) {
    const query = `
      INSERT INTO job_postings (
        posted_by_user_id, department_id, title, company, location,
        job_type, description, application_link, is_active, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const deptId = department_id ? parseInt(department_id, 10) : null;
    const userId = parseInt(posted_by_user_id, 10);

    const { rows } = await db.query(query, [
      userId,
      deptId,
      title.trim(),
      company.trim(),
      location ? location.trim() : 'Remote',
      job_type || 'Full-time',
      description ? description.trim() : '',
      application_link ? application_link.trim() : null,
      is_active !== undefined ? Boolean(is_active) : true,
      expires_at ? new Date(expires_at) : null
    ]);

    return this.getById(rows[0].id);
  },

  /**
   * Update job posting (PUT - full update).
   */
  async update(id, data) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const deptId = data.department_id !== undefined && data.department_id !== '' 
      ? parseInt(data.department_id, 10) 
      : null;

    const query = `
      UPDATE job_postings
      SET department_id = $1,
          title = $2,
          company = $3,
          location = $4,
          job_type = $5,
          description = $6,
          application_link = $7,
          is_active = $8,
          expires_at = $9
      WHERE id = $10
      RETURNING *;
    `;

    const { rows } = await db.query(query, [
      deptId,
      data.title ? data.title.trim() : '',
      data.company ? data.company.trim() : '',
      data.location ? data.location.trim() : 'Remote',
      data.job_type || 'Full-time',
      data.description ? data.description.trim() : '',
      data.application_link ? data.application_link.trim() : null,
      data.is_active !== undefined ? Boolean(data.is_active) : true,
      data.expires_at ? new Date(data.expires_at) : null,
      numId
    ]);

    if (rows.length === 0) return null;
    return this.getById(numId);
  },

  /**
   * Partial update job posting (PATCH).
   */
  async patch(id, updates = {}) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const current = await this.getById(numId);
    if (!current) return null;

    const merged = {
      department_id: updates.department_id !== undefined ? updates.department_id : current.department_id,
      title: updates.title !== undefined ? updates.title : current.title,
      company: updates.company !== undefined ? updates.company : current.company,
      location: updates.location !== undefined ? updates.location : current.location,
      job_type: updates.job_type !== undefined ? updates.job_type : current.job_type,
      description: updates.description !== undefined ? updates.description : current.description,
      application_link: updates.application_link !== undefined ? updates.application_link : current.application_link,
      is_active: updates.is_active !== undefined ? updates.is_active : current.is_active,
      expires_at: updates.expires_at !== undefined ? updates.expires_at : current.expires_at
    };

    return this.update(numId, merged);
  },

  /**
   * Delete job posting.
   */
  async delete(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `DELETE FROM job_postings WHERE id = $1 RETURNING *;`;
    const { rows } = await db.query(query, [numId]);
    return formatJobPostingRow(rows[0]);
  },

  /**
   * Count total job postings.
   */
  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM job_postings;');
    return parseInt(rows[0].count, 10);
  }
};

module.exports = JobPostingModel;

/**
 * PostgreSQL Application Model
 * Encapsulates data storage and CRUD operations for Job & Internship Applications.
 * Supports direct queries as well as nested relationship queries:
 *   - By Job Posting: job_postings/:jobPostingId/applications
 *   - By Applicant: users/:userId/applications
 */

const db = require('../db/db');

function formatApplicationRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    job_posting_id: row.job_posting_id,
    jobTitle: row.job_title,
    jobCompany: row.job_company,
    applicant_user_id: row.applicant_user_id,
    applicantName: row.applicant_name || (row.applicant_first_name ? `${row.applicant_first_name} ${row.applicant_last_name}`.trim() : null),
    applicantEmail: row.applicant_email,
    resume_url: row.resume_url,
    cover_letter: row.cover_letter,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

const ApplicationModel = {
  /**
   * Retrieve applications, optionally filtered by jobPostingId, userId, or status.
   */
  async getAll({ jobPostingId, userId, status, sortBy = 'id', order = 'desc' } = {}) {
    const validSortFields = {
      id: 'a.id',
      status: 'a.status',
      created_at: 'a.created_at',
      createdat: 'a.created_at'
    };

    const sortColumn = validSortFields[sortBy.toLowerCase()] || 'a.created_at';
    const sortDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    let query = `
      SELECT a.id, a.job_posting_id, a.applicant_user_id, a.resume_url, a.cover_letter,
             a.status, a.created_at, a.updated_at,
             jp.title AS job_title, jp.company AS job_company,
             u.first_name AS applicant_first_name, u.last_name AS applicant_last_name, u.email AS applicant_email
      FROM applications a
      LEFT JOIN job_postings jp ON a.job_posting_id = jp.id
      LEFT JOIN users u ON a.applicant_user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (jobPostingId) {
      params.push(parseInt(jobPostingId, 10));
      query += ` AND a.job_posting_id = $${params.length}`;
    }

    if (userId) {
      params.push(parseInt(userId, 10));
      query += ` AND a.applicant_user_id = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND LOWER(a.status) = LOWER($${params.length})`;
    }

    query += ` ORDER BY ${sortColumn} ${sortDirection};`;

    const { rows } = await db.query(query, params);
    return rows.map(formatApplicationRow);
  },

  /**
   * Nested helper: Get all applications for a specific job posting.
   */
  async getByJobPostingId(jobPostingId) {
    return this.getAll({ jobPostingId });
  },

  /**
   * Nested helper: Get all applications submitted by a specific user.
   */
  async getByApplicantUserId(userId) {
    return this.getAll({ userId });
  },

  /**
   * Find application by ID.
   */
  async getById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `
      SELECT a.id, a.job_posting_id, a.applicant_user_id, a.resume_url, a.cover_letter,
             a.status, a.created_at, a.updated_at,
             jp.title AS job_title, jp.company AS job_company,
             u.first_name AS applicant_first_name, u.last_name AS applicant_last_name, u.email AS applicant_email
      FROM applications a
      LEFT JOIN job_postings jp ON a.job_posting_id = jp.id
      LEFT JOIN users u ON a.applicant_user_id = u.id
      WHERE a.id = $1;
    `;

    const { rows } = await db.query(query, [numId]);
    return formatApplicationRow(rows[0]);
  },

  /**
   * Create a new application.
   */
  async create({ job_posting_id, applicant_user_id, resume_url, cover_letter, status = 'pending' }) {
    const query = `
      INSERT INTO applications (
        job_posting_id, applicant_user_id, resume_url, cover_letter, status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const { rows } = await db.query(query, [
      parseInt(job_posting_id, 10),
      parseInt(applicant_user_id, 10),
      resume_url ? resume_url.trim() : null,
      cover_letter ? cover_letter.trim() : null,
      status || 'pending'
    ]);

    return this.getById(rows[0].id);
  },

  /**
   * Full update application (PUT).
   */
  async update(id, { resume_url, cover_letter, status }) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `
      UPDATE applications
      SET resume_url = $1,
          cover_letter = $2,
          status = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;

    const { rows } = await db.query(query, [
      resume_url ? resume_url.trim() : null,
      cover_letter ? cover_letter.trim() : null,
      status || 'pending',
      numId
    ]);

    if (rows.length === 0) return null;
    return this.getById(numId);
  },

  /**
   * Partial update application (PATCH).
   */
  async patch(id, updates = {}) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const current = await this.getById(numId);
    if (!current) return null;

    const merged = {
      resume_url: updates.resume_url !== undefined ? updates.resume_url : current.resume_url,
      cover_letter: updates.cover_letter !== undefined ? updates.cover_letter : current.cover_letter,
      status: updates.status !== undefined ? updates.status : current.status
    };

    return this.update(numId, merged);
  },

  /**
   * Delete application.
   */
  async delete(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `DELETE FROM applications WHERE id = $1 RETURNING *;`;
    const { rows } = await db.query(query, [numId]);
    return formatApplicationRow(rows[0]);
  },

  /**
   * Count total applications.
   */
  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM applications;');
    return parseInt(rows[0].count, 10);
  }
};

module.exports = ApplicationModel;

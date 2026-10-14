/**
 * PostgreSQL Announcement Model
 * Encapsulates data storage and CRUD operations for Announcement entities using PostgreSQL.
 */

const db = require('../db/db');

function formatAnnouncementRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    author_id: row.author_id,
    author: row.author_name || (row.first_name ? `${row.first_name} ${row.last_name}`.trim() : 'Sistem Yönetimi'),
    title: row.title,
    content: row.content,
    category: row.category,
    isPinned: Boolean(row.is_pinned),
    is_pinned: Boolean(row.is_pinned),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

const AnnouncementModel = {
  /**
   * Retrieve all announcements, optionally filtered and sorted by a specific field and order.
   */
  async getAll({ sortBy = 'id', order = 'asc', category } = {}) {
    const validSortFields = {
      id: 'a.id',
      title: 'a.title',
      category: 'a.category',
      createdat: 'a.created_at',
      created_at: 'a.created_at'
    };

    const sortColumn = validSortFields[sortBy.toLowerCase()] || 'a.id';
    const sortDirection = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let query = `
      SELECT a.id, a.author_id, a.title, a.content, a.category, a.is_pinned, a.created_at, a.updated_at,
             u.first_name, u.last_name, u.email as author_email
      FROM announcements a
      LEFT JOIN users u ON a.author_id = u.id
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` WHERE LOWER(a.category) = LOWER($1) `;
    }

    // Always keep pinned announcements on top, followed by chosen sort
    query += ` ORDER BY a.is_pinned DESC, ${sortColumn} ${sortDirection};`;

    const { rows } = await db.query(query, params);
    return rows.map(formatAnnouncementRow);
  },

  /**
   * Find an announcement by its unique ID.
   */
  async getById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const query = `
      SELECT a.id, a.author_id, a.title, a.content, a.category, a.is_pinned, a.created_at, a.updated_at,
             u.first_name, u.last_name, u.email as author_email
      FROM announcements a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = $1;
    `;
    const { rows } = await db.query(query, [numId]);
    return rows.length > 0 ? formatAnnouncementRow(rows[0]) : null;
  },

  /**
   * Create and store a new announcement entity in PostgreSQL.
   */
  async create(payload) {
    let authorId = parseInt(payload.author_id, 10);
    if (isNaN(authorId)) {
      // Find default admin or first user
      const { rows: userRows } = await db.query('SELECT id FROM users ORDER BY id ASC LIMIT 1;');
      authorId = userRows.length > 0 ? userRows[0].id : 1;
    }

    const title = payload.title || 'Başlıksız Duyuru';
    const content = payload.content || '';
    const category = payload.category || 'General';
    const isPinned = Boolean(payload.isPinned !== undefined ? payload.isPinned : payload.is_pinned);

    const { rows } = await db.query(
      `INSERT INTO announcements (author_id, title, content, category, is_pinned, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, author_id, title, content, category, is_pinned, created_at, updated_at;`,
      [authorId, title, content, category, isPinned]
    );

    return formatAnnouncementRow(rows[0]);
  },

  /**
   * Fully update (PUT) an existing announcement entity by ID.
   */
  async update(id, payload) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const existing = await this.getById(numId);
    if (!existing) return null;

    const title = payload.title !== undefined ? payload.title : existing.title;
    const content = payload.content !== undefined ? payload.content : existing.content;
    const category = payload.category !== undefined ? payload.category : existing.category;
    const isPinned = payload.isPinned !== undefined ? Boolean(payload.isPinned) : (payload.is_pinned !== undefined ? Boolean(payload.is_pinned) : existing.isPinned);

    const { rows } = await db.query(
      `UPDATE announcements
       SET title = $1, content = $2, category = $3, is_pinned = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING id, author_id, title, content, category, is_pinned, created_at, updated_at;`,
      [title, content, category, isPinned, numId]
    );

    return rows.length > 0 ? formatAnnouncementRow(rows[0]) : null;
  },

  /**
   * Partially update (PATCH) specific fields of an existing announcement entity by ID.
   */
  async patch(id, payload) {
    return this.update(id, payload);
  },

  /**
   * Delete an announcement entity by ID.
   */
  async delete(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;

    const { rows } = await db.query(
      `DELETE FROM announcements WHERE id = $1
       RETURNING id, author_id, title, content, category, is_pinned, created_at, updated_at;`,
      [numId]
    );

    return rows.length > 0 ? formatAnnouncementRow(rows[0]) : null;
  },

  /**
   * Helper function to get total count of announcements.
   */
  async count() {
    const { rows } = await db.query('SELECT count(*)::int as count FROM announcements;');
    return rows[0].count;
  }
};

module.exports = AnnouncementModel;

/**
 * Migration 008: Create applications table
 * Defines Job & Internship Applications with relationships:
 *   - 1:N with job_postings (job_posting_id -> job_postings.id)
 *   - 1:N with users (applicant_user_id -> users.id)
 */
module.exports = {
  name: '008_create_applications',
  async up(client) {
    await client.query(`
      -- Applications table
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        job_posting_id INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
        applicant_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resume_url VARCHAR(500),
        cover_letter TEXT,
        status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'withdrawn')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_job_applicant UNIQUE (job_posting_id, applicant_user_id)
      );

      -- Query optimization indexes
      CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_posting_id);
      CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_user_id);
    `);
  },
  async down(client) {
    await client.query(`
      DROP TABLE IF EXISTS applications CASCADE;
    `);
  }
};

/**
 * Migration 007: Create performance optimization indexes
 */
module.exports = {
  name: '007_create_indexes',
  async up(client) {
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_alumni_dept_year ON alumni_profiles(department_id, graduation_year);
      CREATE INDEX IF NOT EXISTS idx_alumni_mentorship ON alumni_profiles(available_for_mentorship) WHERE available_for_mentorship = TRUE;
      CREATE INDEX IF NOT EXISTS idx_job_postings_active ON job_postings(is_active, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
    `);
  },
  async down(client) {
    await client.query(`
      DROP INDEX IF EXISTS idx_events_date;
      DROP INDEX IF EXISTS idx_job_postings_active;
      DROP INDEX IF EXISTS idx_alumni_mentorship;
      DROP INDEX IF EXISTS idx_alumni_dept_year;
      DROP INDEX IF EXISTS idx_users_role;
    `);
  }
};

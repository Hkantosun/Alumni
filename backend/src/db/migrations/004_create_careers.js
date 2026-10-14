/**
 * Migration 004: Create job_experiences and job_postings tables
 */
module.exports = {
  name: '004_create_careers',
  async up(client) {
    await client.query(`
      -- Job Experiences (Alumni career history)
      CREATE TABLE IF NOT EXISTS job_experiences (
        id SERIAL PRIMARY KEY,
        alumni_profile_id INTEGER NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
        company VARCHAR(150) NOT NULL,
        position VARCHAR(150) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        is_current BOOLEAN NOT NULL DEFAULT FALSE,
        description TEXT
      );

      -- Job Postings (Shared by alumni/faculty)
      CREATE TABLE IF NOT EXISTS job_postings (
        id SERIAL PRIMARY KEY,
        posted_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        company VARCHAR(150) NOT NULL,
        location VARCHAR(100) NOT NULL,
        job_type VARCHAR(30) NOT NULL CHECK (job_type IN ('Full-time', 'Part-time', 'Internship', 'Contract', 'Remote')),
        description TEXT NOT NULL,
        application_link VARCHAR(500),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP
      );
    `);
  },
  async down(client) {
    await client.query(`
      DROP TABLE IF EXISTS job_postings CASCADE;
      DROP TABLE IF EXISTS job_experiences CASCADE;
    `);
  }
};

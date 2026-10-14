/**
 * Migration 003: Create profile extension tables (alumni_profiles, student_profiles, academic_profiles)
 */
module.exports = {
  name: '003_create_profile_extensions',
  async up(client) {
    await client.query(`
      -- Alumni Profiles (1:1 with users)
      CREATE TABLE IF NOT EXISTS alumni_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
        graduation_year SMALLINT NOT NULL CHECK (graduation_year >= 1950),
        degree VARCHAR(50) NOT NULL DEFAULT 'Bachelor',
        current_job_title VARCHAR(150),
        current_company VARCHAR(150),
        current_city VARCHAR(100),
        linkedin_url VARCHAR(300),
        bio TEXT,
        available_for_mentorship BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Student Profiles (1:1 with users)
      CREATE TABLE IF NOT EXISTS student_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
        student_number VARCHAR(30) NOT NULL UNIQUE,
        enrollment_year SMALLINT NOT NULL,
        expected_graduation_year SMALLINT NOT NULL,
        degree VARCHAR(50) NOT NULL DEFAULT 'Bachelor',
        interests TEXT,
        career_goals TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Academic Profiles (1:1 with users)
      CREATE TABLE IF NOT EXISTS academic_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
        academic_title VARCHAR(100) NOT NULL,
        office_location VARCHAR(150),
        research_areas TEXT,
        office_hours VARCHAR(200),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  },
  async down(client) {
    await client.query(`
      DROP TABLE IF EXISTS academic_profiles CASCADE;
      DROP TABLE IF EXISTS student_profiles CASCADE;
      DROP TABLE IF EXISTS alumni_profiles CASCADE;
    `);
  }
};

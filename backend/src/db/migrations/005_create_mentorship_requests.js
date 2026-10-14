/**
 * Migration 005: Create mentorship_requests table
 */
module.exports = {
  name: '005_create_mentorship_requests',
  async up(client) {
    await client.query(`
      CREATE TABLE IF NOT EXISTS mentorship_requests (
        id SERIAL PRIMARY KEY,
        student_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        mentor_alumni_id INTEGER NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
        status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
        request_message TEXT NOT NULL,
        response_message TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  },
  async down(client) {
    await client.query(`DROP TABLE IF EXISTS mentorship_requests CASCADE;`);
  }
};

/**
 * Migration 006: Create events, event_rsvps, and announcements tables
 */
module.exports = {
  name: '006_create_events_and_announcements',
  async up(client) {
    await client.query(`
      -- Events Table
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'General',
        capacity INTEGER CHECK (capacity > 0),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Event RSVPs Table
      CREATE TABLE IF NOT EXISTS event_rsvps (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(30) NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'declined')),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_event_user UNIQUE (event_id, user_id)
      );

      -- Announcements Table
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'General',
        is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  },
  async down(client) {
    await client.query(`
      DROP TABLE IF EXISTS announcements CASCADE;
      DROP TABLE IF EXISTS event_rsvps CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
    `);
  }
};

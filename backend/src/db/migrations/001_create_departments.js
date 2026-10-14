/**
 * Migration 001: Create departments table
 */
module.exports = {
  name: '001_create_departments',
  async up(client) {
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(150) NOT NULL,
        faculty VARCHAR(150) NOT NULL,
        description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  },
  async down(client) {
    await client.query(`DROP TABLE IF EXISTS departments CASCADE;`);
  }
};

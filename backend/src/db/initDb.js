const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Running database schema initialization from ddd.md...');
    await db.query(sql);
    console.log('Database tables, constraints, indexes, and initial seeds created successfully!');
  } catch (err) {
    console.error('Database initialization failed:', err);
  } finally {
    await db.pool.end();
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;

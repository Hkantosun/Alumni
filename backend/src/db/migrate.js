const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function runMigrations({ rollback = false } = {}) {
  const client = await pool.connect();
  try {
    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Read all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    // 3. Get already executed migrations
    const { rows: executedRows } = await client.query('SELECT name FROM schema_migrations ORDER BY id ASC;');
    const executedNames = new Set(executedRows.map(r => r.name));

    if (rollback) {
      // Rollback last executed migration
      if (executedRows.length === 0) {
        console.log('ℹ️  No migrations to rollback.');
        return;
      }
      const lastMigrationName = executedRows[executedRows.length - 1].name;
      const fileToRollback = files.find(f => f.replace(/\.js$/, '') === lastMigrationName || require(path.join(migrationsDir, f)).name === lastMigrationName);

      if (!fileToRollback) {
        throw new Error(`Migration file for '${lastMigrationName}' not found in ${migrationsDir}`);
      }

      const migration = require(path.join(migrationsDir, fileToRollback));
      console.log(`⏪ Rolling back migration: ${migration.name}...`);

      await client.query('BEGIN');
      try {
        await migration.down(client);
        await client.query('DELETE FROM schema_migrations WHERE name = $1', [migration.name]);
        await client.query('COMMIT');
        console.log(`✅ Rollback complete: ${migration.name}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
      return;
    }

    // Forward migration
    let appliedCount = 0;
    for (const file of files) {
      const migration = require(path.join(migrationsDir, file));
      const migrationName = migration.name || file.replace(/\.js$/, '');

      if (!executedNames.has(migrationName)) {
        console.log(`⚡ Applying migration: ${migrationName}...`);
        await client.query('BEGIN');
        try {
          await migration.up(client);
          await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [migrationName]);
          await client.query('COMMIT');
          console.log(`✅ Applied: ${migrationName}`);
          appliedCount++;
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`❌ Failed migration ${migrationName}:`, err.message);
          throw err;
        }
      }
    }

    if (appliedCount === 0) {
      console.log('✨ All migrations are up to date. Nothing to apply.');
    } else {
      console.log(`🎉 Successfully applied ${appliedCount} migration(s).`);
    }
  } finally {
    client.release();
  }
}

if (require.main === module) {
  const isRollback = process.argv.includes('--rollback');
  runMigrations({ rollback: isRollback })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration error:', err);
      process.exit(1);
    });
}

module.exports = runMigrations;

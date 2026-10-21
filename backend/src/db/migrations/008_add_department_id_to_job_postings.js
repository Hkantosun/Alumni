/**
 * Migration 008: Add department_id to job_postings table
 */
module.exports = {
  name: '008_add_department_id_to_job_postings',
  async up(client) {
    await client.query(`
      -- Add department_id column with foreign key to departments(id)
      ALTER TABLE job_postings 
      ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL;

      -- Create index for filtering job postings by department
      CREATE INDEX IF NOT EXISTS idx_job_postings_dept ON job_postings(department_id);
    `);
  },
  async down(client) {
    await client.query(`
      -- Drop index
      DROP INDEX IF EXISTS idx_job_postings_dept;

      -- Drop column
      ALTER TABLE job_postings 
      DROP COLUMN IF EXISTS department_id;
    `);
  }
};

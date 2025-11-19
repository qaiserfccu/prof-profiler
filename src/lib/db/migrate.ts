/**
 * Database Migration Script
 * Applies database schema migrations and updates
 */

import { initializeDatabase } from './init';

export async function migrateDatabase() {
  try {
    console.log('🔄 Starting database migration...');

    // Run initialization which uses CREATE TABLE IF NOT EXISTS
    // This ensures all tables are created or updated safely
    const initialized = await initializeDatabase();
    
    if (!initialized) {
      throw new Error('Failed to initialize database tables');
    }

    // Future migrations can be added here with version checks
    // Example:
    // const pool = getPool();
    // await applyMigrationV2(pool);
    // await applyMigrationV3(pool);

    console.log('✅ Database migration completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Database migration error:', error);
    return false;
  }
}

/**
 * Example migration function for future schema changes
 * Uncomment and modify as needed for specific migrations
 */
/*
async function applyMigrationV2(pool: any) {
  try {
    // Check if migration has already been applied
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='new_column';
    `);

    if (result.rows.length === 0) {
      console.log('Applying migration V2: Adding new_column to users table...');
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN new_column VARCHAR(255);
      `);
      console.log('Migration V2 applied successfully');
    } else {
      console.log('Migration V2 already applied, skipping...');
    }
  } catch (error) {
    console.error('Error applying migration V2:', error);
    throw error;
  }
}
*/

// Run migration if called directly
if (require.main === module) {
  migrateDatabase().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

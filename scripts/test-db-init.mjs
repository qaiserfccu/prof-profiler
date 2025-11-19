#!/usr/bin/env node
/**
 * Test Database Connection and Initialization
 * Run this with: node scripts/test-db-init.mjs
 */

import { config } from 'dotenv';
import pg from 'pg';

// Load environment variables
config();

const { Pool } = pg;

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  const dbUrl = process.env.DB_URL;
  
  if (!dbUrl) {
    console.error('❌ DB_URL not found in environment variables');
    console.log('Please set DB_URL in your .env file');
    console.log('Example: DB_URL=postgresql://user:password@host:5432/database');
    process.exit(1);
  }
  
  console.log('✅ DB_URL found in environment');
  console.log(`   Connection string: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);
  
  let pool;
  
  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 5,
      connectionTimeoutMillis: 10000,
    });
    
    // Test connection
    console.log('\n🔗 Testing connection...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to database');
    
    // Get database info
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('\n📊 Database Information:');
    console.log(`   Database: ${result.rows[0].current_database}`);
    console.log(`   User: ${result.rows[0].current_user}`);
    console.log(`   Version: ${result.rows[0].version.split(',')[0]}`);
    
    // Check if tables exist
    console.log('\n📋 Checking existing tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('   Found tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('   No tables found (database is empty)');
    }
    
    client.release();
    
    console.log('\n✨ Database connection test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run db:init    (to create tables)');
    console.log('2. Run: npm run dev        (to start the application)');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check if the database host is correct');
      console.log('   - Ensure your network allows connections to the database');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check if the database is running');
      console.log('   - Verify the port number is correct');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your database username and password');
      console.log('   - Ensure the credentials in DB_URL are correct');
    }
    
    process.exit(1);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

testDatabaseConnection();

#!/usr/bin/env node
/**
 * Data Purge Cron Job
 * 
 * Runs daily to purge expired PII data (resumes, photos, sessions)
 * according to the configured retention policy.
 * 
 * Usage:
 *   node scripts/purge-expired-data.mjs
 * 
 * Add to crontab for daily execution:
 *   0 2 * * * cd /path/to/project && node scripts/purge-expired-data.mjs >> /var/log/data-purge.log 2>&1
 */

import { purgeExpiredData, getRetentionStats } from '../src/lib/utils/retention.ts';

async function main() {
  console.log(`[${new Date().toISOString()}] Starting data purge job...`);
  
  try {
    // Get current statistics
    const statsBefore = await getRetentionStats();
    console.log('Statistics before purge:', statsBefore);
    
    // Run purge
    const result = await purgeExpiredData();
    
    console.log('Purge completed:');
    console.log(`  - Resumes deleted: ${result.resumesDeleted}`);
    console.log(`  - Photos deleted: ${result.photosDeleted}`);
    console.log(`  - Sessions deleted: ${result.sessionsDeleted}`);
    
    // Get updated statistics
    const statsAfter = await getRetentionStats();
    console.log('Statistics after purge:', statsAfter);
    
    console.log(`[${new Date().toISOString()}] Data purge job completed successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Data purge job failed:`, error);
    process.exit(1);
  }
}

main();

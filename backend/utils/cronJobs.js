const cron = require('node-cron');
const expiryService = require('../services/expiryService');

// Default to running at 8 AM daily if not specified in env
const EXPIRY_CHECK_CRON = process.env.EXPIRY_CHECK_CRON || '0 8 * * *';

// Validate cron expression
if (!cron.validate(EXPIRY_CHECK_CRON)) {
  console.error(`Invalid cron expression: ${EXPIRY_CHECK_CRON}`);
  console.error('Falling back to default schedule: 0 8 * * * (8 AM daily)');
}

// Schedule product expiry checks
const expiryCheckJob = cron.schedule(EXPIRY_CHECK_CRON, async () => {
  console.log(`[${new Date().toISOString()}] Starting scheduled expiry check...`);
  
  try {
    const result = await expiryService.checkExpiries();
    console.log(`[${new Date().toISOString()}] Expiry check completed:`, {
      expiringProducts: result.expiring,
      expiredProducts: result.expired,
      warningDays: process.env.EXPIRY_WARNING_DAYS || '30'
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in expiry check job:`, error);
  }
}, {
  scheduled: true,
  timezone: process.env.TZ || 'UTC'
});

// Export the job for potential manual control
module.exports = {
  expiryCheckJob
};

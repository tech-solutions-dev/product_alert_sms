const cron = require('node-cron');
const expiryService = require('../services/expiryService');

// Run expiry check every day at 8am
cron.schedule('0 8 * * *', async () => {
  await expiryService.checkExpiries();
  console.log('Checked for expiring products and sent notifications.');
});

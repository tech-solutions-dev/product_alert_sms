require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced.');
    app.listen(PORT, '0.0.0.0',() => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();





// LATER TO ADD EMAIL


// require('dotenv').config();
// const app = require('./app');
// const sequelize = require('./config/database');
// const { expiryCheckJob } = require('./utils/cronJobs');
// const emailConfig = require('./config/email');

// const PORT = process.env.PORT || 5000;

// // Verify email configuration
// const verifyEmailConfig = async () => {
//   try {
//     // First verify the configuration
//     await emailConfig.verify();
    
//     // If verification succeeds, try sending a test email
//     if (process.env.NODE_ENV !== 'production') {
//       await emailConfig.sendTestEmail();
//     }
    
//     return true;
//   } catch (error) {
//     console.error('Email configuration error:', error.message);
//     console.error('Please check your .env file and email settings.');
//     console.error('Required environment variables:');
//     console.error('- EMAIL_USER: Your email address');
//     console.error('- EMAIL_PASS: Your email password or app-specific password');
//     console.error('Optional environment variables:');
//     console.error('- EMAIL_SERVICE: e.g., "gmail" (recommended for Gmail)');
//     console.error('- EMAIL_HOST: SMTP host (if not using EMAIL_SERVICE)');
//     console.error('- EMAIL_PORT: SMTP port (default: 587)');
//     console.error('- EMAIL_SECURE: "true" or "false" (default: false)');
//     console.error('- EMAIL_TLS: "true" or "false" (default: true)');
    
//     if (process.env.EMAIL_SERVICE?.toLowerCase() === 'gmail') {
//       console.error('\nFor Gmail users:');
//       console.error('1. Enable 2-Step Verification in your Google Account');
//       console.error('2. Generate an App Password:');
//       console.error('   - Go to Google Account settings');
//       console.error('   - Search for "App Passwords"');
//       console.error('   - Select "Mail" and your device');
//       console.error('   - Use the generated 16-character password as EMAIL_PASS');
//     }
    
//     // In production, we might want to exit
//     if (process.env.NODE_ENV === 'production') {
//       return false;
//     }
    
//     // In development, we'll log the error but continue
//     console.warn('Email service will not be available');
//     return false;
//   }
// };

// (async () => {
//   try {
//     // Connect to database
//     await sequelize.authenticate();
//     await sequelize.sync();
//     console.log('Database connected and synced.');

//     // Verify email configuration
//     const emailConfigured = await verifyEmailConfig();

//     // Start the server
//     app.listen(PORT, '0.0.0.0', () => {
//       console.log(`Server running on port ${PORT}`);
      
//       // Start cron jobs after server is running
//       if (emailConfigured) {
//         expiryCheckJob.start();
//         console.log('Product expiry check job scheduled');
//       } else {
//         console.warn('Cron jobs disabled due to email configuration issues');
//       }
//     });
//   } catch (error) {
//     console.error('Server initialization error:', error);
//     process.exit(1);
//   }
// })();

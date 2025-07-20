const nodemailer = require('nodemailer');
require('dotenv').config();

// Log environment variables (without sensitive data)
console.log('Email Environment Variables:', {
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  user: process.env.EMAIL_USER,
  tls: process.env.EMAIL_TLS
});

// Validate required email configuration
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('ERROR: Email configuration is incomplete. EMAIL_USER and EMAIL_PASS are required.');
  process.exit(1);
}

let config;

// Configure for Gmail
if (process.env.EMAIL_SERVICE?.toLowerCase() === 'gmail') {
  config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be an app-specific password for Gmail
    }
  };
} 
// Configure for custom SMTP
else {
  config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // TLS Configuration
    ...(process.env.EMAIL_TLS === 'false' ? {} : {
      requireTLS: true,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
        minVersion: 'TLSv1.2'
      }
    })
  };
}

// Create transporter with configuration
const transporter = nodemailer.createTransport(config);

// Enhanced verification method with retries
transporter.verify = async function(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const success = await new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
          if (error) {
            console.error(`Email verification attempt ${attempt} failed:`, error.message);
            reject(error);
          } else {
            resolve(success);
          }
        });
      });

      console.log('Email configuration verified successfully');
      return success;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Email verification failed after ${retries} attempts: ${error.message}`);
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Test email function
transporter.sendTestEmail = async function() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: 'Test Email - ExpireTracker Pro',
      text: 'This is a test email to verify the email configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify the email configuration.</p>'
    });
    console.log('Test email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error.message);
    throw error;
  }
};

// Log configuration (without sensitive data)
console.log('Email Configuration:', {
  service: config.service,
  host: config.host,
  port: config.port,
  secure: config.secure,
  user: config.auth.user,
  requireTLS: config?.requireTLS
});

module.exports = transporter;

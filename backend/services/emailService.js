const transporter = require('../config/email');

/**
 * Send expiry alert emails to users managing a product category
 * @param {Object} product - The product that is expiring/expired
 * @param {Array} users - Array of users to notify
 * @param {Object} options - Additional options (type: 'expiring'|'expired', daysToExpiry: number)
 */
exports.sendExpiryAlert = async (product, users, options = {}) => {
  const { type = 'expiring', daysToExpiry } = options;
  
  try {
    const isExpired = type === 'expired';
    const subject = isExpired
      ? `⚠️ Product Expired: ${product.name}`
      : `⚠️ Product Expiring Soon: ${product.name}`;

    const baseText = isExpired
      ? `The product '${product.name}' has expired on ${new Date(product.expiryDate).toLocaleDateString()}.`
      : `The product '${product.name}' will expire in ${daysToExpiry} days (${new Date(product.expiryDate).toLocaleDateString()}).`;

    const actionText = isExpired
      ? 'Please remove this product from inventory immediately.'
      : 'Please take appropriate action (e.g., use, sell, or dispose of the product).';

    const productDetails = `
Product Details:
- Name: ${product.name}
- Category: ${product.Category?.name || 'Uncategorized'}
- Expiry Date: ${new Date(product.expiryDate).toLocaleDateString()}
- Status: ${isExpired ? 'Expired' : 'Expiring Soon'}
${product.barcode ? `- Barcode: ${product.barcode}` : ''}
`;

    // Send email to each user managing the category
    for (const user of users) {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: subject,
        text: `Dear ${user.username},

${baseText}
${actionText}

${productDetails}

This is an automated notification from your inventory management system.
Please log in to the system for more details and to take action.

Best regards,
ExpireTracker Pro System`,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: ${isExpired ? '#dc2626' : '#f59e0b'};">${subject}</h2>
  
  <p>Dear ${user.username},</p>
  
  <p>${baseText}</p>
  <p><strong>${actionText}</strong></p>
  
  <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Product Details:</h3>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Name:</strong> ${product.name}</li>
      <li><strong>Category:</strong> ${product.Category?.name || 'Uncategorized'}</li>
      <li><strong>Expiry Date:</strong> ${new Date(product.expiryDate).toLocaleDateString()}</li>
      <li><strong>Status:</strong> ${isExpired ? 'Expired' : 'Expiring Soon'}</li>
      ${product.barcode ? `<li><strong>Barcode:</strong> ${product.barcode}</li>` : ''}
    </ul>
  </div>
  
  <p style="color: #4b5563; font-size: 0.9em;">
    This is an automated notification from your inventory management system.<br>
    Please <a href="${process.env.FRONTEND_URL || '#'}">log in to the system</a> for more details and to take action.
  </p>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  
  <p style="color: #6b7280; font-size: 0.8em;">
    ExpireTracker Pro System<br>
    Generated: ${new Date().toLocaleString()}
  </p>
</div>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`Expiry alert sent to ${user.email} for product ${product.name}`);
    }
  } catch (error) {
    console.error('Error sending expiry alert:', error);
    throw error;
  }
};

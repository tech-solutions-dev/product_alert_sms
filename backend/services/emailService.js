const transporter = require('../config/email');

exports.sendExpiryAlert = async (product) => {
  // TODO: Fetch user emails associated with the product/category
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'user@example.com', // We should fetch this dynamically based on the product/category
    subject: `Product Expiry Alert: ${product.name}`,
    text: `The product '${product.name}' is expiring on ${product.expiryDate}. Please take action.`
  };
  await transporter.sendMail(mailOptions);
};

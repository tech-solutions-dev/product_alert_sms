const { Product } = require('../models');
const { Op } = require('sequelize');
const emailService = require('./emailService');

// Check for products expiring soon and send notifications
exports.checkExpiries = async () => {
  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + 7);
  const expiring = await Product.findAll({ where: { expiryDate: { [Op.between]: [now, soon] } } });
  for (const product of expiring) {
    // TODO: Fetch user emails and send notifications
    await emailService.sendExpiryAlert(product);
  }
};

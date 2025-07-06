const { Product, Category } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardOverview = async (req, res) => {
  try {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + 30);
    const totalProducts = await Product.count();
    const expiringSoon = await Product.count({ where: { expiryDate: { [Op.between]: [now, soon] } } });
    const expired = await Product.count({ where: { expiryDate: { [Op.lt]: now } } });
    const categories = await Category.findAll();
    res.json({ totalProducts, expiringSoon, expired, categories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: err.message });
  }
};

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

    const recentProducts = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{ model: Category, attributes: ['name'] }]
    });

    const freshProducts = await Product.count({ where: { expiryDate: { [Op.gt]: soon } } });
    const expiryStats = {
      expired,
      expiringSoon,
      fresh: freshProducts
    };

    const totalCategories = await Category.count();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const addedThisMonth = await Product.count({ where: { createdAt: { [Op.gte]: startOfMonth } } });

    res.json({
      totalProducts,
      expiringSoon,
      expired,
      categories,
      recentProducts,
      expiryStats,
      totalCategories,
      addedThisMonth,
      freshProducts
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: err.message });
  }
};

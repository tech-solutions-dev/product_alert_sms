const { Category, Product } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

exports.getAllReports = async (req, res) => {
  try {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    const categoryFilter = req.user.role !== 'admin' ? { categoryId: req.user.categoryIds } : {};

    const totalProducts = await Product.count({ where: categoryFilter });

    const expiredProducts = await Product.count({
      where: {
        ...categoryFilter,
        expiryDate: {
          [Op.lt]: currentDate
        }
      }
    });

    const expiringSoon = await Product.count({
      where: {
        ...categoryFilter,
        expiryDate: {
          [Op.gt]: currentDate,
          [Op.lt]: thirtyDaysFromNow
        }
      }
    });

    const healthyProducts = totalProducts - expiredProducts - expiringSoon;

    const topCategories = await Product.findAll({
      where: {
        ...categoryFilter,
        expiryDate: {
          [Op.between]: [currentDate, thirtyDaysFromNow]
        }
      },
      include: [{
        model: Category,
        attributes: ['name']
      }],
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Product.id')), 'count']
      ],
      group: ['Category.id', 'Category.name'],
      order: [[sequelize.fn('COUNT', sequelize.col('Product.id')), 'DESC']],
      limit: 5
    });

    const products = await Product.findAll({
      where: categoryFilter,
      include: [{
        model: Category,
        attributes: ['name']
      }],
      order: [['expiryDate', 'ASC']]
    });

    const processedProducts = products.map(product => {
      return {
        id: product.id,
        name: product.name,
        category: product.Category,
        expiryDate: product.expiryDate,
        status: product.status,
        reportCount: 0,
        lastReportedBy: product.updatedAt || 'N/A'
      };
    });

    const warnings = [];
    if (expiredProducts > 0) {
      warnings.push({
        type: 'critical',
        message: `${expiredProducts} products have expired!`
      });
    }
    if (expiringSoon > 0) {
      warnings.push({
        type: 'warning',
        message: `${expiringSoon} products expiring soon.`
      });
    }

    const suggestions = [];
    if (expiredProducts > 0) {
      suggestions.push('Review expired products and remove from inventory.');
    }
    if (expiringSoon > 0) {
      suggestions.push('Contact suppliers for soon-to-expire items.');
    }
    if (healthyProducts < totalProducts * 0.5) {
      suggestions.push('Consider restocking inventory with fresh products.');
    }


    const overview = {
      totalProducts,
      expiredProducts,
      expiringSoon,
      healthyProducts,
      topCategories: topCategories.map(cat => ({
        name: cat.Category.name,
        count: parseInt(cat.get('count'))
      })),
      warnings,
      suggestions
    };

    res.json({ overview, products: processedProducts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { type } = req.body;
    const fromDate = req.body.from ? new Date(req.body.from) : null;
    const toDate = req.body.to ? new Date(req.body.to) : null;

    if (!type) {
      return res.status(400).json({ message: "Report type is required" });
    }
    const categoryFilter = req.user.role !== 'admin' ? { categoryId: req.user.categoryIds } : {};
    let reports;
    if (type === "expiring") {
      reports = await Product.findAll({
        where: {
          ...categoryFilter,
          expiryDate: {
            [Op.between]: [fromDate, toDate],
          },
        },
      });
    } else if (type === "expired") {
      reports = await Product.findAll({
        where: {
          ...categoryFilter,
          expiryDate: {
            [Op.lt]: new Date(),
            [Op.between]: [fromDate, toDate],
          },
        },
      });
    } else if (type === "fresh") {
      reports = await Product.findAll({
        where: {
          ...categoryFilter,
          expiryDate: {
            [Op.gt]: new Date(),
            [Op.between]: [fromDate, toDate],
          },
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }
    return res.json({data: reports,count: reports.length});
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report', error: err.message });
  }
};

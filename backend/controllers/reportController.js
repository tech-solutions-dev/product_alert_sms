const { Report, Category, Product } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

exports.getAllReports = async (req, res) => {
  try {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(currentDate.getDate() + 30);

    // Build category filter for non-admins
    const categoryFilter = req.user.role !== 'admin' ? { categoryId: req.user.categoryIds } : {};

    // Get total products count
    const totalProducts = await Product.count({ where: categoryFilter });

    // Get expired products
    const expiredProducts = await Product.count({
      where: {
        ...categoryFilter,
        expiryDate: {
          [Op.lt]: currentDate
        }
      }
    });

    // Get expiring soon products (within 30 days)
    const expiringSoon = await Product.count({
      where: {
        ...categoryFilter,
        expiryDate: {
          [Op.gt]: currentDate,
          [Op.lt]: thirtyDaysFromNow
        }
      }
    });

    // Get healthy products (not expired or expiring soon)
    const healthyProducts = totalProducts - expiredProducts - expiringSoon;

    // Get top categories with expired/expiring products
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

    // Get detailed product list with their categories and status
    const products = await Product.findAll({
      where: categoryFilter,
      include: [{
        model: Category,
        attributes: ['name']
      }],
      order: [['expiryDate', 'ASC']]
    });

    // Process products to add status
    const processedProducts = products.map(product => {
      // const expiryDate = new Date(product.expiryDate);
      // let status;
      // if (expiryDate < currentDate) {
      //   status = 'Expired';
      // } else if (expiryDate < thirtyDaysFromNow) {
      //   status = 'Expiring Soon';
      // } else {
      //   status = 'Healthy';
      // }

      return {
        id: product.id,
        name: product.name,
        category: product.Category,
        expiryDate: product.expiryDate,
        status: product.status,
        reportCount: 0, // You can implement this if you have a reports table
        lastReportedBy: product.updatedAt || 'N/A'
      };
    });

    // Create warnings based on actual data
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

    // Create suggestions based on actual data
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
    console.error('Error in getAllReports:', err);
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { type } = req.body;
    console.log(req.body);
    const fromDate = req.body.from ? new Date(req.body.from) : null;
    const toDate = req.body.to ? new Date(req.body.to) : null;
    console.log(
      `Generating report of type: ${type} from ${fromDate} to ${toDate}`
    );

    if (!type) {
      return res.status(400).json({ message: "Report type is required" });
    }
    // Build category filter for non-admins
    const categoryFilter = req.user.role !== 'admin' ? { categoryId: req.user.categoryIds } : {};
    let reports;
    if (type === "expiring") {
      console.log("Generating expiring report");
      reports = await Product.findAll({
        where: {
          ...categoryFilter,
          expiryDate: {
            [Op.between]: [fromDate, toDate],
          },
        },
      });
    } else if (type === "expired") {
      console.log("Generating expired report");
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
      console.log("Generating fresh report");
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
    console.log({ data: reports, count: reports.length });
    return res.json({data: reports,count: reports.length});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate report', error: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch report', error: err.message });
  }
}
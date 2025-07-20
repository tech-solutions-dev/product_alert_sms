// const { Product, Category } = require('../models');

const { Report, Product, User, Category } = require('../models');
const { Op } = require('sequelize');
const { pdfGenerator } = require('../utils/pdfGenerator');


// Get all reports with related info, summary, and filters
exports.getAllReports = async (req, res) => {
  try {
    // Filters (date range, category, user)
    const { startDate, endDate, categoryId, userId } = req.query;
    const where = {};
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (userId) {
      where.userId = userId;
    }

    // Fetch reports with associations
    const reports = await Report.findAll({
      where,
      include: [
        { model: Product, attributes: ['id', 'name', 'expiryDate', 'categoryId'] },
        { model: User, attributes: ['id', 'username', 'email'] },
        { model: Category, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Summary stats
    const totalReports = await Report.count();
    const expiredProducts = await Product.count({ where: { expiryDate: { [Op.lt]: new Date() } } });
    const soonExpiring = await Product.count({ where: { expiryDate: { [Op.between]: [new Date(), new Date(Date.now() + 7*24*60*60*1000)] } } });

    res.json({
      summary: {
        totalReports,
        expiredProducts,
        soonExpiring
      },
      reports
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports', details: err.message });
  }
};

// POST /api/reports/products
// Accepts filters in req.body, queries products, and streams PDF
exports.generateProductsReport = async (req, res) => {
  try {
    const { 
      name, 
      categoryId, 
      status,
      dateRange = {},
      sortBy = 'name',
      sortOrder = 'ASC',
    } = req.body;
    
    const where = {};
    console.log('Generating products report with filters:', req.body);
    
    // Build query filters
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (status) {
      where.status = status;
    }
    
    // Date range filter
    if (dateRange.start || dateRange.end) {
      where.expiryDate = {};
      if (dateRange.start) {
        where.expiryDate[Op.gte] = new Date(dateRange.start);
      }
      if (dateRange.end) {
        where.expiryDate[Op.lte] = new Date(dateRange.end);
      }
    }

    const products = await Product.findAll({ 
      where, 
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }],
      order: [[sortBy, sortOrder]]
    });
    
    console.log(`Found ${products.length} products matching criteria`);
    await pdfGenerator(res, products, req.body);
  } catch (err) {
    console.error('Report generation error:', err);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Failed to generate report', 
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
  } 
}

const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const { pdfGenerator } = require('../utils/pdfGenerator');

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
    
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (status) {
      where.status = status;
    }
    
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
    
    await pdfGenerator(res, products, req.body);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Failed to generate report', 
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
  } 
}
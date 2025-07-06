const { Product } = require('../models');
const { Op } = require('sequelize');

exports.scanBarcode = async (barcode) => {
  return await Product.findOne({ where: { barcode } });
};

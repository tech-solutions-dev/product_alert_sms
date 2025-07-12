// Helper to determine status
function getProductStatus(expiryDate) {
  const now = new Date();
  const expDate = new Date(expiryDate);
  const oneMonthLater = new Date(now);
  oneMonthLater.setMonth(now.getMonth() + 1);
  if (expDate <= now) return 'Expired';
  if (expDate <= oneMonthLater) return 'Expiring Soon';
  return 'Fresh';
}
const { Product, Category } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const { name, categoryId, status } = req.query;
    const where = {};
    if (name) {
      where.name = { [require('sequelize').Op.like]: `%${name}%` };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (status) {
      where.status = status;
    }
    const products = await Product.findAll({ where, include: Category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: Category });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, barcode, expiryDate, categoryId } = req.body;
    const status = getProductStatus(expiryDate);
    const product = await Product.create({ name, barcode, expiryDate, categoryId, status });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { expiryDate, ...updateData } = req.body;
    let status = product.status;
    if (expiryDate) {
      status = getProductStatus(expiryDate);
    }
    await product.update({ ...updateData, expiryDate: expiryDate || product.expiryDate, status });
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

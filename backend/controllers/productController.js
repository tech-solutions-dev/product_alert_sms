const { Product, Category } = require("../models");
const { Op } = require("sequelize");
const { getProductStatus } = require("../config/utils");

exports.getAllProducts = async (req, res) => {
  try {
    const { name, categoryId, status } = req.query;
    const where = {};
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (status) {
      where.status = status;
    }
    if (req.user.role !== 'admin') {
      where.categoryId = req.user.categoryIds;
    }
    const products = await Product.findAll({ where, include: Category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: Category });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (req.user.role !== 'admin' && !req.user.categoryIds.includes(product.categoryId)) {
      return res.status(403).json({ message: "Forbidden: You do not have access to this product" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can add products' });
  }
  try {
    const { name, barcode, expiryDate, categoryId, description, imageUrl } = req.body;
    const product = await Product.create({
      name,
      barcode,
      expiryDate,
      categoryId,
      description,
      imageUrl,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can update products' });
  }
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.update(req.body);
    if (req.body.expiryDate) {
      product.status = getProductStatus(product.expiryDate);
      await product.save();
    }
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can delete products' });
  }
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete product",
      error: err.message,
    });
  }
};

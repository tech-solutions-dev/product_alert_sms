// Helper to determine status
const { getProductStatus } = require("../config/utils");
const { Product, Category } = require("../models");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res) => {
  try {
    const { name, categoryId, status } = req.query;
    const where = {};
    if (name) {
      where.name = { [require("sequelize").Op.like]: `%${name}%` };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (status) {
      console.log("Filtering by status:", status);
      where.status = status;
    }
    const products = await Product.findAll({ where, include: Category });
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: Category,
      raw: false, // Get model instance
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: err.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, barcode, expiryDate, categoryId } = req.body;

    // Status will be calculated automatically by the model's virtual field
    const product = await Product.create({
      name,
      barcode,
      expiryDate,
      categoryId,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create product",
      error: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Status will update automatically when expiryDate changes
    await product.update(req.body);

    res.json({
      message: "Product updated",
      product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update product",
      error: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
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
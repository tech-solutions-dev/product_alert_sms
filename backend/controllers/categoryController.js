const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    let categories;
    if (req.user.role === 'admin') {
      categories = await Category.findAll();
    } else {
      categories = await Category.findAll({ where: { id: req.user.categoryIds } });
    }
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (req.user.role !== 'admin' && !req.user.categoryIds.includes(category.id)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this category' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can add categories' });
  }
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can update categories' });
  }
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update(req.body);
    res.json({ message: 'Category updated', category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Only admins can delete categories' });
  }
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};

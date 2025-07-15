const bcrypt = require('bcryptjs');
const { User, Category } = require('../models');
const { UniqueConstraintError } = require('sequelize');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password'] },
      include: [{ model: Category, as: 'categories', through: { attributes: [] } }]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, categoryIds } = req.body;
    // Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      await user.setCategories(categoryIds);
    }
    const userWithCategories = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Category, as: 'categories', through: { attributes: [] } }]
    });
    res.status(201).json(userWithCategories);
  } catch (err) {
    console.error('Error creating user:', err);
    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Category, as: 'categories', through: { attributes: [] } }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(req.body);
    if (Array.isArray(req.body.categoryIds)) {
      await user.setCategories(req.body.categoryIds);
    }
    const userWithCategories = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Category, as: 'categories', through: { attributes: [] } }]
    });
    res.json({ message: 'User updated', user: userWithCategories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

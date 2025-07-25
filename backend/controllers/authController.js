const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, UserCategory } = require('../models');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
    
    let categoryIds = [];
    if (user.role !== 'admin') {
      const userCategories = await UserCategory.findAll({ where: { userId: user.id } });
      categoryIds = userCategories.map(uc => uc.categoryId);
    }
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        categoryIds
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    let categoryIds = [];
    if (user.role !== 'admin') {
      const userCategories = await UserCategory.findAll({ where: { userId: user.id } });
      categoryIds = userCategories.map(uc => uc.categoryId);
    }
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, categoryIds } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await require('../models').User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    let categoryIds = [];
    if (user.role !== 'admin') {
      const userCategories = await UserCategory.findAll({ where: { userId: user.id } });
      categoryIds = userCategories.map(uc => uc.categoryId);
    }
    res.json({ ...user.toJSON(), categoryIds });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

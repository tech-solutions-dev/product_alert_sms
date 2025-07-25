const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const { UserCategory } = require('../models');

exports.auth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    if (req.user.role !== 'admin') {
      const userCategories = await UserCategory.findAll({ where: { userId: req.user.id } });
      req.user.categoryIds = userCategories.map(uc => uc.categoryId);
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


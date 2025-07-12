const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  barcode: { type: DataTypes.STRING, allowNull: true },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('DATE_ADD(NOW(), INTERVAL 30 DAY)')
  },
  description: { type: DataTypes.TEXT, allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Categories', key: 'id' } },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Fresh' },
}, { timestamps: true });

Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;

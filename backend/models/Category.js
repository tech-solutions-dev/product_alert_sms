const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { timestamps: true });

const Product = require('./Product');
Category.hasMany(Product, { 
  foreignKey: 'categoryId',
  onDelete: 'CASCADE'
});

module.exports = Category;
